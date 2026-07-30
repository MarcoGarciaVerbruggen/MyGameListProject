package app.Review.model.persistence;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
public class JPAReviewBody {

    @Embedded
    private JPAMarkdownText markdownBody;

    public JPAReviewBody(JPAMarkdownText markdownBody) {
        this.markdownBody = markdownBody;
    }
}