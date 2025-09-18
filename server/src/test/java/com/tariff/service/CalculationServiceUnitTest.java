package com.tariff.service;

import com.tariff.api.dto.CalculationDtos.CalculationRequest;
import com.tariff.api.dto.CalculationDtos.CalculationResponse;
import com.tariff.domain.TariffRule;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class) // no Spring context needed
class CalculationServiceUnitTest {

    @Mock
    TariffRuleService tariffRuleService;

    @InjectMocks
    CalculationService calc;

    private static CalculationRequest req(BigDecimal customs, BigDecimal liters, BigDecimal abv,
                                          String origin, String dest, String hs, LocalDate on) {
        CalculationRequest r = new CalculationRequest();
        r.customsValue = customs;
        r.quantityLiters = liters;
        r.abv = abv;
        r.origin = origin;
        r.dest = dest;
        r.hs = hs;
        r.on = on;
        return r;
    }

    private static TariffRule rule(String type, String unit, String origin, String dest,
                                   String hs, String rate, LocalDate from) {
        TariffRule t = new TariffRule();
        t.setType(type);
        t.setUnit(unit);                 // NOT NULL in your schema
        t.setOriginCountry(origin);
        t.setDestCountry(dest);
        t.setHsCode(hs);
        t.setRate(new BigDecimal(rate));
        t.setValidFrom(from);
        return t;
    }

    @Test
    void adValorem_applies_before_specific_validFrom() {
        // Only ad valorem is applicable (Mar 2025)
        when(tariffRuleService.findApplicable("SG", "US", "2204", LocalDate.of(2025, 3, 1)))
                .thenReturn(List.of(
                        rule("ad_valorem", "PERCENT", "SG", "US", "2204", "5", LocalDate.of(2025, 1, 1))
                ));

        CalculationResponse resp = calc.calculate(
                req(new BigDecimal("120"), new BigDecimal("1.5"), new BigDecimal("0.12"),
                        "SG","US","2204", LocalDate.of(2025, 3, 1)));

        assertThat(resp.baseDuty).isEqualByComparingTo("6.00");   // 5% of 120
        assertThat(resp.ruleApplied).startsWith("ad_valorem");
    }

    @Test
    void specific_overrides_adValorem_on_or_after_June_2025() {
        // Repo returns rules ordered by valid_from DESC → specific first
        when(tariffRuleService.findApplicable("SG", "US", "2204", LocalDate.of(2025, 6, 15)))
                .thenReturn(List.of(
                        rule("specific", "LAA", "SG","US","2204","10", LocalDate.of(2025, 6, 1)),
                        rule("ad_valorem", "PERCENT", "SG","US","2204","5",  LocalDate.of(2025, 1, 1))
                ));

        CalculationResponse resp = calc.calculate(
                req(new BigDecimal("200"), new BigDecimal("2.0"), new BigDecimal("0.13"),
                        "SG","US","2204", LocalDate.of(2025, 6, 15)));

        // LAA = 2.0 * 0.13 = 0.26 → 0.26 * 10 = 2.60
        assertThat(resp.baseDuty).isEqualByComparingTo("2.60");
        assertThat(resp.ruleApplied).startsWith("specific");
    }

    @Test
    void falls_back_to_adValorem_when_specific_deleted() {
        // After June 1 but specific removed → only ad valorem returned
        when(tariffRuleService.findApplicable("SG", "US", "2204", LocalDate.of(2025, 6, 15)))
                .thenReturn(List.of(
                        rule("ad_valorem", "PERCENT", "SG","US","2204","5", LocalDate.of(2025, 1, 1))
                ));

        CalculationResponse resp = calc.calculate(
                req(new BigDecimal("200"), new BigDecimal("2.0"), new BigDecimal("0.13"),
                        "SG","US","2204", LocalDate.of(2025, 6, 15)));

        assertThat(resp.baseDuty).isEqualByComparingTo("10.00");  // 5% of 200
        assertThat(resp.ruleApplied).startsWith("ad_valorem");
    }
}
