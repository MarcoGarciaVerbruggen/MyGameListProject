package app.Game.model.domain;

import app.Game.model.enums.ProRole;
import lombok.Getter;

import java.util.List;

@Getter
public class Staff {

    private Long id;
    private ProID professional;
    private List<ProRole> role;

    public Staff(Long id, ProID professional, List<ProRole> role) {
        this.id = id;
        this.professional = professional;
        this.role = role;
    }

    protected Staff() {}

}