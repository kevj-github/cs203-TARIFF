package com.tariff.api;

import com.tariff.api.dto.ApiResponse;
import com.tariff.domain.Product;
import com.tariff.repo.ProductRepository;
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

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductRepository productRepository;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    void getAllProducts_returnsList() throws Exception {
        Product p = new Product();
        p.setId(1L);
        p.setName("Phone");
        p.setHsCode("8517.12");

        when(productRepository.findAll()).thenReturn(List.of(p));

        mockMvc.perform(get("/api/products").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].name").value("Phone"));
    }

    @Test
    void getProductByHsCode_notFound_returnsSuccessFalse() throws Exception {
        when(productRepository.findByHsCode(eq("0000.00"))).thenReturn(null);

        mockMvc.perform(get("/api/products/by-hs/0000.00"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Product not found for HS code: 0000.00"));
    }

    @Test
    void existsByHsCode_trueAndFalse() throws Exception {
        when(productRepository.existsByHsCode(eq("8517.12"))).thenReturn(true);

        mockMvc.perform(get("/api/products/exists/8517.12"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").value(true));

        when(productRepository.existsByHsCode(eq("0000.00"))).thenReturn(false);

        mockMvc.perform(get("/api/products/exists/0000.00"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").value(false));
    }

    @Test
    void getProductById_notFound_returnsServerError() throws Exception {
        when(productRepository.findById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/products/99"))
                .andExpect(status().isInternalServerError());
    }
}