import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Briefcase, Heart } from 'lucide-react';

const MasterCard = ({ master, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card overflow-hidden group hover:border-primary-accent/50 transition-all flex flex-col h-full">
      <div className="h-48 bg-glass-hover relative overflow-hidden">
        <img 
          src={master.profileImageUrl ? `/api${master.profileImageUrl}` : 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop'} 
          alt={master.fullName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(master.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isFavorite ? 'bg-primary-accent text-white' : 'bg-black/40 text-white hover:bg-primary-accent/50'
            }`}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
          <Star size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-bold">{master.averageRating || 'Yeni'}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 space-y-4">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-lg line-clamp-1">{master.fullName}</h3>
            <span className="text-primary-accent font-bold text-sm">{master.priceFrom}₼-dan</span>
          </div>
          <p className="text-gray-400 text-xs mb-3 flex items-center gap-1">
            <Briefcase size={12} /> {master.categoryName}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span>{master.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{master.completedJobs} tamamlanmış iş</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate(`/masters/${master.id}`)}
          className="w-full py-3 bg-glass-hover hover:bg-primary-accent rounded-xl text-sm font-bold transition-all active:scale-95"
        >
          Detallara bax
        </button>
      </div>
    </div>
  );
};

export default MasterCard;
