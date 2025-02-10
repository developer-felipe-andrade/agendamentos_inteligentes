package br.edu.ifpr.irati.ads.agenda_inteligente.controller.sms;

import br.edu.ifpr.irati.ads.agenda_inteligente.service.SmsService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sms")
public class SmsController {
    private final SmsService smsService;

    public SmsController(SmsService smsService) {
        this.smsService = smsService;
    }

    @PostMapping("/send")
    public String sendSms(@RequestBody @Valid SmsRequest request) {
        return smsService.sendSms(request.number(), request.message());
    }
}
