package br.edu.ifpr.irati.ads.agenda_inteligente.controller.user;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.classroom.ClassroomResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.reservation.ReservationResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.controller.review.ReviewResponse;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Review;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.User;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.enums.UserProfession;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.enums.UserRole;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public record UserResponse(
        String id,
        String login,
        UserRole role,
        UserProfession profession,
        String name,
        List<Review> pendingReviews
) {
    public static UserResponse fromEntity(User user) {
        return new UserResponse(
                user.getId(),
                user.getLogin(),
                user.getRole(),
                user.getProfession(),
                user.getName(),
                user.getReviews().stream().filter(review -> review.getPending() == true).toList()
        );
    }
}
