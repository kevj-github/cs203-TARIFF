package com.tariff.api;

import com.tariff.api.dto.TariffRuleDtos.CreateTariffRuleRequest;
import com.tariff.api.dto.TariffRuleDtos.TariffRuleResponse;
import com.tariff.domain.TariffRule;
import com.tariff.service.TariffRuleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/tariff-rules")
public class TariffRuleController {

    private final TariffRuleService service;

    public TariffRuleController(TariffRuleService service) {
        this.service = service;
    }

    @Operation(summary = "Create a new tariff rule")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TariffRuleResponse create(@Valid @RequestBody CreateTariffRuleRequest req) {
        return service.create(req);
    }

    @Operation(summary = "Query tariff rules applicable on a given date")
    @GetMapping
    public List<TariffRuleResponse> findApplicable(
            @RequestParam @Parameter(example = "SG") String origin,
            @RequestParam @Parameter(example = "US") String dest,
            @RequestParam @Parameter(example = "2204") String hs,
            @RequestParam(name = "on")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            @Parameter(example = "2025-09-17")
            LocalDate onDate
    ) {
        return service.findApplicable(origin, dest, hs, onDate)
                .stream()
                .map(TariffRuleService::toResp)
                .toList();
    }
}

