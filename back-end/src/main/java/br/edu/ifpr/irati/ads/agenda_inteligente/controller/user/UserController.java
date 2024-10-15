package br.edu.ifpr.irati.ads.agenda_inteligente.controller.user;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.ReleaseRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.dao.UserRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.user.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/release")
    public ResponseEntity release(ReleaseRequest data) {
        try {
            for (User user : data.users()) {
                user.setEnabled(true);
                userRepository.save(user);
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/pending-release")
    public ResponseEntity pendingRelease() {
        List<User> usersPending = userRepository.findByEnabledFalse();
        List<ResponsePendingUsersDTO> responseUsersList = new ArrayList<>();
        for (User user: usersPending) {
            ResponsePendingUsersDTO responseUsers = new ResponsePendingUsersDTO(user.getId(), user.getLogin(), user.getRole(), user.isEnabled());
            responseUsersList.add(responseUsers);
        }

        return ResponseEntity.ok(responseUsersList);
    }
}
