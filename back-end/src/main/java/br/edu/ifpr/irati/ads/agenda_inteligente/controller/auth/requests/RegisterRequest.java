package br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.requests;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.enums.UserProfession;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.enums.UserRole;

public record RegisterRequest(String name, String login, String password, UserRole role, UserProfession profession, String phoneNumber) {
}
