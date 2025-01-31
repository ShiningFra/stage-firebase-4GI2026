import api from '../api/axiosConfig';

export interface Course {
    id: number;
    depart: string;
    destination: string;
    dateDepart: string;
    prix: number;
    completed: boolean;
    chauffeur: any;
    client: any;
}

export const courseService = {
    // Publier une nouvelle course (chauffeur seulement)
    publishCourse: async (courseData: Omit<Course, 'id' | 'completed' | 'chauffeur' | 'client'>) => {
        const response = await api.post('/api/courses/publish', courseData);
        return response.data;
    },

    // Obtenir toutes les courses disponibles
    getAvailableCourses: async () => {
        const response = await api.get('/api/courses/available');
        return response.data;
    },

    // Obtenir mes courses (chauffeur)
    getMyCourses: async () => {
        const response = await api.get('/api/courses/my-courses');
        return response.data;
    },

    // Réserver une course (client)
    reserveCourse: async (courseId: number) => {
        const response = await api.post(`/api/courses/${courseId}/reserve`);
        return response.data;
    },

    // Obtenir mes courses réservées (chauffeur)
    getMyReservedCourses: async () => {
        const response = await api.get('/api/courses/my-reserved-courses');
        return response.data;
    },

    // Obtenir mes courses acceptées (client)
    getMyAcceptedCourses: async () => {
        const response = await api.get('/api/courses/my-accepted-courses');
        return response.data;
    },

    // Obtenir mes courses non complétées (chauffeur)
    getMyIncompleteCourses: async () => {
        const response = await api.get('/api/courses/my-incomplete-courses');
        return response.data;
    },

    // Obtenir mes courses réservées non complétées (chauffeur)
    getMyReservedIncompleteCourses: async () => {
        const response = await api.get('/api/courses/my-reserved-incomplete-courses');
        return response.data;
    },

    // Obtenir l'historique des courses complétées (client)
    getMyCompletedCourses: async () => {
        const response = await api.get('/api/courses/my-completed-courses');
        return response.data;
    },

    // Obtenir l'historique des courses complétées (chauffeur)
    getMyCompletedCoursesDriver: async () => {
        const response = await api.get('/api/courses/my-completed-courses-driver');
        return response.data;
    },

    // Annuler une course (client)
    cancelCourse: async (courseId: number) => {
        const response = await api.delete(`/api/courses/${courseId}/cancel`);
        return response.data;
    },

    // Compléter une course (chauffeur)
    completeCourse: async (courseId: number) => {
        const response = await api.post(`/api/courses/${courseId}/complete`);
        return response.data;
    }
};
