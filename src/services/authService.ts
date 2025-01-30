import api from '../api/axiosConfig';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignUpRequest {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    role: 'CHAUFFEUR' | 'CLIENT';
}

export const authService = {
    login: async (data: LoginRequest) => {
        const response = await api.post('/auth/login', data);
        if (response.data) {
            localStorage.setItem('token', response.data);
        }
        return response.data;
    },

    signup: async (data: SignUpRequest) => {
        const response = await api.post('/auth/signup', data);
        if (response.data) {
            localStorage.setItem('token', response.data);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getToken: () => {
        return localStorage.getItem('token');
    }
};
