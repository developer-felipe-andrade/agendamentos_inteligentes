package br.edu.ifpr.irati.ads.agenda_inteligente.controller.reservation;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record RejectReservationRequest(
        @NotNull
        @Size(min = 1, message = "O email do solicitante não pode ser vazio.")
        String userEmail,
        @NotNull
        List<String> reservationIds,

        @NotNull
        @Size(min = 1, message = "A mensagem de rejeição não pode ser vazia.")
        String message
) {}
