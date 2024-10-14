package br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
public class AuthController {
    @Autowired
    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthRequest data) {
        var usernamepassword = new UsernamePasswordAuthenticationToken(data.login(), data.password());
    }
}