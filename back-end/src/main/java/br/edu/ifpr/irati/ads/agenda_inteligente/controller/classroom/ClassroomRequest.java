package br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ClassroomRequest(
        String id,

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
