package app.authentication.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterAccountDTO {
    private String email;
    private String password;
    private String username;
}
