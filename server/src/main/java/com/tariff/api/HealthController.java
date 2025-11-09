package com.tariff.api;
import com.tariff.api.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
  @GetMapping("/api/health")
  public ResponseEntity<ApiResponse<String>> health() {
    return ResponseEntity.ok(ApiResponse.success("Service is healthy", "OK"));
  }
}
