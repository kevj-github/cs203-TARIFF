package com.tariff.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.time.LocalDate;

public class TariffRuleDtos {

    @Schema(name = "CreateTariffRuleRequest")
    public static class CreateTariffRuleRequest {
        @NotBlank @Size(min = 2, max = 2)
        public String origin;        // e.g., "SG"
        @NotBlank @Size(min = 2, max = 2)
        public String dest;          // e.g., "US"

        @NotBlank @Size(max = 10)
        public String hs;            // e.g., "8517.12"

        // 'ad_valorem' | 'specific' | 'compound'
        @NotBlank
        @Pattern(regexp = "ad_valorem|specific|compound")
        public String type;

        // For ad_valorem: percentage value (e.g., 5.0 means 5%)
        // For specific: currency per unit (e.g., 2.50 means $2.50 per unit)
        // For compound: percentage part (the fixed per-unit part is implied by unit)
        @NotNull @DecimalMin("0.0")
        public BigDecimal rate;

        @Schema(description =
            "Units:\n" +
            "- ad_valorem: 'PERCENT'\n" +
            "- specific: 'USD_PER_UNIT' or 'SGD_PER_UNIT'\n" +
            "- compound: 'PERCENT+USD_PER_UNIT' or 'PERCENT+SGD_PER_UNIT'")
        @NotBlank
        @Size(max = 50)
        public String unit;

        @NotNull
        public LocalDate validFrom;
        public LocalDate validTo;

        @Size(max = 500)
        public String description;

        // ---- Cross-field validation for type ↔ unit coherence ----
        @AssertTrue(message = "Invalid unit for rule type. " +
                "Use PERCENT for ad_valorem; USD_PER_UNIT/SGD_PER_UNIT for specific; " +
                "PERCENT+USD_PER_UNIT or PERCENT+SGD_PER_UNIT for compound.")
        public boolean isUnitValidForType() {
            if (type == null || unit == null) return false;
            return switch (type) {
                case "ad_valorem" -> unit.equals("PERCENT");
                case "specific"   -> unit.equals("USD_PER_UNIT") || unit.equals("SGD_PER_UNIT");
                case "compound"   -> unit.equals("PERCENT+USD_PER_UNIT") || unit.equals("PERCENT+SGD_PER_UNIT");
                default -> false;
            };
        }
    }

    @Schema(name = "TariffRuleResponse")
    public static class TariffRuleResponse {
        public Long id;
        public String origin;
        public String dest;
        public String hs;
        public String type;          // ad_valorem | specific | compound
        public BigDecimal rate;      // meaning depends on type (see request)
        public String unit;          // PERCENT | *_PER_UNIT | PERCENT+*_PER_UNIT
        public LocalDate validFrom;
        public LocalDate validTo;
        public String description;
    }
}
