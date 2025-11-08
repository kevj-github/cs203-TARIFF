package com.tariff.service;

import com.tariff.api.dto.CalculationDtos.CalculationRequest;
import com.tariff.api.dto.CalculationDtos.CalculationResponse;
import com.tariff.domain.TariffRule;
import com.tariff.domain.RuleType;
import com.tariff.domain.RateUnit;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class CalculationServiceImpl implements CalculationService {

    private final TariffRuleService tariffRuleService;

    public CalculationServiceImpl(TariffRuleService tariffRuleService) {
        this.tariffRuleService = tariffRuleService;
    }

    @Override
    public CalculationResponse calculate(CalculationRequest req) {
        TariffRule rule;

        // If simulation mode is enabled, create a simulated rule
        if (req.simulation != null) {
            rule = new TariffRule();
            rule.setType(RuleType.valueOf(req.simulation.taxType));
            rule.setRate(BigDecimal.valueOf(req.simulation.taxRate));
            rule.setUnit(req.simulation.taxType.equals("SPECIFIC") ? RateUnit.USD_PER_UNIT : RateUnit.PERCENT);
        } else {
            // find all rules that match origin/dest/HS/date
            List<TariffRule> rules = tariffRuleService.findApplicable(req.origin, req.dest, req.hs, req.on);
            if (rules.isEmpty()) {
                throw new IllegalArgumentException("No applicable tariff rule found for given parameters and date.");
            }
            // take the most recent
            rule = rules.get(0);
        }

        BigDecimal customsTotal = req.customsValue.multiply(BigDecimal.valueOf(req.quantity));
        BigDecimal baseDuty;

        switch (rule.getType()) {
            case AD_VALOREM -> {
                baseDuty = customsTotal
                        .multiply(rule.getRate())
                        .divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP);
            }
            case SPECIFIC -> {
                baseDuty = rule.getRate().multiply(BigDecimal.valueOf(req.quantity));
            }
            case COMPOUND -> {
                BigDecimal percentPart = customsTotal
                        .multiply(rule.getRate())
                        .divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP);

                // For now: no fixed part stored, extend schema if needed
                BigDecimal fixedPerUnit = BigDecimal.ZERO;

                baseDuty = percentPart.add(fixedPerUnit.multiply(BigDecimal.valueOf(req.quantity)));
            }
            default -> throw new IllegalArgumentException("Unsupported rule type: " + rule.getType());
        }

        baseDuty = baseDuty.setScale(2, RoundingMode.HALF_UP);

        CalculationResponse resp = new CalculationResponse();
        resp.baseDuty = baseDuty;
        resp.indirectTax = BigDecimal.ZERO; // placeholder for GST/VAT
        resp.total = customsTotal.add(resp.baseDuty).add(resp.indirectTax);
        resp.ruleApplied = rule.getType().getDbValue()
                + (rule.getUnit() != null ? (" (" + rule.getUnit().getDbValue() + ")") : "");
        return resp;
    }
}