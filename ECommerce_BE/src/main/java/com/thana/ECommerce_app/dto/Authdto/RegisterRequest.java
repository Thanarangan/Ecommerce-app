package com.thana.ECommerce_app.dto.Authdto;

import com.thana.ECommerce_app.Enums.Roles;
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private Roles role;
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public Roles getRole() {
        return role;
    }
    public void setRole(Roles role) {
        this.role = role;
    }
}