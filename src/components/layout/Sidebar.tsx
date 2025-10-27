import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingBag, Settings, LogOut, Building2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useLayout } from '../../hooks/useLayout';
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
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useLayout();

  const handleLogout = () => {
    logout();
  };

  // Close mobile menu when clicking on a link
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col h-screen shadow-lg",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ backgroundColor: '#2B2E83' }}
      >
        {/* Logo section */}
        <div className="flex items-center justify-center h-14 sm:h-16 px-4" style={{ backgroundColor: '#1F2161' }}>
          <img src={logo} alt="Katos Construction" className="h-8 sm:h-10 w-auto" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                cn(
                  'group flex items-center px-3 py-2.5 sm:py-2 text-sm font-medium rounded-lg transition-colors touch-manipulation',
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-white/80 hover:text-white'
                )
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? '#E95E2D' : 'transparent'
              })}
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout section */}
        <div className="px-3 sm:px-4 pb-4 sm:pb-6 border-t border-white/20">
          <button
            onClick={() => {
              handleLogout();
              handleLinkClick();
            }}
            className="w-full flex items-center px-3 py-2.5 sm:py-2 mt-4 text-sm font-medium text-white/80 rounded-lg hover:text-white transition-colors touch-manipulation"
          >
            <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="truncate">Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
};