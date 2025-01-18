package br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.requests.AuthRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.requests.PasswordRecoveryRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.requests.PasswordRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.requests.RegisterRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.responses.ResponseLoginDTO;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.AuthService;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.EmailService;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private UserService userService;

    @Value("${url.front}")
    private String urlFront;

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

    @PostMapping("/request-recover")
    public ResponseEntity<String> sendRecoverPassword(@RequestBody @Valid PasswordRequest request) {
        if (!userService.containUser(request.login())) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY.value()).body("Não possui usuário na base de dados!");
        }

        String token = UUID.randomUUID().toString();
        String linkRedefinicao = String.format(
                "%s/recover?token=%s&email=%s",
                urlFront,
                token,
                URLEncoder.encode(request.login(), StandardCharsets.UTF_8)
        );

        String message = String.format(
                "Olá %s,\n\nClique no link abaixo para redefinir sua senha:\n%s\n\nSe você não solicitou a redefinição, ignore este e-mail.",
                request.login(),
                linkRedefinicao
        );

        emailService.sendEmail(request.login(), "Redefinição de senha", message);

        return ResponseEntity.ok().build();
    }
}