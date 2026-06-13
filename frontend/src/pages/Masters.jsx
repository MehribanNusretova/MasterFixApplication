import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import apiService from '../api/apiService';
import MasterCard from '../components/MasterCard';
import { Filter, Search as SearchIcon, ChevronLeft, ChevronRight, Loader2, X, Wrench, MapPin, AlertCircle } from 'lucide-react';

const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Elektrik ustası' },
  { id: 2, name: 'Santexnik' },
  { id: 3, name: 'Kondisioner' },
  { id: 4, name: 'Kompüter təmiri' },
  { id: 5, name: 'Mebel ustası' },
  { id: 6, name: 'Rəngsaz' },
  { id: 7, name: 'Təmizlik xidməti' },
  { id: 8, name: 'Kombi ustası' },
];

const categoryEmojis = {
  'Elektrik': '⚡',
  'Santexnik': '🚿',
  'Kondisioner': '❄️',
  'Kompüter': '💻',
  'Mebel': '🪑',
  'Rəngsaz': '🎨',
  'Təmizlik': '🧹',
  'Kombi': '🔥'
};

const getCategoryIcon = (name) => {
    const emoji = Object.entries(categoryEmojis).find(([k]) => name.includes(k))?.[1];
    return emoji || '🛠️';
};

const Masters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryIdFromUrl = searchParams.get("categoryId") || "";
  const cityFromUrl = searchParams.get("city") || "";

  const [selectedCategory, setSelectedCategory] = useState(categoryIdFromUrl);
  const [selectedCity, setSelectedCity] = useState(cityFromUrl);
  
  const [masters, setMasters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 0);

  const globalSearch = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(globalSearch);

  useEffect(() => {
    const id = searchParams.get("categoryId") || "";
    const city = searchParams.get("city") || "";
    setSelectedCategory(id);
    setSelectedCity(city);
  }, [searchParams]);

  useEffect(() => {
    const loadCategories = async () => {
      setCatLoading(true);
      try {
        const { data } = await apiService.getCategories();
        setCategories(data && data.length > 0 ? data : FALLBACK_CATEGORIES);
      } catch (error) {
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        setCatLoading(false);
      }
    };

    const loadFavorites = async () => {
      try {
        const { data } = await apiService.getFavorites();
        setFavorites(data.map(f => f.masterId));
      } catch (e) {}
    };

    loadCategories();
    loadFavorites();
  }, []);

  useEffect(() => {
    const fetchMasters = async () => {
      setLoading(true);
      try {
        const params = {
          categoryId: selectedCategory || undefined,
          city: selectedCity || undefined,
          page: currentPage,
          size: 8,
          sortBy: 'id',
          direction: 'desc'
        };
        
        console.log("MASTERS REQUEST PARAMS:", params);
        const response = await apiService.searchMasters(params);
        console.log("MASTERS RESPONSE:", response.data);

        // 2. Response formatini yoxlayiriq
        const data = response.data;
        if (Array.isArray(data)) {
            setMasters(data);
        } else if (data.content) {
            setMasters(data.content);
            setTotalPages(data.totalPages || 0);
        } else if (data.data) {
            setMasters(data.data);
        } else {
            setMasters([]);
        }

        if ((data.content && data.content.length === 0) || (Array.isArray(data) && data.length === 0)) {
            console.log("Masters boş gəldi. Params:", params);
        }

      } catch (error) {
        console.error('Masterler yüklenirken xeta:', error);
        setMasters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMasters();
  }, [selectedCategory, selectedCity, currentPage, globalSearch]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set('categoryId', value);
    else newParams.delete('categoryId');
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setSelectedCity(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set('city', value);
    else newParams.delete('city');
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handleToggleFavorite = async (masterId) => {
    try {
      if (favorites.includes(masterId)) {
        await apiService.removeFavorite(masterId);
        setFavorites(prev => prev.filter(id => id !== masterId));
      } else {
        await apiService.addFavorite(masterId);
        setFavorites(prev => [...prev, masterId]);
      }
    } catch (e) {}
  };

  const filteredMasters = masters.filter(m => 
    m.fullName.toLowerCase().includes(localSearch.toLowerCase()) ||
    m.categoryName.toLowerCase().includes(localSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Peşəkar Ustalar</h1>
          <p className="text-gray-400">
            {selectedCategory ? `${categories.find(c => String(c.id) === selectedCategory)?.name || 'Seçilmiş'} sahəsi üzrə ustalar` : 'Bütün aktiv ustalar'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-accent transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Ad və ya ixtisas..."
              className="w-full bg-glass-bg border border-glass-border rounded-xl py-2.5 pl-11 pr-4 focus:border-primary-accent outline-none transition-all shadow-inner text-white font-medium"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-6">
          <div className="glass-card p-6 space-y-6 sticky top-8 border-glass-border shadow-xl">
            <div className="flex items-center justify-between font-bold text-lg mb-4 text-white">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-primary-accent" />
                Filtrlər
              </div>
              {(selectedCategory || selectedCity) && (
                <button onClick={() => navigate("/masters")} className="text-[10px] uppercase tracking-widest text-primary-accent hover:underline flex items-center gap-1">
                  <X size={12} /> təmizlə
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Xidmət Sahəsi</label>
                <div className="relative">
                  <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-accent/50" size={18} />
                  <select 
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-full bg-primary-light/20 border border-glass-border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-accent appearance-none transition-all font-bold text-white shadow-inner"
                    disabled={catLoading}
                  >
                    <option value="" className="bg-[#1a0505]">Bütün xidmətlər</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={String(cat.id)} className="bg-[#1a0505]">
                        {getCategoryIcon(cat.name)} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Şəhər</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-accent/50" size={18} />
                  <select 
                    value={selectedCity}
                    onChange={handleCityChange}
                    className="w-full bg-primary-light/20 border border-glass-border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary-accent appearance-none transition-all font-bold text-white shadow-inner"
                  >
                    <option value="" className="bg-[#1a0505]">Bütün şəhərlər</option>
                    <option value="Bakı" className="bg-[#1a0505]">Bakı 🇦🇿</option>
                    <option value="Sumqayıt" className="bg-[#1a0505]">Sumqayıt 🏙️</option>
                    <option value="Gəncə" className="bg-[#1a0505]">Gəncə 🏰</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4 text-gray-400">
              <Loader2 className="animate-spin text-primary-accent" size={40} />
              <p className="font-bold uppercase tracking-widest text-xs">Ustalar axtarılır...</p>
            </div>
          ) : filteredMasters.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMasters.map(master => (
                    <MasterCard 
                      key={master.id} 
                      master={master} 
                      isFavorite={favorites.includes(master.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 pt-12">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.set('page', String(i));
                          setSearchParams(newParams);
                          setCurrentPage(i);
                      }}
                      className={`w-12 h-12 rounded-2xl font-black transition-all transform active:scale-90 ${currentPage === i ? 'bg-primary-accent text-white shadow-xl shadow-primary-accent/20' : 'glass-card text-gray-400 hover:text-white hover:border-primary-accent'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="glass-card p-20 text-center space-y-6 border-glass-border shadow-2xl">
              <div className="w-24 h-24 bg-glass-hover rounded-full mx-auto flex items-center justify-center text-gray-600 shadow-inner ring-8 ring-white/5">
                <SearchIcon size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Usta tapılmadı</h3>
                <p className="text-gray-500 font-medium">Bu kriteriyalara uyğun nəticə yoxdur.</p>
              </div>
              <button 
                onClick={() => navigate("/masters")}
                className="bg-primary-accent text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-primary-accent/20 hover:bg-primary-light transition-all active:scale-95 uppercase tracking-widest text-xs"
              >
                Bütün Ustaları Göstər
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Masters;
