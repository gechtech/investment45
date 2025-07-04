import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Package, FileText } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: User, label: 'My', path: '/profile' },
    { icon: Package, label: 'Product', path: '/invest' },
    { icon: FileText, label: 'My Order', path: '/orders' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
      <div className="grid grid-cols-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center py-3 px-2 transition-colors ${
              isActive(item.path)
                ? 'text-yellow-600 bg-yellow-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;