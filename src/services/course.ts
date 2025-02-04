import api from './api';

export interface Chauffeur {
    id: number;
    name: string;
    // Ajoutez les autres propriétés nécessaires du Chauffeur
}

export interface Client {
    id: number;
    name: string;
    // Ajoutez les autres propriétés nécessaires du Client
}

export interface Course {
    id: number;
    lieu_depart: string;
    lieu_arrivee: string; 
    prix: number;
    date_depart: string;
    completed: boolean;
    chauffeur: Chauffeur;
    client: Client;
}

export const courseService = {

     // Client : Accepter une course
    acceptCourse: async (courseId: number) => {
        const response = await api.post(`/courses/${courseId}/reserve`);
        return response.data;  // La réponse pourrait contenir des informations sur la course ou un message de confirmation
    },

    // Chauffeur : Publier une nouvelle course
    publishCourse: async (course: Partial<Course>) => {
console.log("Données envoyées :", course);
        const response = await api.post('/courses/publish', course);
        return response.data;
    },

    // Chauffeur : Obtenir mes courses
    getMyCourses: async () => {
        const response = await api.get('/courses/my-courses');
        return Array.isArray(response.data) ? response.data : [];
    },

    // Client : Obtenir les courses disponibles
    getAvailableCourses: async () => {
        const response = await api.get('/courses/available');
        return Array.isArray(response.data) ? response.data : [];
    },

    // Client : Réserver une course
    reserveCourse: async (courseId: number) => {
        const response = await api.post(`/courses/${courseId}/reserve`);
        return response.data;
    },

    // Chauffeur : Obtenir les courses réservées
    getMyReservedCourses: async () => {
        const response = await api.get('/courses/my-reserved-courses');
        return Array.isArray(response.data) ? response.data : [];
    },

    // Client : Obtenir mes courses acceptées non complétées
    getMyAcceptedCourses: async () => {
        const response = await api.get('/courses/my-accepted-courses');
        return Array.isArray(response.data) ? response.data : [];
    },

    // Chauffeur : Obtenir les courses non complétées
    getMyIncompleteCourses: async () => {
        const response = await api.get('/courses/my-incomplete-courses');
        return Array.isArray(response.data) ? response.data : [];
    },

    // Client : Obtenir l'historique des courses complétées
    getMyCompletedCourses: async () => {
        const response = await api.get('/courses/my-completed-courses');
        return Array.isArray(response.data) ? response.data : [];
    },

    // Chauffeur : Obtenir l'historique des courses complétées
    getMyCompletedCoursesDriver: async () => {
        const response = await api.get('/courses/my-completed-courses-driver');
        return Array.isArray(response.data) ? response.data : [];
    },

    // Client : Annuler une course
    cancelCourse: async (courseId: number) => {
        const response = await api.delete(`/courses/${courseId}/cancel`);
        return response.data;
    },

    // Chauffeur : Supprimer une course
    deleteCourse: async (courseId: number) => {
        const response = await api.delete(`/courses/${courseId}/delete`);
        return response.data;
    }
};
