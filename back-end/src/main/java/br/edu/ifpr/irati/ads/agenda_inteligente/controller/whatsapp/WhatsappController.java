package br.edu.ifpr.irati.ads.agenda_inteligente.controller.whatsapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/whatsapp")
public class WhatsappController     {
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${url.microservice}")
    String urlMicroservice;

    @GetMapping("/qr-code")
    public ResponseEntity<String> getQRCode() {
        String urlQRCode = urlMicroservice + "/qr-code";
        ResponseEntity<String> response = restTemplate.getForEntity(urlQRCode, String.class);
        return ResponseEntity.ok(response.getBody());
    }

    @GetMapping("/status")
    public ResponseEntity<String> getStatus() {
        String status = urlMicroservice + "/status";
        ResponseEntity<String> response = restTemplate.getForEntity(status, String.class);
        return ResponseEntity.ok(response.getBody());
    }

    @PostMapping("/send-message")
    public ResponseEntity<String> sendMessage(@RequestBody MessageRequest request) {
        String urlSendMessage = urlMicroservice + "/send-message";

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(urlSendMessage, request, String.class);
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        } catch (RestClientException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao enviar mensagem.");
        }
    }

}
