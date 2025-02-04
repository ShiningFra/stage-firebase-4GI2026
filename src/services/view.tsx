import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ViewProps {
  clientId: number;
  chauffeurId: number;
  courseId: number;
}

export const View: React.FC<ViewProps> = ({ clientId, chauffeurId, courseId }) => {
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        // Effectuer une requête GET pour récupérer l'image QR
        const response = await axios.get('http://localhost:8080/api/qr/display', {
          params: { clientId, chauffeurId, courseId },
          responseType: 'arraybuffer',  // Réponse en format binaire
        });

        // Convertir l'image reçue en base64
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        setQrCodeImage(`data:image/png;base64,${base64Image}`);
      } catch (error) {
        setError('Une erreur est survenue lors de la récupération du QR Code');
      }
    };

    if (clientId && chauffeurId && courseId) {
      fetchQRCode();
    }
  }, [clientId, chauffeurId, courseId]);

  return (
    <div>
      {error ? (
        <div>{error}</div>
      ) : (
        <div>
          {qrCodeImage ? (
            <img src={qrCodeImage} alt="QR Code" />
          ) : (
            <p>Chargement du QR Code...</p>
          )}
        </div>
      )}
    </div>
  );
};
