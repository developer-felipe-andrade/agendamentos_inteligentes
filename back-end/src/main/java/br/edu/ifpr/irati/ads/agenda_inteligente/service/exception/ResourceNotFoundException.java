package br.edu.ifpr.irati.ads.agenda_inteligente.service.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
