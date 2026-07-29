package app.authentication.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginAccountDTO {
    private String email;
    private String password;
}
