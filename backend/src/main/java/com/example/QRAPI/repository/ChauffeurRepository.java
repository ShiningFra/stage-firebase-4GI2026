/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.example.QRAPI.repository;

/**
 *
 * @author Roddier
 */
import com.example.QRAPI.model.Chauffeur;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChauffeurRepository extends JpaRepository<Chauffeur, Long> {
    Optional<Chauffeur> findByEmail(String email);
    boolean existsByEmail(String email);
}
