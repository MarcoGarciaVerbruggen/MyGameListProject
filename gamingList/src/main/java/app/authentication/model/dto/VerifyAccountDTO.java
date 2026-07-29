package app.authentication.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyAccountDTO {
    private String email;
    private String verificationCode;
}
