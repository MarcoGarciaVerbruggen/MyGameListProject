package app.authentication.repository;

import app.authentication.model.domain.Account;
import app.authentication.model.domain.AccountID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends CrudRepository<Account, AccountID> {

    Optional<Account> findByEmail(String email);
    Optional<Account> findByVerificationCode(String verificationCode);

}
