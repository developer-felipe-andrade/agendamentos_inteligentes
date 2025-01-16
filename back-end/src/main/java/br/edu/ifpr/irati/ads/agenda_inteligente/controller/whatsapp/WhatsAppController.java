package br.edu.ifpr.irati.ads.agenda_inteligente.controller.whatsapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/whatsapp")
public class WhatsAppController {
    private final WhatsAppService whatsAppService;

    @Autowired
    public WhatsAppController(WhatsAppService whatsAppService) {
        this.whatsAppService = whatsAppService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody WhatsAppRequest request) {
        try {
            whatsAppService.sendMessage(request);
            return ResponseEntity.ok("Mensagem enviada com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao enviar mensagem: " + e.getMessage());
        }
    }
}