package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.resource.ResourceRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.dao.ResourceClassroomRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.ResourceClassroom;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceClassroomService {

    private final ResourceClassroomRepository resourceClassroomRepository;

    public ResourceClassroomService(ResourceClassroomRepository resourceClassroomRepository) {
        this.resourceClassroomRepository = resourceClassroomRepository;
    }

    @Transactional
    public void addResourceToClassroom(String resourceId, Classroom classroom, Integer qtd) {
        ResourceClassroom resourceClassroom = new ResourceClassroom();
        resourceClassroom.setResourceId(resourceId);
        resourceClassroom.setClassroom(classroom);
        resourceClassroom.setQtd(qtd);

        resourceClassroomRepository.save(resourceClassroom);
    }

    @Transactional
    public void deleteResourcesForClassroom(String classroomId) {
        resourceClassroomRepository.deleteByClassroomId(classroomId);
    }
}