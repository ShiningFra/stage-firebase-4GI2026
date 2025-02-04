'use client';

import { useEffect, useState } from 'react';
import { rideService, RideResponse } from '@/services/rideService';

export default function RidesList() {
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
        return <div className="text-center py-4">Loading rides...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    if (rides.length === 0) {
        return <div className="text-center py-4">No rides available</div>;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rides.map((ride) => (
                <div key={ride.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-semibold text-lg">{ride.pickupLocation}</h3>
                            <p className="text-gray-600">to</p>
                            <h3 className="font-semibold text-lg">{ride.dropoffLocation}</h3>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {ride.status}
                        </span>
                    </div>
                    
                    <div className="space-y-2">
                        <p className="text-sm">
                            <span className="font-medium">Start Time:</span>{' '}
                            {new Date(ride.startTime).toLocaleString()}
                        </p>
                        <p className="text-sm">
                            <span className="font-medium">Distance:</span> {ride.distance} km
                        </p>
                        <p className="text-sm">
                            <span className="font-medium">Fare:</span> ${ride.fare}
                        </p>
                        {ride.driver && (
                            <p className="text-sm">
                                <span className="font-medium">Driver:</span> {ride.driver.fullName}
                            </p>
                        )}
                    </div>

                    {ride.status === 'PENDING' && (
                        <button 
                            onClick={() => {/* Add booking logic here */}}
                            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                        >
                            Book This Ride
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
