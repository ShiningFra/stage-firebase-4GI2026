'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    role: 'CLIENT' as 'CLIENT' | 'CHAUFFEUR'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.signup(formData);
      if (formData.role === 'CHAUFFEUR') {
        router.push('/chauffeur/dashboard');
      } else {
        router.push('/client/dashboard');
      }
    } catch (err) {
      setError('Erreur lors de l\'inscription');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Inscription</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="fullName" className="label">
              Nom complet
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="input"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="label">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="label">
              Numéro de téléphone
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              className="input"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="role" className="label">
              Rôle
            </label>
            <select
              id="role"
              name="role"
              required
              className="input"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="CLIENT">Client</option>
              <option value="CHAUFFEUR">Chauffeur</option>
            </select>
          </div>
          <div>
            <button type="submit" className="btn btn-primary w-full">
              S'inscrire
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <Link href="/login" className="text-blue-600 hover:text-blue-800">
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
