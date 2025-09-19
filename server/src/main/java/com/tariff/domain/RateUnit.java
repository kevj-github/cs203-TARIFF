package com.tariff.domain;

public enum RateUnit {
    PERCENT("PERCENT"),
    USD_PER_UNIT("USD_PER_UNIT"),
    SGD_PER_UNIT("SGD_PER_UNIT"),
    PERCENT_PLUS_USD_PER_UNIT("PERCENT+USD_PER_UNIT"),
    PERCENT_PLUS_SGD_PER_UNIT("PERCENT+SGD_PER_UNIT");

    private final String dbValue;

    RateUnit(String dbValue) { this.dbValue = dbValue; }
    public String getDbValue() { return dbValue; }

    public static RateUnit fromDb(String v) {
        for (RateUnit u : values()) {
            if (u.dbValue.equalsIgnoreCase(v)) return u;
        }
        throw new IllegalArgumentException("Unknown rate_unit: " + v);
    }
}

