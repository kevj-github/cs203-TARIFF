package com.tariff.domain;

public enum RuleType {
    AD_VALOREM("ad_valorem"),
    SPECIFIC("specific"),
    COMPOUND("compound");

    private final String dbValue;

    RuleType(String dbValue) { this.dbValue = dbValue; }
    public String getDbValue() { return dbValue; }

    public static RuleType fromDb(String v) {
        for (RuleType t : values()) {
            if (t.dbValue.equalsIgnoreCase(v)) return t;
        }
        throw new IllegalArgumentException("Unknown rule_type: " + v);
    }
}
