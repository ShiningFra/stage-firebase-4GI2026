'use client';

import { useEffect, useState } from 'react';
import { rideService, RideResponse } from '@/services/rideService';

export default function OngoingRidesPage() {
    const [rides, setRides] = useState<RideResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadRides();
    }, []);

    const loadRides = async () => {
        try {
            const data = await rideService.getAllPublishedRides();
            setRides(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load rides');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Available Rides</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {rides.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">No rides available at the moment</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rides.map((ride) => (
                        <div key={ride.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">{ride.pickupLocation}</h3>
                                        <div className="flex items-center my-2">
                                            <div className="border-r-2 h-8 border-gray-300 mx-2"></div>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800">{ride.dropoffLocation}</h3>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        ride.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        ride.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {ride.status}
                                    </span>
                                </div>

                                <div className="space-y-2 text-gray-600">
                                    <p>
                                        <span className="font-medium">Start Time:</span>{' '}
                                        {new Date(ride.startTime).toLocaleString()}
                                    </p>
                                    <p>
                                        <span className="font-medium">Distance:</span>{' '}
                                        {ride.distance} km
                                    </p>
                                    <p>
                                        <span className="font-medium">Fare:</span>{' '}
                                        ${ride.fare}
                                    </p>
                                </div>

                                {ride.status === 'PENDING' && (
                                    <button 
                                        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
                                        onClick={() => {/* Add booking logic here */}}
                                    >
                                        Book This Ride
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
