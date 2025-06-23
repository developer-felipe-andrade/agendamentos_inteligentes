package br.edu.ifpr.irati.ads.agenda_inteligente.controller.user;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.auth.requests.ReleaseRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.User;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.EmailService;
import br.edu.ifpr.irati.ads.agenda_inteligente.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private EmailService emailService;

    @PostMapping("/release")
    public ResponseEntity release(@RequestBody @Valid ReleaseRequest data) {
        try {
            userService.releaseUsers(data.users(), emailService);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY.value()).body(e.getMessage());
        }
    }

    @GetMapping("/pending-release")
    public ResponseEntity pendingRelease() {
        List<User> usersPending = userService.findByReleaseUsers();
        List<ResponsePendingUsersDTO> responseUsersList = new ArrayList<>();
        for (User user: usersPending) {
            ResponsePendingUsersDTO responseUsers = new ResponsePendingUsersDTO(user.getId(), user.getName(), user.getLogin(), user.getRole(), user.getPhoneNumber(), user.isEnabled());
            responseUsersList.add(responseUsers);
        }

        return ResponseEntity.ok(responseUsersList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity delete(@PathVariable String id) {
        if (!userService.deleteUser(id)) return ResponseEntity.notFound().build();

        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String login = authentication.getName();
        User loadedUser = userService.findByLogin(login);
        UserResponse userResponse = UserResponse.fromEntity(loadedUser);

        return ResponseEntity.ok(userResponse);
    }
}
