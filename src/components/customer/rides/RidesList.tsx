import { useEffect, useState } from 'react';
import { Course, courseService } from '@/services/rideService';
import { useAuthContext } from '@/components/context/authContext';
import { toast } from 'react-hot-toast';
import QRCodeDisplay from '@/components/qr/QRCodeDisplay';
import QRScanner from '@/components/qr/QRScanner';
import Modal from '@/components/common/Modal';

export default function RidesList() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showQRCode, setShowQRCode] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const { authUser } = useAuthContext();

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            let data;
            if (authUser?.role === 'CHAUFFEUR') {
                data = await courseService.getMyCourses();
            } else {
                data = await courseService.getAvailableCourses();
            }
            setCourses(data);
        } catch (err) {
            setError('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleReserveCourse = async (courseId: number) => {
        try {
            const course = await courseService.reserveCourse(courseId);
            toast.success('Course réservée avec succès');
            setSelectedCourse(course);
            setShowQRCode(true);
            loadCourses();
        } catch (err) {
            toast.error('Erreur lors de la réservation');
        }
    };

    const handleCancelCourse = async (courseId: number) => {
        try {
            await courseService.cancelCourse(courseId);
            toast.success('Course annulée avec succès');
            loadCourses();
        } catch (err) {
            toast.error('Erreur lors de l\'annulation');
        }
    };

    const handleCompleteCourse = async (course: Course) => {
        if (authUser?.role === 'CHAUFFEUR') {
            setSelectedCourse(course);
            setShowScanner(true);
        } else {
            setSelectedCourse(course);
            setShowQRCode(true);
        }
    };

    const handleScanComplete = async () => {
        setShowScanner(false);
        loadCourses();
    };

    if (loading) {
        return <div className="text-center py-4">Chargement des courses...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    if (courses.length === 0) {
        return <div className="text-center py-4">Aucune course disponible</div>;
    }

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-lg">{course.depart}</h3>
                                <p className="text-gray-600">vers</p>
                                <h3 className="font-semibold text-lg">{course.destination}</h3>
                            </div>
                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                                course.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                                {course.completed ? 'Complétée' : course.client ? 'Réservée' : 'Disponible'}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm">
                                <span className="font-medium">Date de départ:</span>{' '}
                                {new Date(course.dateDepart).toLocaleString()}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Prix:</span> {course.prix} FCFA
                            </p>
                            {course.chauffeur && (
                                <p className="text-sm">
                                    <span className="font-medium">Chauffeur:</span> {course.chauffeur.nom}
                                </p>
                            )}
                        </div>

                        <div className="mt-4 space-y-2">
                            {!course.client && !course.completed && authUser?.role !== 'CHAUFFEUR' && (
                                <button 
                                    onClick={() => handleReserveCourse(course.id)}
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                                >
                                    Réserver
                                </button>
                            )}
                            
                            {course.client && !course.completed && (
                                <>
                                    {authUser?.role !== 'CHAUFFEUR' && (
                                        <>
                                            <button 
                                                onClick={() => handleCancelCourse(course.id)}
                                                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                                            >
                                                Annuler
                                            </button>
                                            <button 
                                                onClick={() => handleCompleteCourse(course)}
                                                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                                            >
                                                Voir QR Code
                                            </button>
                                        </>
                                    )}
                                    {authUser?.role === 'CHAUFFEUR' && (
                                        <button 
                                            onClick={() => handleCompleteCourse(course)}
                                            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                                        >
                                            Scanner QR Code
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal pour afficher le QR Code */}
            <Modal
                isOpen={showQRCode}
                onClose={() => setShowQRCode(false)}
                title="Code QR de la course"
            >
                {selectedCourse && (
                    <QRCodeDisplay
                        clientId={selectedCourse.client?.id}
                        chauffeurId={selectedCourse.chauffeur?.id}
                        courseId={selectedCourse.id}
                        mode="generate"
                    />
                )}
            </Modal>

            {/* Modal pour le scanner */}
            <Modal
                isOpen={showScanner}
                onClose={() => setShowScanner(false)}
                title="Scanner le QR Code"
            >
                <QRScanner onScanComplete={handleScanComplete} />
            </Modal>
        </>
    );
}
