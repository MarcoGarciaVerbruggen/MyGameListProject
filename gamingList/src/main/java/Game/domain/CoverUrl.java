package Game.domain;

import jakarta.persistence.Embeddable;

@Embeddable
public record CoverUrl(String value) {}