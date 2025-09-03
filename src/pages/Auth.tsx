import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

type AuthMode = 'login' | 'register';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn, signUp } = useAuthContext();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (mode === 'login') {
        await signIn(email, password);
        navigate('/');
      } else {
        await signUp(email, password);
        // Tampilkan pesan konfirmasi email
        setError('Silakan periksa email Anda untuk konfirmasi pendaftaran.');
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat autentikasi');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        {mode === 'login' ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
      </h1>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        {mode === 'login' ? (
          <p>
            Belum punya akun?{' '}
            <button
              onClick={() => setMode('register')}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              Daftar di sini
            </button>
          </p>
        ) : (
          <p>
            Sudah punya akun?{' '}
            <button
              onClick={() => setMode('login')}
              className="text-blue-600 hover:underline focus:outline-none"
            >
              Masuk di sini
            </button>
          </p>
        )}
      </div>
    </div>
  );
}