package app.Game.model.persistence;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "price_history")
public class JPAPriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id", nullable = false)
    private JPARegion region;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "currency_id", nullable = false)
    private JPACurrency currency;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "price_history_id")
    private List<JPAPriceData> pricings;

    public JPAPriceHistory() {}

    public JPAPriceHistory(Long id, JPARegion region, JPACurrency currency, List<JPAPriceData> pricings) {
        this.id = id;
        this.region = region;
        this.currency = currency;
        this.pricings = pricings;
    }

}
