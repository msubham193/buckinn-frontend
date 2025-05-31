import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        toggleMobileSidebar={toggleMobileSidebar} 
      />
      <div className="lg:ml-64">
        <Header />
        <main className="p-4 md:p-6 pt-20 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;