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
  const [reservedCourses, setReservedCourses] = useState<Course[]>([]); // Nouvel état pour les courses réservées
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    depart: '',
    destination: '',
    prix: '',
    date: ''
  });
  const [activeTab, setActiveTab] = useState<'my-courses' | 'reserved-courses'>('my-courses'); // Onglets

  const token = localStorage.getItem('token'); // Récupérer le token une fois

  useEffect(() => {
    if (authService.getUserRole() !== 'CHAUFFEUR') {
      router.push('/login');
      return;
    }
    loadCourses();
    loadReservedCourses(); // Charger les courses réservées
  }, []);

  const loadCourses = async () => {
    try {
      const myCourses = await courseService.getMyCourses(token as string);
      setCourses(myCourses);
    } catch (error) {
      console.error('Erreur lors du chargement des courses:', error);
    }
  };

  const loadReservedCourses = async () => {
    try {
      const myReservedCourses = await courseService.getMyReservedCourses(token as string);
      setReservedCourses(myReservedCourses);
    } catch (error) {
      console.error('Erreur lors du chargement des courses réservées:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await courseService.publishCourse({
        ...newCourse,
        prix: parseFloat(newCourse.prix)
      }, token as string);
      setShowNewCourseForm(false);
      setNewCourse({ depart: '', destination: '', prix: '', date: '' });
      loadCourses();
    } catch (error) {
      console.error('Erreur lors de la création de la course:', error);
    }
  };

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

        <div>
          {activeTab === 'my-courses' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Mes Courses</h2>
              <div className="grid-courses">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reserved-courses' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Courses Réservées</h2>
              <div className="grid-courses">
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