"use client";

import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import Navbar from "@/components/Navbar";

const Scan = () => {
  const router = useRouter();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authService.getUserRole() !== "CHAUFFEUR") {
      router.push("/login");
      return;
    }

    // Initialisation du scanner QR dès que le composant est monté
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanError);

    // Nettoyage lors du démontage du composant
    return () => {
      scanner.clear();
    };
  }, [router]);

  const onScanSuccess = async (decodedText: string) => {
    setScanResult(decodedText);  // Met à jour l'état avec le texte scanné
    try {
      // Envoi du QR code scanné pour validation
      const response = await fetch("http://localhost:8080/api/qr/scan?qrCodeData=" + decodedText, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Si la validation est réussie, rediriger vers le tableau de bord
        router.push("/chauffeur/dashboard");
      } else {
        setError("Erreur lors de la validation du QR code");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    }
  };

  const onScanError = (err: string) => {
    console.error(err);  // Gérer les erreurs lors du scan
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
};

export default Scan;
