'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminLogin() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const isLoggedIn = localStorage.getItem('jptech-admin');
    if (isLoggedIn) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple auth - in production use proper authentication
    if (email === 'admin@jptech.rw' && password === 'JPTech2024!') {
      localStorage.setItem('jptech-admin', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials. Use admin@jptech.rw / JPTech2024!');
    }
  };

  return (
    <LanguageProvider>
      <CartProvider>
        <div className="min-h-screen bg-beige flex items-center justify-center py-12">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={() => router.back()}
              className="absolute top-4 left-4 border-t border-b border-l-0 border-r-0 ml-4 mr-1 bg-transparent text-gray-600 p-1 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-2xl font-bold mb-6 text-center">{t('admin.login')}</h1>

            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                required
              />
              <button type="submit" className="w-full btn-primary">
                Sign In
              </button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-4">
              Demo: admin@jptech.rw / JPTech2024!
            </p>
          </div>
        </div>
      </CartProvider>
    </LanguageProvider>
  );
}