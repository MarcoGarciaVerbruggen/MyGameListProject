// ReviewService.java
package app.Review.service;

import app.Review.model.domain.ReviewID;
import app.Review.model.persistence.JPAReview;
import app.Review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public List<JPAReview> findAll() {
        return reviewRepository.findAll();
    }

    public JPAReview findById(ReviewID id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("app.Review not found: " + id));
    }

    public JPAReview create(JPAReview review) {
        return reviewRepository.save(review);
    }

    public JPAReview update(ReviewID id, JPAReview updatedReview) {
        JPAReview existing = findById(id);

        return reviewRepository.save(existing);
    }

    public void delete(ReviewID id) {
        reviewRepository.deleteById(id);
    }
}