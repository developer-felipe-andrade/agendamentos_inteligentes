package br.edu.ifpr.irati.ads.agenda_inteligente.controller.email;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.EmailConfig;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.EmailConfigService;
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
    public ResponseEntity<EmailConfig> createConfig(@RequestBody EmailConfig config) {
        return new ResponseEntity<>(service.saveConfig(config), HttpStatus.CREATED);
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
}