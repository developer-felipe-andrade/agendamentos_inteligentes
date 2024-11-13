package br.edu.ifpr.irati.ads.agenda_inteligente.controller.notification;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.Notification;

import java.time.LocalDateTime;

public record NotificationResponse(
        String id,
        LocalDateTime anticipationTime,
        String form
) {
    public static NotificationResponse fromEntity(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getAnticipationTime(),
                notification.getForm()
        );
    }
}