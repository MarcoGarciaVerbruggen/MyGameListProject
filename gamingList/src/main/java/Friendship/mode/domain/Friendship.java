package Friendship.mode.domain;

import User.model.domain.UserID;
import Utils.model.AuditTimestamp;
import lombok.Getter;

public class Friendship {
    @Getter
    private final FriendshipID friendsID;
    @Getter
    private final UserID user1;
    @Getter
    private final UserID user2;
    @Getter
    private FriendshipStatus status;
    @Getter
    private final AuditTimestamp createdAt;
    @Getter
    private AuditTimestamp updatedAt;

    public Friendship(
            FriendshipID friendsID,
            UserID user1,
            UserID user2,
            FriendshipStatus status,
            AuditTimestamp createdAt,
            AuditTimestamp updatedAt
    ) {
        this.friendsID = friendsID;
        this.user1 = user1;
        this.user2 = user2;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
