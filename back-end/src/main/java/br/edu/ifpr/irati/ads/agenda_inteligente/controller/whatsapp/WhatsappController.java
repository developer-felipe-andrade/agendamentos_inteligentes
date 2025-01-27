package br.edu.ifpr.irati.ads.agenda_inteligente.controller.whatsapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class WhatsappController {
//    @Autowired
//    private RestTemplate restTemplate;
//
//    @Value("${url.microservice}")
//    String urlMicroservice;
//
//    @GetMapping("/qr-code")
//    public ResponseEntity<String> getQRCode() {
//        String urlQRCode = urlMicroservice + "/qr-code";
//        ResponseEntity<String> response = restTemplate.getForEntity(urlQRCode, String.class);
//        return ResponseEntity.ok(response.getBody());
//    }

//    @PostMapping("/send-message")
//    public ResponseEntity<String> sendMessage(@RequestBody MessageRequest request) {
//        String urlSendMessage = urlMicroservice + "/send-message";
//        ResponseEntity<String> response = restTemplate.postForEntity(urlSendMessage)
//    }
}
