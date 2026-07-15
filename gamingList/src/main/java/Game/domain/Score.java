package Game.domain;

import jakarta.persistence.Embeddable;

@Embeddable
public record Score(int value) {}
