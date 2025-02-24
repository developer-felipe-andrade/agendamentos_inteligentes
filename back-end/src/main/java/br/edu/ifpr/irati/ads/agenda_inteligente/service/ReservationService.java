package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom.ClassroomResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.reservation.ReservationResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.dao.ReservationRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Reservation;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository repository;

    @Autowired
    private ClassroomService classroomService;

    @Transactional
    public Reservation create(Reservation reservation) {
        reservation.setId(UUID.randomUUID().toString());
        checkForConflicts(reservation);

        return repository.save(reservation);
    }

    public Page<Reservation> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Page<Reservation> findByClassroomId(String classroomId, Pageable pageable) {
        List<String> statuses = Arrays.asList("PENDING", "APPROVED");
        return repository.findByClassroom_IdAndStatusIn(classroomId, statuses, pageable);
    }

    public Page<Reservation> findByStatus(String status, Pageable pageable) {
        return repository.findByStatusIgnoreCase(status, pageable);
    }

    public Page<Reservation> getReservationsByUserId(String userId, Pageable pageable) {
        return repository.findByUserIdAndStatusAfterCurrentDate(userId, "PENDING", pageable);
    }

    public Optional<Reservation> findById(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new IllegalArgumentException("ID não pode ser nulo ou vazio");
        }
        return repository.findById(id);
    }

    public Reservation getById(String id) {
        return findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva não encontrada com ID: " + id));
    }

    @Transactional
    public Reservation update(String id, Reservation reservation) {
        Reservation existingReservation = getById(id);
        reservation.setId(id);
        reservation.setStatus(existingReservation.getStatus());
        reservation.setCreatedByEmail(existingReservation.getCreatedByEmail());

        validateReservationTimes(reservation);
        checkForConflicts(reservation);

        return repository.save(reservation);
    }

    @Transactional
    public void approveReservations(List<String> uuidList) {
        for (String uuid : uuidList) {
            Reservation reservation = repository.findById(uuid)
                    .orElseThrow(() -> new IllegalArgumentException("Reserva não encontrada para o UUID: " + uuid));

            reservation.setStatus("APPROVED");
            repository.save(reservation);
        }
    }

    @Transactional
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Transactional
    public void deleteRecurring(String id) {
        Reservation existingReservation = getById(id);

        repository.deleteByRecurrence(
                existingReservation.getUser().getId(),
                existingReservation.getClassroom().getId(),
                existingReservation.getDtStart()
        );
    }

    private void validateReservationTimes(Reservation reservation) {
        if (reservation.getDtStart() == null || reservation.getDtEnd() == null) {
            throw new IllegalArgumentException("Datas de início e fim são obrigatórias");
        }

        if (reservation.getDtStart().isAfter(reservation.getDtEnd())) {
            throw new IllegalArgumentException("Data de início deve ser anterior à data de fim");
        }

        if (reservation.getDtStart().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Data de início não pode ser no passado");
        }
    }

    private void validatePeriod(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            throw new IllegalArgumentException("Datas de início e fim são obrigatórias");
        }

        if (start.isAfter(end)) {
            throw new IllegalArgumentException("Data de início deve ser anterior à data de fim");
        }
    }

    private void checkForConflicts(Reservation reservation) {
        List<Reservation> conflicts = repository.findConflictingReservations(
                reservation.getDtStart(),
                reservation.getDtEnd(),
                reservation.getClassroom().getId()
        );

        conflicts = conflicts.stream()
                .filter(r -> !r.getId().equals(reservation.getId()))
                .toList();

        if (!conflicts.isEmpty()) {
            throw new IllegalStateException("Existe conflito de horário com outras reservas");
        }
    }

    public void rejectReservations(List<String> ids) {
        List<Reservation> reservations = repository.findAllByIdIn(ids);
        for (Reservation reservation : reservations) {
            reservation.setStatus("REJECTED");
        }
        repository.saveAll(reservations);
    }

    public Page<Reservation> findReservationsByDateRange(LocalDate dtStart, LocalDate dtEnd, Pageable pageable) {
        LocalDateTime startDateTime = (dtStart != null)
                ? dtStart.atStartOfDay()
                : LocalDate.of(2000, 1, 1).atStartOfDay();

        LocalDateTime endDateTime = (dtEnd != null)
                ? dtEnd.atTime(23, 59, 59)
                : LocalDate.of(3000, 1, 1).atStartOfDay();

        return repository.findByDtStartBetween(startDateTime, endDateTime, pageable);
    }

    public List<Reservation> findByDtStartBefore(LocalDateTime now) {
        return repository.findByDtStartBefore(now);

    }
}