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

    @ManyToOne
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    @Embedded
    private ReviewBody body;

    private Instant reviewPosted;

    private ReviewStatus status;
}