package com.tariff.service;

import com.tariff.api.dto.TariffRuleDtos.CreateTariffRuleRequest;
import com.tariff.api.dto.TariffRuleDtos.TariffRuleResponse;
import com.tariff.domain.RateUnit;
import com.tariff.domain.RuleType;
import com.tariff.domain.TariffRule;
import com.tariff.repo.TariffRuleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class TariffRuleService {

    private final TariffRuleRepository repo;

    public TariffRuleService(TariffRuleRepository repo) {
        this.repo = repo;
    }

    @Transactional
    public TariffRuleResponse create(CreateTariffRuleRequest req) {
        final String origin = req.origin == null ? null : req.origin.trim().toUpperCase();
        final String dest = req.dest == null ? null : req.dest.trim().toUpperCase();

        // Parse enums from DTO strings (validations already run at DTO layer)
        final RuleType type = parseRuleType(req.type);
        final RateUnit unit = parseRateUnit(req.unit);

        // Cross-field validation: enforce type ↔ unit compatibility
        ensureTypeUnitCompatible(type, unit);

        TariffRule t = new TariffRule();
        t.setOriginCountry(origin);
        t.setDestCountry(dest);
        t.setHsCode(req.hs);
        t.setType(type);
        t.setRate(req.rate);
        t.setUnit(unit);
        t.setValidFrom(req.validFrom);
        t.setValidTo(req.validTo);

        TariffRule saved = repo.save(t);
        return toResp(saved);
    }

    @Transactional(readOnly = true)
    public List<TariffRule> findApplicable(String origin, String dest, String hs, LocalDate onDate) {
        // Default to today if null
        LocalDate effectiveDate = (onDate != null) ? onDate : LocalDate.now();

        return repo.findApplicable(
                origin == null ? null : origin.toUpperCase(),
                dest == null ? null : dest.toUpperCase(),
                hs,
                effectiveDate // Now guaranteed to be non-null
        );
    }

    // @Transactional(readOnly = true)
    // public List<TariffRule> findApplicable(String origin, String dest, String hs,
    // LocalDate onDate) {
    // return repo.findApplicable(
    // origin == null ? null : origin.toUpperCase(),
    // dest == null ? null : dest.toUpperCase(),
    // hs,
    // onDate
    // );
    // }

    public static TariffRuleResponse toResp(TariffRule t) {
        TariffRuleResponse r = new TariffRuleResponse();
        r.id = t.getId();
        r.origin = t.getOriginCountry();
        r.dest = t.getDestCountry();
        r.hs = t.getHsCode();
        r.type = t.getType().getDbValue(); // "ad_valorem" | "specific" | "compound"
        r.rate = t.getRate();
        r.unit = t.getUnit().getDbValue(); // e.g. "PERCENT", "USD_PER_UNIT", "PERCENT+USD_PER_UNIT"
        r.validFrom = t.getValidFrom();
        r.validTo = t.getValidTo();
        return r;
    }

    // ---------- helpers ----------

    private static RuleType parseRuleType(String s) {
        if (s == null)
            throw new IllegalArgumentException("rule type is required");
        String v = s.trim().toLowerCase();
        return switch (v) {
            case "ad_valorem" -> RuleType.AD_VALOREM;
            case "specific" -> RuleType.SPECIFIC;
            case "compound" -> RuleType.COMPOUND;
            default -> throw new IllegalArgumentException("Unsupported rule type: " + s);
        };
    }

    private static RateUnit parseRateUnit(String s) {
        if (s == null)
            throw new IllegalArgumentException("unit is required");
        String v = s.trim().toUpperCase();
        // Allow a few tolerant aliases
        if ("%".equals(v))
            v = "PERCENT";
        return switch (v) {
            case "PERCENT" -> RateUnit.PERCENT;
            case "USD_PER_UNIT" -> RateUnit.USD_PER_UNIT;
            case "SGD_PER_UNIT" -> RateUnit.SGD_PER_UNIT;
            case "PERCENT+USD_PER_UNIT" -> RateUnit.PERCENT_PLUS_USD_PER_UNIT;
            case "PERCENT+SGD_PER_UNIT" -> RateUnit.PERCENT_PLUS_SGD_PER_UNIT;
            default -> throw new IllegalArgumentException("Unsupported unit: " + s);
        };
    }

    private static void ensureTypeUnitCompatible(RuleType type, RateUnit unit) {
        switch (type) {
            case AD_VALOREM -> {
                if (unit != RateUnit.PERCENT) {
                    throw new IllegalArgumentException("ad_valorem rules must use unit = PERCENT");
                }
            }
            case SPECIFIC -> {
                if (!(unit == RateUnit.USD_PER_UNIT || unit == RateUnit.SGD_PER_UNIT)) {
                    throw new IllegalArgumentException("specific rules must use unit = USD_PER_UNIT or SGD_PER_UNIT");
                }
            }
            case COMPOUND -> {
                if (!(unit == RateUnit.PERCENT_PLUS_USD_PER_UNIT || unit == RateUnit.PERCENT_PLUS_SGD_PER_UNIT)) {
                    throw new IllegalArgumentException(
                            "compound rules must use unit = PERCENT+USD_PER_UNIT or PERCENT+SGD_PER_UNIT");
                }
            }
        }
    }
}
