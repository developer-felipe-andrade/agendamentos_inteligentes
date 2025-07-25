package br.edu.ifpr.irati.ads.agenda_inteligente.dao;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, String> {
    @Query("SELECT n FROM Notification n WHERE n.anticipationTime BETWEEN :startOfDay AND :now AND n.reservation.status = 'APPROVED' OR n.notified = false")
    List<Notification> findPendingApprovedNotifications(
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("now") LocalDateTime now
    );

}
