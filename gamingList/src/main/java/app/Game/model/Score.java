package app.Game.model;

import jakarta.persistence.Embeddable;

@Embeddable
public record Score(int value) {}
