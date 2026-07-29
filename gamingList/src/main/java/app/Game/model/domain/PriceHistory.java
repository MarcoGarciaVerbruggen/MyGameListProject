package app.Game.model.domain;

import lombok.Getter;

import java.util.List;

@Getter
public class PriceHistory {

    private Long id;
    private Region region;
    private Currency currency;
    private List<PriceData> pricings;

    public PriceHistory(Long id, Region region, Currency currency, List<PriceData> pricings) {
        this.id = id;
        this.region = region;
        this.currency = currency;
        this.pricings = pricings;
    }

    protected PriceHistory() {}

}