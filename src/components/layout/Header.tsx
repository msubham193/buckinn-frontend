import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Header: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 lg:left-64 z-10">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex-1 min-w-0 lg:ml-4">
          <h1 className="text-xl font-semibold text-gray-800 truncate">
            eBook Admin Portal
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          {/* User Profile */}
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center mr-2">
              <User size={16} />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700">Admin</p>
              <p className="text-xs text-gray-500">{user?.phoneNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;