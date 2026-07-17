package UserSettings.model.domain;

import User.model.domain.UserID;
import lombok.Getter;

public class UserSettings {
    @Getter
    private UserSettingsID settingsID;
    @Getter
    private UserID userID;
    @Getter
    private NotificationSettings notificationSettings;
    @Getter
    private PrivacySettings privacySettings;
    @Getter
    private UISettings uiSettings;

    private UserSettings(){

    }
}
