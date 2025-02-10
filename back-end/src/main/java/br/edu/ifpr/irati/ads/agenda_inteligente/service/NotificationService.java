package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.dao.NotificationRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Notification;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.enums.FormNotification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private EmailService emailService;
    @Autowired
    private NotificationRepository notificationRepository;

    public NotificationService() {
    }

    @Transactional
    public void processNotifications() {
        LocalDateTime now = LocalDateTime.now();
        List<Notification> notifications = notificationRepository.findByAnticipationTimeBeforeAndNotifiedFalse(now);

        for (Notification notification : notifications) {
            if (notification.getForm().equals(FormNotification.EMAIL.toString())) {
                String email = notification.getReservation().getCreatedByEmail();
                String dateSchedule = notification.getReservation().getDtStart().toString();
                emailService.sendEmail(email, "Agendamento de sala", dateSchedule);
            }
            notification.setNotified(true);
            notificationRepository.save(notification);
        }
    }
}
