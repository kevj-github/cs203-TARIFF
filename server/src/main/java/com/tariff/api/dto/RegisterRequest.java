package com.tariff.api.dto;

import jakarta.validation.constraints.*;

public class RegisterRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be 3–20 characters")
    @Pattern(regexp = "^[A-Za-z0-9_.-]+$", message = "Username can only contain letters, numbers, _, ., -")
    private String username;
    @NotBlank
    @Email(message = "Invalid email format")
    private String email;
    @NotBlank
    @Size(min = 8, message = "{password.min}")
    @Pattern(regexp = ".*\\d.*", message = "{password.digit}")
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}