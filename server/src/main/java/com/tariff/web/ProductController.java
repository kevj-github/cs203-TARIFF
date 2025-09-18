package com.tariff.web;
import com.tariff.domain.Product;
import com.tariff.repo.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // Create
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    // Read all
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Read one
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id).orElse(null);
    }

    // Update
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        return productRepository.findById(id).map(product -> {
            product.setHsCode(updatedProduct.getHsCode());
            product.setName(updatedProduct.getName());
            product.setProductType(updatedProduct.getProductType());
            product.setBrand(updatedProduct.getBrand());
            product.setModel(updatedProduct.getModel());
            return productRepository.save(product);
        }).orElse(null);
    }

    // Delete
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return "Product with ID " + id + " deleted.";
    }
}

