package br.edu.ifpr.irati.ads.agenda_inteligente.model.enums;

public enum UserRole {
    ADMIN("admin"),
    USER("user"),
    COORDINATOR("coordinator");

    private String role;

    UserRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}
