// GameRepository.java
package app.Game.repository;

import app.Game.model.persistence.JPAGame;
import app.Game.model.persistence.JPAGameID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends JpaRepository<JPAGame, JPAGameID> {
}