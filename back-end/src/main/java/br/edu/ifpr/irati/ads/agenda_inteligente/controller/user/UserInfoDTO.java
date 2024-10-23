package br.edu.ifpr.irati.ads.agenda_inteligente.controller.user;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.user.UserRole;

public record UserInfoDTO(
        String login,
        UserRole role
) {
}
