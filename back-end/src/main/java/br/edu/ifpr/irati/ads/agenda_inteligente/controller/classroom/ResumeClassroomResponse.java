package br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.resource.ResourceResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;

import java.util.List;
import java.util.stream.Collectors;

public record ResumeClassroomResponse(
        String id,
        String name,
        int qtdPlace,
        String block,
        boolean isAccessible,
        boolean active,
        boolean confirmation,
        List<ResourceResponse> resources
) {
    public static ResumeClassroomResponse fromEntity(Classroom classroom) {
        return new ResumeClassroomResponse(
                classroom.getId(),
                classroom.getName(),
                classroom.getQtdPlace(),
                classroom.getBlock(),
                classroom.isAcessible(),
                classroom.isActive(),
                classroom.isConfirmation(),
                classroom.getResources() != null ? classroom.getResources()
                        .stream()
                        .map(resourceClassroom -> new ResourceResponse(resourceClassroom.getResource()))
                        .collect(Collectors.toList()) : List.of()
        );
    }
}
