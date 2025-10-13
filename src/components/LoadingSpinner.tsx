import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-600 border-t-cyan-400 rounded-full animate-spin"></div>
        <div className="w-12 h-12 border-4 border-slate-700 border-t-purple-400 rounded-full animate-spin absolute top-2 left-2 animate-reverse"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;