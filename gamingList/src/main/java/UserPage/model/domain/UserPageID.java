package UserPage.model.domain;

import lombok.Getter;

import java.util.UUID;

public class UserPageID {
    @Getter
    private final UUID id;

    protected UserPageID(UUID id) {
        this.id = id;
    }
}
