package com.tariff.api;

import com.tariff.domain.Product;
import com.tariff.domain.TariffRule;
import com.tariff.domain.RuleType;
import com.tariff.repo.ProductRepository;
import com.tariff.service.TariffRuleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/csv")
@CrossOrigin(origins = "*")
public class CsvBulkCalculationController {

    private final ProductRepository productRepository;
    private final TariffRuleService tariffRuleService;

    public CsvBulkCalculationController(ProductRepository productRepository, 
                                       TariffRuleService tariffRuleService) {
        this.productRepository = productRepository;
        this.tariffRuleService = tariffRuleService;
    }

    /**
     * Upload CSV file with format: productId,originCountry,destCountry,quantity,customsValue
     * Example CSV:
     * productId,originCountry,destCountry,quantity,customsValue
     * 1,CN,US,100,500.00
     * 2,SG,US,50,1200.00
     */
    @PostMapping("/calculate")
    public ResponseEntity<?> calculateFromCsv(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "File is empty", "success", false)
            );
        }

        try {
            List<CsvRow> csvRows = parseCsvFile(file);
            List<CalculationResult> results = processCalculations(csvRows);

            // Calculate summary statistics
            BigDecimal totalCustomsValue = BigDecimal.ZERO;
            BigDecimal totalTariff = BigDecimal.ZERO;
            BigDecimal grandTotal = BigDecimal.ZERO;

            for (CalculationResult result : results) {
                if (result.success) {
                    totalCustomsValue = totalCustomsValue.add(result.customsValueTotal);
                    totalTariff = totalTariff.add(result.tariffAmount);
                    grandTotal = grandTotal.add(result.totalWithTariff);
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("itemCount", results.size());
            response.put("successfulCalculations", 
                results.stream().filter(r -> r.success).count());
            response.put("failedCalculations", 
                results.stream().filter(r -> !r.success).count());
            response.put("summary", Map.of(
                "totalCustomsValue", totalCustomsValue.setScale(2, RoundingMode.HALF_UP),
                "totalTariff", totalTariff.setScale(2, RoundingMode.HALF_UP),
                "grandTotal", grandTotal.setScale(2, RoundingMode.HALF_UP)
            ));
            response.put("calculations", results);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("error", "Error processing file: " + e.getMessage(), 
                       "success", false)
            );
        }
    }

    private List<CsvRow> parseCsvFile(MultipartFile file) throws Exception {
        List<CsvRow> rows = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            boolean isFirstLine = true;
            int lineNumber = 0;

            while ((line = reader.readLine()) != null) {
                lineNumber++;

                // Skip header line
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }

                // Skip empty lines
                if (line.trim().isEmpty()) {
                    continue;
                }

                String[] parts = line.split(",");
                if (parts.length < 5) {
                    throw new IllegalArgumentException(
                        "Invalid CSV format at line " + lineNumber + 
                        ". Expected format: productId,originCountry,destCountry,quantity,customsValue");
                }

                try {
                    CsvRow row = new CsvRow();
                    row.lineNumber = lineNumber;
                    row.productId = Long.parseLong(parts[0].trim());
                    row.originCountry = parts[1].trim().toUpperCase();
                    row.destCountry = parts[2].trim().toUpperCase();
                    row.quantity = Integer.parseInt(parts[3].trim());
                    row.customsValuePerUnit = new BigDecimal(parts[4].trim());

                    // Validate country codes (ISO2 format)
                    if (row.originCountry.length() != 2 || row.destCountry.length() != 2) {
                        throw new IllegalArgumentException(
                            "Country codes must be 2-letter ISO codes");
                    }

                    // Validate positive values
                    if (row.quantity <= 0) {
                        throw new IllegalArgumentException("Quantity must be positive");
                    }
                    if (row.customsValuePerUnit.compareTo(BigDecimal.ZERO) <= 0) {
                        throw new IllegalArgumentException(
                            "Customs value must be positive");
                    }

                    rows.add(row);

                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException(
                        "Invalid number format at line " + lineNumber + ": " + 
                        e.getMessage());
                }
            }
        }

        if (rows.isEmpty()) {
            throw new IllegalArgumentException(
                "CSV file contains no valid data rows");
        }

        return rows;
    }

    private List<CalculationResult> processCalculations(List<CsvRow> csvRows) {
        List<CalculationResult> results = new ArrayList<>();
        LocalDate calculationDate = LocalDate.now();

        for (CsvRow row : csvRows) {
            CalculationResult result = new CalculationResult();
            result.lineNumber = row.lineNumber;
            result.productId = row.productId;
            result.originCountry = row.originCountry;
            result.destCountry = row.destCountry;
            result.quantity = row.quantity;
            result.customsValuePerUnit = row.customsValuePerUnit;

            try {
                // Fetch product
                Optional<Product> productOpt = productRepository.findById(row.productId);
                if (productOpt.isEmpty()) {
                    result.success = false;
                    result.errorMessage = "Product not found with ID: " + row.productId;
                    results.add(result);
                    continue;
                }

                Product product = productOpt.get();
                result.productName = product.getName();
                result.hsCode = product.getHsCode();

                // Calculate total customs value
                result.customsValueTotal = row.customsValuePerUnit
                    .multiply(BigDecimal.valueOf(row.quantity))
                    .setScale(2, RoundingMode.HALF_UP);

                // Find applicable tariff rules
                List<TariffRule> rules = tariffRuleService.findApplicable(
                    row.originCountry, 
                    row.destCountry, 
                    product.getHsCode(), 
                    calculationDate
                );

                if (rules.isEmpty()) {
                    result.success = false;
                    result.errorMessage = String.format(
                        "No tariff rule found for %s → %s (HS: %s) on %s",
                        row.originCountry, row.destCountry, 
                        product.getHsCode(), calculationDate
                    );
                    results.add(result);
                    continue;
                }

                // Use the most recent applicable rule
                TariffRule rule = rules.get(0);
                result.ruleType = rule.getType().getDbValue();
                result.rateValue = rule.getRate();
                result.rateUnit = rule.getUnit().getDbValue();

                // Calculate tariff based on rule type
                BigDecimal tariff = calculateTariff(
                    rule, 
                    result.customsValueTotal, 
                    row.quantity
                );

                result.tariffAmount = tariff.setScale(2, RoundingMode.HALF_UP);
                result.totalWithTariff = result.customsValueTotal
                    .add(result.tariffAmount)
                    .setScale(2, RoundingMode.HALF_UP);
                result.success = true;

            } catch (Exception e) {
                result.success = false;
                result.errorMessage = "Calculation error: " + e.getMessage();
            }

            results.add(result);
        }

        return results;
    }

    private BigDecimal calculateTariff(TariffRule rule, 
                                      BigDecimal customsTotal, 
                                      int quantity) {
        BigDecimal tariff;

        switch (rule.getType()) {
            case AD_VALOREM:
                // Percentage of customs value
                tariff = customsTotal
                    .multiply(rule.getRate())
                    .divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP);
                break;

            case SPECIFIC:
                // Fixed amount per unit
                tariff = rule.getRate()
                    .multiply(BigDecimal.valueOf(quantity));
                break;

            case COMPOUND:
                // Percentage + fixed per unit
                BigDecimal percentPart = customsTotal
                    .multiply(rule.getRate())
                    .divide(BigDecimal.valueOf(100), 6, RoundingMode.HALF_UP);

                // Note: For compound tariffs, if you store fixed part separately,
                // retrieve it here. Currently using rate value only for percentage.
                BigDecimal fixedPerUnit = BigDecimal.ZERO;
                BigDecimal fixedPart = fixedPerUnit
                    .multiply(BigDecimal.valueOf(quantity));

                tariff = percentPart.add(fixedPart);
                break;

            default:
                throw new IllegalArgumentException(
                    "Unsupported rule type: " + rule.getType());
        }

        return tariff;
    }

    // Inner classes for data structures
    private static class CsvRow {
        int lineNumber;
        Long productId;
        String originCountry;
        String destCountry;
        int quantity;
        BigDecimal customsValuePerUnit;
    }

    public static class CalculationResult {
        public int lineNumber;
        public Long productId;
        public String productName;
        public String hsCode;
        public String originCountry;
        public String destCountry;
        public int quantity;
        public BigDecimal customsValuePerUnit;
        public BigDecimal customsValueTotal;
        public String ruleType;
        public BigDecimal rateValue;
        public String rateUnit;
        public BigDecimal tariffAmount;
        public BigDecimal totalWithTariff;
        public boolean success;
        public String errorMessage;
    }
}
