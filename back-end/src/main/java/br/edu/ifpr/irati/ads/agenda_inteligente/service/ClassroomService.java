package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom.ClassroomRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom.ClassroomResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom.ResumeClassroomResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.user.UserResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.dao.ClassroomRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.ResourceClassroom;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.User;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ClassroomService {

    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private ResourceClassroomService resourceClassroomService;

    @Autowired
    private UserService userService;

    private final ModelMapper modelMapper = new ModelMapper();

    @Transactional
    public void updateClassroom(String id, ClassroomRequest data) {
        Optional<Classroom> optionalClassroom = classroomRepository.findById(id);

        if (optionalClassroom.isPresent()) {
            Classroom classroom = optionalClassroom.get();
            classroom.setName(data.name());
            classroom.setQtdPlace(data.qtdPlace());
            classroom.setBlock(data.block());
            classroom.setActive(data.active());
            classroom.setAcessible(data.acessible());
            classroom.setConfirmation(data.confirmation());

            if (data.confirmation()) {
                User user = userService.findById(data.idUser());
                classroom.setResponsible(user);
            } else {
                classroom.setResponsible(null);
            }

            Classroom classroomSaved = classroomRepository.save(classroom);

            for (ClassroomRequest.ResourceQuantity resourceQuantity : data.idsResources()) {
                resourceClassroomService.deleteResourcesForClassroom(resourceQuantity.id());
            }
            for (ClassroomRequest.ResourceQuantity resourceQuantity : data.idsResources()) {
                resourceClassroomService.addResourceToClassroom(resourceQuantity.id(), classroomSaved, resourceQuantity.quantity());
            }
        } else {
            throw new RuntimeException("Classroom not found with id: " + id);
        }
    }

    @Transactional
    public boolean deleteClassroom(String id) {
        Optional<Classroom> optionalClassroom = classroomRepository.findById(id);

        if (classroomRepository.existsByIdAndReservationsIsNotEmpty(id)) {
            return false;
        };

        if (optionalClassroom.isPresent()) {
            classroomRepository.delete(optionalClassroom.get());

            return true;
        }

        return false;
    }

    public ClassroomResponse getClassroomById(String id) {
        Optional<Classroom> classroom = classroomRepository.findById(id);

        return classroom.map(ClassroomResponse::fromEntity).orElse(null);
    }

    public Page<ClassroomResponse> findAll(Pageable pageable) {
        return classroomRepository.findAll(pageable).map(ClassroomResponse::fromEntity);
    }

    @Transactional
    public void register(ClassroomRequest data) {
        Classroom classroom = new Classroom(data);

        if (data.confirmation()) {
            User user = userService.findById(data.idUser());
            classroom.setResponsible(user);
        }

        Classroom classroomSaved = classroomRepository.save(classroom);

        for (ClassroomRequest.ResourceQuantity resourceQuantity : data.idsResources()) {
            resourceClassroomService.addResourceToClassroom(resourceQuantity.id(), classroomSaved, resourceQuantity.quantity());
        }
    }

    public List<ResumeClassroomResponse> findAvailableClassrooms(LocalDateTime dtStart, LocalDateTime dtEnd, int qtdPlace, String block, List<String> idsResources) {
        List<Classroom> classrooms = classroomRepository.findAvailableClassrooms(dtStart, dtEnd, qtdPlace, block, idsResources);
        return classrooms.stream().map(ResumeClassroomResponse::fromEntity).toList();
    }
}
