import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Save, Shield, UserCircle } from 'lucide-react';
import userService from '../services/userService';
import ErrorMessage from '../components/ErrorMessage';

const Profile = () => {
  const { user, fetchUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  const [status, setStatus] = useState({ loading: false, success: '', error: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: '', error: '' });
    try {
      await userService.updateMe(formData);
      await fetchUser();
      setStatus({ loading: false, success: 'Profile updated successfully!', error: '' });
    } catch (error) {
      setStatus({ loading: false, success: '', error: error.response?.data?.message || 'Update failed' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 text-center">
            <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-slate-700 shadow-sm">
              <UserCircle className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.fullName}</h2>
            <p className="text-sm text-slate-500">{user?.role}</p>
          </div>
          
          <nav className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
             <button className="w-full text-left px-6 py-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold border-l-4 border-indigo-600">
               Personal Info
             </button>
             <button className="w-full text-left px-6 py-4 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
               Security
             </button>
             <button className="w-full text-left px-6 py-4 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
               Notifications
             </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-grow space-y-6">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Profile Settings</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <ErrorMessage message={status.error} />
              {status.success && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                  {status.success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      disabled
                      value={formData.email}
                      className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={status.loading}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center space-x-2"
                >
                  {status.loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 flex items-start space-x-4">
             <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm text-indigo-600">
               <Shield className="w-6 h-6" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Privacy Matters</h3>
               <p className="text-sm text-slate-600 dark:text-slate-400">Your profile information is only shared with masters once you confirm a booking. We never share your email without your consent.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
