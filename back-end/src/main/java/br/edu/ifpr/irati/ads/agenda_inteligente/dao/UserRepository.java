package br.edu.ifpr.irati.ads.agenda_inteligente.dao;

import br.edu.ifpr.irati.ads.agenda_inteligente.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    UserDetails findByLogin(String email);
    List<User> findByEnabledFalse();

    @Query(value = "SELECT u.* FROM users u WHERE u.role = 'ADMIN' or u.role = 'COORDINATOR' and u.enabled = true", nativeQuery = true)
    List<User> findByResponsibles();
}