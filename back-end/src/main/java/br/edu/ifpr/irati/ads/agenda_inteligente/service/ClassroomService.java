package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom.ClassroomRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom.ClassroomResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.dao.ClassroomRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.dao.UserRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.User;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClassroomService {

    @Autowired
    private ClassroomRepository classroomRepository;
    @Autowired
    private UserRepository userRepository;

    public Classroom updateClassroom(String id, Classroom updatedClassroom) {
        Optional<Classroom> optionalClassroom = classroomRepository.findById(id);

        if (optionalClassroom.isPresent()) {
            Classroom classroom = optionalClassroom.get();
            classroom.setName(updatedClassroom.getName());
            classroom.setQtdPlace(updatedClassroom.getQtdPlace());
            classroom.setBlock(updatedClassroom.getBlock());
            classroom.setActive(updatedClassroom.isActive());
            classroom.setAcessible(updatedClassroom.isAcessible());
            classroom.setConfirmation(updatedClassroom.isConfirmation());

            if (updatedClassroom.isConfirmation()) {
                if (updatedClassroom.getResponsible() != null) {
                    User user = userRepository.findById(updatedClassroom.getResponsible().getId())
                            .orElseThrow(() -> new UserNotFoundException("User not found"));

                    classroom.setResponsible(user);
                }
            } else {
                classroom.setResponsible(null);
            }

            return classroomRepository.save(classroom);
        } else {
            throw new RuntimeException("Classroom not found with id: " + id);
        }
    }

    public boolean deleteClassroom(String id) {
        Optional<Classroom> optionalClassroom = classroomRepository.findById(id);
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

    public void register(ClassroomRequest data) {
        Classroom classroom = new Classroom(data);

        if (data.confirmation()) {
            Optional<User> optionalUser = userRepository.findById(data.idUser());
            optionalUser.ifPresent(classroom::setResponsible);
        }

        classroomRepository.save(classroom);
    }
}
