package app.Game.model.domain;

import lombok.Getter;

@Getter
public class Tags {

    private Long id;
    private String tag;

    public Tags(Long id, String tag) {
        this.id = id;
        this.tag = tag;
    }

    protected Tags() {}

}