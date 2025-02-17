import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ViewProps {
  courseId: number;
}

export const View: React.FC<ViewProps> = ({ courseId }) => {
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        // Appel à l'API pour récupérer le fichier image correspondant à courseId
        const response = await axios.get(`http://localhost:5000/api/files/file/${courseId}`, {
          responseType: 'arraybuffer', // Réponse en format binaire
        });

        // Conversion de la réponse en base64
        const base64Image = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        setQrCodeImage(`data:image/png;base64,${base64Image}`);
      } catch (error) {
        setError('Une erreur est survenue lors de la récupération du QR Code');
        console.error(error);
      }
    };

    if (courseId) {
      fetchQRCode();
    }
  }, [courseId]);

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
