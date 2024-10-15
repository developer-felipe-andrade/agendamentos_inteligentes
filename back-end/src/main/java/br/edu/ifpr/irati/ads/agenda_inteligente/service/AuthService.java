package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.RegisterRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.dao.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements UserDetailsService {

    @Autowired
    UserRepository repository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByLogin(username);
    }
}
