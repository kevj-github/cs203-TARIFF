package com.tariff.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class A {
    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @GetMapping("/activeprofile")
    public String getProfile() {
        return "Active profile: " + activeProfile;
    }
}