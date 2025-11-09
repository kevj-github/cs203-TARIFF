package com.tariff.api;

import com.tariff.api.dto.ApiResponse;
import com.tariff.domain.Country;
import com.tariff.repo.CountryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5175",
        "https://cs203-tariff-deploy.vercel.app",
        "https://cs203-tariff-deploy.vercel.app/"
})
@RequestMapping("/api/countries")
public class CountryController {

    @Autowired
    private CountryRepository countryRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Country>>> getAllCountries() {
        List<Country> countries = countryRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Countries retrieved successfully", countries));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Country>> getCountryById(@PathVariable Long id) {
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Country not found"));
        return ResponseEntity.ok(ApiResponse.success("Country retrieved successfully", country));
    }

    @GetMapping("/code/{iso2}")
    public ResponseEntity<ApiResponse<Country>> getCountryByIso2(@PathVariable String iso2) {
        Country country = countryRepository.findByIso2(iso2.toUpperCase());
        if (country == null) {
            throw new RuntimeException("Country not found with ISO2: " + iso2);
        }
        return ResponseEntity.ok(ApiResponse.success("Country retrieved successfully", country));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Country>> createCountry(@RequestBody Country country) {
        Country savedCountry = countryRepository.save(country);
        return ResponseEntity.ok(ApiResponse.success("Country created successfully", savedCountry));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Country>> updateCountry(
            @PathVariable Long id,
            @RequestBody Country updatedDetails) {
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Country not found"));
        country.setName(updatedDetails.getName());
        country.setIso2(updatedDetails.getIso2());
        Country updated = countryRepository.save(country);
        return ResponseEntity.ok(ApiResponse.success("Country updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCountry(@PathVariable Long id) {
        countryRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Country deleted successfully", null));
    }
}
