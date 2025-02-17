"use client";

import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import Navbar from "@/components/Navbar";
import { courseService } from "@/services/course"; // Assurez-vous que le chemin est correct

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
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanError);

    // Nettoyage lors du démontage du composant
    return () => {
      scanner.clear();
    };
  }, [router]);

  const onScanSuccess = async (decodedText: string) => {
    setScanResult(decodedText); // Met à jour l'état avec le texte scanné

    try {
      // Construction de l'objet History à envoyer dans le corps de la requête (adapter selon vos besoins)
      const history = {
        lieu: "ENSPY",
	ville: "Yaoundé",
	pays: "Cameroun", 
      };

      // Remplacez "MaSuperCleSecrete" par votre secret réel.
      const scanUrl = `http://localhost:8080/api/qr/scan?qrCodeData=${encodeURIComponent(decodedText)}&secret=MaSuperCleSecrete`;

      const scanResponse = await fetch(scanUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Ajoutez un header Authorization si nécessaire :
          "Authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJwcm92aWRlciI6IkZyYSIsInN1YiI6IkZyYSIsImlhdCI6MTczOTYzNjUwM30.xNcbEJzYBFIF-ALaOfMZ1YcpbFTw4IQm9C2fA3swh5rCsXCjJoYtXGWL3rsi2p58gxPieQYhs3RNC9FgAklsjA"
        },
        body: JSON.stringify(history),
      });

      if (!scanResponse.ok) {
        const scanErrMsg = await scanResponse.text();
        setError("Erreur lors de la validation du QR code: " + scanErrMsg);
        return;
      }

      // Récupération des données retournées par l'API de scan (QRData)
      const qrData = await scanResponse.json();

      if (!qrData.courseId) {
        setError("Les données du QR Code sont invalides : courseId manquant.");
        return;
      }

      // Appel à l'API pour compléter la course via le service
      const completedCourse = await courseService.completeCourse(qrData.courseId);

      if (completedCourse) {
        // Si la complétion est réussie, rediriger vers le tableau de bord du chauffeur
        router.push("/chauffeur/dashboard");
      } else {
        setError("Erreur lors de la complétion de la course.");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion au serveur");
    }
  };

  const onScanError = (err: string) => {
    console.error("Erreur lors du scan: ", err);
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
