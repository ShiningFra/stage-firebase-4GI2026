'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import { courseService, Course } from '@/services/course';
import { authService } from '@/services/auth';

export default function ChauffeurDashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [reservedCourses, setReservedCourses] = useState<Course[]>([]);
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    depart: '',
    destination: '',
    prix: '',
    date: ''
  });
  const [activeTab, setActiveTab] = useState<'my-courses' | 'reserved-courses'>('my-courses');

  // Effet au montage pour vérifier le rôle et charger les données
  useEffect(() => {
    if (authService.getUserRole() !== 'CHAUFFEUR') {
      router.push('/login');
      return;
    }
    loadCourses();
    loadReservedCourses();
  }, []);

  // Chargement des courses
  const loadCourses = async () => {
    try {
      const myCourses = await courseService.getMyCourses();
      setCourses(myCourses);
    } catch (error) {
      console.error('Erreur lors du chargement des courses:', error);
    }
  };

  // Chargement des courses réservées
  const loadReservedCourses = async () => {
    try {
      const myReservedCourses = await courseService.getMyReservedCourses();
      setReservedCourses(myReservedCourses);
    } catch (error) {
      console.error('Erreur lors du chargement des courses réservées:', error);
    }
  };

  // Soumission du formulaire de création de course
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await courseService.publishCourse({
        ...newCourse,
        prix: parseFloat(newCourse.prix)
      });
      setShowNewCourseForm(false);
      setNewCourse({ depart: '', destination: '', prix: '', date: '' });
      loadCourses();
    } catch (error) {
      console.error('Erreur lors de la création de la course:', error);
    }
  };

  // Gestion des changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCourse({
      ...newCourse,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord Chauffeur</h1>
          <button
            onClick={() => setShowNewCourseForm(!showNewCourseForm)}
            className="btn btn-primary"
          >
            {showNewCourseForm ? 'Annuler' : 'Nouvelle Course'}
          </button>
        </div>

        {/* Onglets de navigation */}
        <div className="flex mb-6 space-x-4">
          <button
            className={`btn ${activeTab === 'my-courses' ? 'btn-primary' : 'bg-gray-200'}`}
            onClick={() => {
              setActiveTab('my-courses');
              loadCourses(); // Recharger les courses
            }}
          >
            Mes Courses
          </button>
          <button
            className={`btn ${activeTab === 'reserved-courses' ? 'btn-primary' : 'bg-gray-200'}`}
            onClick={() => {
              setActiveTab('reserved-courses');
              loadReservedCourses(); // Recharger les courses réservées
            }}
          >
            Courses Réservées
          </button>
        </div>

        {/* Formulaire pour publier une nouvelle course */}
        {showNewCourseForm && (
          <div className="bg-white p-6 mb-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Nouvelle Course</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="depart" className="block text-sm font-medium text-gray-700">Départ</label>
                <input
                  type="text"
                  id="depart"
                  name="depart"
                  value={newCourse.depart}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={newCourse.destination}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="prix" className="block text-sm font-medium text-gray-700">Prix</label>
                <input
                  type="number"
                  id="prix"
                  name="prix"
                  value={newCourse.prix}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newCourse.date}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">Publier la Course</button>
            </form>
          </div>
        )}

        {/* Affichage des courses en fonction de l'onglet actif */}
        <div>
          {activeTab === 'my-courses' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Mes Courses</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reserved-courses' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Courses Réservées</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reservedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
