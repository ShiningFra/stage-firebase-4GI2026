import { useState, useEffect } from 'react';

interface User {
    id: number;
    email: string;
    fullName: string;
    role: string;
}

export function useAuthState() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (e) {
                console.error('Error parsing user data:', e);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        
        setLoading(false);

        // Listen for storage events (login/logout in other tabs)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token') {
                if (!e.newValue) {
                    setUser(null);
                } else {
                    const userData = localStorage.getItem('user');
                    if (userData) {
                        try {
                            setUser(JSON.parse(userData));
                        } catch (e) {
                            console.error('Error parsing user data:', e);
                        }
                    }
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    return {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    };
}
