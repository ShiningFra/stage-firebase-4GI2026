/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.QRAPI.controller;

/**
 *
 * @author Roddier
 */
import com.example.QRAPI.model.UserRole;

public class SignUpRequest {
    private String email;
    private String password;
    private String fullName;
    private String phoneNumber;
    private UserRole role;

    // Getters et setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    
    public void setPassword(String password) { 
        this.password = password; // Hachage ici
    }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
}
