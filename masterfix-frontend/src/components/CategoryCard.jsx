import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const CategoryCard = ({ category }) => {
  return (
    <Link 
      to={`/masters?categoryId=${category.id}`} 
      className="group p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all hover:shadow-lg hover:border-indigo-500/30"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse experts
          </p>
        </div>
        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
