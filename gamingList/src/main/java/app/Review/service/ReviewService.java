// ReviewService.java
package app.Review.service;

import app.Review.model.Review;
import app.Review.model.ReviewID;
import app.Review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public List<Review> findAll() {
        return reviewRepository.findAll();
    }

    public Review findById(ReviewID id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("app.Review not found: " + id));
    }

    public Review create(Review review) {
        return reviewRepository.save(review);
    }

    public Review update(ReviewID id, Review updatedReview) {
        Review existing = findById(id);

        return reviewRepository.save(existing);
    }

    public void delete(ReviewID id) {
        reviewRepository.deleteById(id);
    }
}