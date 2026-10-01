import React from 'react';
import { CloudSun, Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Fetching meteorological observations...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="absolute w-24 h-24 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
        
        {/* Rotating outer spinner ring */}
        <div className="w-20 h-20 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 border-r-cyan-400 animate-spin" />

        {/* Center floating icon */}
        <div className="absolute flex items-center justify-center bg-slate-900/90 rounded-full p-3 border border-white/10 shadow-lg">
          <CloudSun className="w-7 h-7 text-cyan-400 animate-bounce" />
        </div>
      </div>

      <div className="mt-6 text-center space-y-1">
        <p className="text-base font-semibold text-slate-100 tracking-wide">
          {message}
        </p>
        <p className="text-xs text-slate-400">
          Syncing with OpenWeatherMap satellites
        </p>
      </div>
    </div>
  );
}
