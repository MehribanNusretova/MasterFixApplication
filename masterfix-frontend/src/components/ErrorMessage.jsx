import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start space-x-3 text-red-600 dark:text-red-400">
      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default ErrorMessage;
