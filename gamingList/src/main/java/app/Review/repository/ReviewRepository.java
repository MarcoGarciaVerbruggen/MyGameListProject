// ReviewRepository.java
package app.Review.repository;

import app.Review.model.Review;
import app.Review.model.ReviewID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, ReviewID> {
}