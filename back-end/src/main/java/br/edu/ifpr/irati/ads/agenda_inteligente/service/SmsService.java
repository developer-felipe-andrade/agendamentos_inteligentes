package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class SmsService {
    private final RestTemplate restTemplate = new RestTemplate();
    @Value("${url.sms}")
    private String textBeltUrl;

    public String sendSms(String number, String message) {
        Map<String, String> request = new HashMap<>();
        request.put("number", number);
        request.put("message", message);
        request.put("key", "textbelt");

        Map response = restTemplate.postForObject(textBeltUrl, request, Map.class);

        if (response != null && Boolean.TRUE.equals(response.get("success"))) {
            return "SMS enviado com sucesso para " + number;
        } else {
            return "Falha ao enviar SMS: " + response;
        }
    }
}
