// package com.tariff.domain;

// import jakarta.persistence.*;
// import java.math.BigDecimal;
// import java.time.LocalDate;
// import jakarta.persistence.Table; 

// @Entity
// @Table(name = "tariff_rules")
// public class TariffRule {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @Column(name = "origin_iso2", nullable = false, length = 2)
//     private String originCountry;

//     @Column(name = "dest_iso2", nullable = false, length = 2)
//     private String destCountry;

//     @Column(name = "hs_code", nullable = false, length = 10)
//     private String hsCode;

//     // Enum mapped to 'ad_valorem' | 'specific' | 'compound'
//     @Convert(converter = RuleTypeConverter.class)
//     @Column(name = "rule_type", nullable = false, length = 20)
//     private RuleType type;

//     // NUMERIC(12,6)
//     @Column(name = "rate_value", nullable = false, precision = 12, scale = 6)
//     private BigDecimal rate;

//     // Enum mapped to 'PERCENT', 'USD_PER_UNIT', 'SGD_PER_UNIT',
//     // 'PERCENT+USD_PER_UNIT', 'PERCENT+SGD_PER_UNIT'
//     @Convert(converter = RateUnitConverter.class)
//     @Column(name = "rate_unit", nullable = false, length = 50)
//     private RateUnit unit;

//     @Column(name = "valid_from", nullable = false)
//     private LocalDate validFrom;

//     @Column(name = "valid_to")
//     private LocalDate validTo;

//     public TariffRule() {}

//     // getters/setters
//     public Long getId() { return id; }
//     public void setId(Long id) { this.id = id; }

//     public String getOriginCountry() { return originCountry; }
//     public void setOriginCountry(String originCountry) { this.originCountry = originCountry; }

//     public String getDestCountry() { return destCountry; }
//     public void setDestCountry(String destCountry) { this.destCountry = destCountry; }

//     public String getHsCode() { return hsCode; }
//     public void setHsCode(String hsCode) { this.hsCode = hsCode; }

//     public RuleType getType() { return type; }
//     public void setType(RuleType type) { this.type = type; }

//     public BigDecimal getRate() { return rate; }
//     public void setRate(BigDecimal rate) { this.rate = rate; }

//     public RateUnit getUnit() { return unit; }
//     public void setUnit(RateUnit unit) { this.unit = unit; }

//     public LocalDate getValidFrom() { return validFrom; }
//     public void setValidFrom(LocalDate validFrom) { this.validFrom = validFrom; }

//     public LocalDate getValidTo() { return validTo; }
//     public void setValidTo(LocalDate validTo) { this.validTo = validTo; }
// }

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

    @Column(name = "origin_iso2", nullable = false, length = 2)
    private String originCountry;

    @Column(name = "dest_iso2", nullable = false, length = 2)
    private String destCountry;

    @Column(name = "hs_code", nullable = false, length = 10)
    private String hsCode;

    // Enum mapped to 'ad_valorem' | 'specific' | 'compound'
    @Convert(converter = RuleTypeConverter.class)
    @Column(name = "rule_type", nullable = false, length = 20)
    private RuleType type;

    // NUMERIC(12,6)
    @Column(name = "rate_value", nullable = false, precision = 12, scale = 6)
    private BigDecimal rate;

    // Enum mapped to 'PERCENT', 'USD_PER_UNIT', 'SGD_PER_UNIT',
    // 'PERCENT+USD_PER_UNIT', 'PERCENT+SGD_PER_UNIT'
    @Convert(converter = RateUnitConverter.class)
    @Column(name = "rate_unit", nullable = false, length = 50)
    private RateUnit unit;

    @Column(name = "valid_from", nullable = false)
    private LocalDate validFrom;

    @Column(name = "valid_to")
    private LocalDate validTo;

    public TariffRule() {
    }

    // getters/setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOriginCountry() {
        return originCountry;
    }

    public void setOriginCountry(String originCountry) {
        this.originCountry = originCountry;
    }

    public String getDestCountry() {
        return destCountry;
    }

    public void setDestCountry(String destCountry) {
        this.destCountry = destCountry;
    }

    public String getHsCode() {
        return hsCode;
    }

    public void setHsCode(String hsCode) {
        this.hsCode = hsCode;
    }

    public RuleType getType() {
        return type;
    }

    public void setType(RuleType type) {
        this.type = type;
    }

    public BigDecimal getRate() {
        return rate;
    }

    public void setRate(BigDecimal rate) {
        this.rate = rate;
    }

    public RateUnit getUnit() {
        return unit;
    }

    public void setUnit(RateUnit unit) {
        this.unit = unit;
    }

    public LocalDate getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(LocalDate validFrom) {
        this.validFrom = validFrom;
    }

    public LocalDate getValidTo() {
        return validTo;
    }

    public void setValidTo(LocalDate validTo) {
        this.validTo = validTo;
    }
}
