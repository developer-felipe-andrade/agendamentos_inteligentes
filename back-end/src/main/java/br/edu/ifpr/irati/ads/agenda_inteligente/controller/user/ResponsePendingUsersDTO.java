package br.edu.ifpr.irati.ads.agenda_inteligente.controller.user;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.enums.UserProfession;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.enums.UserRole;


public record ResponsePendingUsersDTO(String id, String name, String login, UserRole role, UserProfession profession, Boolean enabled) {
}
