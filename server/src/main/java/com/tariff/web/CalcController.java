package com.tariff.web;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/calculate")
public class CalcController {
  @PostMapping
  public Map<String,Object> calculate(@RequestBody Map<String,Object> p){
    // Stub: just echo back for now; you’ll wire service logic next
    return Map.of(
      "origin", p.get("origin"),
      "destination", p.get("destination"),
      "hs_code", p.get("hs_code"),
      "total", 0
    );
  }
}
