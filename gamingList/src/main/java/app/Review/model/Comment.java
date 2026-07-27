package app.Review.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table
public class Comment {

    @EmbeddedId
    private CommentId commentId;

    @Embedded
    @AttributeOverride(name = "id", column = @Column(name = "review_id"))
    private ReviewID originalReview;

    @Embedded
    private ReviewBody body;

    private Instant reviewPosted;

    private ReviewStatus status;
}