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
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    depart: '',
    destination: '',
    prix: '',
    date: ''
  });

  useEffect(() => {
    if (authService.getUserRole() !== 'CHAUFFEUR') {
      router.push('/login');
      return;
    }
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const myCourses = await courseService.getMyCourses();
      setCourses(myCourses);
    } catch (error) {
      console.error('Erreur lors du chargement des courses:', error);
    }
  };

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

        {showNewCourseForm && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-4">Créer une nouvelle course</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="depart" className="label">
                  Lieu de départ
                </label>
                <input
                  type="text"
                  id="depart"
                  name="depart"
                  required
                  className="input"
                  value={newCourse.depart}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="destination" className="label">
                  Destination
                </label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  required
                  className="input"
                  value={newCourse.destination}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="prix" className="label">
                  Prix (€)
                </label>
                <input
                  type="number"
                  id="prix"
                  name="prix"
                  required
                  min="0"
                  step="0.01"
                  className="input"
                  value={newCourse.prix}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="date" className="label">
                  Date et heure
                </label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  required
                  className="input"
                  value={newCourse.date}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Créer la course
              </button>
            </form>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-4">Mes Courses</h2>
          <div className="grid-courses">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
