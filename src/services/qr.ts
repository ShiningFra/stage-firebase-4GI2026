import axios from 'axios';

const qrApi = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token JWT
qrApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
	console.log('token :', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const qrService = {
    // Obtenir l'URL du QR code pour une course
    getQRCodeUrl: (courseId: number) => {
        return `http://localhost:8080/qr/${courseId}`;
    },

    // Scanner un QR code
    scanQRCode: async (courseId: number, qrCode: string) => {
        const response = await qrApi.post('/scan', {
            courseId,
            qrCode
        });
        return response.data;
    },

    // Vérifier si un QR code est valide
    verifyQRCode: async (qrCode: string) => {
        const response = await qrApi.post('/verify', {
            qrCode
        });
        return response.data;
    }
};
