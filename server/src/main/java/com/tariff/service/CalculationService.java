package com.tariff.service;

import com.tariff.api.dto.CalculationDtos.CalculationRequest;
import com.tariff.api.dto.CalculationDtos.CalculationResponse;

public interface CalculationService {
    CalculationResponse calculate(CalculationRequest req);
}