'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

const rwandaDistricts = [
  'Gasabo', 'Kicukiro', 'Nyarugenge', 'Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana',
  'Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo', 'Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe',
  'Nyanza', 'Nyaruguru', 'Ruhango', 'Karongi', 'Ngororero', 'Nyabihu', 'Rubavu', 'Rusizi', 'Rutsiro'
];

interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  district: string;
  sector: string;
  address: string;
  password: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { user, login, signup, googleLogin, logout, isLoading } = useUser();
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    phone: '',
    district: '',
    sector: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        district: formData.district,
        sector: formData.sector,
        address: formData.address,
        password: formData.password,
      });
      setSuccess('Account created successfully! Welcome to JPTech.');
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(loginData.email, loginData.password);
      setSuccess('Logged in successfully!');
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await googleLogin();
      // Redirect will happen automatically via NextAuth
    } catch (error) {
      setError('Google authentication failed. Please try again or use email signup.');
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-beige pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-3xl font-bold text-black mb-6">My Profile</h1>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-black">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-black">{user.name}</h2>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-beige p-4 rounded-lg">
                  <h3 className="font-semibold text-black mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Email:</span> {user.email}</p>
                    {user.phone && <p><span className="font-medium">Phone:</span> {user.phone}</p>}
                  </div>
                </div>

                <div className="bg-beige p-4 rounded-lg">
                  <h3 className="font-semibold text-black mb-2">Delivery Address</h3>
                  <div className="space-y-2 text-sm">
                    {user.district && <p><span className="font-medium">District:</span> {user.district}</p>}
                    {user.sector && <p><span className="font-medium">Sector:</span> {user.sector}</p>}
                    {user.address && <p><span className="font-medium">Address:</span> {user.address}</p>}
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-black mb-2">
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-gray-600">
                {isSignup
                  ? 'Join JPTech for the best technology experience'
                  : 'Sign in to your JPTech account'
                }
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
                {success}
              </div>
            )}

            {!isSignup ? (
              // Login Form
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Password</label>
                  <input
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gold text-black py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            ) : (
              // Signup Form
              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="+250 XXX XXX XXX"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">District</label>
                    <select
                      required
                      value={formData.district}
                      onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    >
                      <option value="">Select District</option>
                      {rwandaDistricts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Sector</label>
                    <input
                      type="text"
                      value={formData.sector}
                      onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="Enter sector"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Delivery Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                    placeholder="Enter your delivery address"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Password</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="Create password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gold text-black py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}

            {/* Google Sign Up */}
            <div className="mt-6">
              <button
                onClick={handleGoogleSignup}
                className="w-full bg-white border-2 border-gray-300 text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>

            {/* Toggle between login/signup */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError('');
                  setSuccess('');
                }}
                className="text-gold hover:text-black transition-colors font-medium"
              >
                {isSignup
                  ? 'Already have an account? Sign in'
                  : 'Need an account? Create one'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}