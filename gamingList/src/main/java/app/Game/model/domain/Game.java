package app.Game.model.domain;

import lombok.Getter;

import java.time.Instant;
import java.util.List;

@Getter
public class Game {

    private final GameID gameID;
    private boolean unlisted;
    private List<GameID> versions;
    private Name name;
    private Description description;
    private CoverUrl cover;
    private List<Tags> tags;
    private float score;
    private float medianScore;
    private Instant release;
    private Publisher publisher;
    private Developer developer;
    private List<Staff> talent;
    private PlatformGame platform;

    public Game(
            GameID gameID,
            boolean unlisted,
            List<GameID> versions,
            Name name,
            Description description,
            CoverUrl cover,
            List<Tags> tags,
            float score,
            float medianScore,
            Instant release,
            Publisher publisher,
            Developer developer,
            List<Staff> talent,
            PlatformGame platform
    ) {
        this.gameID = gameID;
        this.unlisted = unlisted;
        this.versions = versions;
        this.name = name;
        this.description = description;
        this.cover = cover;
        this.tags = tags;
        this.score = score;
        this.medianScore = medianScore;
        this.release = release;
        this.publisher = publisher;
        this.developer = developer;
        this.talent = talent;
        this.platform = platform;
    }

}