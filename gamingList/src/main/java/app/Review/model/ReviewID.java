package app.Review.model;

import jakarta.persistence.Embeddable;
import java.util.UUID;

@Embeddable
public record ReviewID(UUID id) {}