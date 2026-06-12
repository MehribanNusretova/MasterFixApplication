import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen flex bg-[#1a0505]">
      <Sidebar />
      <main className="flex-1 md:ml-24 lg:ml-72 flex flex-col min-w-0">
        <Navbar />
        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
