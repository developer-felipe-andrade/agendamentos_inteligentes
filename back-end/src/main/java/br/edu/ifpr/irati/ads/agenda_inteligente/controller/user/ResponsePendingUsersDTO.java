package br.edu.ifpr.irati.ads.agenda_inteligente.controller.user;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.user.UserRole;

public record ResponsePendingUsersDTO(String id, String login, UserRole role, Boolean enabled) {
}
