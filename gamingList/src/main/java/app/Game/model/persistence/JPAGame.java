package app.Game.model.persistence;

import app.Game.model.domain.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "games")
public class JPAGame {

    @EmbeddedId
    private JPAGameID gameID;

    @Column(name = "unlisted", nullable = false)
    private boolean unlisted;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "game_versions", joinColumns = @JoinColumn(name = "parent_game_id"))
    @Column(name = "version_id")
    private List<JPAGameID> versions;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "name", column = @Column(name = "game_name"))
    })
    private Name name;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "description", column = @Column(name = "game_description"))
    })
    private Description description;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "url", column = @Column(name = "cover_url"))
    })
    private CoverUrl cover;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "game_tags",
        joinColumns = @JoinColumn(name = "game_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<JPATags> tags;

    @Column(name = "score", nullable = false)
    private float score;

    @Column(name = "median_score", nullable = false)
    private float medianScore;

    @Column(name = "release_date")
    private Instant release;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publisher_id")
    private JPAPublisher publisher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "developer_id")
    private JPADeveloper developer;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "game_staff",
        joinColumns = @JoinColumn(name = "game_id"),
        inverseJoinColumns = @JoinColumn(name = "staff_id")
    )
    private List<JPAStaff> talent;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "platform_id")
    private JPAPlatformGame platform;

    public JPAGame() {}

    public JPAGame(JPAGameID gameID, boolean unlisted, List<JPAGameID> versions, Name name,
                   Description description, CoverUrl cover, List<JPATags> tags, float score,
                   float medianScore, Instant release, JPAPublisher publisher, JPADeveloper developer,
                   List<JPAStaff> talent, JPAPlatformGame platform) {
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