import { useState } from 'react';
import { rideService } from '@/services/rideService';

export default function PublishRide() {
    const [formData, setFormData] = useState({
        pickupLocation: '',
        dropoffLocation: '',
        startTime: '',
        distance: 0,
        fare: 0
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('Submitting ride data:', formData); // Debug log
            const response = await rideService.publishRide({
                ...formData,
                distance: Number(formData.distance),
                fare: Number(formData.fare),
            });
            console.log('Ride published successfully:', response); // Debug log
            window.location.href = '/rides';
        } catch (error: any) {
            console.error('Error publishing ride:', error.response || error);
            setError(error.response?.data?.message || 'Failed to publish ride');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'distance' || name === 'fare' ? parseFloat(value) || 0 : value
        }));
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Publish a New Ride</h2>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">
                        Pickup Location
                    </label>
                    <input
                        type="text"
                        id="pickupLocation"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                
                <div>
                    <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700">
                        Dropoff Location
                    </label>
                    <input
                        type="text"
                        id="dropoffLocation"
                        name="dropoffLocation"
                        value={formData.dropoffLocation}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                
                <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                        Start Time
                    </label>
                    <input
                        type="datetime-local"
                        id="startTime"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                
                <div>
                    <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
                        Distance (km)
                    </label>
                    <input
                        type="number"
                        id="distance"
                        name="distance"
                        value={formData.distance}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                
                <div>
                    <label htmlFor="fare" className="block text-sm font-medium text-gray-700">
                        Fare
                    </label>
                    <input
                        type="number"
                        id="fare"
                        name="fare"
                        value={formData.fare}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Publish Ride
                </button>
            </form>
        </div>
    );
}
