import React from 'react';
import { User, Mail, Shield, Settings as SettingsIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';

export const Settings: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header moderne avec glassmorphism */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500"></div>
          <div className="relative p-4 sm:p-6 lg:p-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3 sm:space-x-6">
                <div className="p-2 sm:p-3 lg:p-4 bg-white/15 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-white/10">
                  <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-black" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-black">Paramètres</h1>
                  <p className="text-black/80 text-sm sm:text-base lg:text-lg mt-1 font-medium">Centre de contrôle de votre compte</p>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-right">
                  <p className="text-white/80 text-xs sm:text-sm">Interface Katos</p>
                  <p className="text-white font-semibold text-sm sm:text-base">Version 1.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Profil utilisateur - Design moderne */}
          <Card className="border-0 shadow-lg sm:shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <div className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg sm:rounded-xl shadow-lg">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Profil utilisateur</h2>
              </div>

              {/* Avatar et infos principales - Design moderne */}
              <div className="flex flex-col sm:flex-row items-center sm:space-x-4 lg:space-x-6 p-4 sm:p-6 bg-gradient-to-r from-slate-50 to-white rounded-xl sm:rounded-2xl border border-slate-200/50 shadow-sm space-y-4 sm:space-y-0">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl">
                    <User className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-black" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-1">{user?.name}</h3>
                  <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0">
                    <div className="flex items-center space-x-2 bg-primary-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
                      <span className="text-xs sm:text-sm font-semibold text-primary-700">Administrateur</span>
                    </div>
                    <span className="text-xs sm:text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">En ligne</span>
                  </div>
                </div>
              </div>

              {/* Informations détaillées - Grid moderne */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                <div className="group p-4 sm:p-6 bg-gradient-to-br from-white to-slate-50 border border-slate-200/50 rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                    <div className="p-1.5 sm:p-2 bg-secondary-100 rounded-lg group-hover:bg-secondary-200 transition-colors">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-600" />
                    </div>
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">Adresse email</span>
                  </div>
                  <p className="text-gray-900 font-medium text-base sm:text-lg truncate">{user?.email}</p>
                </div>

                <div className="group p-4 sm:p-6 bg-gradient-to-br from-white to-slate-50 border border-slate-200/50 rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                    <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                    </div>
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">Niveau d'accès</span>
                  </div>
                  <p className="text-gray-900 font-medium text-base sm:text-lg">Super Administrateur</p>
                </div>
              </div>
            </div>
          </Card>


        </div>
      </div>
    </div>
  );
};