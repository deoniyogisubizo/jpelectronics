'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const isLoggedIn = localStorage.getItem('jptech-admin');
    if (isLoggedIn) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check passcode
    if (passcode === '0000') {
      localStorage.setItem('jptech-admin', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid passcode');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative">
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 border-t border-b border-l-0 border-r-0 ml-4 mr-1 bg-transparent text-gray-600 p-1 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JP Tech Admin</h1>
          <p className="text-gray-600">Enter passcode to access admin portal</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="passcode" className="block text-sm font-medium text-gray-700 mb-2">
              Passcode
            </label>
            <input
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
              placeholder="••••"
              maxLength={4}
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || passcode.length !== 4}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Verifying...' : 'Enter Admin Portal'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Authorized personnel only</p>
        </div>
      </div>
    </div>
  );
}