package br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;

public record ClassroomResponse(
        String id,
        String name
) {
    public static ClassroomResponse fromEntity(Classroom classroom) {
        return new ClassroomResponse(
                classroom.getId(),
                classroom.getName()
        );
    }
}