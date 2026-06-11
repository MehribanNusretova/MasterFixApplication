import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hammer, User, LogOut, Heart, Calendar, Briefcase, Settings, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Hammer className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                MasterFix
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/masters" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium px-3 py-2">
              Masters
            </Link>
            
            <ThemeToggle />

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/favorites" className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <Heart className="w-5 h-5" />
                </Link>
                <Link to="/my-bookings" className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <Calendar className="w-5 h-5" />
                </Link>
                
                {user.role === 'MASTER' && (
                  <Link to="/master-bookings" className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <Briefcase className="w-5 h-5" />
                  </Link>
                )}

                {user.role === 'ADMIN' && (
                  <Link to="/admin/categories" className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <Settings className="w-5 h-5" />
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center space-x-2 p-1 pl-2 border border-slate-200 dark:border-slate-700 rounded-full hover:shadow-sm transition-all">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{user.fullName}</span>
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Profile</Link>
                    {user.role === 'USER' && (
                       <Link to="/create-master-profile" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Become a Master</Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-medium">
                  Login
                </Link>
                <Link to="/register" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-md shadow-indigo-200 dark:shadow-none">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg text-slate-600 dark:text-slate-300">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-5 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/masters" className="block px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Masters</Link>
            {user && (
              <>
                <Link to="/favorites" className="block px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Favorites</Link>
                <Link to="/my-bookings" className="block px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">My Bookings</Link>
                <Link to="/profile" className="block px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">Profile</Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">Logout</button>
              </>
            )}
            {!user && (
              <div className="pt-4 flex flex-col space-y-2 px-3">
                <Link to="/login" className="px-4 py-2 text-center border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300">Login</Link>
                <Link to="/register" className="px-4 py-2 text-center bg-indigo-600 text-white rounded-lg">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
