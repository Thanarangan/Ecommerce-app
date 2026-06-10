package com.thana.ECommerce_app.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thana.ECommerce_app.Models.Products;

@Repository
public interface ProductRepo extends JpaRepository<Products, Integer> {
    List<Products> findBySellerId(Long id);

    Products findByProductId(Long productId);

    List<Products> findByProductNameContainingIgnoreCase(String query);

    void deleteByProductId(Long productId);
    
}
