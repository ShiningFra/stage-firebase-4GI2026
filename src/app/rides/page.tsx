import RidesList from '@/components/customer/rides/RidesList';

export default function RidesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Published Rides</h1>
            <RidesList />
        </div>
    );
}
