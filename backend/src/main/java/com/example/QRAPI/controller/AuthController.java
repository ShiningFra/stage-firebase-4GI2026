package com.example.QRAPI.controller;

import com.example.QRAPI.model.Client;
import com.example.QRAPI.model.Chauffeur;
import com.example.QRAPI.model.UserRole;
import com.example.QRAPI.repository.ClientRepository;
import com.example.QRAPI.repository.ChauffeurRepository;
import com.example.QRAPI.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ChauffeurRepository chauffeurRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody SignUpRequest signUpRequest) {
        String hashedPassword = passwordEncoder.encode(signUpRequest.getPassword());

        if (signUpRequest.getRole() == UserRole.CLIENT) {
            Client client = new Client();
            client.setNom(signUpRequest.getFullName());
            client.setEmail(signUpRequest.getEmail());
            client.setPrenom("Cli");
            client.setTelephone(signUpRequest.getPhoneNumber());
            client.setPassword(hashedPassword);
            clientRepository.save(client);
            
            String token = jwtUtil.generateToken(client.getEmail(), UserRole.CLIENT.name());
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } else {
            Chauffeur chauffeur = new Chauffeur();
            chauffeur.setNom(signUpRequest.getFullName());
            chauffeur.setPrenom("Chauff");
            chauffeur.setEmail(signUpRequest.getEmail());
            chauffeur.setTelephone(signUpRequest.getPhoneNumber());
            chauffeur.setPassword(hashedPassword);
            chauffeurRepository.save(chauffeur);
            
            String token = jwtUtil.generateToken(chauffeur.getEmail(), UserRole.CHAUFFEUR.name());
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LogInRequest loginRequest) {
        if (clientRepository.existsByEmail(loginRequest.getEmail())) {
            Client client = clientRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
            if (passwordEncoder.matches(loginRequest.getPassword(), client.getPassword())) {
                String token = jwtUtil.generateToken(client.getEmail(), "CLIENT");
                return ResponseEntity.ok(Collections.singletonMap("token", token));
            }
        } else if (chauffeurRepository.existsByEmail(loginRequest.getEmail())) {
            Chauffeur chauffeur = chauffeurRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
            if (passwordEncoder.matches(loginRequest.getPassword(), chauffeur.getPassword())) {
                String token = jwtUtil.generateToken(chauffeur.getEmail(), "CHAUFFEUR");
                return ResponseEntity.ok(Collections.singletonMap("token", token));
            }
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
