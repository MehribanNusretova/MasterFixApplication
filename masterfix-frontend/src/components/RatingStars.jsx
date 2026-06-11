import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating, size = 16, count = 5 }) => {
  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(count)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`${
            i < Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : i < rating
              ? 'fill-amber-400/50 text-amber-400'
              : 'text-slate-300 dark:text-slate-600'
          }`}
        />
      ))}
      <span className="ml-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
        {rating > 0 ? rating.toFixed(1) : 'No rating'}
      </span>
    </div>
  );
};

export default RatingStars;
