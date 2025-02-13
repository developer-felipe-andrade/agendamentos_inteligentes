package br.edu.ifpr.irati.ads.agenda_inteligente.controller.reservation;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ApprovedReservationRequest(
    @NotNull
    List<String> reservationIds
) {
}
