package app.UserPage.model.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "user_pages")
@Getter
@Setter
public class JPAUserPage {

    //Page ID
    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID pageID;

    //User ID
    @Column(name = "user_id", nullable = false, updatable = false)
    private UUID userID;

    //Trackers
}
