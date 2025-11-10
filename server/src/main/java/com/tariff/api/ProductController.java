package com.tariff.api;

import com.tariff.api.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import com.tariff.domain.Product;
import com.tariff.repo.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5175", "https://cs203-tariff-deploy.vercel.app", "https://cs203-tariff-deploy.vercel.app/" })
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", products));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody Product product) {
        Product savedProduct = productRepository.save(product);
        return ResponseEntity.ok(ApiResponse.success("Product created successfully", savedProduct));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return ResponseEntity.ok(ApiResponse.success("Product retrieved successfully", product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(@PathVariable Long id,
            @RequestBody Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setName(productDetails.getName());
        product.setHsCode(productDetails.getHsCode());
        product.setProductType(productDetails.getProductType());
        product.setBrand(productDetails.getBrand());
        product.setModel(productDetails.getModel());
        Product updatedProduct = productRepository.save(product);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updatedProduct));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }

    @GetMapping("/exists/{hsCode}")
    public ResponseEntity<ApiResponse<Boolean>> existsByHsCode(@PathVariable String hsCode) {
        boolean exists = productRepository.existsByHsCode(hsCode);
        return ResponseEntity.ok(ApiResponse.success("Exists check", exists));
    }

    @GetMapping("/by-hs/{hsCode}")
    public ResponseEntity<ApiResponse<Product>> getProductByHsCode(@PathVariable String hsCode) {
        Product product = productRepository.findByHsCode(hsCode);
        if (product == null) {
            return ResponseEntity.ok(ApiResponse.error("Product not found for HS code: " + hsCode));
        }
        return ResponseEntity.ok(ApiResponse.success("Product found", product));
    }
}
