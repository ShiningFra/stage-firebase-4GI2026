import ap from '../api/axiosConf';

export const qrService = {
    // Générer un QR code pour une course
    generateQRCode: async (clientId: number, chauffeurId: number, courseId: number) => {
        const response = await ap.get(`/api/qr/generate?clientId=${clientId}&chauffeurId=${chauffeurId}&courseId=${courseId}`, {
            responseType: 'blob'
        });
        return URL.createObjectURL(response.data);
    },

    // Voir un QR code existant
    viewQRCode: async (qrCodeData: string) => {
        const response = await ap.get(`/api/qr/view?qrCodeData=${qrCodeData}`, {
            responseType: 'blob'
        });
        return URL.createObjectURL(response.data);
    },

    // Scanner un QR code
    scanQRCode: async (qrCodeData: string) => {
        const response = await ap.get(`/api/qr/scan?qrCodeData=${qrCodeData}`);
        return response.data;
    }
};
