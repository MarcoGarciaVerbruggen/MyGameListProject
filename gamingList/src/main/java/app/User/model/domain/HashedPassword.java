package app.User.model.domain;

import lombok.Getter;

public class HashedPassword {
    @Getter
    private final String password;

    protected HashedPassword(String password){
        this.password = password;
    }
}
