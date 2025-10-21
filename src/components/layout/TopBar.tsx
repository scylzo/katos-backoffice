import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const TopBar: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Backoffice Katos Construction
          </h2>
        </div>

        <div className="flex items-center space-x-6">
          <button className="relative p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 group">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-2 hover:from-gray-100 hover:to-gray-150 transition-all duration-300 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                {user?.name}
              </span>
              <span className="text-xs text-gray-500">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};