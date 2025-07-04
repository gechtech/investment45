import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Gift, 
  Banknote, 
  MessageCircle, 
  Lock, 
  RotateCcw, 
  LogOut,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { icon: Gift, label: 'Gift', path: '/gift' },
    { icon: Banknote, label: 'Bank Account', path: '/bank' },
    { icon: MessageCircle, label: 'Telegram @GechTec', path: '/telegram' },
    { icon: Lock, label: 'Change Password', path: '/change-password' },
    { icon: RotateCcw, label: 'Reset Password', path: '/reset-password' },
  ];

  return (
    <aside className="fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 z-30 transform -translate-x-full lg:translate-x-0 transition-transform duration-300">
      <div className="p-6">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-yellow-50 text-yellow-700 border-l-4 border-yellow-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          {/* Admin Link */}
          {user?.isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/admin')
                  ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-500'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Admin Panel</span>
            </Link>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;