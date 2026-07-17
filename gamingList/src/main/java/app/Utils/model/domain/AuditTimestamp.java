package app.Utils.model.domain;

import lombok.Getter;

import java.time.Instant;
import java.util.Objects;

public final class AuditTimestamp {

    @Getter
    private final Instant instant;


    private AuditTimestamp(Instant instant) {
        this.instant = Objects.requireNonNull(instant);
    }

    public static AuditTimestamp now(Instant now) {
        return new AuditTimestamp(now);
    }
}
