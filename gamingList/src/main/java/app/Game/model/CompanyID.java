package app.Game.model;

import jakarta.persistence.Embeddable;
import java.util.UUID;

@Embeddable
public record CompanyID(UUID companyId) {}