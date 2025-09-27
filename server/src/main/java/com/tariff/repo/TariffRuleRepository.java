package com.tariff.repo;

import com.tariff.domain.TariffRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TariffRuleRepository extends JpaRepository<TariffRule, Long> {

    @Query("""
        SELECT t FROM TariffRule t
        WHERE t.originCountry = :origin
          AND t.destCountry = :dest
          AND t.hsCode = :hs
          AND t.validFrom <= :onDate
          AND (t.validTo IS NULL OR t.validTo >= :onDate)
        ORDER BY t.validFrom DESC, t.id DESC
    """)
    List<TariffRule> findApplicable(String origin, String dest, String hs, LocalDate onDate);

    // Convenience method: fetch only the latest applicable rule
    default Optional<TariffRule> findLatestApplicable(String origin, String dest, String hs, LocalDate onDate) {
        List<TariffRule> rules = findApplicable(origin, dest, hs, onDate);
        return rules.isEmpty() ? Optional.empty() : Optional.of(rules.get(0));
    }
}
