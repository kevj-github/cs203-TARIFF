package com.tariff.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CalculationDtos {

    @Schema(name = "CalculationRequest")
    public static class CalculationRequest {

        @NotBlank
        @Size(min = 2, max = 2)
        public String origin; // e.g., "SG"

        @NotBlank
        @Size(min = 2, max = 2)
        public String dest; // e.g., "US"

        @NotBlank
        @Size(max = 10)
        public String hs; // e.g., "8517.12"

        @NotNull
        public LocalDate on; // import date (rule validity)

        // Electronics inputs
        @NotNull
        @DecimalMin("0.0")
        public BigDecimal customsValue; // CIF/customs value PER UNIT (USD)

        @NotNull
        @Min(1)
        public Integer quantity; // number of units

        public SimulationDetails simulation; // Optional simulation details for tax calculation
    }

    @Schema(name = "CalculationResponse")
    public static class CalculationResponse {
        public BigDecimal baseDuty; // computed customs duty
        public BigDecimal indirectTax; // GST/VAT if you add it later (0 for now)
        public BigDecimal total; // customsValue*quantity + baseDuty + indirectTax
        public String ruleApplied; // e.g., "ad_valorem (PERCENT)"
    }
}
