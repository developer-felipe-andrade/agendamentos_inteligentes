package br.edu.ifpr.irati.ads.agenda_inteligente.controller.review;

import br.edu.ifpr.irati.ads.agenda_inteligente.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @PutMapping("/{id}")
    public ResponseEntity<Void> submitReview(@PathVariable String id, @RequestBody ReviewRequest reviewRequest) {
        reviewService.submitReview(id, reviewRequest);
        return ResponseEntity.noContent().build();
    }
}
