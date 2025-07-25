package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom.ClassroomRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom.ClassroomResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom.FoundClassroomResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.dao.ClassroomRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    public Classroom findById(String id) {
        return classroomRepository.findById(id).orElse(null);
    }

    public Page<ClassroomResponse> findAll(Pageable pageable) {
        return classroomRepository.findAll(pageable).map(ClassroomResponse::fromEntity);
    }

    @Transactional
    public boolean register(ClassroomRequest data) {
        Classroom classroom = new Classroom(data);

        if (classroomRepository.existsByNameAndBlock(data.name().trim(), data.block().trim())) {
            return false;
        }

        Classroom classroomSaved = classroomRepository.save(classroom);

        for (ClassroomRequest.ResourceQuantity resourceQuantity : data.idsResources()) {
            resourceClassroomService.addResourceToClassroom(resourceQuantity.id(), classroomSaved, resourceQuantity.quantity());
        }

        return true;
    }

    public List<FoundClassroomResponse> findAvailableClassrooms(LocalDateTime dtStart, LocalDateTime dtEnd, int qtdPlace, boolean isAccessible, List<String> idsResources) {
        List<Classroom> classrooms = classroomRepository.findAvailableClassrooms(dtStart, dtEnd, qtdPlace, isAccessible, idsResources);
        return classrooms.stream().map(FoundClassroomResponse::fromEntity).toList();
    }
}
