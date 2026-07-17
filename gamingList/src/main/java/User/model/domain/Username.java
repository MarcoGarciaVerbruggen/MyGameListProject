package User.model.domain;

import lombok.Getter;

public class Username {
    @Getter
    private final String username;

    protected Username(String username){
        this.username = username;
    }
}
