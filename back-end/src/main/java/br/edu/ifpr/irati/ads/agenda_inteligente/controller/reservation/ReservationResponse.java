package br.edu.ifpr.irati.ads.agenda_inteligente.controller.reservation;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom.ClassroomResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.notification.NotificationResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.user.UserResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Reservation;

import java.time.LocalDateTime;
import java.util.List;

public record ReservationResponse(
        String id,
        LocalDateTime dtStart,
        LocalDateTime dtEnd,
        String status,
        String obs,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        UserResponse user,
        ClassroomResponse classroom,
        List<NotificationResponse> notifications
) {
    public static ReservationResponse fromEntity(Reservation reservation) {
        List<NotificationResponse> notificationResponses = reservation.getNotifications().stream()
                .map(NotificationResponse::fromEntity)
                .toList();

        return new ReservationResponse(
                reservation.getId(),
                reservation.getDtStart(),
                reservation.getDtEnd(),
                reservation.getStatus(),
                reservation.getObs(),
                reservation.getCreatedAt(),
                reservation.getUpdatedAt(),
                UserResponse.fromEntity(reservation.getUser()),
                ClassroomResponse.fromEntity(reservation.getClassroom()),
                notificationResponses
        );
    }
}