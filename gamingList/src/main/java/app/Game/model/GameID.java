package app.Game.model;

import jakarta.persistence.Embeddable;
import java.util.UUID;

@Embeddable
public record GameID(UUID id) {}