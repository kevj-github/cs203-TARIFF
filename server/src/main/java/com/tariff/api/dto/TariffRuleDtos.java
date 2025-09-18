package com.tariff.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class TariffRuleDtos {

    @Schema(name = "CreateTariffRuleRequest")
    public static class CreateTariffRuleRequest {
        @NotBlank @Size(min = 2, max = 2)
        public String origin;        // SG
        @NotBlank @Size(min = 2, max = 2)
        public String dest;          // US
        @NotBlank @Size(max = 10)
        public String hs;            // 2204
        @NotBlank @Pattern(regexp = "ad_valorem|specific")
        public String type;          // ad_valorem | specific
        @NotNull @DecimalMin("0.0")
        public BigDecimal rate;      // % for ad_valorem, currency per unit for specific
        @Schema(description = "For specific only: L (per liter) or LAA (per liter-of-alcohol)")
        @Pattern(regexp = "(L|LAA)?")
        public String unit;          // null for ad_valorem; "L" or "LAA" for specific
        @NotNull
        public LocalDate validFrom;
        public LocalDate validTo;
        public String description;
    }

    @Schema(name = "TariffRuleResponse")
    public static class TariffRuleResponse {
        public Long id;
        public String origin;
        public String dest;
        public String hs;
        public String type;
        public BigDecimal rate;
        public String unit;
        public LocalDate validFrom;
        public LocalDate validTo;
        public String description;
    }
}

