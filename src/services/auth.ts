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
        try {
            const response = await api.post('/auth/login', data);

            // Vérifiez si une réponse est reçue et si un token est présent
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                console.log('Token:', localStorage.getItem('token'));

                // Décoder le token pour obtenir le rôle
                const base64Url = response.data.token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
                    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join(''));

                const { role } = JSON.parse(jsonPayload);
                localStorage.setItem('userRole', role);
            } else {
                console.error('Token manquant dans la réponse');
                throw new Error('Token manquant');
            }

            return response.data;
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            throw error; // Propager l'erreur pour un traitement ultérieur
        }
    },

    signup: async (data: SignUpRequest) => {
        try {
            const response = await api.post('/auth/signup', data);
            
            // Vérifiez si une réponse est reçue et si un token est présent
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userRole', data.role);
            } else {
                console.error('Token manquant dans la réponse');
                throw new Error('Token manquant');
            }

            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            throw error; // Propager l'erreur pour un traitement ultérieur
        }
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
    },

    getToken: () => {
        return localStorage.getItem('token');
    }
};