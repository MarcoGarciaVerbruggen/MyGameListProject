package User.model.domain;

import lombok.Getter;

public class Profile {
    @Getter
    private final String displayName;
    @Getter
    private final String avatarURL;

    protected Profile(String displayName, String avatarURL){
        this.displayName = displayName;
        this.avatarURL = avatarURL;
    }
}
