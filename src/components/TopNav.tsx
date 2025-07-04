import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowDownToLine, CreditCard, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TopNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-2 rounded-lg">
              <span className="font-bold text-lg">EI</span>
            </div>
            <span className="text-xl font-bold text-gray-900">EthioInvest</span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            <Link
              to="/withdraw"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/withdraw') 
                  ? 'bg-red-100 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span className="hidden sm:inline">Withdraw</span>
            </Link>
            
            <Link
              to="/recharge"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/recharge') 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Recharge</span>
            </Link>
            
            <Link
              to="/team"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/team') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">My Team</span>
            </Link>

            {/* Wallet Balance */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">
                {user?.walletBalance?.toLocaleString() || 0} ETB
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;