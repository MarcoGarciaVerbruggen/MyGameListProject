package UserAudit.model.domain;

import lombok.Getter;

import java.util.UUID;

public class UserAuditID {
    @Getter
    private final UUID id;

    protected UserAuditID(UUID id) {
        this.id = id;
    }
}
