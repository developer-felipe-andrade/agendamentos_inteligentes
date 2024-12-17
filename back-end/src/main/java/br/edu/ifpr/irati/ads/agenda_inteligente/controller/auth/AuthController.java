package br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.requests.AuthRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.requests.PasswordRecoveryRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.requests.RegisterRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.responses.ResponseLoginDTO;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ResponseLoginDTO> login(@RequestBody @Valid AuthRequest data) {
        String token = authService.loginService(data);

        return ResponseEntity.ok(new ResponseLoginDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterRequest data) {
        boolean isRegistered = authService.registerUser(data);

        if (!isRegistered) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.status(201).build();
    }

    @PostMapping("/recover")
    public ResponseEntity<Void> recover(@RequestBody @Valid PasswordRecoveryRequest data) {
        boolean isRecovered = authService.recoverPassword(data);

        if (!isRecovered) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String tokenHeader) {
        if (tokenHeader == null || !tokenHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Token not provided or invalid.");
        }

        String token = tokenHeader.substring(7);
        authService.logoutUser(token);

        return ResponseEntity.ok("Logout successful.");
    }
}