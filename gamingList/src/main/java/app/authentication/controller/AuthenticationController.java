package app.authentication.controller;

import app.authentication.model.domain.Account;
import app.authentication.model.dto.LoginAccountDTO;
import app.authentication.model.dto.RegisterAccountDTO;
import app.authentication.model.dto.VerifyAccountDTO;
import app.authentication.service.AuthenticationService;
import app.authentication.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {

    private final JwtService jwtService;
    private final AuthenticationService authenticationService;


    public AuthenticationController(
            JwtService jwtService,
            AuthenticationService authenticationService
    ) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Account> register(@RequestBody RegisterAccountDTO registerAccountDTO) {
        Account registeredAccount = authenticationService.signup(registerAccountDTO);
        return ResponseEntity.ok(registeredAccount);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginAccountDTO loginAccountDTO) {
        Account authenticatedAccount = authenticationService.authenticate(loginAccountDTO);
        String jwtToken = jwtService.generateToken(authenticatedAccount);
        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody VerifyAccountDTO verifyAccountDTO) {
        try {
            authenticationService.verifyUser(verifyAccountDTO);
            return ResponseEntity.ok("Account verified successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email) {
        try {
            authenticationService.resendVerificationCode(email);
            return ResponseEntity.ok("Verification code sent, check your email!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
