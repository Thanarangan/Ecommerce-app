package com.thana.ECommerce_app.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.thana.ECommerce_app.Models.Transaction;

@Repository
public interface TransactionRepo extends JpaRepository<Transaction, Long> {

    List<Transaction> findBySellerId(Long customerId);
    
}
