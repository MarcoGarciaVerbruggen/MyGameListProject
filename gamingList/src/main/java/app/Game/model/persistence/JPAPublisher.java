package app.Game.model.persistence;

import app.Game.model.domain.CompanyID;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "publishers")
public class JPAPublisher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Embedded
    private CompanyID company;

    public JPAPublisher() {}

    public JPAPublisher(Long id, CompanyID company) {
        this.id = id;
        this.company = company;
    }

}
