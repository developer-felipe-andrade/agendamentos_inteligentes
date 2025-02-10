package br.edu.ifpr.irati.ads.agenda_inteligente.controller.sms;

import jakarta.validation.constraints.NotBlank;

public record SmsRequest(
        @NotBlank(message = "O número do destinatário é obrigatório.") String number,
        @NotBlank(message = "A mensagem não pode estar vazia.") String message
) {}
