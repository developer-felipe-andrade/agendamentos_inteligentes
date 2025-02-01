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

import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationService service;
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<ReservationResponse> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid ReservationRequest request
    ) {
        String username = userDetails.getUsername();
        User user = userService.findByLogin(username);

        Reservation reservation = service.create(request.toEntity(user.getId()));
        ReservationResponse response = ReservationResponse.fromEntity(reservation);

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
    public ResponseEntity<ReservationResponse> update(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid ReservationRequest request) {
        String username = userDetails.getUsername();
        User user = userService.findByLogin(username);

        return service.findById(id)
                .map(existingReservation -> {
                    Reservation updated = service.update(id, request.toEntity(user.getId()));
                    return ResponseEntity.ok(ReservationResponse.fromEntity(updated));
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
}
