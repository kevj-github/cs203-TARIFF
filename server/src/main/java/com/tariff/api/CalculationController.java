package com.tariff.api;

import com.tariff.api.dto.CalculationDto;
import com.tariff.api.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.tariff.domain.Calculation;
import com.tariff.domain.User;
import com.tariff.service.CalculationEntityService;
import com.tariff.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/calculations")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5175", "http://localhost:3000"})
public class CalculationController {
    private static final Logger log = LoggerFactory.getLogger(CalculationController.class);
    @Autowired
    private CalculationEntityService calculationService;
    @Autowired
    private UserService userService;

    @PostMapping("/save")
    public ResponseEntity<?> saveCalculation(@RequestBody CalculationDto dto, Authentication auth) {
        log.info("POST /api/calculations/save called by auth={}", auth==null?"<no-auth>":auth.getName());
        log.debug("Payload: {}", dto);
        if (auth == null || !auth.isAuthenticated()) {
            log.warn("Attempt to save calculation without authentication");
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        User user = userService.findByEmail(auth.getName()).orElseThrow();
        if (dto.getHsCode() == null || dto.getHsCode().isBlank()) {
            log.warn("Missing hsCode in save payload");
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing hsCode"));
        }
        // Enforce NOT NULL constraints to match DB schema
        if (dto.getOriginIso2() == null || dto.getOriginIso2().isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing originIso2"));
        }
        if (dto.getDestIso2() == null || dto.getDestIso2().isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing destIso2"));
        }
        if (dto.getQuantity() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing quantity"));
        }
        if (dto.getCalcDate() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing calcDate"));
        }
        if (dto.getDeclaredValuePerUnitUsd() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing declaredValuePerUnitUsd"));
        }
        Calculation calc = new Calculation();
        calc.setHsCode(dto.getHsCode());
        calc.setOriginIso2(dto.getOriginIso2());
        calc.setDestIso2(dto.getDestIso2());
        // Optional fields mirroring DB columns one-to-one
        calc.setDeclaredValuePerUnit(dto.getDeclaredValuePerUnit());
        calc.setDeclaredValuePerUnitUsd(dto.getDeclaredValuePerUnitUsd());
        calc.setQuantity(dto.getQuantity());
        calc.setBaseDuty(dto.getBaseDuty());
        calc.setTotal(dto.getTotal());
        calc.setRuleApplied(dto.getRuleApplied());
        calc.setIndirectTax(dto.getIndirectTax());
        calc.setCalculatedAt(dto.getCalculatedAt());
        calc.setCalcDate(dto.getCalcDate());
        calc.setBaseDutyUsd(dto.getBaseDutyUsd());
        calc.setTotalUsd(dto.getTotalUsd());
        calc.setIndirectTaxUsd(dto.getIndirectTaxUsd());
        calc.setNotes(dto.getNotes());
        // Track simulation mode if provided; default to false
        calc.setIsSimulation(dto.getIsSimulation() != null ? dto.getIsSimulation() : false);
        calc.setUser(user);
        calculationService.saveCalculation(calc);
        return ResponseEntity.ok(ApiResponse.success("Saved", null));
    }

    @GetMapping
    public ResponseEntity<List<Calculation>> getUserCalculations(Authentication auth) {
        User user = userService.findByEmail(auth.getName()).orElseThrow();
        List<Calculation> list = calculationService.getCalculationsForUser(user);
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCalculation(@PathVariable Long id, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        User user = userService.findByEmail(auth.getName()).orElseThrow();
        Optional<Calculation> calcOpt = calculationService.findById(id);
        if (calcOpt.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.error("Not found"));
        }
        Calculation calc = calcOpt.get();
        if (calc.getUser() == null || !calc.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(ApiResponse.error("Forbidden"));
        }
        calculationService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }
}
