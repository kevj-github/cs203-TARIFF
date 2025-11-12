package com.tariff.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tariff.api.dto.LoginRequest;
import com.tariff.api.dto.RegisterRequest;
import com.tariff.domain.User;
import com.tariff.security.JwtAuthenticationFilter;
import com.tariff.security.JwtTokenProvider;
import com.tariff.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private JwtTokenProvider tokenProvider;

    // Mock JWT filter so security chain builds cleanly in slice tests
    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void register_success_returnsTokenAndUser() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("anglify_user");
        req.setEmail("user@anglify.com");
        req.setPassword("Password123");

        User saved = new User();
        saved.setId(1L);
        saved.setUsername("anglify_user");
        saved.setEmail("user@anglify.com");
        saved.setRole("USER");

        when(userService.registerUser(eq("anglify_user"), eq("user@anglify.com"), eq("Password123")))
                .thenReturn(saved);
        when(tokenProvider.generateToken(eq("user@anglify.com"))).thenReturn("jwt-token-123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").value("jwt-token-123"))
                .andExpect(jsonPath("$.data.user.email").value("user@anglify.com"));
    }

    @Test
    void register_boundary_duplicateEmail_returnsBadRequest() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("anglify_user");
        req.setEmail("user@anglify.com");
        req.setPassword("Password123");

        when(userService.registerUser(any(), any(), any()))
                .thenThrow(new RuntimeException("Email already exists"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email already exists"));
    }

    @Test
    void login_success_returnsTokenAndUser() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("user@anglify.com");
        req.setPassword("Password123");

        UserDetails principal = new org.springframework.security.core.userdetails.User(
                "user@anglify.com", "", Collections.emptyList());
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        User found = new User();
        found.setId(2L);
        found.setUsername("anglify_user");
        found.setEmail("user@anglify.com");
        found.setRole("USER");

        when(authenticationManager.authenticate(any(Authentication.class))).thenReturn(authentication);
        when(tokenProvider.generateToken(eq(authentication))).thenReturn("jwt-token-abc");
        when(userService.findByEmail(eq("user@anglify.com"))).thenReturn(Optional.of(found));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").value("jwt-token-abc"))
                .andExpect(jsonPath("$.data.user.email").value("user@anglify.com"));
    }

    @Test
    void login_boundary_invalidCredentials_returnsBadRequest() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("user@anglify.com");
        req.setPassword("wrong");

        when(authenticationManager.authenticate(any(Authentication.class)))
                .thenThrow(new RuntimeException("Bad credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }
}