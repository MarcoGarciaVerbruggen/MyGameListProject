package app.Game.model.persistence;

import app.Game.model.domain.ExternalID;
import app.Game.model.domain.Link;
import app.Game.model.domain.PlatformID;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "platform_games")
public class JPAPlatformGame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "externalId", column = @Column(name = "external_id"))
    })
    private ExternalID externalID;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "platformId", column = @Column(name = "platform_id"))
    })
    private PlatformID platform;

    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "url", column = @Column(name = "store_url"))
    })
    private Link store;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "price_history_id")
    private JPAPriceHistory priceHistory;

    public JPAPlatformGame() {}

    public JPAPlatformGame(Long id, ExternalID externalID, PlatformID platform, Link store, JPAPriceHistory priceHistory) {
        this.id = id;
        this.externalID = externalID;
        this.platform = platform;
        this.store = store;
        this.priceHistory = priceHistory;
    }

}
