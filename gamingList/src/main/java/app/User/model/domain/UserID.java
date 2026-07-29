package app.User.model.domain;

import lombok.Getter;

import java.util.UUID;

public class UserID {
    @Getter
    private final UUID id;

    protected UserID(UUID id) {
        this.id = id;
    }
}
