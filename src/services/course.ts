import api from './api';

export interface Course {
    id: number;
    depart: string;
    destination: string;
    prix: number;
    date: string;
    completed: boolean;
    chauffeur?: any; // Remplacez par un type spécifique si possible
    client?: any;    // Remplacez par un type spécifique si possible
}

export const courseService = {
    // Chauffeur : Publier une nouvelle course
    publishCourse: async (course: Partial<Course>, token: string) => {
        const response = await api.post('/courses/publish', course, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Chauffeur : Obtenir mes courses
    getMyCourses: async (token: string) => {
        const response = await api.get('/courses/my-courses', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Client : Obtenir les courses disponibles
    getAvailableCourses: async (token: string) => {
        const response = await api.get('/courses/available', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Client : Réserver une course
    reserveCourse: async (courseId: number, token: string) => {
        const response = await api.post(`/courses/${courseId}/reserve`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Chauffeur : Obtenir les courses réservées
    getMyReservedCourses: async (token: string) => {
        const response = await api.get('/courses/my-reserved-courses', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Client : Obtenir mes courses acceptées non complétées
    getMyAcceptedCourses: async (token: string) => {
        const response = await api.get('/courses/my-accepted-courses', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Chauffeur : Obtenir les courses non complétées
    getMyIncompleteCourses: async (token: string) => {
        const response = await api.get('/courses/my-incomplete-courses', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Client : Obtenir l'historique des courses complétées
    getMyCompletedCourses: async (token: string) => {
        const response = await api.get('/courses/my-completed-courses', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Chauffeur : Obtenir l'historique des courses complétées
    getMyCompletedCoursesDriver: async (token: string) => {
        const response = await api.get('/courses/my-completed-courses-driver', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Client : Annuler une course
    cancelCourse: async (courseId: number, token: string) => {
        const response = await api.delete(`/courses/${courseId}/cancel`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};