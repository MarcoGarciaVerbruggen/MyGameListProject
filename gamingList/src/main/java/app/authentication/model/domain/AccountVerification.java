package app.authentication.model.domain;

import java.time.LocalDateTime;

public record AccountVerification(String verificationCode, LocalDateTime expiresAt) {
}
