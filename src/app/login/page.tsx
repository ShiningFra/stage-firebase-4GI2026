'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const { token } = await authService.login({ email, password }); // Assurez-vous que le token est renvoyé
        localStorage.setItem('authToken', token); // Stockez le token dans localStorage
        const userRole = localStorage.getItem('userRole');
        if (userRole === 'CHAUFFEUR') {
            router.push('/chauffeur/dashboard');
        } else {
            router.push('/client/dashboard');
        }
    } catch (err) {
        setError('Email ou mot de passe incorrect');
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Connexion</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="label">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" className="btn btn-primary w-full">
              Se connecter
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <Link href="/signup" className="text-blue-600 hover:text-blue-800">
            Pas encore de compte ? S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}
