package br.edu.ifpr.irati.ads.agenda_inteligente.controller.reservation;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.notification.NotificationRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Notification;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Reservation;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.user.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
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
        List<NotificationRequest> notifications
) {
    public Reservation toEntity(String userId) {
        Reservation reservation = new Reservation();
        reservation.setId(UUID.randomUUID().toString());
        reservation.setDtStart(this.dtStart);
        reservation.setDtEnd(this.dtEnd);
        reservation.setStatus(this.status);
        reservation.setObs(this.obs);

        User user = new User();
        user.setId(userId);
        reservation.setUser(user);

        Classroom classroom = new Classroom();
        classroom.setId(this.classroomId);
        reservation.setClassroom(classroom);

        List<Notification> notificationEntities = this.notifications.stream()
                .map(notificationRequest -> notificationRequest.toEntity(reservation))
                .toList();
        reservation.setNotifications(notificationEntities);

        return reservation;
    }
}