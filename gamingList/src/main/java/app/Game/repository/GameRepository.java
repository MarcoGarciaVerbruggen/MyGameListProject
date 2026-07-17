// GameRepository.java
package app.Game.repository;

import app.Game.model.Game;
import app.Game.model.GameID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends JpaRepository<Game, GameID> {
}