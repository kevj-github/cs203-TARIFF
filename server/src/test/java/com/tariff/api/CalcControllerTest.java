package com.tariff.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tariff.api.dto.CalculationDtos.CalculationRequest;
import com.tariff.api.dto.CalculationDtos.CalculationResponse;
import com.tariff.service.CalculationService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CalculationController.class)
class CalculationControllerTest {

    private final MockMvc mockMvc;
    private final ObjectMapper om;

    CalculationControllerTest(MockMvc mockMvc, ObjectMapper om) {
        this.mockMvc = mockMvc;
        this.om = om;
    }

    @MockBean
    CalculationService calculationService;

    @Test
    void post_calculation_returns_response() throws Exception {
        // request
        CalculationRequest req = new CalculationRequest();
        req.customsValue = new BigDecimal("200");
        req.quantityLiters = new BigDecimal("2.0");
        req.abv = new BigDecimal("0.13");
        req.origin = "SG";
        req.dest = "US";
        req.hs = "2204";
        req.on = LocalDate.of(2025, 6, 15);

        // mock service result
        CalculationResponse resp = new CalculationResponse();
        resp.baseDuty = new BigDecimal("2.60");
        resp.excise = BigDecimal.ZERO;
        resp.total = new BigDecimal("2.60");
        resp.ruleApplied = "specific (LAA)";

        when(calculationService.calculate(req)).thenReturn(resp);

        mockMvc.perform(post("/api/calculations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.baseDuty").value("2.60"))
            .andExpect(jsonPath("$.total").value("2.60"))
            .andExpect(jsonPath("$.ruleApplied").value("specific (LAA)"));
    }
}
