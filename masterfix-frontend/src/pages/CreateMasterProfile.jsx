import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, DollarSign, BookOpen, CheckCircle, Hammer } from 'lucide-react';
import masterService from '../services/masterService';
import categoryService from '../services/categoryService';
import ErrorMessage from '../components/ErrorMessage';

const CreateMasterProfile = () => {
  const { fetchUser } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: '',
    city: '',
    pricePerHour: '',
    bio: ''
  });
  const [status, setStatus] = useState({ loading: false, error: '' });

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '' });
    try {
      await masterService.create(formData);
      await fetchUser();
      navigate('/profile', { state: { message: 'Master profile created successfully!' } });
    } catch (error) {
      setStatus({ loading: false, error: error.response?.data?.message || 'Creation failed' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl mb-6 shadow-xl shadow-indigo-500/20">
          <Hammer className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Become a Professional</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">Share your skills and start earning with MasterFix.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <form onSubmit={handleSubmit} className="space-y-8">
          <ErrorMessage message={status.error} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Service Category</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  name="categoryId"
                  required
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white appearance-none transition-all"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Your City</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="e.g. Baku"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Hourly Rate (₼)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  name="pricePerHour"
                  required
                  placeholder="e.g. 25"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Professional Bio</label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
              <textarea
                name="bio"
                required
                rows="5"
                placeholder="Describe your experience and why clients should choose you..."
                value={formData.bio}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all resize-none"
              ></textarea>
            </div>
          </div>

          <div className="pt-4">
             <button
               type="submit"
               disabled={status.loading}
               className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-[1.5rem] font-extrabold text-lg transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center space-x-3"
             >
               {status.loading ? (
                 <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
               ) : (
                 <>
                   <CheckCircle className="w-6 h-6" />
                   <span>Launch My Profile</span>
                 </>
               )}
             </button>
             <p className="text-center text-sm text-slate-500 mt-6">By launching, you agree to our Professional Terms of Service.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMasterProfile;
