package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.email.EmailRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final String fromEmail;

    @Autowired
    public EmailService(JavaMailSender mailSender, @Value("${spring.mail.username}") String fromEmail) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
    }

    public void sendEmail(EmailRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(request.to());
        message.setSubject("Aprovação de usuário.");
        message.setText(request.body());

        mailSender.send(message);
    }

    public void sendEmail(String email, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }
}
