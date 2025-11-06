package com.tariff.service;

import com.tariff.api.dto.CalculationDtos.CalculationRequest;
import com.tariff.api.dto.CalculationDtos.CalculationResponse;

import java.security.Principal;

public interface CalculationService {
    CalculationResponse calculate(CalculationRequest req, Principal principal, boolean save);
}
