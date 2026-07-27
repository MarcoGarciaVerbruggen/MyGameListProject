package app.User.model.persistence;

import app.User.model.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
public class JPAUser {

    // UserID
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID userID;

    // Simple VOs
    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String password;

    //Profile VO
    @Column(name = "display_name")
    private String displayName;

    @Column(name = "avatar_url")
    private String avatarUrl;

    //Enums
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AccountStatus status;

    @Enumerated(EnumType.STRING)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role", nullable = false)
    private Set<UserRole> roles = new HashSet<>();

    //Aggregate Root ID references
    @Column(name = "audit_id", nullable = false, updatable = false)
    private UUID auditID;

    @Column(name = "settings_id", nullable = false, updatable = false)
    private UUID settingsID;

    @Column(name = "page_id", nullable = false, updatable = false)
    private UUID pageID;

    @ElementCollection
    @CollectionTable(name = "user_friends", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "friend_id", nullable = false)
    private Set<UUID> friends = new HashSet<>();

    protected JPAUser() {}
}
