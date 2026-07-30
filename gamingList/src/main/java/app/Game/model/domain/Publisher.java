package app.Game.model.domain;

import lombok.Getter;

@Getter
public class Publisher {

    private Long id;
    private CompanyID company;

    public Publisher(Long id, CompanyID company) {
        this.id = id;
        this.company = company;
    }

    protected Publisher() {}

}