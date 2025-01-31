'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { authService } from '@/services/auth';

export default function ScanPage() {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authService.getUserRole() !== 'CHAUFFEUR') {
      router.push('/login');
      return;
    }

    // Initialiser le scanner QR
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanError);

    // Nettoyer le scanner lors du démontage du composant
    return () => {
      scanner.clear();
    };
  }, []);

  const onScanSuccess = async (decodedText: string) => {
    setScanResult(decodedText);
    try {
      // Envoyer le QR code scanné au serveur QRAPI
      const response = await fetch('http://localhost:8080/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ qrCode: decodedText })
      });

      if (response.ok) {
        router.push('/chauffeur/dashboard');
      } else {
        setError('Erreur lors de la validation du QR code');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    }
  };

  const onScanError = (err: string) => {
    console.error(err);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Scanner un QR Code</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="card">
          <div id="reader" className="w-full"></div>
          
          {scanResult && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
              QR Code scanné avec succès
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
