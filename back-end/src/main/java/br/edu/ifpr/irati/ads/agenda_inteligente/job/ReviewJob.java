package br.edu.ifpr.irati.ads.agenda_inteligente.job;

import br.edu.ifpr.irati.ads.agenda_inteligente.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ReviewJob {
    @Autowired
    private ReviewService reviewService;

    @Scheduled(cron = "0 * * * * *")
    public void executePendingReviewProcessing() {
        System.out.println("Job Review");
        reviewService.processPendingReviews();
    }
}
