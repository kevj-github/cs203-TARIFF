package com.tariff.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "tariff_rules")
public class TariffRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // matches origin_iso2 / dest_iso2
    @Column(name = "origin_iso2", nullable = false, length = 2)
    private String originCountry;

    @Column(name = "dest_iso2", nullable = false, length = 2)
    private String destCountry;

    @Column(name = "hs_code", nullable = false, length = 10)
    private String hsCode;

    // 'ad_valorem' | 'specific' | 'compound' (we currently use first two)
    @Column(name = "rule_type", nullable = false, length = 20)
    private String type;

    // NUMERIC(12,6)
    @Column(name = "rate_value", nullable = false, precision = 12, scale = 6)
    private BigDecimal rate;

    // NOT NULL in schema; allow values like 'PERCENT', 'L', 'LAA', 'USD_PER_LITER'
    @Column(name = "rate_unit", nullable = false, length = 50)
    private String unit;

    @Column(name = "valid_from", nullable = false)
    private LocalDate validFrom;

    @Column(name = "valid_to")
    private LocalDate validTo;

    public TariffRule() {}

    // getters/setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOriginCountry() { return originCountry; }
    public void setOriginCountry(String originCountry) { this.originCountry = originCountry; }

    public String getDestCountry() { return destCountry; }
    public void setDestCountry(String destCountry) { this.destCountry = destCountry; }

    public String getHsCode() { return hsCode; }
    public void setHsCode(String hsCode) { this.hsCode = hsCode; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public BigDecimal getRate() { return rate; }
    public void setRate(BigDecimal rate) { this.rate = rate; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public LocalDate getValidFrom() { return validFrom; }
    public void setValidFrom(LocalDate validFrom) { this.validFrom = validFrom; }

    public LocalDate getValidTo() { return validTo; }
    public void setValidTo(LocalDate validTo) { this.validTo = validTo; }
}

