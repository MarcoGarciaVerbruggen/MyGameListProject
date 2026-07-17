package app.Game.model;

import jakarta.persistence.Embeddable;

@Embeddable
public record ExternalID(String id) {}