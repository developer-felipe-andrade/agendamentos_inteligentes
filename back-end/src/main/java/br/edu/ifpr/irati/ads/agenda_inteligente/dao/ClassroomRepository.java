package br.edu.ifpr.irati.ads.agenda_inteligente.dao;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, String> {
    boolean existsByIdAndReservationsIsNotEmpty(String id);

    @Query(value = """
    SELECT DISTINCT c.* FROM classrooms c
    LEFT JOIN resource_classroom rc ON c.id = rc.classroom_id
    WHERE c.qtd_place >= :qtdPlace 
    AND (
        :isAccessible = true AND c.is_accessible = true
        OR :isAccessible = false
    )
    AND NOT EXISTS (
        SELECT 1 FROM reservations r 
        WHERE r.classroom_id = c.id 
        AND (
            (r.dt_start BETWEEN :dtStart AND :dtEnd) 
            OR (r.dt_end BETWEEN :dtStart AND :dtEnd) 
            OR (:dtStart BETWEEN r.dt_start AND r.dt_end) 
            OR (:dtEnd BETWEEN r.dt_start AND r.dt_end)
        )
    ) 
    AND EXISTS (
        SELECT 1
        FROM resource_classroom rc
        WHERE rc.classroom_id = c.id
        AND (rc.resource_id IN (:idsResources) OR '' = '')
    )
    """, nativeQuery = true)
    List<Classroom> findAvailableClassrooms(
            @Param("dtStart") LocalDateTime dtStart,
            @Param("dtEnd") LocalDateTime dtEnd,
            @Param("qtdPlace") int qtdPlace,
            @Param("isAccessible") boolean isAccessible,
            @Param("idsResources") List<String> idsResources);
}