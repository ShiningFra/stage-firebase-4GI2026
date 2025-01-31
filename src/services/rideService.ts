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

const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

export const courseService = {
    // Publier une nouvelle course (chauffeur seulement)
    publishCourse: async (courseData: Omit<Course, 'id' | 'completed' | 'chauffeur' | 'client'>) => {
        const response = await api.post('/api/courses/publish', courseData, {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    },

    // Obtenir toutes les courses disponibles
    getAvailableCourses: async () => {
        const response = await api.get('/api/courses/available', {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    },

    // Obtenir mes courses (chauffeur)
    getMyCourses: async () => {
        const response = await api.get('/api/courses/my-courses', {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    },

    // Réserver une course (client)
    reserveCourse: async (courseId: number) => {
        const response = await api.post(`/api/courses/${courseId}/reserve`, null, {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    },

    // Obtenir mes courses réservées (chauffeur)
    getMyReservedCourses: async () => {
        const response = await api.get('/api/courses/my-reserved-courses', {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    },

    // Obtenir mes courses acceptées (client)
    getMyAcceptedCourses: async () => {
        const response = await api.get('/api/courses/my-accepted-courses', {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    },

    // Obtenir mes courses non complétées (chauffeur)
    getMyIncompleteCourses: async () => {
        const response = await api.get('/api/courses/my-incomplete-courses', {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    },

    // Obtenir mes courses réservées non complétées (chauffeur)
    getMyReservedIncompleteCourses: async () => {
        const response = await api.get('/api/courses/my-reserved-incomplete-courses', {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    },

    // Obtenir l'historique des courses complétées (client)
    getMyCompletedCourses: async () => {
        const response = await api.get('/api/courses/my-completed-courses', {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    },

    // Obtenir l'historique des courses complétées (chauffeur)
    getMyCompletedCoursesDriver: async () => {
        const response = await api.get('/api/courses/my-completed-courses-driver', {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    },

    // Annuler une course (client)
    cancelCourse: async (courseId: number) => {
        const response = await api.delete(`/api/courses/${courseId}/cancel`, {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    },

    // Compléter une course (chauffeur)
    completeCourse: async (courseId: number) => {
        const response = await api.post(`/api/courses/${courseId}/complete`, null, {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
        });
        return response.data;
    }
};