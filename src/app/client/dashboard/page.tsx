'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import { courseService, Course } from '@/services/course';
import { authService } from '@/services/auth';

export default function ClientDashboard() {
  const router = useRouter();
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'my-courses'>('available');
  const token = authService.getToken(); // Récupérer le token une fois
console.log('Token', token);

  useEffect(() => {
    if (authService.getUserRole() !== 'CLIENT') {
      router.push('/login');
      return;
    }
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const [available, accepted] = await Promise.all([
        courseService.getAvailableCourses(token as string),
        courseService.getMyAcceptedCourses(token as string)
      ]);
      setAvailableCourses(available);
      setMyCourses(accepted);
    } catch (error) {
      console.error('Erreur lors du chargement des courses:', error);
    }
  };

  const handleReserve = async (courseId: number) => {
    try {
      await courseService.reserveCourse(courseId, token as string);
      loadCourses();
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
    }
  };

  const handleCancel = async (courseId: number) => {
    try {
      await courseService.cancelCourse(courseId, token as string);
      loadCourses();
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord Client</h1>

        <div className="flex mb-6 space-x-4">
          <button
            className={`btn ${activeTab === 'available' ? 'btn-primary' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('available')}
          >
            Courses Disponibles
          </button>
          <button
            className={`btn ${activeTab === 'my-courses' ? 'btn-primary' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('my-courses')}
          >
            Mes Courses
          </button>
        </div>

        <div className="grid-courses">
          {activeTab === 'available' ? (
            availableCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onReserve={handleReserve}
              />
            ))
          ) : (
            myCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onCancel={handleCancel}
                showQRCode={true}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}