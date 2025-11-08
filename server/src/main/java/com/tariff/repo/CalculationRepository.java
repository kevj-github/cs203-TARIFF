package com.tariff.repo;

import com.tariff.domain.Calculation;
import com.tariff.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CalculationRepository extends JpaRepository<Calculation, Long> {
    List<Calculation> findByUser(User user);
}
