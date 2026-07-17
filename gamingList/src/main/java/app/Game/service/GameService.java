// GameService.java
package app.Game.service;

import app.Game.model.Game;
import app.Game.model.GameID;
import app.Game.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRepository gameRepository;

    public List<Game> findAll() {
        return gameRepository.findAll();
    }

    public Game findById(GameID id) {
        return gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("app.Game not found: " + id));
    }

    public Game create(Game game) {
        return gameRepository.save(game);
    }

    public Game update(GameID id, Game updatedGame) {
        Game existing = findById(id);
        existing.setName(updatedGame.getName());
        existing.setDescription(updatedGame.getDescription());
        existing.setCover(updatedGame.getCover());
        existing.setTags(updatedGame.getTags());
        existing.setScore(updatedGame.getScore());
        existing.setRelease(updatedGame.getRelease());
        existing.setPublisher(updatedGame.getPublisher());
        existing.setDeveloper(updatedGame.getDeveloper());
        existing.setTalent(updatedGame.getTalent());
        existing.setPlatform(updatedGame.getPlatform());
        existing.setUnlisted(updatedGame.isUnlisted());
        return gameRepository.save(existing);
    }

    public void delete(GameID id) {
        gameRepository.deleteById(id);
    }
}