package br.edu.ifpr.irati.ads.agenda_inteligente.controller.user;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.user.User;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.user.UserRole;

public record UserResponse(
        String id,
        String login,
        UserRole role
) {
    public static UserResponse fromEntity(User user) {
        return new UserResponse(
                user.getId(),
                user.getLogin(),
                user.getRole()
        );
    }
}
