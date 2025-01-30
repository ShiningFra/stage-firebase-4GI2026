/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.QRAPI.repository;

import com.example.QRAPI.model.Chauffeur;
import com.example.QRAPI.model.Client;
import com.example.QRAPI.model.Course;
import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Roddier
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByClient(Client client);
    List<Course> findByChauffeur(Chauffeur chauffeur); // Méthode pour trouver les courses par chauffeur
    List<Course> findByClientIsNull(); // Méthode pour trouver les courses sans client
    List<Course> findByChauffeurAndClientNotNull(Chauffeur chauffeur); // Méthode pour trouver les courses réservées par un chauffeur
    List<Course> findByClientAndCompletedFalse(Client client); // Méthode pour trouver les courses acceptées par un client qui ne sont pas complétées
    List<Course> findByChauffeurAndCompletedFalse(Chauffeur chauffeur); // Méthode pour trouver les courses non complétées par un chauffeur
    List<Course> findByChauffeurAndClientNotNullAndCompletedFalse(Chauffeur chauffeur); // Méthode pour trouver les courses réservées non complétées par un chauffeur
    List<Course> findByClientAndCompletedTrue(Client client); // Méthode pour trouver les courses complétées par un client
    List<Course> findByChauffeurAndCompletedTrue(Chauffeur chauffeur); // Méthode pour trouver les courses complétées par un chauffeur
    
}
