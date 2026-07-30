package app.Game.model.persistence;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "currencies")
public class JPACurrency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "symbol", nullable = false)
    private String symbol;

    public JPACurrency() {}

    public JPACurrency(Long id, String name, String symbol) {
        this.id = id;
        this.name = name;
        this.symbol = symbol;
    }

}
