package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.requests.AuthRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.requests.PasswordRecoveryRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.requests.RegisterRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.dao.UserRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.infra.security.TokenService;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements UserDetailsService {

    @Autowired
    UserRepository repository;

    @Autowired
    @Lazy
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByLogin(username);
    }

    public String loginService(AuthRequest data) {
        var username = new UsernamePasswordAuthenticationToken(data.login(), data.password());
        var auth = this.authenticationManager.authenticate(username);

        return tokenService.generateToken((User) auth.getPrincipal());
    }

    public void logoutUser(String token) {
        tokenService.revokeToken(token);
    }

    public boolean registerUser(@Valid RegisterRequest data) {
        if (repository.findByLogin(data.login()) != null) {
            return false;
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        User user = new User(data.name(), data.login(), encryptedPassword, data.role(), data.profession(), data.phoneNumber());
        repository.save(user);

        return true;
    }

    public boolean recoverPassword(@Valid PasswordRecoveryRequest data) {
        User user = (User) repository.findByLogin(data.login());
        if (user == null) {
            return false;
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        user.setPassword(encryptedPassword);
        repository.save(user);

        return true;
    }
}
