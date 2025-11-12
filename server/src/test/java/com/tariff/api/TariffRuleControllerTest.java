package com.tariff.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tariff.api.dto.TariffRuleDtos.CreateTariffRuleRequest;
import com.tariff.api.dto.TariffRuleDtos.TariffRuleResponse;
import com.tariff.domain.RateUnit;
import com.tariff.domain.RuleType;
import com.tariff.domain.TariffRule;
import com.tariff.security.JwtAuthenticationFilter;
import com.tariff.service.TariffRuleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TariffRuleController.class)
class TariffRuleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TariffRuleService tariffRuleService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void findApplicable_validParams_returnsList() throws Exception {
        TariffRule entity = new TariffRule();
        entity.setOriginCountry("SG");
        entity.setDestCountry("US");
        entity.setHsCode("8517.12");
        entity.setType(RuleType.AD_VALOREM);
        entity.setRate(BigDecimal.valueOf(5.0));
        entity.setUnit(RateUnit.PERCENT);
        entity.setValidFrom(LocalDate.now().minusDays(1));
        entity.setValidTo(LocalDate.now().plusDays(1));

        when(tariffRuleService.findApplicable(eq("SG"), eq("US"), eq("8517.12"), any()))
                .thenReturn(List.of(entity));

        mockMvc.perform(get("/api/tariff-rules")
                        .param("origin", "SG")
                        .param("dest", "US")
                        .param("hs", "8517.12")
                        .param("on", LocalDate.now().toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].unit").value("PERCENT"));
    }

    @Test
    void findApplicable_boundary_invalidOriginPattern_returnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/tariff-rules")
                        .param("origin", "sg")
                        .param("dest", "US")
                        .param("hs", "8517.12"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void create_adminSuccess_returnsCreated() throws Exception {
        CreateTariffRuleRequest req = new CreateTariffRuleRequest();
        req.origin = "SG";
        req.dest = "US";
        req.hs = "8517.12";
        req.type = "ad_valorem";
        req.rate = BigDecimal.valueOf(5.0);
        req.unit = "PERCENT";
        req.validFrom = LocalDate.now();

        TariffRuleResponse resp = new TariffRuleResponse();
        resp.origin = req.origin;
        resp.dest = req.dest;
        resp.hs = req.hs;
        resp.type = req.type;
        resp.rate = req.rate;
        resp.unit = req.unit;
        resp.validFrom = req.validFrom;

        when(tariffRuleService.create(any(CreateTariffRuleRequest.class))).thenReturn(resp);

        mockMvc.perform(post("/api/tariff-rules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.unit").value("PERCENT"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void create_boundary_invalidUnitForType_returnsBadRequest() throws Exception {
        CreateTariffRuleRequest req = new CreateTariffRuleRequest();
        req.origin = "SG";
        req.dest = "US";
        req.hs = "8517.12";
        req.type = "ad_valorem";
        req.rate = BigDecimal.valueOf(5.0);
        req.unit = "USD_PER_UNIT"; // invalid for ad_valorem
        req.validFrom = LocalDate.now();

        mockMvc.perform(post("/api/tariff-rules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }
}