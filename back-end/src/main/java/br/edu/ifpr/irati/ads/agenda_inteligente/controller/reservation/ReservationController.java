package br.edu.ifpr.irati.ads.agenda_inteligente.controller.reservation;


import br.edu.ifpr.irati.ads.agenda_inteligente.dao.UserRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Reservation;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.User;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.EmailService;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.ReservationService;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationService service;
    @Autowired
    private UserService userService;
    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity create(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid ReservationRequest request
    ) {
        String username = userDetails.getUsername();
        User user = userService.findByLogin(username);
        List<Reservation> reservations = request.toEntities(user);
        for (Reservation reservation : reservations) {
            reservation.setCreatedByEmail(user.getLogin());
            service.create(reservation);
        }

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<Page<ReservationResponse>> findAll(
            @RequestParam(value = "dtStart", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dtStart,
            @RequestParam(value = "dtEnd", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dtEnd,
            @PageableDefault(size = 10, sort = "dtStart") Pageable pageable) {

        Page<ReservationResponse> responses = service.findReservationsByDateRange(dtStart, dtEnd, pageable)
                .map(ReservationResponse::fromEntity);

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> findById(@PathVariable String id) {
        return service.findById(id)
                .map(ReservationResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/classroom/{classroomId}")
    public ResponseEntity<Page<ReservationResponse>> findByClassroomId(
            @PathVariable String classroomId,
            @PageableDefault(sort = "dtStart") Pageable pageable) {
        Page<ReservationResponse> responses = service.findByClassroomId(classroomId, pageable)
                .map(ReservationResponse::fromEntity);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<List<ReservationResponse>> update(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid ReservationRequest request
    ) {
        String username = userDetails.getUsername();
        User user = userService.findByLogin(username);

        return service.findById(id)
                .map(existingReservation -> {
                    List<Reservation> updatedReservations = new ArrayList<>();
                    List<Reservation> newReservations = request.toEntities(user);

                    for (Reservation newReservation : newReservations) {
                        Reservation updated = service.update(id, newReservation);
                        updatedReservations.add(updated);
                    }

                    List<ReservationResponse> responses = updatedReservations.stream()
                            .map(ReservationResponse::fromEntity)
                            .toList();

                    return ResponseEntity.ok(responses);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/responsible/{userId}")
    public ResponseEntity<Page<ReservationResponse>> findByResponsible(
            @PathVariable String userId,
            @PageableDefault(sort = "dt_start") Pageable pageable) {
        
        Page<ReservationResponse> responses = service.getReservationsByUserId(userId, pageable)
                .map(ReservationResponse::fromEntity);
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (service.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reject")
    public ResponseEntity<String> rejectReservations(@Valid @RequestBody List<RejectReservationRequest> rejectionsRequest) {
        for (RejectReservationRequest reject: rejectionsRequest) {
            emailService.sendRejectionEmail(reject.userEmail(), reject.reservationIds(), reject.message());
            service.rejectReservations(reject.reservationIds());
        }

        return ResponseEntity.ok("Reservations rejected successfully.");
    }

    @PutMapping("/approve")
    public ResponseEntity<String> approveReservations(@RequestBody List<String> reservationIds) {
        try {
            service.approveReservations(reservationIds, emailService);

            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Erro ao aprovar reservas: " + e.getMessage());
        }
    }
}
