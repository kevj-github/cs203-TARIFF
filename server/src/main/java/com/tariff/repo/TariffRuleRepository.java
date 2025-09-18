package com.tariff.repo;

import com.tariff.domain.TariffRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

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
}


