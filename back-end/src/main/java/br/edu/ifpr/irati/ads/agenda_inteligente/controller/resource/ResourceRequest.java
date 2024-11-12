package br.edu.ifpr.irati.ads.agenda_inteligente.controller.resource;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record ResourceRequest(
        String id,
        @NotBlank(message = "Nome é obrigatório")
        String name,
        @NotBlank(message = "Tipo é obrigatório")
        String type
) {}
