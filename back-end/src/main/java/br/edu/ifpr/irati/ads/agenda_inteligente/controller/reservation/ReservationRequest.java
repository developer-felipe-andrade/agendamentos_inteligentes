package br.edu.ifpr.irati.ads.agenda_inteligente.controller.reservation;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.notification.NotificationRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Notification;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Reservation;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.User;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.enums.UserRole;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.*;

public record ReservationRequest(
        @NotNull(message = "O titulo é obrgatório")
        String title,

        @NotNull(message = "Data inicial é obrigatória")
        @FutureOrPresent(message = "A data inicial deve ser no presente ou futuro")
        LocalDateTime dtStart,

        @NotNull(message = "Data final é obrigatória")
        @FutureOrPresent(message = "A data final deve ser no presente ou futuro")
        LocalDateTime dtEnd,

        @Size(max = 1000, message = "Observação deve ter no máximo 1000 caracteres")
        String obs,

        @NotNull(message = "ID da sala é obrigatório")
        String classroomId,

        @Valid
        @NotEmpty(message = "Pelo menos uma notificação deve ser configurada")
        List<NotificationRequest> notifications,

        Boolean recurrence,

        @Pattern(regexp = "^(ALLDAY|MONDAYTOFRIDAY|ONLYDAY)$",
                message = "Tipo de recorrência deve ser: ALLDAY, MONDAYTOFRIDAY ou ONLYDAY")
        String typeRecurrence,

        @Min(value = 1, message = "A recorrência deve ser pelo menos 1")
        Integer timeRecurrence
) {
    @AssertTrue(message = "Se a recorrência for MONDAYTOFRIDAY, a data não pode ser sábado ou domingo")
    public boolean isValidRecurrence() {
        if ("MONDAYTOFRIDAY".equals(typeRecurrence)) {
            DayOfWeek dayOfWeek = dtStart.getDayOfWeek();
            return dayOfWeek != DayOfWeek.SATURDAY && dayOfWeek != DayOfWeek.SUNDAY;
        }
        return true;
    }

    public boolean hasDuplicateAnticipationTimes() {
        if (notifications == null || notifications.isEmpty()) {
            return false;
        }

        Set<LocalDateTime> uniqueTimes = new HashSet<>();
        for (NotificationRequest notification : notifications) {
            if (notification.anticipationTime() != null && !uniqueTimes.add(notification.anticipationTime())) {
                return true;
            }
        }
        return false;
    }

    public ReservationRequest {
        if (recurrence == null) {
            recurrence = false;
        }

        isValidRecurrence();
        hasDuplicateAnticipationTimes();
    }

    public List<Reservation> toEntities(User user) {
        List<Reservation> reservations = new ArrayList<>();
        LocalDateTime start = this.dtStart;
        LocalDateTime end = this.dtEnd;

        for (int i = 0; i < (Boolean.TRUE.equals(this.recurrence) ? this.timeRecurrence : 1); i++) {
            Reservation reservation = new Reservation();
            reservation.setTitle(this.title);
            reservation.setId(UUID.randomUUID().toString());
            reservation.setDtStart(start);
            reservation.setDtEnd(end);
            reservation.setObs(this.obs);
            if (user.getRole().equals(UserRole.USER)) {
                reservation.setStatus("PENDING");
            } else {
                reservation.setStatus("APPROVED");
            }
            reservation.setUser(user);

            Classroom classroom = new Classroom();
            classroom.setId(this.classroomId);
            reservation.setClassroom(classroom);

            List<Notification> notificationsEntities = this.notifications.stream()
                    .map(notificationRequest -> notificationRequest.toEntity(reservation))
                    .toList();
            reservation.setNotifications(notificationsEntities);

            if (Boolean.TRUE.equals(this.recurrence)) {
                switch (this.typeRecurrence) {
                    case "ALLDAY":
                        start = start.plusDays(1);
                        end = end.plusDays(1);
                        break;
                    case "MONDAYTOFRIDAY":
                        start = start.plusDays(1);
                        end = end.plusDays(1);
                        while (start.getDayOfWeek() == DayOfWeek.SATURDAY || start.getDayOfWeek() == DayOfWeek.SUNDAY) {
                            start = start.plusDays(1);
                            end = end.plusDays(1);
                        }

                        break;
                    case "ONLYDAY":
                        start = start.plusDays(7);
                        end = end.plusDays(7);
                        break;
                }
            }

            reservations.add(reservation);
        }

        return reservations;
    }
}
