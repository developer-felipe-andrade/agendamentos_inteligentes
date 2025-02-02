package br.edu.ifpr.irati.ads.agenda_inteligente.controller.reservation;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.notification.NotificationRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Notification;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Reservation;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public record ReservationRequest(
        @NotNull(message = "Data inicial é obrigatória")
        @FutureOrPresent(message = "A data inicial deve ser no presente ou futuro")
        LocalDateTime dtStart,

        @NotNull(message = "Data final é obrigatória")
        @FutureOrPresent(message = "A data final deve ser no presente ou futuro")
        LocalDateTime dtEnd,

        @NotNull(message = "Status é obrigatório")
        @Pattern(regexp = "^(PENDING|APPROVED|REJECTED|CANCELED)$",
                message = "Status deve ser: PENDING, APPROVED, REJECTED ou CANCELED")
        String status,

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

        @Pattern(regexp = "^(WEEK|MONTH)$",
                message = "Tipo de repetição deve ser: WEEK ou MONTH")
        String typeTime,

        @Min(value = 1, message = "A recorrência deve ser pelo menos 1")
        Integer timeRecurrence
) {
    public ReservationRequest {
        if (recurrence == null) {
            recurrence = false;
        }
    }

    public List<Reservation> toEntities(String userId) {
        List<Reservation> reservations = new ArrayList<>();
        LocalDateTime start = this.dtStart;
        LocalDateTime end = this.dtEnd;

        for (int i = 0; i < (Boolean.TRUE.equals(this.recurrence) ? this.timeRecurrence : 1); i++) {
            Reservation reservation = new Reservation();
            reservation.setId(UUID.randomUUID().toString());
            reservation.setDtStart(start);
            reservation.setDtEnd(end);
            reservation.setStatus(this.status);
            reservation.setObs(this.obs);

            User user = new User();
            user.setId(userId);
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
                        // Incrementa 1 dia por iteração
                        start = start.plusDays(1);  // Agora sempre incrementa de 1 em 1 dia
                        end = end.plusDays(1);      // Ajustando também a data de término
                        break;

                    case "MONDAYTOFRIDAY":
                        while (start.getDayOfWeek() == DayOfWeek.SATURDAY || start.getDayOfWeek() == DayOfWeek.SUNDAY) {
                            start = start.plusDays(1); // Pula o fim de semana
                            end = end.plusDays(1);
                        }
                        break;

                    case "ONLYDAY":
                        if (start.getDayOfWeek() != this.dtStart.getDayOfWeek()) {
                            int daysToAdd = (this.dtStart.getDayOfWeek().getValue() - start.getDayOfWeek().getValue() + 7) % 7;
                            start = start.plusDays(daysToAdd);
                            end = end.plusDays(daysToAdd);
                        }
                        break;
                }
            }

            reservations.add(reservation);
        }

        return reservations;
    }
}
