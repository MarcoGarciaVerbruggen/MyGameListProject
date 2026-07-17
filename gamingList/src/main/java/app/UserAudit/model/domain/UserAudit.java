package app.UserAudit.model.domain;

import app.User.model.domain.UserID;
import app.Utils.model.domain.AuditTimestamp;
import lombok.Getter;

public class UserAudit {
    @Getter
    private final UserAuditID auditID;
    @Getter
    private final UserID userID;
    @Getter
    private final AuditTimestamp createdAt;
    @Getter
    private AuditTimestamp updatedAt;
    @Getter
    private AuditTimestamp loginAt;
    @Getter
    private AuditTimestamp passwordChangeAt;
    @Getter
    private boolean emailVerified;
    @Getter
    private AuditTimestamp emailChangeAt;

    public UserAudit(
            UserAuditID auditID,
            UserID userID,
            AuditTimestamp createdAt,
            AuditTimestamp updatedAt,
            AuditTimestamp loginAt,
            AuditTimestamp passwordChangeAt,
            boolean emailVerified,
            AuditTimestamp emailChangedAt
    ) {
        this.auditID = auditID;
        this.userID = userID;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.loginAt = loginAt;
        this.passwordChangeAt = passwordChangeAt;
        this. emailVerified = emailVerified;
        this.emailChangeAt = emailChangedAt;
    }
}
