package app.Review.model.domain;

import lombok.Getter;

import java.util.List;

@Getter
public class ReviewBody {

    private MarkdownText markdownBody;

    private List<String> images;

    public ReviewBody(MarkdownText markdownBody, List<String> images) {
        this.markdownBody = markdownBody;
        this.images = images;
    }

    protected ReviewBody () {}
}