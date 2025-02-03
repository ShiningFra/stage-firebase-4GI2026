import api from './api';

export interface Course {
    id: number;
    depart: string;
    destination: string;
    prix: number;
    date: string;
    completed: boolean;
    chauffeur?: object;
    client?: object;
}

export const courseService = {
    // Chauffeur : Publier une nouvelle course
    publishCourse: async (course: Partial<Course>) => {
        const response = await api.post('/courses/publish', course);
        return response.data;
    },

    // Chauffeur : Obtenir mes courses
    getMyCourses: async () => {
        const response = await api.get('/courses/my-courses');
        return response.data;
    },

    // Client : Obtenir les courses disponibles
    getAvailableCourses: async () => {
        const response = await api.get('/courses/available');
        return response.data;
    },

    // Client : Réserver une course
    reserveCourse: async (courseId: number) => {
        const response = await api.post(`/courses/${courseId}/reserve`);
        return response.data;
    },

    // Chauffeur : Obtenir les courses réservées
    getMyReservedCourses: async () => {
        const response = await api.get('/courses/my-reserved-courses');
        return response.data;
    },

    // Client : Obtenir mes courses acceptées non complétées
    getMyAcceptedCourses: async () => {
        const response = await api.get('/courses/my-accepted-courses');
        return response.data;
    },

    // Chauffeur : Obtenir les courses non complétées
    getMyIncompleteCourses: async () => {
        const response = await api.get('/courses/my-incomplete-courses');
        return response.data;
    },

    // Client : Obtenir l'historique des courses complétées
    getMyCompletedCourses: async () => {
        const response = await api.get('/courses/my-completed-courses');
        return response.data;
    },

    // Chauffeur : Obtenir l'historique des courses complétées
    getMyCompletedCoursesDriver: async () => {
        const response = await api.get('/courses/my-completed-courses-driver');
        return response.data;
    },

    // Client : Annuler une course
    cancelCourse: async (courseId: number) => {
        const response = await api.delete(`/courses/${courseId}/cancel`);
        return response.data;
    }
};
