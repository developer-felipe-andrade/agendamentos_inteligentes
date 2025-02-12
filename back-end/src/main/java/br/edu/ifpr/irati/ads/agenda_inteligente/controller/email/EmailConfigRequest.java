package br.edu.ifpr.irati.ads.agenda_inteligente.controller.email;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record EmailConfigRequest(
        @NotBlank(message = "O nome de usuário não pode estar vazio.")
        String username,

        @NotBlank(message = "A senha não pode estar vazia.")
        String password,

        @NotBlank(message = "O host não pode estar vazio.")
        String host,

        @Min(value = 1, message = "A porta deve ser um número positivo.")
        int port,

        boolean useSSL
) {}

