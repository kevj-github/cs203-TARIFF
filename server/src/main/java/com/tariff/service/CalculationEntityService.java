package com.tariff.service;

import com.tariff.domain.Calculation;
import com.tariff.domain.User;
import com.tariff.repo.CalculationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CalculationEntityService {
    @Autowired
    private CalculationRepository calculationRepository;

    public Calculation saveCalculation(Calculation calc) {
        return calculationRepository.save(calc);
    }

    public List<Calculation> getCalculationsForUser(User user) {
        return calculationRepository.findByUser(user);
    }
}
