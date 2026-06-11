import React, { useState, useEffect } from 'react';
import { Heart, Search } from 'lucide-react';
import favoriteService from '../services/favoriteService';
import masterService from '../services/masterService';
import MasterCard from '../components/MasterCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const myFavs = await favoriteService.getMyFavorites();
        // The favorite entity usually contains masterId, we might need full master data
        // For simplicity, let's assume we fetch them all or the backend provides them
        // If backend only provides masterId, we might need to fetch master details
        const mastersData = await Promise.all(
          myFavs.map(f => masterService.getById(f.masterId))
        );
        setFavorites(mastersData);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Favorites</h1>
        <p className="text-slate-500 dark:text-slate-400">Masters you've saved for later.</p>
      </div>

      {loading ? <Loading /> : (
        <>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favorites.map(master => (
                <MasterCard key={master.id} master={master} />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No favorites yet" 
              message="Start exploring masters and save your favorites to see them here." 
              icon={Heart}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Favorites;
