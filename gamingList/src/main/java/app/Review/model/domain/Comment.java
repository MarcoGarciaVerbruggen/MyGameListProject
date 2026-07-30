package app.Review.model.domain;

import app.Review.model.enums.ReviewStatus;
import lombok.Getter;
import java.time.Instant;

@Getter
public class Comment {

    private CommentId commentId;

    private Review review;

    private ReviewBody body;

    private Instant reviewPosted;

    private ReviewStatus status;

    public Comment(CommentId commentId, Review review, ReviewBody body, Instant reviewPosted, ReviewStatus status) {
        this.commentId = commentId;
        this.review = review;
        this.body = body;
        this.reviewPosted = reviewPosted;
        this.status = status;
    }

    protected Comment() {}
}