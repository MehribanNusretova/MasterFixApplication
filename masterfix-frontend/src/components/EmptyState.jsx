import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title, message, icon: Icon = Inbox }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-full mb-4">
        <Icon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 max-w-sm">{message}</p>
    </div>
  );
};

export default EmptyState;
