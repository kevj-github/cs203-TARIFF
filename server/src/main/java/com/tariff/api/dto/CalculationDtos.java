package com.tariff.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class CalculationDtos {

    @Schema(name = "CalculationRequest")
    public static class CalculationRequest {
        @NotBlank @Size(min = 2, max = 2)
        public String origin;
        @NotBlank @Size(min = 2, max = 2)
        public String dest;
        @NotBlank
        public String hs;
        @NotNull
        public LocalDate on;

        // Inputs for duty computation
        @NotNull @DecimalMin("0.0")
        public BigDecimal customsValue;       // CIF or customs value for ad valorem
        @NotNull @DecimalMin("0.0")
        public BigDecimal quantityLiters;     // total liters of product
        @NotNull @DecimalMin("0.0") @DecimalMax("1.0")
        public BigDecimal abv;                // alcohol by volume as a fraction (e.g., 0.125 for 12.5%)
    }

    @Schema(name = "CalculationResponse")
    public static class CalculationResponse {
        public BigDecimal baseDuty;
        public BigDecimal excise;   // for now 0
        public BigDecimal total;
        public String ruleApplied;  // human-readable
    }
}

