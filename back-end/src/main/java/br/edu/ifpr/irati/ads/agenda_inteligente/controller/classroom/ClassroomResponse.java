package br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.user.UserResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;

import java.util.List;
import java.util.stream.Collectors;

public record ClassroomResponse(
        String id,
        String name,
        String block,
        boolean confirmation,
        int qtdPlace,
        boolean acessible,
        boolean active,
        UserResponse responsible,
        List<ResourceInfo> idsResources
) {
    public static ClassroomResponse fromEntity(Classroom classroom) {
        UserResponse responsibleResponse = null;

        if (classroom.getResponsible() != null) {
            responsibleResponse = new UserResponse(
                    classroom.getResponsible().getId(),
                    classroom.getResponsible().getLogin(),
                    classroom.getResponsible().getRole(),
                    classroom.getResponsible().getProfession(),
                    classroom.getResponsible().getName()
            );
        }

        List<ResourceInfo> resourceInfos = classroom.getResources().stream()
                .map(resourceClassroom -> new ResourceInfo(
                        resourceClassroom.getResource().getId(),
                        resourceClassroom.getQtd()
                ))
                .collect(Collectors.toList());

        return new ClassroomResponse(
                classroom.getId(),
                classroom.getName(),
                classroom.getBlock(),
                classroom.isConfirmation(),
                classroom.getQtdPlace(),
                classroom.isAcessible(),
                classroom.isActive(),
                responsibleResponse,
                resourceInfos
        );
    }
}
