package com.thana.ECommerce_app.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.thana.ECommerce_app.Models.Cart;

public interface CartRepo extends JpaRepository<Cart, Long> {
    
}
