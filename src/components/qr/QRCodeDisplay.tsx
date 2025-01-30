import { useEffect, useState } from 'react';
import Image from 'next/image';
import { qrService } from '@/services/qrService';

interface QRCodeDisplayProps {
    clientId: number;
    chauffeurId: number;
    courseId: number;
    qrCodeData?: string;
    mode: 'generate' | 'view';
}

export default function QRCodeDisplay({ clientId, chauffeurId, courseId, qrCodeData, mode }: QRCodeDisplayProps) {
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadQRCode = async () => {
            try {
                let url;
                if (mode === 'generate') {
                    url = await qrService.generateQRCode(clientId, chauffeurId, courseId);
                } else if (mode === 'view' && qrCodeData) {
                    url = await qrService.viewQRCode(qrCodeData);
                }
                if (url) {
                    // Révoquer l'ancien URL si nécessaire
                    if (qrCodeUrl) {
                        URL.revokeObjectURL(qrCodeUrl);
                    }
                    setQrCodeUrl(url);
                }
            } catch (err) {
                setError('Erreur lors du chargement du QR code');
                console.error(err);
            }
        };

        loadQRCode();

        // Cleanup function
        return () => {
            if (qrCodeUrl) {
                URL.revokeObjectURL(qrCodeUrl);
            }
        };
    }, [clientId, chauffeurId, courseId, qrCodeData, mode, qrCodeUrl]);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="flex justify-center items-center p-4">
            {qrCodeUrl && (
                <Image 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    width={350}
                    height={350}
                    className="max-w-xs w-full h-auto"
                    unoptimized // Nécessaire car nous utilisons un blob URL
                />
            )}
        </div>
    );
}
