package app.Game.model.persistence;

import app.Game.model.domain.ProID;
import app.Game.model.enums.ProRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "staff")
public class JPAStaff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Embedded
    private ProID professional;

    @ElementCollection(fetch = FetchType.LAZY)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "staff_roles", joinColumns = @JoinColumn(name = "staff_id"))
    @Column(name = "role", nullable = false)
    private List<ProRole> role;

    public JPAStaff() {}

    public JPAStaff(Long id, ProID professional, List<ProRole> role) {
        this.id = id;
        this.professional = professional;
        this.role = role;
    }

}
