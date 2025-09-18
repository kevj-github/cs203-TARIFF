package com.tariff.service;

import com.tariff.api.dto.TariffRuleDtos.CreateTariffRuleRequest;
import com.tariff.api.dto.TariffRuleDtos.TariffRuleResponse;
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
        // Basic normalization
        final String origin = req.origin == null ? null : req.origin.trim().toUpperCase();
        final String dest   = req.dest   == null ? null : req.dest.trim().toUpperCase();
        final String type   = req.type   == null ? null : req.type.trim();
        final String unit   = normalizeUnit(type, req.unit);

        // Validate type ↔ unit compatibility
        if ("ad_valorem".equals(type)) {
            if (!"PERCENT".equals(unit)) {
                throw new IllegalArgumentException("ad_valorem rules must use unit = PERCENT.");
            }
        } else if ("specific".equals(type)) {
            if (!"L".equals(unit) && !"LAA".equals(unit)) {
                throw new IllegalArgumentException("specific rules must use unit = L or LAA.");
            }
        } else {
            throw new IllegalArgumentException("Unsupported rule type: " + type);
        }

        TariffRule t = new TariffRule();
        t.setOriginCountry(origin);
        t.setDestCountry(dest);
        t.setHsCode(req.hs);
        t.setType(type);
        t.setRate(req.rate);
        t.setUnit(unit); // NOT NULL by schema
        t.setValidFrom(req.validFrom);
        t.setValidTo(req.validTo);
        TariffRule saved = repo.save(t);
        return toResp(saved);
    }

    @Transactional(readOnly = true)
    public List<TariffRule> findApplicable(String origin, String dest, String hs, LocalDate onDate) {
        return repo.findApplicable(
                origin == null ? null : origin.toUpperCase(),
                dest   == null ? null : dest.toUpperCase(),
                hs,
                onDate
        );
    }

    public static TariffRuleResponse toResp(TariffRule t) {
        TariffRuleResponse r = new TariffRuleResponse();
        r.id = t.getId();
        r.origin = t.getOriginCountry();
        r.dest = t.getDestCountry();
        r.hs = t.getHsCode();
        r.type = t.getType();
        r.rate = t.getRate();
        r.unit = t.getUnit();
        r.validFrom = t.getValidFrom();
        r.validTo = t.getValidTo();
        return r;
    }

    /**
     * Normalize external/unit inputs into the minimal internal set:
     *  - ad_valorem → PERCENT (default if missing)
     *  - specific  → L or LAA
     * Also maps things like USD_PER_LITER → L, *_PER_LAA → LAA.
     */
    private static String normalizeUnit(String type, String rawUnit) {
        String u = rawUnit == null ? "" : rawUnit.trim().toUpperCase();

        if ("ad_valorem".equals(type)) {
            // Default to PERCENT if caller omitted unit
            if (u.isEmpty()) return "PERCENT";
            if ("PERCENT".equals(u) || "%".equals(u)) return "PERCENT";
            // tolerate "ADVALOREM" / "AD_VALOREM_PERCENT" style inputs
            if (u.endsWith("PERCENT")) return "PERCENT";
            return "PERCENT"; // safest default for ad valorem
        }

        if ("specific".equals(type)) {
            if (u.isEmpty()) {
                // missing unit for specific is not OK — be explicit
                throw new IllegalArgumentException("Unit is required for specific rules (use L or LAA).");
            }
            // Accept L / LAA directly
            if ("L".equals(u) || "LAA".equals(u)) return u;

            // Map *_PER_LITER → L, *_PER_LAA → LAA
            if (u.endsWith("_PER_LITER")) return "L";
            if (u.endsWith("_PER_LAA"))   return "LAA";

            // Accept common alternates
            if ("PER_LITER".equals(u) || "LITER".equals(u) || "LITRE".equals(u)) return "L";
            if ("PER_LAA".equals(u)) return "LAA";

            throw new IllegalArgumentException("Unsupported unit for specific rule: " + rawUnit);
        }

        // Unknown type; return as-is (create() will reject)
        return u;
    }
}
