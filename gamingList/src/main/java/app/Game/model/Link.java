package app.Game.model;

import jakarta.persistence.Embeddable;

@Embeddable
public record Link(String url) {}