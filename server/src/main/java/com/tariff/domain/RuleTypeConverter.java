package com.tariff.domain;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class RuleTypeConverter implements AttributeConverter<RuleType, String> {
    @Override
    public String convertToDatabaseColumn(RuleType attribute) {
        return attribute == null ? null : attribute.getDbValue();
    }
    @Override
    public RuleType convertToEntityAttribute(String dbData) {
        return dbData == null ? null : RuleType.fromDb(dbData);
    }
}

