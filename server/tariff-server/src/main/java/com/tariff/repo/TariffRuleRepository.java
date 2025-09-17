package com.tariff.repo;

import com.tariff.domain.TariffRule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface TariffRuleRepository extends JpaRepository<TariffRule, Long> {
  List<TariffRule> findByOriginIso2AndDestIso2AndHsCodeAndValidFromLessThanEqualAndValidToIsNullOrValidToGreaterThanEqual(
    String originIso2, String destIso2, String hsCode, LocalDate onDate1, LocalDate onDate2
  );
}

