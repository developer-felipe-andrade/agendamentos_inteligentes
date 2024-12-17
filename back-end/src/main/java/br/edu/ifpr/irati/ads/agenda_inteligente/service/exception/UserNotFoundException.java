package br.edu.ifpr.irati.ads.agenda_inteligente.service.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
