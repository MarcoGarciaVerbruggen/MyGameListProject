package app.authentication.model.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "accounts")
@Getter
@Builder
public class Account implements UserDetails {

    @Id
    private AccountID id;

    @Column(name = "name", unique = true, nullable = false)
    private AccountName name;

    @Column(name = "email", unique = true, nullable = false)
    private AccountEmail email;

    @Column(name = "password", nullable = false)
    private AccountPassword password;

    @Column(name = "verification")
    private AccountVerification verification;

    private boolean enabled;

    protected Account(){}

    private Account(
            AccountID id,
            AccountName name,
            AccountEmail email,
            AccountPassword password,
            AccountVerification verification
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.verification = verification;
        this.enabled = false;
    }

    public void updateVerification(AccountVerification verification) {
        this.verification = verification;
    }

    public void enableUser() {
        this.enabled = true;
    }

    public void disableUser() {
        this.enabled = false;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return this.name.name();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }
}
