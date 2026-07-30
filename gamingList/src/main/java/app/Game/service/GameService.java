// GameService.java
package app.Game.service;

import app.Game.model.domain.Game;
import app.Game.model.domain.GameID;
import app.Game.model.persistence.JPAGame;
import app.Game.model.persistence.JPAGameID;
import app.Game.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;

    public List<JPAGame> findAll() {
        return gameRepository.findAll();
    }

    public JPAGame findById(GameID id) {
        JPAGameID jpaGameID = new JPAGameID(id);
        return gameRepository.findById(jpaGameID)
                .orElseThrow(() -> new RuntimeException("app.Game not found: " + id));
    }

    public JPAGame create(Game game) {
        JPAGameID jpaGameID = new JPAGameID(game.getGameID());
        JPAGame jpaGame = new JPAGame(
                jpaGameID,
                game.isUnlisted(),
                game.getVersions() != null ? game.getVersions().stream()
                        .map(JPAGameID::new)
                        .toList() : null,
                game.getName(),
                game.getDescription(),
                game.getCover(),
                null, // tags - will need conversion
                game.getScore(),
                game.getMedianScore(),
                game.getRelease(),
                null, // publisher - will need conversion
                null, // developer - will need conversion
                null, // talent - will need conversion
                null  // platform - will need conversion
        );
        return gameRepository.save(jpaGame);
    }

    public JPAGame update(GameID id, Game updatedGame) {
        JPAGame existing = findById(id);
        existing.setName(updatedGame.getName());
        existing.setDescription(updatedGame.getDescription());
        existing.setCover(updatedGame.getCover());
        existing.setScore(updatedGame.getScore());
        existing.setMedianScore(updatedGame.getMedianScore());
        existing.setRelease(updatedGame.getRelease());
        existing.setUnlisted(updatedGame.isUnlisted());
        return gameRepository.save(existing);
    }

    public void delete(GameID id) {
        JPAGameID jpaGameID = new JPAGameID(id);
        gameRepository.deleteById(jpaGameID);
    }
}