package br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;

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

        List<@Valid ResourceQuantity> idsResources
) {
        public record ResourceQuantity(
                @NotBlank
                String id,

                @NotBlank
                @Positive
                Integer quantity
        ) {}
}


