package app.Game.model.persistence;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "tags")
public class JPATags {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tag", nullable = false, unique = true)
    private String tag;

    public JPATags() {}

    public JPATags(Long id, String tag) {
        this.id = id;
        this.tag = tag;
    }

}
