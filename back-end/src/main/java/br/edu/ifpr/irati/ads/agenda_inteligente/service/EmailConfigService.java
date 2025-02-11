package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.dao.EmailConfigRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.EmailConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
public class EmailConfigService {
    @Autowired
    private EmailConfigRepository repository;

    public EmailConfig saveConfig(EmailConfig config) {
        return repository.save(config);
    }

    public boolean authenticateSmtp(String username, String password, String host, int port, boolean useSSL) {
        try {
            JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
            mailSender.setHost(host);
            mailSender.setPort(port);
            mailSender.setUsername(username);
            mailSender.setPassword(password);

            Properties props = mailSender.getJavaMailProperties();
            props.put("mail.transport.protocol", "smtp");
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", useSSL);

            mailSender.testConnection(); // Testa a conexão SMTP
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}