import { Course } from '@/services/course';
import { authService } from '@/services/auth';
import { qrService } from '@/services/qr';
import { useState } from 'react';
import Link from 'next/link';

interface CourseCardProps {
  course: Course;
  onReserve?: (courseId: number) => void;
  onCancel?: (courseId: number) => void;
}

export default function CourseCard({ course, onReserve, onCancel }: CourseCardProps) {
  const userRole = authService.getUserRole();
  const isClient = userRole === 'CLIENT';
  const [showQRCode, setShowQRCode] = useState(false);

  return (
    <div className="course-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{course.depart} → {course.destination}</h3>
          <p className="text-gray-600">{new Date(course.date).toLocaleString()}</p>
        </div>
        <div className="text-xl font-bold text-green-600">{course.prix}€</div>
      </div>
      
      <div className="text-sm text-gray-500 mb-4">
        {isClient ? (
          <p>Chauffeur: {course.chauffeur?.nom}</p>
        ) : (
          course.client && <p>Client: {course.client?.nom}</p>
        )}
      </div>

      {/* QR Code pour les clients */}
      {isClient && course.client && showQRCode && (
        <div className="qr-code">
          <img
            src={qrService.getQRCodeUrl(course.id)}
            alt="QR Code"
            className="w-full"
          />
          <button 
            onClick={() => setShowQRCode(false)}
            className="btn btn-secondary mt-2 w-full"
          >
            Masquer le QR Code
          </button>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        {/* Boutons pour les clients */}
        {isClient && !course.client && onReserve && (
          <button
            onClick={() => onReserve(course.id)}
            className="btn btn-primary"
          >
            Réserver
          </button>
        )}
        {isClient && course.client && !course.completed && (
          <>
            {!showQRCode && (
              <button
                onClick={() => setShowQRCode(true)}
                className="btn btn-secondary"
              >
                Voir QR Code
              </button>
            )}
            {onCancel && (
              <button
                onClick={() => onCancel(course.id)}
                className="btn btn-danger"
              >
                Annuler
              </button>
            )}
          </>
        )}

        {/* Bouton pour les chauffeurs */}
        {!isClient && course.client && !course.completed && (
          <Link 
            href={`/scan/${course.id}`}
            className="btn btn-primary"
          >
            Scanner QR Code
          </Link>
        )}
      </div>
    </div>
  );
}
