package br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.user.UserResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;

import java.util.List;
import java.util.stream.Collectors;

public record ClassroomResponse(
        String id,
        String name,
        String block,
        Integer qtdPlace,
        Boolean acessible,
        Boolean active,
        List<ResourceInfo> idsResources
) {
    public static ClassroomResponse fromEntity(Classroom classroom) {
        UserResponse responsibleResponse = null;

        List<ResourceInfo> resourceInfos = classroom.getResources().stream()
                .map(resourceClassroom -> new ResourceInfo(
                        resourceClassroom.getResource().getId(),
                        resourceClassroom.getResource().getName(),
                        resourceClassroom.getQtd()
                ))
                .collect(Collectors.toList());

        return new ClassroomResponse(
                classroom.getId(),
                classroom.getName(),
                classroom.getBlock(),
                classroom.getQtdPlace(),
                classroom.isAcessible(),
                classroom.isActive(),
                resourceInfos
        );
    }
}
