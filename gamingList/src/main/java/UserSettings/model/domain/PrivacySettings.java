package UserSettings.model.domain;

import lombok.Getter;

public class PrivacySettings {
    @Getter
    private final boolean profileIsPublic;
    @Getter
    private final boolean friendListIsPublic;
    @Getter
    private final boolean onlineStatusIsVisible;

    protected PrivacySettings(
            boolean profileIsPublic,
            boolean friendListIsPublic,
            boolean onlineStatusIsVisible
    ) {
        this.profileIsPublic = profileIsPublic;
        this.friendListIsPublic = friendListIsPublic;
        this.onlineStatusIsVisible = onlineStatusIsVisible;
    }
}
