import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, X, SlidersHorizontal } from 'lucide-react';
import masterService from '../services/masterService';
import categoryService from '../services/categoryService';
import MasterCard from '../components/MasterCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

const Masters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [masters, setMasters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cats = await categoryService.getAll();
        setCategories(cats);

        let data;
        const catId = searchParams.get('categoryId');
        const cityName = searchParams.get('city');

        if (catId) {
          data = await masterService.getByCategory(catId);
        } else if (cityName) {
          data = await masterService.getByCity(cityName);
        } else {
          data = await masterService.getAll();
        }
        setMasters(data);
      } catch (error) {
        console.error("Error fetching masters:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  const handleFilter = () => {
    const params = {};
    if (selectedCategory) params.categoryId = selectedCategory;
    if (city) params.city = city;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setCity('');
    setSelectedCategory('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Find Your Master</h1>
          <p className="text-slate-500 dark:text-slate-400">Discover top-rated professionals for any task.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative min-w-[200px]">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="City (e.g. Baku)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"
            />
          </div>
          
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white appearance-none transition-all"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={handleFilter}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            Apply
          </button>
          
          {(city || selectedCategory) && (
            <button 
              onClick={clearFilters}
              className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              title="Clear Filters"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {loading ? <Loading /> : (
        <>
          {masters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {masters.map(master => (
                <MasterCard key={master.id} master={master} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No masters found" 
              message="Try adjusting your filters to find what you're looking for." 
              icon={Search}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Masters;
