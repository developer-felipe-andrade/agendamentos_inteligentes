package br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth;

import java.util.List;
import java.util.UUID;

public record ReleaseRequest(List<String> users) {
}
