import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        authService.logout();
        router.push('/login');
    };

    return (
        <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 font-medium"
        >
            Logout
        </button>
    );
}
