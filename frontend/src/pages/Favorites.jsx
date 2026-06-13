import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';
import MasterCard from '../components/MasterCard';
import { Heart, Search as SearchIcon, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data } = await apiService.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Sevimliler yüklenirken xeta:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (masterId) => {
    try {
      await apiService.removeFavorite(masterId);
      setFavorites(prev => prev.filter(f => f.masterId !== masterId));
    } catch (error) {
      console.error('Favorite silme xetasi:', error);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sevimlilər</h1>
        <p className="text-gray-400">Bəyəndiyiniz və tez tapmaq istədiyiniz ustalar</p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary-accent border-t-transparent rounded-full"></div>
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((fav) => (
            <MasterCard 
              key={fav.masterId} 
              master={{
                id: fav.masterId,
                fullName: fav.masterName,
                categoryName: fav.categoryName,
                profileImageUrl: fav.profileImageUrl,
                averageRating: fav.averageRating,
                city: fav.city,
                priceFrom: fav.priceFrom,
                completedJobs: fav.completedJobs
              }}
              isFavorite={true}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-20 text-center space-y-6">
          <div className="w-24 h-24 bg-red-500/5 rounded-full mx-auto flex items-center justify-center text-red-500 shadow-inner">
            <Heart size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Siyahı hələ boşdur</h3>
            <p className="text-gray-400 max-w-xs mx-auto">İşini bəyəndiyiniz ustaları ürək ikonuna basaraq bura əlavə edə bilərsiniz.</p>
          </div>
          <button 
            onClick={() => navigate('/masters')}
            className="bg-primary-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-light transition-all active:scale-95"
          >
            Usta Axtar
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
