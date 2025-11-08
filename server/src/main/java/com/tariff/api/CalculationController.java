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

@RestController
@RequestMapping("/api/calculations")
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
        Calculation calc = new Calculation();
        calc.setHsCode(dto.getHsCode());
        calc.setOriginIso2(dto.getOriginIso2());
        calc.setDestIso2(dto.getDestIso2());
        calc.setNotes(dto.getNotes());
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
}
