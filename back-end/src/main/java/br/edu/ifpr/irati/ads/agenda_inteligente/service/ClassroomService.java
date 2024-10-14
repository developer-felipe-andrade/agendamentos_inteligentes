package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.dao.ClassroomRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ClassroomService {

    @Autowired
    private ClassroomRepository classroomRepository;

    public Classroom updateClassroom(UUID id, Classroom updatedClassroom) {
        Optional<Classroom> optionalClassroom = classroomRepository.findById(id);

        if (optionalClassroom.isPresent()) {
            Classroom classroom = optionalClassroom.get();
            classroom.setName(updatedClassroom.getName());
            classroom.setQtdPlace(updatedClassroom.getQtdPlace());
            classroom.setBlock(updatedClassroom.getBlock());
            classroom.setAcessibled(updatedClassroom.isAcessibled());
            classroom.setStatus(updatedClassroom.getStatus());
            classroom.setConfirmation(updatedClassroom.isConfirmation());
            return classroomRepository.save(classroom);
        } else {
            throw new RuntimeException("Classroom not found with id: " + id);
        }
    }

    public boolean deleteClassroom(UUID id) {
        Optional<Classroom> optionalClassroom = classroomRepository.findById(id);
        if (optionalClassroom.isPresent()) {
            classroomRepository.delete(optionalClassroom.get());

            return true;
        }

        return false;
    }

    public Classroom getClassroomById(UUID id) {
        Optional<Classroom> classroom = classroomRepository.findById(id);
        return classroom.orElse(null);
    }

    public List<Classroom> getAll() {
        return classroomRepository.findAll();
    }

    public void register(ClassroomRequest data) {
        Classroom classroom = new Classroom(data);

        classroomRepository.save(classroom);
    }
}
