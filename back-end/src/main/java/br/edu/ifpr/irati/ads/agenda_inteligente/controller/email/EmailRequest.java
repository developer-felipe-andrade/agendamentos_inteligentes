package br.edu.ifpr.irati.ads.agenda_inteligente.controller.email;

public record EmailRequest(
        String to,
        String body
) {}