package app.Game.model.persistence;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "regions")
public class JPARegion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    public JPARegion() {}

    public JPARegion(Long id, String name) {
        this.id = id;
        this.name = name;
    }

}
