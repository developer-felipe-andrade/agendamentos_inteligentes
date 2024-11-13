package br.edu.ifpr.irati.ads.agenda_inteligente.controller.notification;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.Notification;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Reservation;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationRequest(
        @NotNull(message = "Tempo de antecipação é obrigatório")
        LocalDateTime anticipationTime,

        @NotNull(message = "Forma de notificação é obrigatória")
        @Pattern(regexp = "^(EMAIL|SMS|WHATSAPP|PUSH)$",
                message = "Forma de notificação deve ser: EMAIL, SMS, WHATSAPP ou PUSH")
        String form
) {
    public Notification toEntity(Reservation reservation) {
        Notification notification = new Notification();
        notification.setId(UUID.randomUUID().toString());
        notification.setAnticipationTime(this.anticipationTime);
        notification.setForm(this.form);
        notification.setReservation(reservation);
        return notification;
    }
}