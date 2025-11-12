
/**
 * Repository for querying tariff rules with optional filters for origin, destination, and HS code.
 * Ensures validity windows via `validFrom` and `validTo` in the query.
 */
package com.tariff.repo;

import com.tariff.domain.TariffRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TariffRuleRepository extends JpaRepository<TariffRule, Long> {

    @Query("""
            SELECT t FROM TariffRule t
            WHERE (:origin IS NULL OR t.originCountry = :origin)
            AND (:dest IS NULL OR t.destCountry = :dest)
            AND (:hs IS NULL OR t.hsCode = :hs)
            AND t.validFrom <= :onDate
            AND (t.validTo IS NULL OR t.validTo >= :onDate)
            ORDER BY t.validFrom DESC, t.id DESC
            """)
    List<TariffRule> findApplicable(
            @Param("origin") String origin,
            @Param("dest") String dest,
            @Param("hs") String hs,
            @Param("onDate") LocalDate onDate);
}
