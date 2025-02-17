"use client";
import React, { useState, useEffect } from "react";
import { courseService } from "@/services/course";
import { authService } from "@/services/auth";
import Card, { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DialogActions, { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { View } from "@/services/view"; // Assurez-vous que l'importation est correcte
import { useRouter } from 'next/navigation';
import axios from 'axios';

const ClientDashboard = () => {
  const [showView, setShowView] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [availableRides, setAvailableRides] = useState([]);
  const [acceptedRides, setAcceptedRides] = useState([]);
  const [completedRides, setCompletedRides] = useState([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false); // Dialogue de confirmation pour accepter la course
  const router = useRouter();

  const fetchData = async () => {
    const available = await courseService.getAvailableCourses();
    const accepted = await courseService.getMyAcceptedCourses();
    const completed = await courseService.getMyCompletedCourses();
    setAvailableRides(available);
    setAcceptedRides(accepted);
    setCompletedRides(completed);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReserveRide = async (courseId) => {
    const acceptedCourse = await courseService.reserveCourse(courseId);
    if (acceptedCourse) {
      fetchData();
      // Stocker les valeurs dans une variable temporaire
      const updatedSelectedCourse = {
        clientId: acceptedCourse.client.id,
        chauffeurId: acceptedCourse.chauffeur.id,
        courseId: acceptedCourse.id,
      };
      
      // Mettre à jour l'état
      setSelectedCourse(updatedSelectedCourse);

// Exemple de token JWT récupéré précédemment
const token = 'eyJhbGciOiJIUzUxMiJ9.eyJwcm92aWRlciI6IkZyYSIsInN1YiI6IkZyYSIsImlhdCI6MTczOTYzNjUwM30.xNcbEJzYBFIF-ALaOfMZ1YcpbFTw4IQm9C2fA3swh5rCsXCjJoYtXGWL3rsi2p58gxPieQYhs3RNC9FgAklsjA';

// Génération du QR Code
const response = await axios.post(
  'http://localhost:8080/api/qr/generate?secret=MaSuperCleSecrete&expirationMillis=3600000',
  {
    clientId: updatedSelectedCourse.clientId,
    chauffeurId: updatedSelectedCourse.chauffeurId,
    courseId: updatedSelectedCourse.courseId,
    // Ajoutez d'autres champs si nécessaire :
    lieu: updatedSelectedCourse.lieu,
    heure: updatedSelectedCourse.heure,
    date: updatedSelectedCourse.date,
    ville: updatedSelectedCourse.ville,
    pays: updatedSelectedCourse.pays,
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    responseType: 'arraybuffer', // Pour recevoir la réponse en binaire (image PNG)
  }
);

console.log("QR Code généré avec succès", response.data);

// Sauvegarde du QR Code en appelant l'API de sauvegarde avec courseId comme nom de fichier
const saveResponse = await axios.post(
  `http://localhost:5000/api/files/save/${updatedSelectedCourse.courseId}`,
  response.data, // On passe directement les données binaires du QR Code
  {
    headers: {
      'Content-Type': 'application/octet-stream', // Pour envoyer le binaire
    },
    responseType: 'json',
  }
);

console.log("QR Code sauvegardé avec succès", saveResponse.data);


    }
  };

  const handleShowQRCode = (ride) => {
    setSelectedCourse({
      courseId: ride.id,
      clientId: ride.client.id,
      chauffeurId: ride.chauffeur.id,
    });
    setShowView(true);
  };

  const handleConfirmReservation = async () => {
    setIsConfirmDialogOpen(false);
    fetchData(); // Actualiser les courses après réservation
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Client</h1>
        <Button onClick={fetchData}>Actualiser</Button>
      </div>
      
      <section>
        <h2 className="text-xl font-semibold">Courses disponibles</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {availableRides.map((ride) => (
            <Card key={ride.id}>
              <CardContent className="p-4 space-y-2">
                <p>{ride.lieu_depart} → {ride.lieu_arrivee}</p>
                <p>Prix : {ride.prix} €</p>
                <Button onClick={() => handleReserveRide(ride.id)}>Accepter</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold">Courses en cours</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {acceptedRides.map((ride) => (
            <Card key={ride.id}>
              <CardContent className="p-4 space-y-2">
                <p>{ride.lieu_depart} → {ride.lieu_arrivee}</p>
                <Button onClick={() => handleShowQRCode(ride)}>Voir QRCode</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-semibold">Courses terminées</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {completedRides.map((ride) => (
            <Card key={ride.id}>
              <CardContent className="p-4 space-y-2">
                <p>{ride.lieu_depart} → {ride.lieu_arrivee}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmation de réservation</DialogTitle>
          </DialogHeader>
          <DialogActions>
            <Button onClick={handleConfirmReservation}>Confirmer</Button>
            <Button onClick={() => setIsConfirmDialogOpen(false)}>Annuler</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog open={showView} onOpenChange={setShowView}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Voir QRCode</DialogTitle>
          </DialogHeader>
          <View clientId={selectedCourse?.clientId} chauffeurId={selectedCourse?.chauffeurId} courseId={selectedCourse?.courseId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDashboard;
