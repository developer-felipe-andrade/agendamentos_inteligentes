package br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.user.User;

import java.util.List;

public record ReleaseRequest(List<User> users) {
}
