import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, User } from 'lucide-react';
import RatingStars from './RatingStars';

const MasterCard = ({ master }) => {
  return (
    <Link to={`/masters/${master.id}`} className="group block">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
        <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-900 relative">
          {/* Placeholder for master photo if exists, otherwise icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="w-16 h-16 text-slate-300 dark:text-slate-700" />
          </div>
          <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 shadow-sm">
            {master.category?.name || 'Handyman'}
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {master.user?.fullName}
            </h3>
            <div className="flex items-center text-indigo-600 dark:text-indigo-400">
              <span className="font-bold">{master.pricePerHour}</span>
              <span className="text-xs ml-0.5">₼/hr</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{master.city}</span>
          </div>
          
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <RatingStars rating={master.averageRating || 0} />
            <span className="text-xs text-slate-400">View Details</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MasterCard;
