package com.tariff.api.dto;

public class CalculationDto {
    private String hsCode;
    private String originIso2;
    private String destIso2;
    // Optional details
    private Double declaredValuePerUnit;
    private java.math.BigDecimal declaredValuePerUnitUsd;
    private Integer quantity;
    private Double baseDuty;
    private Double total;
    private String ruleApplied;
    private Double indirectTax;
    private java.time.Instant calculatedAt;
    private java.time.LocalDate calcDate;
    private java.math.BigDecimal baseDutyUsd;
    private java.math.BigDecimal totalUsd;
    private java.math.BigDecimal indirectTaxUsd;
    private String notes;
    private Boolean isSimulation;

    // Getters and setters
    public String getHsCode() { return hsCode; }
    public void setHsCode(String hsCode) { this.hsCode = hsCode; }

    public String getOriginIso2() { return originIso2; }
    public void setOriginIso2(String originIso2) { this.originIso2 = originIso2; }

    public String getDestIso2() { return destIso2; }
    public void setDestIso2(String destIso2) { this.destIso2 = destIso2; }

    public Double getDeclaredValuePerUnit() { return declaredValuePerUnit; }
    public void setDeclaredValuePerUnit(Double declaredValuePerUnit) { this.declaredValuePerUnit = declaredValuePerUnit; }

    public java.math.BigDecimal getDeclaredValuePerUnitUsd() { return declaredValuePerUnitUsd; }
    public void setDeclaredValuePerUnitUsd(java.math.BigDecimal declaredValuePerUnitUsd) { this.declaredValuePerUnitUsd = declaredValuePerUnitUsd; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getBaseDuty() { return baseDuty; }
    public void setBaseDuty(Double baseDuty) { this.baseDuty = baseDuty; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public String getRuleApplied() { return ruleApplied; }
    public void setRuleApplied(String ruleApplied) { this.ruleApplied = ruleApplied; }

    public Double getIndirectTax() { return indirectTax; }
    public void setIndirectTax(Double indirectTax) { this.indirectTax = indirectTax; }

    public java.time.Instant getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(java.time.Instant calculatedAt) { this.calculatedAt = calculatedAt; }

    public java.time.LocalDate getCalcDate() { return calcDate; }
    public void setCalcDate(java.time.LocalDate calcDate) { this.calcDate = calcDate; }

    public java.math.BigDecimal getBaseDutyUsd() { return baseDutyUsd; }
    public void setBaseDutyUsd(java.math.BigDecimal baseDutyUsd) { this.baseDutyUsd = baseDutyUsd; }

    public java.math.BigDecimal getTotalUsd() { return totalUsd; }
    public void setTotalUsd(java.math.BigDecimal totalUsd) { this.totalUsd = totalUsd; }

    public java.math.BigDecimal getIndirectTaxUsd() { return indirectTaxUsd; }
    public void setIndirectTaxUsd(java.math.BigDecimal indirectTaxUsd) { this.indirectTaxUsd = indirectTaxUsd; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Boolean getIsSimulation() { return isSimulation; }
    public void setIsSimulation(Boolean isSimulation) { this.isSimulation = isSimulation; }
}
