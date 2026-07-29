package app.Review.model.domain;

import app.Game.model.domain.GameID;
import app.Review.model.enums.ReviewStatus;

import java.time.Instant;
import java.util.List;

public class Review {

    private ReviewID reviewID;

    //private UserId userID;

    private GameID gameID;

    private ReviewBody body;

    private Instant reviewPosted;

    private float totalPlaytime;

    private float playtimeAtReview;

    private int reviewScore;

    //private TrackerEntry masterList;

    //private List<TrackerEntry> otherScores;

    private int averageScore;

    private ReviewStatus status;

    private List<Comment> comments;

    private int upvotes;

    private int downvotes;

}