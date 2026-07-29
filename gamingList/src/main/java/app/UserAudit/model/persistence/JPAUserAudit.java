package app.UserAudit.model.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_audits")
@Getter
@Setter
public class JPAUserAudit {

    //Audit ID
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID auditID;

    //User ID
    @Column(name = "user_id", nullable = false, updatable = false)
    private UUID userID;

    //Audit Data
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "udpdated_at", nullable = false, updatable = false)
    private Instant updatedAt;

    @Column(name = "last_login_at", nullable = false, updatable = false)
    private Instant lastLoginAt;

    @Column(name = "password_changed_at", nullable = false, updatable = false)
    private Instant passwordChangedAt;

    @Column(name = "email_verified", nullable = false, updatable = false)
    private boolean emailVerified;

    @Column(name = "email_changed_at", nullable = false, updatable = false)
    private Instant emailChangedAt;
}
