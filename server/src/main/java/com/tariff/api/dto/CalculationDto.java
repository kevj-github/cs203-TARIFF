package com.tariff.api.dto;

public class CalculationDto {
    private String hsCode;
    private String originIso2;
    private String destIso2;
    // Add other fields as needed
    private String notes;

    // Getters and setters
    public String getHsCode() { return hsCode; }
    public void setHsCode(String hsCode) { this.hsCode = hsCode; }

    public String getOriginIso2() { return originIso2; }
    public void setOriginIso2(String originIso2) { this.originIso2 = originIso2; }

    public String getDestIso2() { return destIso2; }
    public void setDestIso2(String destIso2) { this.destIso2 = destIso2; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
