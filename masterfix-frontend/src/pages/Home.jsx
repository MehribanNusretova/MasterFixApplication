import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Hammer, Shield, Star, ArrowRight, Zap, Users } from 'lucide-react';
import categoryService from '../services/categoryService';
import masterService from '../services/masterService';
import CategoryCard from '../components/CategoryCard';
import MasterCard from '../components/MasterCard';
import Loading from '../components/Loading';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [popularMasters, setPopularMasters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, masters] = await Promise.all([
          categoryService.getAll(),
          masterService.getAll()
        ]);
        setCategories(cats.slice(0, 6));
        setPopularMasters(masters.slice(0, 4));
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" />
            <span>Expert Help in Minutes</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            Fix it. Build it. <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Master it.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            Connecting you with the best local professionals for all your home improvement and repair needs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/masters" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center space-x-2 group">
              <span>Find a Master</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              Join as a Professional
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm">
           <div className="text-center">
             <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">10k+</div>
             <div className="text-sm text-slate-500">Happy Users</div>
           </div>
           <div className="text-center border-l border-slate-100 dark:border-slate-800">
             <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">500+</div>
             <div className="text-sm text-slate-500">Expert Masters</div>
           </div>
           <div className="text-center border-l border-slate-100 dark:border-slate-800">
             <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">20+</div>
             <div className="text-sm text-slate-500">Categories</div>
           </div>
           <div className="text-center border-l border-slate-100 dark:border-slate-800">
             <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">4.9/5</div>
             <div className="text-sm text-slate-500">Average Rating</div>
           </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Popular Categories</h2>
            <p className="text-slate-500 dark:text-slate-400">Whatever you need, we have an expert for it.</p>
          </div>
          <Link to="/masters" className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center hover:underline">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? <Loading /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Masters Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Top Rated Masters</h2>
            <p className="text-slate-500 dark:text-slate-400">Highly skilled professionals in your area.</p>
          </div>
          <Link to="/masters" className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center hover:underline">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? <Loading /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularMasters.map(master => (
              <MasterCard key={master.id} master={master} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-slate-900 dark:bg-slate-950 py-24 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose MasterFix?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">We provide the safest and most efficient way to get things done at home.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             <div className="text-center">
               <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <Shield className="w-8 h-8 text-indigo-400" />
               </div>
               <h3 className="text-xl font-bold mb-3">Verified Pros</h3>
               <p className="text-slate-400">Every master is manually verified and background checked for your peace of mind.</p>
             </div>
             <div className="text-center">
               <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <Star className="w-8 h-8 text-purple-400" />
               </div>
               <h3 className="text-xl font-bold mb-3">Quality Guaranteed</h3>
               <p className="text-slate-400">Not happy with the result? Our support team is here to ensure everything is perfect.</p>
             </div>
             <div className="text-center">
               <div className="w-16 h-16 bg-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <Zap className="w-8 h-8 text-emerald-400" />
               </div>
               <h3 className="text-xl font-bold mb-3">Instant Booking</h3>
               <p className="text-slate-400">No more waiting for callbacks. Book your preferred slot instantly on our platform.</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
