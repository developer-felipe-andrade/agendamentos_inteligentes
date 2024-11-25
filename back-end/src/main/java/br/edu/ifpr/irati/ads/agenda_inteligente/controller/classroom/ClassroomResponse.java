package br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;

public record ClassroomResponse(
        String id,
        String name,
        String block,
        boolean confirmation,
        int qtdPlace,
        boolean acessible,
        boolean active
) {
    public static ClassroomResponse fromEntity(Classroom classroom) {
        return new ClassroomResponse(
                classroom.getId(),
                classroom.getName(),
                classroom.getBlock(),
                classroom.isConfirmation(),
                classroom.getQtdPlace(),
                classroom.isAcessible(),
                classroom.isActive()
        );
    }
}