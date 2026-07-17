package app.Game.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlatformGame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Embedded
    private ExternalID externalID;

    @Embedded
    private PlatformID platform;

    @Embedded
    private Link store;

    @OneToOne
    private PriceHistory priceHistory;
}