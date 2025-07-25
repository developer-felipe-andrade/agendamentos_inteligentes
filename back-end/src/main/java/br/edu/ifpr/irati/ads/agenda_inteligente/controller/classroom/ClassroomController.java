package br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom;


import br.edu.ifpr.irati.ads.agenda_inteligente.model.Classroom;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.ClassroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/classroom")
public class ClassroomController {
    @Autowired
    private ClassroomService classroomService;

    @GetMapping
    public ResponseEntity<Page<ClassroomResponse>> getAll(@PageableDefault(size = 9999999, sort = "name") Pageable pageable) {
        Page<ClassroomResponse> classrooms = classroomService.findAll(pageable);

        return ResponseEntity.ok(classrooms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassroomResponse> getClassroom(
            @PathVariable String id
    ) {
        ClassroomResponse classroom = classroomService.getClassroomById(id);

        return ResponseEntity.ok(classroom);
    }

    @GetMapping("/findAvailableClassrooms")
    public ResponseEntity<List<FoundClassroomResponse>> findAvailableClassrooms(
            @RequestParam("dtStart") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dtStart,
            @RequestParam("dtEnd") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dtEnd,
            @RequestParam("qtdPlace") int qtdPlace,
            @RequestParam("isAccessible") boolean isAccessible,
            @RequestParam("idsResources") List<String> idsResources) {

        List<FoundClassroomResponse> classrooms = classroomService.findAvailableClassrooms(dtStart, dtEnd, qtdPlace, isAccessible, idsResources);

        return ResponseEntity.ok(classrooms);
    }

    @PostMapping
    public ResponseEntity<Classroom> register(@RequestBody ClassroomRequest data) {
        if (!classroomService.register(data)) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        };

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Classroom> update(
        @PathVariable String id,
        @RequestBody ClassroomRequest data
    ) {
        classroomService.updateClassroom(id, data);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(
            @PathVariable String id
    ) {
        boolean deleted = classroomService.deleteClassroom(id);

        if (!deleted) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.noContent().build();
    }
}
