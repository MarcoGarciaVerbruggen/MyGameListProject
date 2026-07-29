package app.Review.model.persistence;


import app.Game.model.persistence.JPAGameID;
import app.Review.model.domain.ReviewID;
import app.Review.model.enums.ReviewStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "reviews")
public class JPAReview {

    @EmbeddedId
    private ReviewID reviewID;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "id", column = @Column(name = "game_id"))
    })
    private JPAGameID gameID;

    @Embedded
    private JPAReviewBody body;

    @ElementCollection
    @CollectionTable(
            name = "review_images",
            joinColumns = @JoinColumn(name = "review_id")
    )
    @Column(name = "image_url")
    private List<String> images;

    @Column(name = "review_posted")
    private Instant reviewPosted;

    @Column(name = "total_playtime", nullable = false)
    private float totalPlaytime;

    @Column(name = "playtime_at_review", nullable = false)
    private float playtimeAtReview;

    @Column(name = "review_score", nullable = false)
    private int reviewScore;

    @Column(name = "average_score", nullable = false)
    private int averageScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReviewStatus status;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<JPAComment> comments;

    @Column(name = "upvotes", nullable = false)
    private int upvotes;

    @Column(name = "downvotes", nullable = false)
    private int downvotes;

    public JPAReview() {}

    public JPAReview(ReviewID reviewID, JPAGameID gameID, JPAReviewBody body, Instant reviewPosted,
                     float totalPlaytime, float playtimeAtReview, int reviewScore, int averageScore,
                     ReviewStatus status, List<JPAComment> comments, int upvotes, int downvotes) {
        this.reviewID = reviewID;
        this.gameID = gameID;
        this.body = body;
        this.reviewPosted = reviewPosted;
        this.totalPlaytime = totalPlaytime;
        this.playtimeAtReview = playtimeAtReview;
        this.reviewScore = reviewScore;
        this.averageScore = averageScore;
        this.status = status;
        this.comments = comments;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
    }
}