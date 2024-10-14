package br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom;


import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.ClassroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/classroom")
public class ClassroomController {
    @Autowired
    private ClassroomService classroomService;

    @GetMapping
    public ResponseEntity<List<Classroom>> getAll() {
        List<Classroom> classrooms = classroomService.getAll();

        return ResponseEntity.ok(classrooms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Classroom> getClassroom(
            @PathVariable UUID id
    ) {
        Classroom classroom = classroomService.getClassroomById(id);

        return ResponseEntity.ok(classroom);
    }

    @PostMapping
    public ResponseEntity<Classroom> register(@RequestBody ClassroomRequest data) {
        classroomService.register(data);

        return ResponseEntity.status(201).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Classroom> update(
        @PathVariable UUID id,
        @RequestBody Classroom data
    ) {
        Classroom updated = classroomService.updateClassroom(id, data);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(
            @PathVariable UUID id
    ) {
        classroomService.deleteClassroom(id);

        return ResponseEntity.noContent().build();
    }
}
