/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.example.QRAPI.controller;

import com.example.QRAPI.model.Course;
import com.example.QRAPI.model.Chauffeur;
import com.example.QRAPI.model.Client;
import com.example.QRAPI.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    /**
     * Méthode pour publier une nouvelle course
     * @param course
     * @param chauffeur
     * @return
     */
    @PostMapping("/publish")
    @PreAuthorize("hasRole('CHAUFFEUR')")
    public ResponseEntity<Course> publishCourse(@RequestBody Course course, @AuthenticationPrincipal Chauffeur chauffeur) {
        if (chauffeur == null) {
            return ResponseEntity.status(401).body(null); // 401 Unauthorized si le chauffeur n'est pas authentifié
        }
	System.out.println("Données reçues backend : " + course);

        course.setChauffeur(chauffeur); // Associer le chauffeur à la course
        course.setClient(null); // Le client est null à la création

        Course savedCourse = courseRepository.save(course); // Enregistrer la course dans la base de données
        return ResponseEntity.ok(savedCourse); // Retourner la course enregistrée
    }
    
    /**
     * Méthode pour récupérer toutes les courses d'un chauffeur authentifié
     * @param chauffeur
     * @return
     */
    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('CHAUFFEUR')")
    public ResponseEntity<List<Course>> getMyCourses(@AuthenticationPrincipal Chauffeur chauffeur) {
        if (chauffeur == null) {
            return ResponseEntity.status(401).body(null); // 401 Unauthorized si le chauffeur n'est pas authentifié
        }

        List<Course> courses = courseRepository.findByChauffeur(chauffeur); // Récupérer les courses du chauffeur
        return ResponseEntity.ok(courses); // Retourner la liste des courses
    }
    
    /**
     * Méthode pour récupérer toutes les courses non réservées
     * @return
     */
    @GetMapping("/available")
    public ResponseEntity<List<Course>> getAvailableCourses() {
        List<Course> availableCourses = courseRepository.findByClientIsNull(); // Récupérer les courses sans client
        return ResponseEntity.ok(availableCourses); // Retourner la liste des courses disponibles
    }
    
    /**
     * Méthode pour réserver une course
     * @param courseId
     * @param client
     * @return
     */
    @PostMapping("/{courseId}/reserve")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Course> reserveCourse(@PathVariable Long courseId, @AuthenticationPrincipal Client client) {
        if (client == null) {
            return ResponseEntity.status(401).body(null); // 401 Unauthorized si le client n'est pas authentifié
        }

        Optional<Course> courseOptional = courseRepository.findById(courseId);
        if (courseOptional.isPresent() && courseOptional.get().getClient() == null) {
            Course course = courseOptional.get();
            course.setClient(client); // Associer le client à la course
            Course savedCourse = courseRepository.save(course); // Enregistrer les modifications
            return ResponseEntity.ok(savedCourse); // Retourner la course mise à jour
        }

        return ResponseEntity.badRequest().body(null); // Course non trouvée ou déjà réservée
    }

    /**
     * Méthode pour récupérer les courses réservées par un chauffeur
     * @param chauffeur
     * @return
     */
    @GetMapping("/my-reserved-courses")
    @PreAuthorize("hasRole('CHAUFFEUR')")
    public ResponseEntity<List<Course>> getMyReservedCourses(@AuthenticationPrincipal Chauffeur chauffeur) {
        if (chauffeur == null) {
            return ResponseEntity.status(401).body(null); // 401 Unauthorized si le chauffeur n'est pas authentifié
        }

        List<Course> reservedCourses = courseRepository.findByChauffeurAndClientNotNull(chauffeur); // Récupérer les courses réservées par le chauffeur
        return ResponseEntity.ok(reservedCourses); // Retourner la liste des courses réservées
    }
    
    /**
     * Méthode pour récupérer les courses acceptées par un client qui ne sont pas complétées
     * @param client
     * @return
     */
    @GetMapping("/my-accepted-courses")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<Course>> getMyAcceptedCourses(@AuthenticationPrincipal Client client) {
        if (client == null) {
            return ResponseEntity.status(401).body(null); // 401 Unauthorized si le client n'est pas authentifié
        }

        List<Course> acceptedCourses = courseRepository.findByClientAndCompletedFalse(client); // Récupérer les courses acceptées par le client qui ne sont pas complétées
        return ResponseEntity.ok(acceptedCourses); // Retourner la liste des courses acceptées
    }
    
    /**
     * Méthode pour récupérer les courses non complétées créées par un chauffeur
     * @param chauffeur
     * @return
     */
    @GetMapping("/my-incomplete-courses")
    @PreAuthorize("hasRole('CHAUFFEUR')")
    public ResponseEntity<List<Course>> getMyIncompleteCourses(@AuthenticationPrincipal Chauffeur chauffeur) {
        if (chauffeur == null) {
            return ResponseEntity.status(401).body(null); // 401 Unauthorized si le chauffeur n'est pas authentifié
        }

        List<Course> incompleteCourses = courseRepository.findByChauffeurAndClientNotNullAndCompletedFalse(chauffeur); // Récupérer les courses non complétées
        return ResponseEntity.ok(incompleteCourses); // Retourner la liste des courses non complétées
    }
    
    /**
     * Méthode pour récupérer les courses réservées par un client qui ne sont pas complétées
     * et créées par un chauffeur
     * @param chauffeur
     * @return
     */
    @GetMapping("/my-reserved-incomplete-courses")
    @PreAuthorize("hasRole('CHAUFFEUR')")
    public ResponseEntity<List<Course>> getMyReservedIncompleteCourses(@AuthenticationPrincipal Chauffeur chauffeur) {
        if (chauffeur == null) {
            return ResponseEntity.status(401).body(null); // 401 Unauthorized si le chauffeur n'est pas authentifié
        }

        List<Course> reservedIncompleteCourses = courseRepository.findByChauffeurAndClientNotNullAndCompletedFalse(chauffeur); // Récupérer les courses réservées non complétées
        return ResponseEntity.ok(reservedIncompleteCourses); // Retourner la liste des courses réservées non complétées
    }
    
    /**
     * Méthode pour récupérer l'historique des courses complétées d'un client
     * @param client
     * @return
     */
    @GetMapping("/my-completed-courses")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<Course>> getMyCompletedCourses(@AuthenticationPrincipal Client client) {
        if (client == null) {
            return ResponseEntity.status(401).body(null); // 401 Unauthorized si le client n'est pas authentifié
        }

        List<Course> completedCourses = courseRepository.findByClientAndCompletedTrue(client); // Récupérer les courses complétées par le client
        return ResponseEntity.ok(completedCourses); // Retourner la liste des courses complétées
    }

    /**
     * Méthode pour récupérer l'historique des courses complétées par un chauffeur
     * @param chauffeur
     * @return
     */
    @GetMapping("/my-completed-courses-driver")
    @PreAuthorize("hasRole('CHAUFFEUR')")
    public ResponseEntity<List<Course>> getMyCompletedCoursesDriver(@AuthenticationPrincipal Chauffeur chauffeur) {
        if (chauffeur == null) {
            return ResponseEntity.status(401).body(null); // 401 Unauthorized si le chauffeur n'est pas authentifié
        }

        List<Course> completedCourses = courseRepository.findByChauffeurAndCompletedTrue(chauffeur); // Récupérer les courses complétées par le chauffeur
        return ResponseEntity.ok(completedCourses); // Retourner la liste des courses complétées
    }
    
    /**
    * Méthode pour annuler une course par un client
    * @param courseId
    * @param client
    * @return
    */
    @DeleteMapping("/{courseId}/cancel")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> cancelCourse(@PathVariable Long courseId, @AuthenticationPrincipal Client client) {
        if (client == null) {
            return ResponseEntity.status(401).build(); // 401 Unauthorized si le client n'est pas authentifié
        }

        Optional<Course> courseOptional = courseRepository.findById(courseId);
        if (courseOptional.isPresent() && courseOptional.get().getClient() != null && 
            courseOptional.get().getClient().equals(client)) {
            Course course = courseOptional.get();
            course.setClient(null); // Annuler la réservation en mettant le client à null
            courseRepository.save(course); // Enregistrer les modifications
            return ResponseEntity.noContent().build(); // Retourner 204 No Content
        }

        return ResponseEntity.badRequest().build(); // Course non trouvée ou non réservée par le client
    }

    /**
    * Méthode pour supprimer une course par un chauffeur
    * @param courseId
    * @param chauffeur
    * @return
    */
    @DeleteMapping("/{courseId}/delete")
    @PreAuthorize("hasRole('CHAUFFEUR')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long courseId, @AuthenticationPrincipal Chauffeur chauffeur) {
        if (chauffeur == null) {
            return ResponseEntity.status(401).build(); // 401 Unauthorized si le chauffeur n'est pas authentifié
        }

        Optional<Course> courseOptional = courseRepository.findById(courseId);
        if (courseOptional.isPresent() && courseOptional.get().getChauffeur().equals(chauffeur)) {
            courseRepository.delete(courseOptional.get()); // Supprimer la course
            return ResponseEntity.noContent().build(); // Retourner 204 No Content
        }

        return ResponseEntity.badRequest().build(); // Course non trouvée ou non créée par le chauffeur
    }

    /**
    * Méthode pour compléter une course par un chauffeur
    * @param courseId
    * @param chauffeur
    * @return
    */
    @PostMapping("/{courseId}/complete")
    @PreAuthorize("hasRole('CHAUFFEUR')")
    public ResponseEntity<Course> completeCourse(@PathVariable Long courseId, @AuthenticationPrincipal Chauffeur chauffeur) {
        if (chauffeur == null) {
            return ResponseEntity.status(401).body(null); // 401 Unauthorized si le chauffeur n'est pas authentifié
        }

        Optional<Course> courseOptional = courseRepository.findById(courseId);
        if (courseOptional.isPresent() && courseOptional.get().getChauffeur().equals(chauffeur)) {
            Course course = courseOptional.get();
            course.setCompleted(true);
            Course savedCourse = courseRepository.save(course);
            return ResponseEntity.ok(savedCourse);
        }

        return ResponseEntity.badRequest().body(null); // Course non trouvée ou non créée par le chauffeur
    }
}