package com.tariff.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "calculations")
public class Calculation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hs_code")
    @NotNull
    private String hsCode;

    @Column(name = "origin_iso2")
    @NotNull
    private String originIso2;

    @Column(name = "dest_iso2")
    @NotNull
    private String destIso2;

    @Column(name = "declared_value_per_unit")
    private Double declaredValuePerUnit;

    // USD variant (numeric, NOT NULL)
    @Column(name = "declared_value_per_unit_usd")
    @NotNull
    private java.math.BigDecimal declaredValuePerUnitUsd;

    @Column(name = "quantity")
    @NotNull
    private Integer quantity;

    @Column(name = "base_duty")
    private Double baseDuty;

    @Column(name = "total")
    private Double total;

    @Column(name = "rule_applied")
    private String ruleApplied;

    @Column(name = "indirect_tax")
    private Double indirectTax;

    @Column(name = "calculated_at")
    private java.time.Instant calculatedAt;

    // Additional columns to mirror DB one-to-one
    @Column(name = "calc_date")
    @NotNull
    private java.time.LocalDate calcDate;

    @Column(name = "base_duty_usd")
    private java.math.BigDecimal baseDutyUsd;

    @Column(name = "total_usd")
    private java.math.BigDecimal totalUsd;

    @Column(name = "indirect_tax_usd")
    private java.math.BigDecimal indirectTaxUsd;

    // Add other fields as needed
    @Column(name = "notes")
    private String notes;

    // Track whether this calculation was done in simulation mode
    @Column(name = "is_simulation")
    private Boolean isSimulation;

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Boolean getIsSimulation() { return isSimulation; }
    public void setIsSimulation(Boolean isSimulation) { this.isSimulation = isSimulation; }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
