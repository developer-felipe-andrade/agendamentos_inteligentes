package br.edu.ifpr.irati.ads.agenda_inteligente.controller.resource;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.Resource;

public record ResourceResponse(
        String id,
        String name,
        String type
) {
    public ResourceResponse(Resource resource) {
        this(
                resource.getId(),
                resource.getName(),
                resource.getType()
        );
    }
}
