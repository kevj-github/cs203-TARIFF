package com.tariff.api.dto;

import lombok.Data;

@Data
public class SimulationDetails {
    public double taxRate;
    public String taxType; // ADVALOREM, SPECIFIC, or COMPOUND
}