package com.thana.ECommerce_app.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.thana.ECommerce_app.Models.Users;

public interface UserRepo extends JpaRepository<Users, Long> {

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    Users findByUsername(String username);

    Users findByEmail(String email);
}