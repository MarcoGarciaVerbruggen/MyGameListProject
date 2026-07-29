package app.Game.model.domain;

import lombok.Getter;

@Getter
public class Region {

    private Long id;
    private String name;

    public Region(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    protected Region() {}

}