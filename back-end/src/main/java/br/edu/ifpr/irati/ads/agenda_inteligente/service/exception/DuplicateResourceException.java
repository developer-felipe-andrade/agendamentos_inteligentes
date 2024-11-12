package br.edu.ifpr.irati.ads.agenda_inteligente.service.exception;

public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}