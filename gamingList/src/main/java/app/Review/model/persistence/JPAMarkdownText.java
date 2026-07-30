package app.Review.model.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
public class JPAMarkdownText {

    @Column(name = "markdown_body", columnDefinition = "TEXT")
    private String body;

    public JPAMarkdownText(String body) {
        this.body = body;
    }
}