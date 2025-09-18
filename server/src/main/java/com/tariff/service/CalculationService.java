package com.tariff.service;

import com.tariff.api.dto.CalculationDtos.CalculationRequest;
import com.tariff.api.dto.CalculationDtos.CalculationResponse;
import com.tariff.domain.TariffRule;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class CalculationService {

    private final TariffRuleService tariffRuleService;

    public CalculationService(TariffRuleService tariffRuleService) {
        this.tariffRuleService = tariffRuleService;
    }

    /**
     * Supports:
     * - ad_valorem: baseDuty = customsValue * (rate / 100)
     * - specific (unit=L): baseDuty = rate * quantityLiters
     * - specific (unit=LAA): baseDuty = rate * (abv * quantityLiters)
     */
    public CalculationResponse calculate(CalculationRequest req) {
        List<TariffRule> rules = tariffRuleService.findApplicable(req.origin, req.dest, req.hs, req.on);
        if (rules.isEmpty()) {
            throw new IllegalArgumentException("No applicable tariff rule found for given parameters and date.");
        }

        // Take the most recent applicable rule (repo query orders by valid_from DESC)
        TariffRule rule = rules.get(0);

        BigDecimal base;
        switch (rule.getType()) {
            case "ad_valorem" -> {
                base = req.customsValue
                        .multiply(rule.getRate())
                        .divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP);
            }
            case "specific" -> {
                String u = (rule.getUnit() == null) ? "" : rule.getUnit().toUpperCase();
                // normalize units to our internal set
                if (u.endsWith("_PER_LITER") || "L".equals(u)) {
                    base = rule.getRate().multiply(req.quantityLiters);
                } else if (u.endsWith("_PER_LAA") || "LAA".equals(u)) {
                    base = rule.getRate().multiply(req.quantityLiters.multiply(req.abv));
                } else {
                    throw new IllegalArgumentException("Unsupported unit for specific duty: " + u);
                }
            }
            default -> throw new IllegalArgumentException("Unsupported rule type: " + rule.getType());
        }

        base = base.setScale(2, RoundingMode.HALF_UP);

        CalculationResponse resp = new CalculationResponse();
        resp.baseDuty = base;
        resp.excise = BigDecimal.ZERO; // placeholder for future excise calc
        resp.total = resp.baseDuty.add(resp.excise);
        resp.ruleApplied = rule.getType() + (rule.getUnit() != null ? (" (" + rule.getUnit() + ")") : "");
        return resp;
    }
}
