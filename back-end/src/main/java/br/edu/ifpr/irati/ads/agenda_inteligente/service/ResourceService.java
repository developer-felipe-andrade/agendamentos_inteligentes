package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.resource.ResourceRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.resource.ResourceResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.dao.ResourceRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Resource;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.exception.DuplicateResourceException;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ResourceService {
    @Autowired
    private ResourceRepository repository;

    public ResourceResponse create(ResourceRequest request) {
        if (repository.existsByNameAndType(request.name(), request.type())) {
            throw new DuplicateResourceException("Recurso já existe com este nome e tipo");
        }

        Resource resource = new Resource(request);
        repository.save(resource);
        return new ResourceResponse(resource);
    }

    public ResourceResponse findById(String id) {
        var resource = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recurso não encontrado"));
        return new ResourceResponse(resource);
    }

    public Page<ResourceResponse> findAll(Pageable pageable) {
        return repository.findAll(pageable)
                .map(ResourceResponse::new);  // Usa o construtor que recebe Resource
    }

    public ResourceResponse update(String id, ResourceRequest request) {
        var resource = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recurso não encontrado"));

        if (!request.name().equals(resource.getName()) &&
                repository.existsByNameAndType(request.name(), request.type())) {
            throw new DuplicateResourceException("Já existe um recurso com este nome e tipo");
        }

        resource.setName(request.name());
        resource.setType(request.type());
        repository.save(resource);

        return new ResourceResponse(resource);
    }

    public void delete(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Recurso não encontrado");
        }
        repository.deleteById(id);
    }
}