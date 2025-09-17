package com.tariff.domain;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tariff_rules")
public class TariffRule {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String originIso2;
  private String destIso2;
  private String hsCode;
  private String ruleType;    // 'ad_valorem' | 'specific' | 'compound'
  private Double rateValue;   // e.g. 0.25 (25%), 0.198 (USD/L)
  private String rateUnit;    // 'PERCENT' | 'USD_PER_LITER' | 'SGD_PER_LAA'
  private LocalDate validFrom;
  private LocalDate validTo;
  // getters/setters omitted for brevity
}

