package app.Game.model.domain;

import lombok.Getter;

import java.time.Instant;

@Getter
public class PriceData {

    private Long id;
    private float price;
    private Instant instant;
    private float discount;

    public PriceData(Long id, float price, Instant instant, float discount) {
        this.id = id;
        this.price = price;
        this.instant = instant;
        this.discount = discount;
    }

    protected PriceData() {}

}