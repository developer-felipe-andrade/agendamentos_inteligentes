package br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.resource.ResourceResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;

import java.util.List;
import java.util.stream.Collectors;

public record FoundClassroomResponse(
        String id,
        String name,
        int qtdPlace,
        String block,
        boolean isAccessible,
        boolean active,
        List<ResourceResponse> resources
) {
    public static FoundClassroomResponse fromEntity(Classroom classroom) {
        return new FoundClassroomResponse(
                classroom.getId(),
                classroom.getName(),
                classroom.getQtdPlace(),
                classroom.getBlock(),
                classroom.isAcessible(),
                classroom.isActive(),
                classroom.getResources() != null ? classroom.getResources()
                        .stream()
                        .map(resourceClassroom -> new ResourceResponse(resourceClassroom.getResource()))
                        .collect(Collectors.toList()) : List.of()
        );
    }
}
