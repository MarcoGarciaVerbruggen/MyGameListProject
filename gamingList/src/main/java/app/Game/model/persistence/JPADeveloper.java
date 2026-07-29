package app.Game.model.persistence;

import app.Game.model.domain.CompanyID;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "developers")
public class JPADeveloper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Embedded
    private CompanyID company;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "developer_id")
    private List<JPAStaff> staff;

    public JPADeveloper() {}

    public JPADeveloper(Long id, CompanyID company, List<JPAStaff> staff) {
        this.id = id;
        this.company = company;
        this.staff = staff;
    }

}
