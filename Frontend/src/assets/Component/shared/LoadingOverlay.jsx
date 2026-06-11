import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const LoadingOverlay = () => {
  const { loading } = useAuth();
  const [showDismiss, setShowDismiss] = useState(false);
  const [forceHide, setForceHide] = useState(false);

  useEffect(() => {
    let timer;
    if (loading) {
      // Set a timeout to show a dismiss button if request takes > 10 seconds
      timer = setTimeout(() => {
        setShowDismiss(true);
      }, 10000);
    } else {
      // Reset states when loading finishes naturally
      setShowDismiss(false);
      setForceHide(false);
    }

    return () => clearTimeout(timer);
  }, [loading]);

  if (!loading || forceHide) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col items-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-orange-500 border-t-transparent shadow-xl"></div>
        <p className="mt-4 text-sm font-black text-slate-900 uppercase tracking-[0.2em] animate-pulse">
          Processing...
        </p>
        
        {showDismiss && (
          <button 
            onClick={() => setForceHide(true)}
            className="mt-6 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-slate-800 transition shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            Taking too long? Dismiss
          </button>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;