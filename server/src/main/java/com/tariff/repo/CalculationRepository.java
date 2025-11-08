package com.tariff.repo;

import com.tariff.domain.Calculation;
import com.tariff.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CalculationRepository extends JpaRepository<Calculation, Long> {
    List<Calculation> findByUser(User user);
}
