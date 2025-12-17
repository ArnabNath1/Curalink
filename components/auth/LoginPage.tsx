import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { Page } from '../../types';
import Spinner from '../shared/Spinner';

const LoginPage: React.FC = () => {
  const { login, authError, setCurrentPage } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-brand-dark mb-6">Log In to CuraLink</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-brand-dark"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm bg-white text-brand-dark"
              placeholder="••••••••"
            />
          </div>
          {authError && <p className="text-red-500 text-sm">{authError}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading && <Spinner />}
            Log In
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          No account?{' '}
          <button onClick={() => setCurrentPage(Page.LANDING)} className="font-medium text-brand-primary hover:underline">
            Sign up
          </button>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;