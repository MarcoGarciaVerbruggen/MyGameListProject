package Utils.model;

import lombok.Getter;

import java.time.Instant;
import java.util.Objects;

public final class AuditTimestamp {

    @Getter
    private final Instant value;


    private AuditTimestamp(Instant value) {
        this.value = Objects.requireNonNull(value);
    }

    public static AuditTimestamp now(Instant now) {
        return new AuditTimestamp(now);
    }
}
