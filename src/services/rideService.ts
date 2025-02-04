import api from '../api/axiosConfig';

export interface RideRequest {
    pickupLocation: string;
    dropoffLocation: string;
    startTime: string;
    distance: number;
    fare: number;
    vehicleId?: number;
}

export interface RideResponse {
    id: number;
    pickupLocation: string;
    dropoffLocation: string;
    startTime: string;
    endTime: string | null;
    distance: number;
    fare: number;
    status: string;
    rating: number | null;
    comment: string | null;
    driver: any;
    client: any;
    vehicle: any;
}

export const rideService = {
    publishRide: async (data: RideRequest) => {
        const response = await api.post('/rides', data);
        return response.data;
    },

    getAllPublishedRides: async () => {
        const response = await api.get('/rides');
        return response.data;
    },

    getDriverRides: async () => {
        const response = await api.get('/rides/driver');
        return response.data;
    },

    getClientRides: async () => {
        const response = await api.get('/rides/client');
        return response.data;
    },

    updateRideStatus: async (rideId: number, status: string) => {
        const response = await api.put(`/rides/${rideId}/status?status=${status}`);
        return response.data;
    },

    rateRide: async (rideId: number, rating: number, comment?: string) => {
        const response = await api.put(`/rides/${rideId}/rating`, { rating, comment });
        return response.data;
    }
};
