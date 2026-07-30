package app.Review.model.domain;

import lombok.Getter;

@Getter
public class MarkdownText {

    private String body;

    public MarkdownText(String body) {
        this.body = body;
    }

    protected MarkdownText() {}
}