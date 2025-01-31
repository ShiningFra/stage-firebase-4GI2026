import api from './api';

export interface SignUpRequest {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    role: 'CHAUFFEUR' | 'CLIENT';
}

export interface LoginRequest {
    email: string;
    password: string;
}

export const authService = {
    login: async (data: LoginRequest) => {
        const response = await api.post('/auth/login', data);
        if (response.data) {
            localStorage.setItem('token', response.data);
            // Décoder le token pour obtenir le rôle
            const base64Url = response.data.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));
            const { role } = JSON.parse(jsonPayload);
            localStorage.setItem('userRole', role);
        }
        return response.data;
    },

    signup: async (data: SignUpRequest) => {
        const response = await api.post('/auth/signup', data);
        if (response.data) {
            localStorage.setItem('token', response.data);
            localStorage.setItem('userRole', data.role);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getUserRole: () => {
        return localStorage.getItem('userRole');
    }
};
