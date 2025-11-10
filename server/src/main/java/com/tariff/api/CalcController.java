package com.tariff.api;

import com.tariff.api.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import com.tariff.api.dto.CalculationDtos.CalculationRequest;
import com.tariff.api.dto.CalculationDtos.CalculationResponse;
import com.tariff.service.CalculationService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5175", "https://cs203-tariff-deploy.vercel.app", "https://cs203-tariff-deploy.vercel.app/"})
@RequestMapping("/api/calculate")
public class CalcController {

    private final CalculationService calculationService;

    public CalcController(CalculationService calculationService) {
        this.calculationService = calculationService;
    }

    @Operation(summary = "Calculate tariff duty (ad valorem / specific)")
    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<ApiResponse<CalculationResponse>> calculate(@Valid @RequestBody CalculationRequest req) {
        CalculationResponse result = calculationService.calculate(req);
        return ResponseEntity.ok(ApiResponse.success("Calculation completed successfully", result));
    }
}
