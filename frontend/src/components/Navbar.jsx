import React, { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchValue, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate(`/masters?search=${searchValue}`);
    }
  };

  return (
    <header className="h-20 flex items-center justify-between px-8 z-40">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Usta, xidmət və ya şəhər axtar (Enter bas)..."
            className="w-full bg-glass-bg border border-glass-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent/50 transition-all"
            value={searchValue}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => alert('Yeni bildirişiniz yoxdur')}
          className="relative p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary-accent rounded-full border-2 border-[#1a0505]"></span>
        </button>

        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-4 pl-6 border-l border-glass-border cursor-pointer group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white group-hover:text-primary-accent transition-colors">{user?.email?.split('@')[0] || 'Qonaq'}</p>
            <p className="text-xs text-gray-400">{user?.role || 'İstifadəçi'}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-accent to-accent-pink flex items-center justify-center font-bold shadow-lg group-hover:scale-105 transition-transform">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
