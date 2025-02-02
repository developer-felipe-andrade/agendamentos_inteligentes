package br.edu.ifpr.irati.ads.agenda_inteligente.dao;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.Reservation;
import org.hibernate.annotations.processing.HQL;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, String> {
    Page<Reservation> findByClassroom_Id(String classroomId, Pageable pageable);
    Page<Reservation> findByStatusIgnoreCase(String status, Pageable pageable);

    @Query("SELECT r FROM Reservation r WHERE r.classroom.id = :classroomId " +
            "AND ((r.dtStart BETWEEN :start AND :end) OR " +
            "(r.dtEnd BETWEEN :start AND :end) OR " +
            "(r.dtStart <= :start AND r.dtEnd >= :end))")
    List<Reservation> findConflictingReservations(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            @Param("classroomId") String classroomId);

    @Modifying
    @Query("DELETE FROM Reservation r WHERE r.user.id = :userId AND r.classroom.id = :classroomId AND r.dtStart >= :dtStart")
    void deleteByRecurrence(@Param("userId") String userId,
                            @Param("classroomId") String classroomId,
                            @Param("dtStart") LocalDateTime dtStart);
}