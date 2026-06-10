package com.thana.ECommerce_app.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.thana.ECommerce_app.Models.Orders;

@Repository
public interface OrdersRepo extends JpaRepository<Orders, Long> {

    List<Orders> findByCustomerId(Long customerId);
    
}
