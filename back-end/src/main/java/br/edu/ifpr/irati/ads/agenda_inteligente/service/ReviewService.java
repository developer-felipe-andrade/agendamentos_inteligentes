package br.edu.ifpr.irati.ads.agenda_inteligente.service;

import br.edu.ifpr.irati.ads.agenda_inteligente.controller.review.ReviewRequest;
import br.edu.ifpr.irati.ads.agenda_inteligente.dao.ReviewRepository;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Reservation;
import br.edu.ifpr.irati.ads.agenda_inteligente.model.Review;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReservationService reservationService;

    public List<Review> getPendingReviewsByUserId(String userId) {
        return reviewRepository.findByUserIdAndPendingTrue(userId);
    }

    @Transactional
    public void processPendingReviews() {
        LocalDateTime now = LocalDateTime.now();
        List<Reservation> pastReservations = reservationService.findByDtStartBefore(now);

        for (Reservation reservation : pastReservations) {
            boolean hasReview = reviewRepository.existsByReservationId(reservation.getId());

            if (!hasReview) {
                Review review = new Review();
                review.setClassroom(reservation.getClassroom());
                review.setReservation(reservation);
                review.setUser(reservation.getUser());
                review.setPending(true);

                reviewRepository.save(review);
            }
        }
    }

    @Transactional
    public void submitReview(String id, ReviewRequest reviewRequest) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avaliação não encontrada"));

        if (!review.getPending()) {
            throw new RuntimeException("Essa avaliação já foi concluída");
        }

        review.setRating(reviewRequest.rating());
        review.setComment(reviewRequest.comment());
        review.setPending(false);

        reviewRepository.save(review);
    }
}
