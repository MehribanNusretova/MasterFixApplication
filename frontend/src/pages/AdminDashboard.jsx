import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import { 
  Users, 
  Wrench, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit, 
  BarChart3, 
  UserCheck, 
  UserX,
  PlusCircle,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { validators, mapBackendErrors } from '../utils/validators';

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [masters, setMasters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Category Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [catRes, userRes, masterRes] = await Promise.all([
        apiService.getCategories(),
        apiService.getAllUsers(),
        apiService.getMasters({ size: 100 })
      ]);
      setCategories(catRes.data);
      setUsers(userRes.data);
      setMasters(masterRes.data.content || []);
    } catch (error) {
      console.error('Admin datası yüklenirken xeta:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Frontend Validation
    const validationErrors = validators.category(categoryForm);
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    try {
      if (editingCategory) {
        await apiService.updateCategory(editingCategory.id, categoryForm);
      } else {
        await apiService.createCategory(categoryForm);
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '' });
      fetchAdminData();
    } catch (error) {
      console.log("Backend validation errors:", error.response?.data);
      setErrors(mapBackendErrors(error.response?.data));
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Bu kateqoriyanı silmək istədiyinizə əminsiniz?')) {
      try {
        await apiService.deleteCategory(id);
        fetchAdminData();
      } catch (error) {
        alert('Kateqoriya silinərkən xəta baş verdi');
      }
    }
  };

  const stats = [
    { label: 'Cəmi İstifadəçi', value: users.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Aktiv Ustalar', value: masters.length, icon: Wrench, color: 'text-primary-accent', bg: 'bg-primary-accent/10' },
    { label: 'Kateqoriyalar', value: categories.length, icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-primary-accent" size={40} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold">Admin Paneli</h1>
        <p className="text-gray-400">Sistemin ümumi vəziyyəti və idarəetmə</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 flex items-center gap-6 border-glass-border">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl border border-white/5`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Category Management */}
        <section className="glass-card p-8 space-y-6 border-glass-border shadow-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="text-primary-accent" />
              Kateqoriyalar
            </h2>
            <button 
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ name: '', description: '' });
                setErrors({});
                setIsModalOpen(true);
              }}
              className="bg-primary-accent hover:bg-primary-light text-white p-2.5 rounded-xl transition-all shadow-lg active:scale-90"
            >
              <Plus size={22} />
            </button>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-5 bg-glass-hover rounded-2xl group transition-all border border-transparent hover:border-primary-accent/30">
                <div>
                  <h3 className="font-bold text-white">{cat.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1 italic">"{cat.description}"</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setEditingCategory(cat);
                      setCategoryForm({ name: cat.name, description: cat.description });
                      setErrors({});
                      setIsModalOpen(true);
                    }}
                    className="p-2.5 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-colors border border-blue-500/20"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors border border-red-500/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* User Management */}
        <section className="glass-card p-8 space-y-6 border-glass-border shadow-2xl">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="text-primary-accent" />
            Sistem İstifadəçiləri
          </h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-glass-hover rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-primary-accent/10 text-primary-accent rounded-xl border border-primary-accent/20 flex items-center justify-center font-black">
                    {user.firstName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{user.firstName} {user.lastName}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{user.email}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 
                  user.role === 'MASTER' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass-card w-full max-w-md p-8 space-y-8 animate-in zoom-in-95 duration-300 relative border-glass-border shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black tracking-tight">{editingCategory ? 'Kateqoriyanı Yenilə' : 'Yeni Kateqoriya'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-2 bg-glass-hover rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Kateqoriya Adı</label>
                <input 
                  type="text" 
                  className={`w-full bg-primary-light/20 border ${errors.name ? 'border-red-500' : 'border-glass-border'} rounded-xl px-4 py-3 outline-none focus:border-primary-accent transition-all font-medium`}
                  value={categoryForm.name}
                  onChange={(e) => {
                      setCategoryForm({...categoryForm, name: e.target.value});
                      if (errors.name) setErrors(prev => ({...prev, name: null}));
                  }}
                />
                {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Təsvir</label>
                <textarea 
                  className={`w-full bg-primary-light/20 border ${errors.description ? 'border-red-500' : 'border-glass-border'} rounded-xl px-4 py-3 h-32 outline-none focus:border-primary-accent transition-all resize-none font-medium`}
                  value={categoryForm.description}
                  onChange={(e) => {
                      setCategoryForm({...categoryForm, description: e.target.value});
                      if (errors.description) setErrors(prev => ({...prev, description: null}));
                  }}
                ></textarea>
                {errors.description && <p className="text-[10px] text-red-500 font-bold uppercase ml-1">{errors.description}</p>}
              </div>

              <button 
                type="submit"
                className="w-full bg-primary-accent hover:bg-primary-light text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary-accent/20 active:scale-95 transition-all"
              >
                {editingCategory ? 'Dəyişiklikləri Saxla' : 'Kateqoriya Yarat'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
