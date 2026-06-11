import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Settings, AlertCircle, Check } from 'lucide-react';
import categoryService from '../services/categoryService';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [editCat, setEditCat] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setStatus({ loading: true, error: '' });
    try {
      await categoryService.create({ name: newCatName });
      setNewCatName('');
      fetchCategories();
      setStatus({ loading: false, error: '' });
    } catch (error) {
      setStatus({ loading: false, error: error.response?.data?.message || 'Creation failed' });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editCat.name.trim()) return;
    setStatus({ loading: true, error: '' });
    try {
      await categoryService.update(editCat.id, { name: editCat.name });
      setEditCat(null);
      fetchCategories();
      setStatus({ loading: false, error: '' });
    } catch (error) {
      setStatus({ loading: false, error: error.response?.data?.message || 'Update failed' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This will affect masters in this category.")) return;
    try {
      await categoryService.delete(id);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Manage Categories</h1>
          <p className="text-slate-500 dark:text-slate-400">Add, edit or remove service categories.</p>
        </div>
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl text-indigo-600 dark:text-indigo-400">
          <Settings className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm sticky top-24">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Add New Category</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <ErrorMessage message={status.error} />
              <input
                type="text"
                placeholder="Category name..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"
              />
              <button
                type="submit"
                disabled={status.loading}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create</span>
              </button>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          {loading ? <Loading /> : (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Name</th>
                    <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        {editCat?.id === cat.id ? (
                          <form onSubmit={handleUpdate} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editCat.name}
                              onChange={(e) => setEditCat({...editCat, name: e.target.value})}
                              className="px-3 py-1 bg-white dark:bg-slate-900 border border-indigo-500 rounded-lg outline-none dark:text-white"
                              autoFocus
                            />
                            <button type="submit" className="text-emerald-500 hover:bg-emerald-50 p-1 rounded-lg">
                              <Check className="w-5 h-5" />
                            </button>
                            <button type="button" onClick={() => setEditCat(null)} className="text-red-500 hover:bg-red-50 p-1 rounded-lg">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </form>
                        ) : (
                          <span className="font-medium text-slate-900 dark:text-white">{cat.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => setEditCat(cat)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(cat.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {categories.length === 0 && (
                <div className="p-10 text-center text-slate-500">No categories found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
