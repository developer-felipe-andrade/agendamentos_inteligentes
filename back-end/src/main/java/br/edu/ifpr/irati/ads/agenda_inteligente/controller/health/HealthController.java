package br.edu.ifpr.irati.ads.agenda_inteligente.controller.health;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<String> status() {
        return ResponseEntity.ok("success");
    }
}
