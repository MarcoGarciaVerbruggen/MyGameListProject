package app.Game.model.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Embeddable
public class JPAGameID implements Serializable {

    @Column(name = "game_id", nullable = false, columnDefinition = "BINARY(16)")
    private UUID gameId;

    public JPAGameID(UUID gameId) {
        this.gameId = gameId;
    }

    public JPAGameID(app.Game.model.domain.GameID gameID) {
        this.gameId = gameID.gameId();
    }

    public app.Game.model.domain.GameID toDomain() {
        return new app.Game.model.domain.GameID(this.gameId);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        JPAGameID jpaGameID = (JPAGameID) o;
        return gameId != null && gameId.equals(jpaGameID.gameId);
    }

    @Override
    public int hashCode() {
        return gameId != null ? gameId.hashCode() : 0;
    }
}
