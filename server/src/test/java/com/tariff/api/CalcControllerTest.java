package com.tariff.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tariff.api.dto.CalculationDtos.CalculationRequest;
import com.tariff.api.dto.CalculationDtos.CalculationResponse;
import com.tariff.api.dto.SimulationDetails;
import com.tariff.security.JwtAuthenticationFilter;
import com.tariff.service.CalculationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CalcController.class)
class CalcControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CalculationService calculationService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void calculate_validRequest_returnsResult() throws Exception {
        CalculationRequest req = new CalculationRequest();
        req.origin = "SG";
        req.dest = "US";
        req.hs = "8517.12";
        req.on = LocalDate.now();
        req.customsValue = BigDecimal.valueOf(10.0);
        req.quantity = 2;
        SimulationDetails sim = new SimulationDetails();
        sim.setTaxRate(5.0);
        sim.setTaxType("ad_valorem");
        req.simulation = sim;

        CalculationResponse resp = new CalculationResponse();
        resp.baseDuty = BigDecimal.valueOf(1.0);
        resp.indirectTax = BigDecimal.ZERO;
        resp.total = BigDecimal.valueOf(21.0);
        resp.ruleApplied = "ad_valorem (PERCENT)";

        when(calculationService.calculate(any(CalculationRequest.class))).thenReturn(resp);

        mockMvc.perform(post("/api/calculate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.total").value(21.0));
    }

    @Test
    void calculate_boundary_invalidQuantity_returnsBadRequest() throws Exception {
        CalculationRequest req = new CalculationRequest();
        req.origin = "SG";
        req.dest = "US";
        req.hs = "8517.12";
        req.on = LocalDate.now();
        req.customsValue = BigDecimal.valueOf(10.0);
        req.quantity = 0; // violates @Min(1)

        mockMvc.perform(post("/api/calculate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void calculate_boundary_invalidOriginLength_returnsBadRequest() throws Exception {
        CalculationRequest req = new CalculationRequest();
        req.origin = "S"; // violates @Size(min=2,max=2)
        req.dest = "US";
        req.hs = "8517.12";
        req.on = LocalDate.now();
        req.customsValue = BigDecimal.valueOf(10.0);
        req.quantity = 1;

        mockMvc.perform(post("/api/calculate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }
}