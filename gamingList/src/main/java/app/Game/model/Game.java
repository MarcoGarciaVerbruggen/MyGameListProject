package app.Game.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Game {

    @EmbeddedId
    private GameID gameID;

    private boolean unlisted;

    @ElementCollection
    private List<GameID> versions;

    @Embedded
    private Name name;

    @Embedded
    private Description description;

    private CoverUrl cover;

    @ManyToMany
    private List<Tags> tags;

    private float score;

    private float medianScore;

    private Instant release;

    @ManyToOne
    private Publisher publisher;

    @ManyToOne
    private Developer developer;

    @ManyToMany
    private List<Staff> talent;

    @OneToOne
    private PlatformGame platform;
}