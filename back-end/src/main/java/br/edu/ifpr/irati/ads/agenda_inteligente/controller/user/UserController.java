package br.edu.ifpr.irati.ads.agenda_inteligente.controller.user;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.requests.ReleaseRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.dao.UserRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.user.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/release")
    public ResponseEntity release(@RequestBody @Valid ReleaseRequest data) {
        try {
            for (String uuidUser : data.users()) {
                Optional<User> loadedUser = userRepository.findById(uuidUser);
                if (loadedUser.isPresent()) {
                    User user = loadedUser.get();
                    user.setEnabled(true);
                    userRepository.save(user);
                }
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY.value()).body(e.getMessage());
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

    @DeleteMapping("/{id}")
    public ResponseEntity delete(@PathVariable String id) {
        Optional<User> loadedUser = userRepository.findById(id);
        if(loadedUser.isPresent()) {
            User user = loadedUser.get();
            userRepository.delete(user);

            return ResponseEntity.ok().build();
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/me")
    public ResponseEntity me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String user = authentication.getName();
        User loadedUser =(User) userRepository.findByLogin(user);
        UserResponse dto = new UserResponse(loadedUser.getId(), loadedUser.getLogin(), loadedUser.getRole());

        return ResponseEntity.ok(dto);
    }
}
