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

  useEffect(() => {
    const fetchData = async () => {
      const available = await courseService.getAvailableCourses();
      const accepted = await courseService.getMyAcceptedCourses();
      const completed = await courseService.getMyCompletedCourses();
      setAvailableRides(available);
      setAcceptedRides(accepted);
      setCompletedRides(completed);
    };

    fetchData();
  }, []);

  const handleReserveRide = async (courseId) => {
    // Ouvrir le dialogue de confirmation
    const acceptedCourse = await courseService.reserveCourse(courseId);
    if (acceptedCourse) {
      // Afficher un dialogue pour confirmer la réservation
      setIsConfirmDialogOpen(true);
      setSelectedCourse({
        clientId: acceptedCourse.client.id,
        chauffeurId: acceptedCourse.chauffeur.id,
        courseId: acceptedCourse.id,
      });
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
    // Ici, tu peux éventuellement mettre à jour l'état de la réservation après confirmation si nécessaire
    setIsConfirmDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Client</h1>
      
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

      {/* Dialogue de confirmation d'acceptation de course */}
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

      {/* Dialogue pour afficher le QR Code */}
      <Dialog open={showView} onOpenChange={setShowView}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Voir QRCode</DialogTitle>
          </DialogHeader>
          {/* Passer l'ID de la course pour que View récupère l'image QR */}
          <View clientId={selectedCourse?.clientId} chauffeurId={selectedCourse?.chauffeurId} courseId={selectedCourse?.courseId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDashboard;
