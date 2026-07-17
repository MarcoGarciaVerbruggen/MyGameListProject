package User.model.domain;

import Friendship.mode.domain.FriendshipID;
import UserAudit.model.domain.UserAuditID;
import UserPage.model.domain.UserPageID;
import UserSettings.model.domain.UserSettingsID;
import lombok.Getter;

import java.util.Set;

public class User {

    @Getter
    private final UserID userID;
    @Getter
    private Username username;
    @Getter
    private Email email;
    @Getter
    private HashedPassword password;
    @Getter
    private Profile profile;
    @Getter
    private AccountStatus status;
    @Getter
    private Set<UserRole> roles;
    @Getter
    private final UserAuditID auditID;
    @Getter
    private final UserSettingsID settingsID;
    @Getter
    private final UserPageID pageID;
    @Getter
    private Set<FriendshipID> friends;

    private User(
            UserID userID,
            Username username,
            Email email,
            HashedPassword password,
            Profile profile,
            AccountStatus status,
            Set<UserRole> roles,
            UserAuditID auditID,
            UserSettingsID settingsID,
            UserPageID pageID,
            Set<FriendshipID> friends
    ) {
        this.userID = userID;
        this.username = username;
        this.email = email;
        this.password = password;
        this.profile = profile;
        this.status = status;
        this.roles = roles;
        this.auditID = auditID;
        this.settingsID = settingsID;
        this.pageID = pageID;
        this.friends = friends;
    }


}
