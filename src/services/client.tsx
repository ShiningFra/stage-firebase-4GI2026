import React, { useState, useEffect } from "react";
import courseService from "@/services/course";
import authService from "@/services/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import View from "@/services/view";
import { useRouter } from 'next/navigation';

const ClientDashboard = () => {
  const [showView, setShowView] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (authService.getUserRole() !== 'CLIENT') {
      router.push('/login');
      return;
    }
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const availableRides = courseService.getAvailableCourses();
  const acceptedRides = courseService.getMyAcceptedCourses();
  const completedRides = courseService.getMyCompletedCourses();

  const handleReserveRide = async (courseId) => {
    await courseService.reserveCourse(courseId);
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
                <p>{ride.depart} → {ride.destination}</p>
                <p>Prix : {ride.prix} €</p>
                <Button onClick={() => handleReserveRide(ride.id)}>Réserver</Button>
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
                <p>{ride.depart} → {ride.destination}</p>
                <Button onClick={() => { setSelectedCourse(ride); setShowView(true); }}>Voir QRCode</Button>
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
                <p>{ride.depart} → {ride.destination}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      <Dialog open={showView} onOpenChange={setShowView}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Voir QRCode</DialogTitle>
          </DialogHeader>
          <View course={selectedCourse} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDashboard;
