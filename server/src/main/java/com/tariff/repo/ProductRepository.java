package com.tariff.repo;

import com.tariff.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByHsCode(String hsCode);
    Product findByHsCode(String hsCode);
}