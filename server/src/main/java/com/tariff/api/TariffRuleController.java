// package com.tariff.api;

// import com.tariff.api.dto.ApiResponse;
// import com.tariff.api.dto.TariffRuleDtos.CreateTariffRuleRequest;
// import com.tariff.api.dto.TariffRuleDtos.TariffRuleResponse;
// import com.tariff.service.TariffRuleService;
// import io.swagger.v3.oas.annotations.Operation;
// import io.swagger.v3.oas.annotations.Parameter;
// import jakarta.validation.Valid;
// import org.springframework.format.annotation.DateTimeFormat;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.validation.annotation.Validated;
// import org.springframework.web.bind.annotation.*;

// import java.time.LocalDate;
// import java.util.List;

// @Validated
// @RestController
// @CrossOrigin(origins = "http://localhost:5175")
// @RequestMapping("/api/tariff-rules")
// public class TariffRuleController {

// private final TariffRuleService service;

// public TariffRuleController(TariffRuleService service) {
// this.service = service;
// }

// @Operation(summary = "Create a new tariff rule (electronics: ad valorem /
// specific / compound)")
// @PostMapping(consumes = "application/json", produces = "application/json")
// public ResponseEntity<ApiResponse<TariffRuleResponse>> create(@Valid
// @RequestBody CreateTariffRuleRequest req) {
// TariffRuleResponse resp = service.create(req);
// return
// ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Tariff
// rule created", resp));
// }

// @Operation(summary = "Query tariff rules applicable on a given date")
// @GetMapping(produces = "application/json")
// public ResponseEntity<ApiResponse<List<TariffRuleResponse>>> findApplicable(
// @RequestParam @Parameter(example = "SG") String origin,
// @RequestParam @Parameter(example = "US") String dest,
// @RequestParam @Parameter(example = "8517.12") String hs,
// @RequestParam(name = "on") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
// @Parameter(example = "2025-09-17") LocalDate onDate) {
// List<TariffRuleResponse> rules = service.findApplicable(origin, dest, hs,
// onDate)
// .stream()
// .map(TariffRuleService::toResp)
// .toList();

// return ResponseEntity.ok(ApiResponse.success("Tariff rules retrieved",
// rules));
// }
// }

package com.tariff.api;

import com.tariff.api.dto.ApiResponse;
import com.tariff.api.dto.TariffRuleDtos.CreateTariffRuleRequest;
import com.tariff.api.dto.TariffRuleDtos.TariffRuleResponse;
import com.tariff.service.TariffRuleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Validated
@RestController
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5175", "https://cs203-tariff-deploy.vercel.app", "https://cs203-tariff-deploy.vercel.app/" })
@RequestMapping("/api/tariff-rules")
public class TariffRuleController {

    private final TariffRuleService service;

    public TariffRuleController(TariffRuleService service) {
        this.service = service;
    }

    @Operation(summary = "Create a new tariff rule (electronics: ad valorem / specific / compound)")
    @PostMapping(consumes = "application/json", produces = "application/json")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TariffRuleResponse>> create(@Valid @RequestBody CreateTariffRuleRequest req) {
        TariffRuleResponse resp = service.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Tariff rule created", resp));
    }

    @Operation(summary = "Query tariff rules applicable on a given date")
    @GetMapping(produces = "application/json")
    public ResponseEntity<ApiResponse<List<TariffRuleResponse>>> findApplicable(
            @RequestParam(required = false) @Parameter(example = "SG") @Pattern(regexp = "^[A-Z]{2}$", message = "Origin must be ISO2 uppercase") String origin,
            @RequestParam(required = false) @Parameter(example = "US") @Pattern(regexp = "^[A-Z]{2}$", message = "Destination must be ISO2 uppercase") String dest,
            @RequestParam(required = false) @Parameter(example = "8517.12") @Pattern(regexp = "^[0-9]{2,6}(?:\\.[0-9]{2})?$", message = "HS code must be 2–6 digits, optional dot+2 digits") String hs,
            @RequestParam(name = "on", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) @Parameter(example = "2025-09-17") LocalDate onDate) {
        // Service already handles nulls and defaults to today's date for onDate
        List<TariffRuleResponse> rules = service.findApplicable(origin, dest, hs, onDate)
                .stream()
                .map(TariffRuleService::toResp)
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Tariff rules retrieved", rules));
    }
}
