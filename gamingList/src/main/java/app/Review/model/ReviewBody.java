package app.Review.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewBody {

    @Embedded
    private MarkdownText markdownBody;

    @ElementCollection
    private List<String> images;
}