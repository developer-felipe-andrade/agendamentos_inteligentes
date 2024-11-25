package br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ClassroomRequest(
        String id,

        @NotBlank
        String name,
        @NotNull
        Integer qtdPlace,

        @NotBlank
        String block,

        @NotNull
        boolean acessible,

        @NotNull
        Boolean active,

        @NotBlank
        boolean confirmation
) {

}
