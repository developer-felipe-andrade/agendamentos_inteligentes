package br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.requests;

public record PasswordRecoveryRequest(
        String login,
        String password
) {
}
