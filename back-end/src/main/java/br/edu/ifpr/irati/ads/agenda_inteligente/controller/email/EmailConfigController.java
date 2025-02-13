package br.edu.ifpr.irati.ads.agenda_inteligente.controller.email;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.EmailConfig;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.EmailConfigService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email-config")
class EmailConfigController {
    @Autowired
    private EmailConfigService service;

    @PostMapping
    public ResponseEntity<EmailConfig> createConfig(@Valid @RequestBody EmailConfigRequest config) {
        EmailConfig emailConfig = new EmailConfig();
        emailConfig.setEmail(config.username());
        emailConfig.setHost(config.host());
        emailConfig.setPort(config.port());
        emailConfig.setPassword(config.password());
        emailConfig.setUseSsl(config.useSSL());

        return new ResponseEntity<>(service.saveConfig(emailConfig), HttpStatus.CREATED);
    }

    @GetMapping("/authenticate")
    public ResponseEntity<Boolean> authenticate(
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String host,
            @RequestParam int port,
            @RequestParam boolean useSSL
    ) {
        return ResponseEntity.ok(service.authenticateSmtp(username, password, host, port, useSSL));
    }

    @GetMapping
    public ResponseEntity<EmailConfig> getConfig() {
        return ResponseEntity.ok(service.getConfig());
    }

    @GetMapping("exists")
    public ResponseEntity<Boolean> existConfig() {
        return ResponseEntity.ok(service.existConfig());
    }

    @DeleteMapping
    public ResponseEntity deleteConfig() {
        service.deleteConfig();

        return ResponseEntity.noContent().build();
    }
}