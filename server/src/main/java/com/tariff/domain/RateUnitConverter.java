package com.tariff.domain;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class RateUnitConverter implements AttributeConverter<RateUnit, String> {
    @Override
    public String convertToDatabaseColumn(RateUnit attribute) {
        return attribute == null ? null : attribute.getDbValue();
    }
    @Override
    public RateUnit convertToEntityAttribute(String dbData) {
        return dbData == null ? null : RateUnit.fromDb(dbData);
    }
}
