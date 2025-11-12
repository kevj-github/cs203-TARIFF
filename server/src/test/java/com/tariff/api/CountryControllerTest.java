package com.tariff.api;

import com.tariff.domain.Country;
import com.tariff.repo.CountryRepository;
import com.tariff.security.JwtAuthenticationFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CountryController.class)
class CountryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CountryRepository countryRepository;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void getAllCountries_returnsList() throws Exception {
        Country sg = new Country();
        sg.setId(1L);
        sg.setIso2("SG");
        sg.setName("Singapore");

        when(countryRepository.findAll()).thenReturn(List.of(sg));

        mockMvc.perform(get("/api/countries").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].iso2").value("SG"));
    }

    @Test
    void getCountryByIso2_uppercaseConversion_success() throws Exception {
        Country us = new Country();
        us.setId(2L);
        us.setIso2("US");
        us.setName("United States");

        when(countryRepository.findByIso2(eq("US"))).thenReturn(us);

        mockMvc.perform(get("/api/countries/code/us"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.iso2").value("US"));
    }

    @Test
    void getCountryByIso2_notFound_returnsServerError() throws Exception {
        when(countryRepository.findByIso2(eq("ZZ"))).thenReturn(null);

        mockMvc.perform(get("/api/countries/code/ZZ"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void getCountryById_notFound_returnsServerError() throws Exception {
        when(countryRepository.findById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/countries/999"))
                .andExpect(status().isInternalServerError());
    }
}