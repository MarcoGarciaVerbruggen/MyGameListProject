package app.UserSettings.model.domain;

import lombok.Getter;

public class NotificationSettings {
    @Getter
    private final boolean emailOnFriendRequest;
    @Getter
    private final boolean pushOnFriendRequest;
    @Getter
    private final boolean emailOnFriendActivity;
    @Getter
    private final boolean pushOnFriendActivity;
    @Getter
    private final boolean emailOnTrackerInvite;
    @Getter
    private final boolean pushOnTrackerInvite;

    protected NotificationSettings(
            boolean emailOnFriendRequest,
            boolean pushOnFriendRequest,
            boolean emailOnFriendActivity,
            boolean pushOnFriendActivity,
            boolean emailOnTrackerInvite,
            boolean pushOnTrackerInvite
    ) {
        this.emailOnFriendRequest = emailOnFriendRequest;
        this.pushOnFriendRequest = pushOnFriendRequest;
        this.emailOnFriendActivity = emailOnFriendActivity;
        this.pushOnFriendActivity = pushOnFriendActivity;
        this.emailOnTrackerInvite = emailOnTrackerInvite;
        this.pushOnTrackerInvite = pushOnTrackerInvite;
    }
}
