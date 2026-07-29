// ReviewRepository.java
package app.Review.repository;

import app.Review.model.domain.ReviewID;
import app.Review.model.persistence.JPAReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<JPAReview, ReviewID> {
}