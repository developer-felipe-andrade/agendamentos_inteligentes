package br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth;

import br.edu.ifpr.irati.ads.agenda_inteligente.dao.UserRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.infra.security.TokenService;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.user.User;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthRequest data) {
        var username = new UsernamePasswordAuthenticationToken(data.login(), data.password());
        var auth = this.authenticationManager.authenticate(username);

        var token = tokenService.generateToken((User) auth.getPrincipal());

        return ResponseEntity.ok(new ResponseDTO(token));
    }



    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterRequest data) {
        if (this.userRepository.findByLogin(data.login()) != null) return ResponseEntity.badRequest().build();

        String encrpytPassword = new BCryptPasswordEncoder().encode(data.password());
        User user = new User(data.login(), encrpytPassword, data.role());

        this.userRepository.save(user);

        return ResponseEntity.status(201).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String tokenHeader) {
        if (tokenHeader != null && tokenHeader.startsWith("Bearer ")) {
            String token = tokenHeader.substring(7);
            tokenService.revokeToken(token);
            return ResponseEntity.ok("Logout successful.");
        }
        return ResponseEntity.badRequest().body("Token not provided or invalid.");
    }
}