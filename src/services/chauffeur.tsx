import React, { useState } from "react";
import courseService from "@/services/course";
import Scan from "@/services/scan";
import authService from "@/services/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useRouter } from 'next/navigation';


useEffect(() => {
    if (authService.getUserRole() !== 'CHAUFFEUR') {
      router.push('/login');
      return;
    }
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }


const ChauffeurDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [newCourse, setNewCourse] = useState({
    lieu_depart: "",
    lieu_arrivee: "",
    prix: "",
    date_depart: "",
  });

  const createdRides = courseService.getMyCourses();
  const ongoingRides = courseService.getMyIncompleteCourses();
  const completedRides = courseService.getMyCompletedCoursesDriver();

  const handleCreateRide = async () => {
    await courseService.publishCourse({
      ...newCourse,
      prix: parseFloat(newCourse.prix),
    });
    setShowForm(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Chauffeur</h1>
      
      <Button onClick={() => setShowForm(true)} className="mb-4">Créer une course</Button>
      
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
        <h2 className="text-xl font-semibold">Courses créées</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {createdRides.map((ride) => (
            <Card key={ride.id}>
              <CardContent className="p-4 space-y-2">
                <p>{ride.depart} → {ride.destination}</p>
                <Button onClick={() => courseService.cancelCourse(ride.id)}>Supprimer</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Courses en cours</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {ongoingRides.map((ride) => (
            <Card key={ride.id}>
              <CardContent className="p-4 space-y-2">
                <p>{ride.depart} → {ride.destination}</p>
                <Button onClick={() => courseService.cancelCourse(ride.id)}>Annuler</Button>
                <Button className="ml-2" onClick={() => setShowScan(true)}>Scanner QRCode</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Dialog open={showScan} onOpenChange={setShowScan}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scanner QRCode</DialogTitle>
          </DialogHeader>
          <Scan />
        </DialogContent>
      </Dialog>

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
    </div>
  );
};

export default ChauffeurDashboard;
