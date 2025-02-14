package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.dao.NotificationRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Notification;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.enums.FormNotification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class NotificationService {
    private final EmailService emailService;
    private final NotificationRepository repository;

    public NotificationService(EmailService emailService, NotificationRepository repository) {
        this.emailService = emailService;
        this.repository = repository;
    }

    @Transactional
    public void processNotifications() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime now = LocalDateTime.now();

        List<Notification> notifications = repository.findPendingApprovedNotifications(startOfDay, now);

        for (Notification notification : notifications) {
            if (notification.getForm().equals(FormNotification.EMAIL.toString())) {
                sendEmailNotification(notification);
            }
            notification.setNotified(true);
            repository.save(notification);
        }
    }

    private void sendEmailNotification(Notification notification) {
        String email = notification.getReservation().getCreatedByEmail();
        LocalDateTime startDate = notification.getReservation().getDtStart();
        LocalDateTime endDate = notification.getReservation().getDtEnd();
        String roomName = notification.getReservation().getClassroom().getName();

        String body = String.format(
                "Prezado(a),\n\n" +
                        "Seu agendamento de sala foi confirmado. Aqui estão os detalhes:\n\n" +
                        "Sala: %s\n" +
                        "Data de início: %s\n" +
                        "Data de término: %s\n\n" +
                        "Lembre-se de verificar sua reserva com antecedência.\n\n" +
                        "Se precisar de qualquer ajuda, entre em contato com o suporte.\n\n" +
                        roomName,
                startDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")),
                endDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
        );

        emailService.sendEmail(email, "Agendamento de sala", body);
    }
}
