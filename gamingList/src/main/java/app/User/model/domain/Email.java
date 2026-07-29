package app.User.model.domain;

import lombok.Getter;

public class Email {
    @Getter
    private final String email;

    protected Email(String email) {
        this.email = email;
    }
}
