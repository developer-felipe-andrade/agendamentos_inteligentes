package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.dao.ReservationRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Reservation;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository repository;

    @Transactional
    public Reservation create(Reservation reservation) {
        reservation.setId(UUID.randomUUID().toString());

        return repository.save(reservation);
    }

    public Page<Reservation> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Page<Reservation> findByClassroomId(String classroomId, Pageable pageable) {
        return repository.findByClassroom_Id(classroomId, pageable);
    }

    public Page<Reservation> findByStatus(String status, Pageable pageable) {
        return repository.findByStatusIgnoreCase(status, pageable);
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
        reservation.setCreatedAt(existingReservation.getCreatedAt());

        validateReservationTimes(reservation);
        checkForConflicts(reservation);

        return repository.save(reservation);
    }


    @Transactional
    public Optional<Reservation> updateStatus(String id, String status) {
        return repository.findById(id)
                .map(reservation -> {
                    reservation.setStatus(status);
                    return repository.save(reservation);
                });
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
}