import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingBag, Settings, LogOut, Building2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/cn';
import logo from '../../assets/logo.png';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Projets', href: '/projects', icon: Building2 },
  { name: 'Boutique', href: '/boutique', icon: ShoppingBag },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col w-64 h-screen shadow-lg" style={{backgroundColor: '#2B2E83'}}>
      <div className="flex items-center justify-center h-16 px-4" style={{backgroundColor: '#1F2161'}}>
        <img src={logo} alt="Katos Construction" className="h-10 w-auto" />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'text-white shadow-md'
                  : 'text-white/80 hover:text-white'
              )
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#E95E2D' : 'transparent'
            })}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-6 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 mt-4 text-sm font-medium text-white/80 rounded-lg hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};