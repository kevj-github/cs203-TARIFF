package com.tariff.api;

import com.tariff.api.dto.CalculationDtos.CalculationRequest;
import com.tariff.api.dto.CalculationDtos.CalculationResponse;
import com.tariff.service.CalculationService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/calculate")
public class CalcController {

    private final CalculationService calculationService;

    public CalcController(CalculationService calculationService) {
        this.calculationService = calculationService;
    }

    @Operation(summary = "Calculate tariff duty (ad valorem / specific)")
    @PostMapping(consumes = "application/json", produces = "application/json")
    public CalculationResponse calculate(@Valid @RequestBody CalculationRequest req) {
        return calculationService.calculate(req);
    }
}
