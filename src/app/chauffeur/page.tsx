"use client";
import React, { useState, useEffect } from "react";
import { courseService } from "@/services/course";
import Scan from "@/services/scan";
import authService from "@/services/auth";
import Card, { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';

const ChauffeurDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [newCourse, setNewCourse] = useState({
    lieu_depart: "",
    lieu_arrivee: "",
    prix: "",
    date_depart: "",
  });
  const [isClient, setIsClient] = useState(false);

  const [createdRides, setCreatedRides] = useState([]);
  const [ongoingRides, setOngoingRides] = useState([]);
  const [completedRides, setCompletedRides] = useState([]);

  const fetchData = async () => {
    const created = await courseService.getMyCourses();
    const ongoing = await courseService.getMyIncompleteCourses();
    const completed = await courseService.getMyCompletedCoursesDriver();
    
    setCreatedRides(created);
    setOngoingRides(ongoing);
    setCompletedRides(completed);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const router = useRouter();

  const handleCreateRide = async () => {
    await courseService.publishCourse({
      ...newCourse,
      prix: parseFloat(newCourse.prix),
    });
    setShowForm(false);
    fetchData();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Chauffeur</h1>
      
      <Button onClick={() => setShowForm(true)} className="mb-4">Créer une course</Button>
      <Button onClick={() => setShowScan(true)} className="mb-4">Scanner QRCode</Button>
      <Button onClick={fetchData} className="mb-4">Actualiser</Button>
      
      <Dialog open={showScan} onOpenChange={setShowScan}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scanner QRCode</DialogTitle>
          </DialogHeader>
          <Scan />
        </DialogContent>
      </Dialog>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Lieu de départ</Label>
            <Input value={newCourse.lieu_depart} onChange={(e) => setNewCourse({ ...newCourse, lieu_depart: e.target.value })} />
            <Label>Lieu d'arrivée</Label>
            <Input value={newCourse.lieu_arrivee} onChange={(e) => setNewCourse({ ...newCourse, lieu_arrivee: e.target.value })} />
            <Label>Prix</Label>
            <Input type="number" value={newCourse.prix} onChange={(e) => setNewCourse({ ...newCourse, prix: e.target.value })} />
            <Label>Date de départ</Label>
            <Input type="date" value={newCourse.date_depart} onChange={(e) => setNewCourse({ ...newCourse, date_depart: e.target.value })} />
          </div>
          <DialogFooter>
            <Button onClick={handleCreateRide}>Publier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <section>
        <h2 className="text-xl font-semibold">Courses en cours</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(ongoingRides) && ongoingRides.map((ride) => (
            <Card key={ride.id}>
              <CardContent className="p-4 space-y-2">
                <p>{ride.lieu_depart} → {ride.lieu_arrivee}</p>
                <Button onClick={() => courseService.deleteCourse(ride.id)}>Annuler</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Courses terminées</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(completedRides) && completedRides.map((ride) => (
            <Card key={ride.id}>
              <CardContent className="p-4 space-y-2">
                <p>{ride.lieu_depart} → {ride.lieu_arrivee}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ChauffeurDashboard;
