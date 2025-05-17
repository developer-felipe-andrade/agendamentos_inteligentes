package br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.responses;

public record ResponseLoginDTO(String token, Boolean isTmpPassword) {
}
