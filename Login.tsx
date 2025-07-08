
import React, { useState } from 'react';
import { databaseService } from '../services/databaseService';

interface LoginProps {
  onLogin: (id: string, name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!id.trim() || !name.trim()) {
      setError('Both Unique ID and Name are required.');
      return;
    }
    if (/\s/.test(id)) {
        setError('Unique ID cannot contain spaces.');
        return;
    }

    const existingUser = databaseService.getUserById(id.trim());
    if (existingUser && existingUser.name.toLowerCase() !== name.trim().toLowerCase()) {
        setError(`ID "${id.trim()}" is already taken by another user.`);
        return;
    }

    onLogin(id.trim(), name.trim());
  };

  return (
    <div className="flex items-center justify-center h-screen bg-wa-dark-green">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome to Funtelligent Chat</h2>
            <p className="mt-2 text-gray-600">Create your identity to start chatting.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="user-id" className="sr-only">Unique ID</label>
              <input
                id="user-id"
                name="id"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-wa-light-green focus:border-wa-light-green focus:z-10 sm:text-sm"
                placeholder="Unique ID (e.g., john-doe)"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="user-name" className="sr-only">Your Name</label>
              <input
                id="user-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-wa-light-green focus:border-wa-light-green focus:z-10 sm:text-sm"
                placeholder="Your Display Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-wa-light-green hover:bg-wa-teal-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wa-teal-green transition-colors"
            >
              Start Chatting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;