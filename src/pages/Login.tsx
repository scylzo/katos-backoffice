import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Mail, Lock, Building2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const success = login(email, password);
    if (!success) {
      toast.error('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Katos Construction
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connexion au backoffice
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@katos.sn"
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              required
            />


            <Button
              type="submit"
              className="w-full"
              size="lg"
            >
              Se connecter
            </Button>

            <div className="text-xs text-gray-500 text-center">
              Compte de test: admin@katos.sn / 1234
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};