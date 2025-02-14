package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.email.EmailRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.EmailConfig;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Reservation;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Properties;

@Service
public class EmailService {
    @Autowired
    private EmailConfigService emailConfigService;
    @Autowired
    private ReservationService reservationService;

    private JavaMailSender mailSender;

    @PostConstruct
    public void init() {
        initializeMailSender();
    }

    private void initializeMailSender() {
        EmailConfig emailConfig = emailConfigService.getConfig();

        if (emailConfig != null) {
            JavaMailSenderImpl mailSenderImpl = new JavaMailSenderImpl();
            mailSenderImpl.setHost(emailConfig.getHost());
            mailSenderImpl.setPort(emailConfig.getPort());
            mailSenderImpl.setUsername(emailConfig.getEmail());
            mailSenderImpl.setPassword(emailConfig.getPassword());

            Properties props = mailSenderImpl.getJavaMailProperties();
            props.put("mail.transport.protocol", "smtp");
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", emailConfig.getUseSsl() ? "true" : "false");

            this.mailSender = mailSenderImpl;
        } else {
            System.out.println("Configuração de e-mail não encontrada!");
        }
    }

    public void sendEmail(EmailRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(getFromEmail());
        message.setTo(request.to());
        message.setSubject("Aprovação de usuário.");
        message.setText(request.body());

        mailSender.send(message);
    }

    public void sendEmail(String email, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(getFromEmail());
        message.setTo(email);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    public void sendRejectionEmail(String email, List<String> uuidList, String customMessage) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(getFromEmail());
        message.setTo(email);
        message.setSubject("Rejeição de Reserva");

        StringBuilder body = new StringBuilder();
        body.append(customMessage).append("\n\n");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        for (String uuid : uuidList) {
            Optional<Reservation> reservation = reservationService.findById(uuid);
            if (reservation.isPresent()) {
                String formattedDate = reservation.get().getDtStart().format(formatter);

                body.append("Nome da Sala: ").append(reservation.get().getClassroom().getName()).append("\n");
                body.append("Data e Hora de Início: ").append(formattedDate).append("\n");
                body.append("----------------------------\n");
            } else {
                body.append("Reserva com ID ").append(uuid).append(" não encontrada.\n");
            }
        }

        message.setText(body.toString());
        mailSender.send(message);
    }

    private String getFromEmail() {
        return emailConfigService.getConfig().getEmail();
    }
}
