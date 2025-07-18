package br.edu.ifpr.irati.ads.agenda_inteligente.async;

import br.edu.ifpr.irati.ads.agenda_inteligente.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NotificationJob {
    @Autowired
    private NotificationService notificationService;

    @Scheduled(cron = "0 0 * * * *")
    public void checkNotifications() {
        System.out.println("Notification Job");
        notificationService.processNotifications();
    }
}
