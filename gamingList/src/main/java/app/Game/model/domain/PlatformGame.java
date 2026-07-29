package app.Game.model.domain;

import lombok.Getter;

@Getter
public class PlatformGame {

    private Long id;
    private ExternalID externalID;
    private PlatformID platform;
    private Link store;
    private PriceHistory priceHistory;

    public PlatformGame(Long id, ExternalID externalID, PlatformID platform, Link store, PriceHistory priceHistory) {
        this.id = id;
        this.externalID = externalID;
        this.platform = platform;
        this.store = store;
        this.priceHistory = priceHistory;
    }

    protected PlatformGame() {}

}