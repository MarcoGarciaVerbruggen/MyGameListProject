package app.Game.model.domain;

import lombok.Getter;

import java.util.List;

@Getter
public class Developer {

    private Long id;
    private CompanyID company;
    private List<Staff> staff;

    public Developer(Long id, CompanyID company, List<Staff> staff) {
        this.id = id;
        this.company = company;
        this.staff = staff;
    }

    protected Developer() {}

    public void setId(Long id) {
        this.id = id;
    }

    public void setCompany(CompanyID company) {
        this.company = company;
    }

    public void setStaff(List<Staff> staff) {
        this.staff = staff;
    }
}