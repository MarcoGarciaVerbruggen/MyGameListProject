package app.UserSettings.model.persistence;

import app.UserSettings.model.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "user_settings")
@Getter
@Setter
public class JPAUserSettings {

    //Settings ID
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID settingsID;

    //User ID
    @Column(name = "user_id", nullable = false, updatable = false)
    private UUID userID;

    //Flattened Notification Settings
    @Column(name = "email_on_friend_request", nullable = false)
    private boolean emailOnFriendRequest;

    @Column(name = "push_on_friend_request", nullable = false)
    private boolean pushOnFriendRequest;

    @Column(name = "email_on_friend_activity", nullable = false)
    private boolean emailOnFriendActivity;

    @Column(name = "push_on_friend_activity", nullable = false)
    private boolean pushOnFriendActivity;

    @Column(name = "email_on_tracker_invite", nullable = false)
    private boolean emailOnTrackerInvite;

    @Column(name = "push_on_tracker_invite", nullable = false)
    private boolean pushOnTrackerInvite;

    //Flattened Privacy Settings
    @Column(name = "profile_is_public", nullable = false)
    private boolean profileIsPublic;

    @Column(name = "friend_list_is_public", nullable = false)
    private boolean friendListIsPublic;

    @Column(name = "online_status_is_visible", nullable = false)
    private boolean onlineStatusIsVisible;

    //Flattened UI Settings
    @Enumerated(EnumType.STRING)
    @Column(name = "theme", nullable = false)
    private UITheme theme;

    @Enumerated(EnumType.STRING)
    @Column(name = "language", nullable = false)
    private UILanguage language;

    @Column(name = "items_per_page", nullable = false)
    private int itemsPerPage;
}
