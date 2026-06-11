import React from 'react';

const Loading = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="mt-4 text-slate-600 dark:text-slate-400 font-medium text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-10 h-10 border-3 border-slate-200 dark:border-slate-800 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
