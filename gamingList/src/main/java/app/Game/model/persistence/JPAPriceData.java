package app.Game.model.persistence;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Setter
@Getter
@Entity
@Table(name = "price_data")
public class JPAPriceData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "price", nullable = false)
    private float price;

    @Column(name = "recorded_at", nullable = false)
    private Instant instant;

    @Column(name = "discount", nullable = false)
    private float discount;

    public JPAPriceData() {}

    public JPAPriceData(Long id, float price, Instant instant, float discount) {
        this.id = id;
        this.price = price;
        this.instant = instant;
        this.discount = discount;
    }

}
