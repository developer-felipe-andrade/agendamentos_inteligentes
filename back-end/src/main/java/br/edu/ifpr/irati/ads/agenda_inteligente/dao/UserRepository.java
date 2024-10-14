package br.edu.ifpr.irati.ads.agenda_inteligente.dao;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserRepository extends JpaRepository<User, String> {
    UserDetails findByLogin(String email);
}
