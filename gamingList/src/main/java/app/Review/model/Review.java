package app.Review.model;

import app.Game.model.GameID;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @EmbeddedId
    private ReviewID reviewID;

    //private UserId userID;

    @Embedded
    private GameID gameID;

    @Embedded
    private ReviewBody body;

    private Instant reviewPosted;

    private float totalPlaytime;

    private float playtimeAtReview;

    private int reviewScore;

    //private TrackerEntry masterList;

    //@OneToMany
    //private List<TrackerEntry> otherScores;

    private int averageScore;

    private ReviewStatus status;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments;

    private int upvotes;

    private int downvotes;

}