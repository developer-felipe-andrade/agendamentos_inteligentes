package br.edu.ifpr.irati.ads.agenda_inteligente.controller.whatsapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class WhatsAppService {
    private final RestTemplate restTemplate;
    private final String apiUrl;
    private final String accessToken;
    private final String phoneNumberId;

    @Autowired
    public WhatsAppService(
            RestTemplate restTemplate,
            @Value("${whatsapp.api.url}") String apiUrl,
            @Value("${whatsapp.access.token}") String accessToken,
            @Value("${whatsapp.phone.number.id}") String phoneNumberId
    ) {
        this.restTemplate = restTemplate;
        this.apiUrl = apiUrl;
        this.accessToken = accessToken;
        this.phoneNumberId = phoneNumberId;
    }

    public void sendMessage(WhatsAppRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("messaging_product", "whatsapp");
        body.put("to", request.to());
        body.put("type", "text");

        Map<String, String> text = new HashMap<>();
        text.put("body", request.message());
        body.put("text", text);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        String url = apiUrl + "/v17.0/" + phoneNumberId + "/messages";

        ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Falha ao enviar mensagem de WhatsApp: " + response.getBody());
        }
    }
}