'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      router.push('/login');
    } else {
      if (userRole === 'CHAUFFEUR') {
        router.push('/chauffeur/dashboard');
      } else if (userRole === 'CLIENT') {
        router.push('/client/dashboard');
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="text-center text-white p-8 rounded-xl bg-white/10 backdrop-blur-md">
        <div className="mb-8">
          <Image
            src="/img/vehicleLogo.png"
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4">Transport App</h1>
        <div className="flex justify-center items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
