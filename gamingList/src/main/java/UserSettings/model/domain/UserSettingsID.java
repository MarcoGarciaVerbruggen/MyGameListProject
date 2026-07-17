package UserSettings.model.domain;

import lombok.Getter;

import java.util.UUID;

public class UserSettingsID {
    @Getter
    private final UUID id;

    protected UserSettingsID(UUID id) {
        this.id = id;
    }
}
