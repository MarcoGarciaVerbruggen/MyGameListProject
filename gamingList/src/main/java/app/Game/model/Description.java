package app.Game.model;

import jakarta.persistence.Embeddable;

@Embeddable
public record Description(String value) {}