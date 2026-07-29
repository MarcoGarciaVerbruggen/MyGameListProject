package app.Game.model.domain;

import lombok.Getter;

@Getter
public class Currency {

    private Long id;
    private String name;
    private String symbol;

    public Currency(Long id, String name, String symbol) {
        this.id = id;
        this.name = name;
        this.symbol = symbol;
    }

    protected Currency() {}

}