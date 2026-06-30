import React, { useEffect } from 'react';

// Universal Notification/Toast component
export function Notification({ message, type = 'error', onClose, duration = 4000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgClass = type === 'success' 
    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200 shadow-emerald-500/5' 
    : 'bg-rose-500/20 border-rose-500/30 text-rose-200 shadow-rose-500/5';
  
  const iconColor = type === 'success' ? 'text-emerald-400' : 'text-rose-400';

  return (
    <div className="fixed top-5 right-5 z-50 animate-fadeIn">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-lg ${bgClass}`}>
        {type === 'success' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0" />
          </svg>
        )}
        <span className="text-sm font-medium">{message}</span>
        <button 
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Custom Input Field with validation error display
export function Input({ label, id, error, className = '', ...props }) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-white text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        {...props}
        className={`w-full bg-black/60 border ${
          error ? 'border-rose-500 focus:ring-rose-500/50' : 'border-purple-500/50 focus:ring-purple-500/50'
        } rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 transition-all`}
      />
      {error && (
        <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1 animate-fadeIn font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
