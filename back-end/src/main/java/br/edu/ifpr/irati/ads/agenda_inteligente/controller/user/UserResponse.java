package br.edu.ifpr.irati.ads.agenda_inteligente.controller.user;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.User;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.enums.UserProfession;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.enums.UserRole;

public record UserResponse(
        String id,
        String login,
        UserRole role,
        UserProfession profession,
        String name,
        Boolean isGodUser
) {
    public static UserResponse fromEntity(User user) {
        return new UserResponse(
                user.getId(),
                user.getLogin(),
                user.getRole(),
                user.getProfession(),
                user.getName(),
                user.getLogin().equals("admin@admin.com")
        );
    }
}
