package br.edu.ifpr.irati.ads.agenda_inteligente.controller.reservation;


import br.edu.ifpr.irati.ads.agenda_inteligente.dao.UserRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Reservation;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.User;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.ReservationService;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationService service;
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity create(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid ReservationRequest request
    ) {
        String username = userDetails.getUsername();
        User user = userService.findByLogin(username);
        List<Reservation> reservations = request.toEntities(user.getId());
        for (Reservation reservation : reservations) {
            reservation.setCreatedByEmail(user.getLogin());
            service.create(reservation);
        }

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<Page<ReservationResponse>> findAll(
            @PageableDefault(size = 10, sort = "dtStart") Pageable pageable) {
        Page<ReservationResponse> responses = service.findAll(pageable)
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

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<ReservationResponse>> findByStatus(
            @PathVariable String status,
            @PageableDefault(sort = "dtStart") Pageable pageable) {
        Page<ReservationResponse> responses = service.findByStatus(status, pageable)
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
                    List<Reservation> newReservations = request.toEntities(user.getId());

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

    @PatchMapping("/{id}/active")
    public ResponseEntity<ReservationResponse> updateStatus(
            @PathVariable String id) {
        return service.updateStatus(id, "ACTIVE")
                .map(ReservationResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (service.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/recurring/{id}")
    public ResponseEntity<Void> deleteRecurring(@PathVariable String id) {
        if (service.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        service.deleteRecurring(id);
        return ResponseEntity.noContent().build();
    }


}
