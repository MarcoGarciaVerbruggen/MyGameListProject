// GameController.java
package app.Game.controller;

import app.Game.model.domain.Game;
import app.Game.model.domain.GameID;
import app.Game.model.persistence.JPAGame;
import app.Game.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @GetMapping
    public List<JPAGame> getAll() {
        return gameService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<JPAGame> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(gameService.findById(new GameID(id)));
    }

    @PostMapping
    public ResponseEntity<JPAGame> create(@RequestBody Game game) {
        return ResponseEntity.ok(gameService.create(game));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JPAGame> update(@PathVariable UUID id, @RequestBody Game game) {
        return ResponseEntity.ok(gameService.update(new GameID(id), game));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        gameService.delete(new GameID(id));
        return ResponseEntity.noContent().build();
    }
}