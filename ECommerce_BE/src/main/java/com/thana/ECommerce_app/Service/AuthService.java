package com.thana.ECommerce_app.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.thana.ECommerce_app.Models.Users;
import com.thana.ECommerce_app.Repository.UserRepo;
import com.thana.ECommerce_app.dto.Authdto.LoginRequest;
import com.thana.ECommerce_app.dto.Authdto.RegisterRequest;

@Service
public class AuthService {
    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;
    
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);
    
    public void register(RegisterRequest request) {
        if(userRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if(userRepo.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        Users user = new Users();
       user.setUsername(request.getUsername());
       user.setEmail(request.getEmail());
       user.setPassword(passwordEncoder.encode(request.getPassword()));
       user.setRole(request.getRole());
       userRepo.save(user);
    }

    public ResponseEntity<String> login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        if(!authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        return ResponseEntity.ok(jwtService.generateToken(request.getEmail()));
    }
}
