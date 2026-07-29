package app.authentication.service;

import app.authentication.model.domain.*;
import app.authentication.model.dto.LoginAccountDTO;
import app.authentication.model.dto.RegisterAccountDTO;
import app.authentication.model.dto.VerifyAccountDTO;
import app.authentication.repository.AccountRepository;
import jakarta.mail.MessagingException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthenticationService {
    private static final int MINUTES_TO_VERIFICATION_CODE_EXPIRY = 15;
    private static final String VERIFICATION_EMAIL_SUBJECT = "GamingDB Account Verification";
    private static final String VERIFICATION_EMAIL_BODY_1 = "<html>" +
            "<body style=\"font-family: Arial, sans-serif;\">" +
            "<div style=\"background-color: #f5f5f5; padding:20px;\">" +
            "<h2 style=\"color: #333; \"> Welcome to Gaming DB!</h2>" +
            "<p style=\"font-size: 16px;\">Please enter the following verification code to continue:</p>" +
            "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">" +
            "<h3 style=\"color: #333;\">Verification Code:</h3>" +
            "<p style=\"font-size:18px; font-weight: bold; color: #007bff;\">";
    private static final String VERIFICATION_EMAIL_BODY_2 = "</p>"+
            "</div>"+
            "</div>"+
            "</body>"+
            "</html>";
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationService(
            AccountRepository accountRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            EmailService emailService
    ) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    public Account signup(RegisterAccountDTO dto) {
        //TODO: validation for username, email, password
        AccountName name = new AccountName(dto.getUsername());
        AccountEmail email = new AccountEmail(dto.getEmail());
        AccountPassword password = new AccountPassword(passwordEncoder.encode(dto.getPassword()));

        AccountVerification verification = new AccountVerification(
                generateVerificationCode(),
                LocalDateTime.now().plusMinutes(MINUTES_TO_VERIFICATION_CODE_EXPIRY)
        );

        Account account = Account.builder()
                .name(name)
                .email(email)
                .password(password)
                .verification(verification)
                .build();
        account.disableUser();

        sendVerificationEmail(account);

        return accountRepository.save(account);
    }

    public Account authenticate(LoginAccountDTO dto) {
        Account account = accountRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if(!account.isEnabled()) {
            throw new RuntimeException("Account not verified. Please verify your account");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.getEmail(),
                        dto.getPassword()
                )
        );

        return account;
    }

    public void verifyUser(VerifyAccountDTO dto) {
        Optional<Account> optionalAccount = accountRepository.findByEmail(dto.getEmail());
        if(optionalAccount.isPresent()) {
            Account account = optionalAccount.get();
            if(account.getVerification().expiresAt().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Verification code has expired");
            }
            if(account.getVerification().verificationCode().equals(dto.getVerificationCode())) {
                account.enableUser();
                account.updateVerification(new AccountVerification(null, null));
                accountRepository.save(account);
            } else {
                throw new RuntimeException("Invalid verification code");
            }
        } else {
            throw new RuntimeException("Account not found");
        }
    }

    public void resendVerificationCode(String email) {
        Optional<Account> optionalAccount = accountRepository.findByEmail(email);
        if(optionalAccount.isPresent()) {
            Account account = optionalAccount.get();
            if(account.isEnabled()) {
                throw new RuntimeException("Account is already verified");
            }
            account.updateVerification(
                    new AccountVerification(
                        generateVerificationCode(),
                        LocalDateTime.now().plusMinutes(MINUTES_TO_VERIFICATION_CODE_EXPIRY)
            ));
            sendVerificationEmail(account);
            accountRepository.save(account);
        } else {
            throw new RuntimeException("Account not found");
        }
    }

    public void sendVerificationEmail(Account account) {
        String verificationCode = account.getVerification().verificationCode();
        String htmlMessage = VERIFICATION_EMAIL_BODY_1 + verificationCode + VERIFICATION_EMAIL_BODY_2;

        try {
            emailService.sendVerificationEmail(account.getEmail().email(), VERIFICATION_EMAIL_SUBJECT, htmlMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000)+10000;
        return String.valueOf(code);
    }
}
