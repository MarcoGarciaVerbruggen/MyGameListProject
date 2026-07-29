package app.Review.model.persistence;

import app.Review.model.domain.CommentId;
import app.Review.model.enums.ReviewStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "comments")
public class JPAComment {

    @EmbeddedId
    private CommentId commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    private JPAReview review;

    @Embedded
    private JPAReviewBody body;

    @ElementCollection
    @CollectionTable(
            name = "comment_images",
            joinColumns = @JoinColumn(name = "comment_id")
    )
    @Column(name = "image_url")
    private List<String> images;

    @Column(name = "review_posted")
    private Instant reviewPosted;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReviewStatus status;

    public JPAComment() {}

    public JPAComment(CommentId commentId, JPAReview review, JPAReviewBody body, Instant reviewPosted, ReviewStatus status) {
        this.commentId = commentId;
        this.review = review;
        this.body = body;
        this.reviewPosted = reviewPosted;
        this.status = status;
    }
}