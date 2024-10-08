package br.edu.ifpr.irati.ads.agenda_inteligente.controller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ClassroomRequest(
        UUID id,

        @NotBlank
        String name,
        @NotNull
        Integer qtdPlace,

        @NotBlank
        String block,

        @NotNull
        boolean isAcessibled,

        @NotNull
        String status,

        @NotBlank
        boolean confirmation
) {

}
