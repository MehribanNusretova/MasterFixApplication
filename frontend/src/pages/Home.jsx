import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../api/apiService';
import { 
  Zap, Droplets, Snowflake, Monitor, Armchair, Paintbrush, Brush, Flame,
  ArrowRight, Star, Users, Loader2, Wrench, ChevronRight
} from 'lucide-react';

// Statik fallback datası
const fallbackCategories = [
  { id: 1, name: 'Elektrik ustası', description: 'Elektrik montajı və təmiri xidmətləri' },
  { id: 2, name: 'Santexnik', description: 'Su boruları və santexnika quraşdırılması' },
  { id: 3, name: 'Kondisioner', description: 'Kondisionerlərin təmiri və quraşdırılması' },
  { id: 4, name: 'Kompüter təmiri', description: 'Noutbuk və fərdi kompüterlərin təmiri' },
  { id: 5, name: 'Mebel ustası', description: 'Mebellərin yığılması və bərpası' },
  { id: 6, name: 'Rəngsaz', description: 'Daxili və xarici boya işləri' },
  { id: 7, name: 'Təmizlik xidməti', description: 'Ev və ofis təmizliyi xidmətləri' },
  { id: 8, name: 'Kombi ustası', description: 'İstilik sistemləri və kombi təmiri' },
];

const categoryConfig = {
  'Elektrik': { emoji: '⚡', color: 'from-yellow-400 to-orange-500' },
  'Santexnik': { emoji: '🚿', color: 'from-blue-400 to-cyan-500' },
  'Kondisioner': { emoji: '❄️', color: 'from-cyan-300 to-blue-500' },
  'Kompüter': { emoji: '💻', color: 'from-indigo-400 to-purple-600' },
  'Mebel': { emoji: '🪑', color: 'from-orange-400 to-red-600' },
  'Rəngsaz': { emoji: '🎨', color: 'from-pink-400 to-rose-600' },
  'Təmizlik': { emoji: '🧹', color: 'from-green-400 to-emerald-600' },
  'Kombi': { emoji: '🔥', color: 'from-red-400 to-orange-600' }
};

const getLogoDetails = (name) => {
  const key = Object.keys(categoryConfig).find(k => name.includes(k));
  return categoryConfig[key] || { emoji: '🛠️', color: 'from-gray-400 to-gray-600' };
};

const Home = () => {
  const [featuredMasters, setFeaturedMasters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [masterRes, catRes] = await Promise.all([
          apiService.getMasters({ size: 4 }),
          apiService.getCategories()
        ]);
        setFeaturedMasters(masterRes.data.content || []);
        
        // API-den data gelirse onu, gelmezse fallback-i islet
        if (catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data);
        } else {
          setCategories(fallbackCategories);
        }
      } catch (error) {
        console.error('Data yuklenirken xeta, statik dataya kecid edilir:', error);
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[450px] rounded-[2.5rem] overflow-hidden bg-master-gradient flex items-center px-8 md:px-16 shadow-2xl border border-glass-border">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop')] opacity-15 bg-cover bg-center"></div>
        <div className="relative z-10 max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary-accent/20 text-primary-accent px-4 py-2 rounded-full text-sm font-bold border border-primary-accent/30 animate-pulse">
            <Star size={16} className="fill-current" /> Yeni: Premium Ustalar Siyahısı
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tighter">
            Eviniz üçün <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-accent to-accent-pink">Peşəkar</span> Həllər
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-lg">
            MasterFix ilə ən yaxşı ustaları tapın, rəyləri oxuyun və bir toxunuşla sifariş edin.
          </p>
          <button 
            onClick={() => navigate('/masters')}
            className="group bg-primary-accent hover:bg-primary-light text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-primary-accent/20"
          >
            Usta Tap <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="space-y-10">
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">Populyar Kateqoriyalar</h2>
          <p className="text-gray-500 font-medium italic">Ehtiyacınız olan xidməti seçin</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {loading ? (
            // Skeleton Loader
            [...Array(8)].map((_, i) => (
              <div key={i} className="glass-card h-64 animate-pulse border-glass-border"></div>
            ))
          ) : (
            categories.map((cat) => {
              const details = getLogoDetails(cat.name);
              return (
                <div
                  key={cat.id}
                  className="group relative glass-card p-8 flex flex-col items-center md:items-start text-center md:text-left gap-6 hover:border-primary-accent/50 transition-all duration-500 cursor-pointer overflow-hidden border-glass-border"
                >
                  {/* Background Glow */}
                  <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${details.color} opacity-0 group-hover:opacity-10 blur-3xl rounded-full transition-opacity duration-500`}></div>
                  
                  {/* Icon Box */}
                  <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-tr ${details.color} flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 transition-transform duration-500 ring-8 ring-white/5`}>
                    {details.emoji}
                  </div>

                  <div className="space-y-3 relative z-10 flex-1">
                    <h3 className="text-xl font-bold tracking-tight group-hover:text-primary-accent transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 font-medium">
                      {cat.description || `${cat.name} sahəsində ixtisaslaşmış peşəkar ustalarımız xidmətinizdədir.`}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/masters?categoryId=${cat.id}`)}
                    className="w-full py-3 bg-glass-hover hover:bg-primary-accent text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all group/btn border border-white/5"
                  >
                    Ustaları gör <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Featured Masters */}
      <section className="space-y-8 pb-20">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Önə Çıxan Ustalar</h2>
            <p className="text-gray-500 font-medium">Ən yüksək reytinqli peşəkarlar</p>
          </div>
          <button onClick={() => navigate('/masters')} className="text-primary-accent hover:underline font-bold text-sm tracking-wide">HAMISINA BAX</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredMasters.map((master) => (
            <div key={master.id} className="glass-card overflow-hidden group hover:border-primary-accent/50 transition-all flex flex-col border-glass-border">
              <div className="h-56 bg-glass-hover relative overflow-hidden">
                <img 
                  src={master.profileImageUrl ? `/api${master.profileImageUrl}` : 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop'} 
                  alt={master.fullName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-2xl flex items-center gap-1.5 border border-white/10">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-black">{master.averageRating || 'YENİ'}</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-primary-accent/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tighter shadow-lg">
                  {master.categoryName}
                </div>
              </div>
              <div className="p-8 space-y-6 flex-1 flex flex-col">
                <div className="space-y-1">
                  <h3 className="font-bold text-xl group-hover:text-primary-accent transition-colors">{master.fullName}</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <Users size={14} className="text-primary-accent" />
                    <span>{master.completedJobs} tamamlanmış iş</span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-4 border-y border-glass-border">
                  <span className="text-gray-400 text-xs font-bold uppercase">Xidmət</span>
                  <span className="text-white font-black text-lg">{master.priceFrom}₼-dan</span>
                </div>
                <button 
                  onClick={() => navigate(`/masters/${master.id}`)}
                  className="w-full py-4 bg-glass-hover hover:bg-primary-accent rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 border border-white/5 shadow-lg"
                >
                  Profilə bax
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
