import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Loader2, Leaf } from 'lucide-react';

interface AuthProps {
  onLogin: (user: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Simple Login: Check matching username and password
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('name', username)
          .eq('password', password)
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error('Invalid username or password');
        
        onLogin(data);
      } else {
        // Sign Up: Check if user exists first
        const { data: existing, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('name', username)
          .maybeSingle();

        if (checkError) throw checkError;
        if (existing) throw new Error('Username already taken');

        // Create new user
        const { data, error } = await supabase
          .from('users')
          .insert({ name: username, password })
          .select()
          .single();

        if (error) throw error;
        onLogin(data);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-oleum-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 border border-oleum-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-oleum-500 p-3 rounded-full mb-3 shadow-lg shadow-oleum-200">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-oleum-900 tracking-tight">Oleum</h1>
          <p className="text-oleum-600">Supply Chain Management</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-oleum-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-oleum-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-oleum-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-oleum-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-oleum-600 hover:bg-oleum-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center shadow-md shadow-oleum-200"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "New to Oleum? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-oleum-600 hover:text-oleum-800 font-semibold"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};