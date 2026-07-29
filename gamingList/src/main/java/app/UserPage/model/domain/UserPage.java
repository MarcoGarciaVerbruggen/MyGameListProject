package app.UserPage.model.domain;

import app.User.model.domain.UserID;
import lombok.Getter;

public class UserPage {
    @Getter
    private final UserPageID pageID;
    @Getter
    private final UserID userID;
    /*
    @Getter
    private List<TrackerID> trackers;
     */

    public UserPage(UserPageID pageID, UserID userID/*, List<TrackerID> trackers*/) {
        this.pageID = pageID;
        this.userID = userID;
        //this.trackers = trackers;
    }
}
