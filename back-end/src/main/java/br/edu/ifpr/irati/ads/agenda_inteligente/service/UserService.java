package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.dao.UserRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.User;
import jakarta.validation.constraints.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Boolean containUser(String login) {
        User loadedUser =(User) userRepository.findByLogin(login);

        return loadedUser != null;
    }

    public Boolean deleteUser(String id) {
        Optional<User> loadedUser = userRepository.findById(id);

        if (loadedUser.isEmpty()) return false;

        userRepository.delete(loadedUser.get());

        return true;
    }

    public List<User> findByReleaseUsers() {
        return userRepository.findByEnabledFalse();
    }

    public List<User> findByResponsibles() {
        return userRepository.findByResponsibles();
    }

    public User findByLogin(String login) {
        return (User) userRepository.findByLogin(login);
    }

    public void releaseUsers(List<String> uuidUsers, EmailService emailService) {
        for (String uuidUser: uuidUsers) {
            User user = this.findById(uuidUser);
            user.setEnabled(true);
            emailService.sendUserApprovalEmail(user.getLogin(), user.getName());
            userRepository.save(user);
        }
    }

    public User findById(String id) {
        Optional<User> user = userRepository.findById(id);

        return user.orElse(null);
    }
}
