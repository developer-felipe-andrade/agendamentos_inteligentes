package br.edu.ifpr.irati.ads.agenda_inteligente.controller.resource;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.Resource;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.ResourceService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/resource")
public class ResourceController {
    @Autowired
    private ResourceService service;

    @PostMapping
    public ResponseEntity<ResourceResponse> create(@RequestBody @Valid ResourceRequest request) {
        var response = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<ResourceResponse>> findAll(
            @PageableDefault(size = 10, sort = "name") Pageable pageable) {
        return ResponseEntity.ok(service.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> findById(@PathVariable String id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceResponse> update(
            @PathVariable String id,
            @RequestBody @Valid ResourceRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}