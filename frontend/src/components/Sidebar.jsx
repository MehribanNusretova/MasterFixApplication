import React from 'react';
import { 
  Home, 
  Search, 
  Calendar, 
  Heart, 
  User, 
  Settings, 
  LogOut, 
  PlusCircle,
  BarChart3
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Ana Səhifə', path: '/' },
    { icon: Search, label: 'Ustalar', path: '/masters' },
    { icon: Calendar, label: 'Sifarişlərim', path: '/my-bookings' },
    { icon: Heart, label: 'Sevimlilər', path: '/favorites' },
    { icon: User, label: 'Profilim', path: '/profile' },
  ];

  if (user?.role === 'MASTER') {
    menuItems.push({ icon: PlusCircle, label: 'Usta Paneli', path: '/master-dashboard' });
  }

  if (user?.role === 'ADMIN') {
    menuItems.push({ icon: BarChart3, label: 'Admin', path: '/admin-dashboard' });
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 lg:w-64 glass-card m-4 hidden md:flex flex-col py-8 z-50">
      <div className="flex items-center gap-3 px-6 mb-12">
        <div className="w-10 h-10 bg-primary-accent rounded-xl flex items-center justify-center font-bold text-xl">
          M
        </div>
        <span className="text-xl font-bold hidden lg:block tracking-wider">MasterFix</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
              ${isActive 
                ? 'bg-primary-accent text-white shadow-lg shadow-primary-accent/30' 
                : 'text-gray-400 hover:bg-glass-hover hover:text-white'}
            `}
          >
            <item.icon size={22} />
            <span className="font-medium hidden lg:block">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300"
        >
          <LogOut size={22} />
          <span className="font-medium hidden lg:block">Çıxış</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
