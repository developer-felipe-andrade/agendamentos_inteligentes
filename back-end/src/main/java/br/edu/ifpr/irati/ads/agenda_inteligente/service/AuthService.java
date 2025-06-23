package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.requests.AuthRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.requests.PasswordRecoveryRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.requests.RegisterRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.responses.ResponseLoginDTO;
import br.edu.ifpr.irati.ads.agenda_inteligente.dao.UserRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.infra.security.TokenService;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByLogin(username);
    }

    public ResponseLoginDTO loginService(AuthRequest data) {
        User user = repository.findByLogin(data.login());

        if (user != null) {
            if (user.isTmpPassword()) {
                return new ResponseLoginDTO(null, true);
            }

            try {
                var username = new UsernamePasswordAuthenticationToken(user.getLogin(), data.password());
                var auth = this.authenticationManager.authenticate(username);

                return new ResponseLoginDTO(tokenService.generateToken((User) auth.getPrincipal()), false);
            } catch (BadCredentialsException e) {
                return null;
            }
        }

        return null;
    }

    public void logoutUser(String token) {
        tokenService.revokeToken(token);
    }

    public boolean registerUser(@Valid RegisterRequest data) {
        if (repository.findByLogin(data.login()) != null) {
            return false;
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        User user = new User(data.name(), data.login(), encryptedPassword, data.role(), data.phoneNumber());
        repository.save(user);

        return true;
    }

    public boolean recoverPassword(@Valid PasswordRecoveryRequest data) {
        User user = repository.findByLogin(data.login());
        if (user == null) {
            return false;
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        user.setPassword(encryptedPassword);
        if (user.isTmpPassword()) user.setTmpPassword(false);
        repository.save(user);

        return true;
    }
}
