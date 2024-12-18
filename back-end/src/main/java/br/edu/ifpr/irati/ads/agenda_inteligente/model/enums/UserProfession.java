package br.edu.ifpr.irati.ads.agenda_inteligente.model.enums;

public enum UserProfession {
    WORKER("worker"),
    STUDENT("student"),
    EXTERNAL_COMUNITY("external_comunity");

    private String profession;

    UserProfession(String profession) {
        this.profession = profession;
    }

    public String getProfession() {
        return profession;
    }
}
