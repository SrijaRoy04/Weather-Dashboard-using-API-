import React, { useState, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Key, 
  Sparkles, 
  Compass, 
  X,
  CloudSun,
  AlertCircle
} from 'lucide-react';

const QUICK_CITIES = ['London', 'New York', 'Tokyo', 'Paris', 'Delhi', 'Sydney', 'Mumbai'];

export default function Navbar({ 
  onSearch, 
  onLocationClick, 
  unit, 
  onUnitToggle, 
  onOpenSettings,
  isDemoMode,
  isLoading
}) {
  const [searchInput, setSearchInput] = useState('');
  const [emptyPrompt, setEmptyPrompt] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      setEmptyPrompt(true);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      setTimeout(() => setEmptyPrompt(false), 3000);
      return;
    }
    setEmptyPrompt(false);
    onSearch(searchInput.trim());
    setSearchInput('');
  };

  const handleQuickCity = (city) => {
    setEmptyPrompt(false);
    onSearch(city);
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-slate-950/70 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div 
              className="flex items-center gap-2.5 cursor-pointer group" 
              onClick={() => onSearch('London')}
              title="SkyPulse Dashboard - Click to reset to London"
            >
              <div className="relative p-2 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all duration-300">
                <CloudSun className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
                  SkyPulse
                </h1>
                <p className="text-[10px] uppercase font-semibold tracking-wider text-cyan-400/80 -mt-0.5">
                  Live Weather Radar
                </p>
              </div>
            </div>

            {/* Mobile Actions: Unit & Settings */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={onUnitToggle}
                className="px-2.5 py-1.5 rounded-lg glass-panel text-xs font-semibold text-slate-200 hover:text-white hover:border-cyan-500/40 transition-all"
                title="Toggle Temperature Unit"
              >
                {unit === 'metric' ? '°C' : '°F'}
              </button>
              <button
                type="button"
                onClick={onOpenSettings}
                className="p-2 rounded-lg glass-panel text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
                title="API Key & Settings"
              >
                <Key className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Form */}
          <div className="w-full md:max-w-md relative">
            <form 
              onSubmit={handleSubmit} 
              className="relative flex items-center w-full"
            >
              <div className="relative w-full flex items-center">
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="absolute left-3 p-1 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    if (emptyPrompt) setEmptyPrompt(false);
                  }}
                  placeholder="Search any city (e.g., Delhi, Tokyo, London)..."
                  className={`w-full pl-10 pr-20 py-2.5 rounded-xl glass-input text-sm text-slate-100 placeholder-slate-400 outline-none transition-all duration-200 ${
                    emptyPrompt ? 'ring-2 ring-rose-500/60 border-rose-500/50 bg-rose-950/20' : ''
                  }`}
                  disabled={isLoading}
                />

                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput('')}
                    aria-label="Clear input"
                    className="absolute right-10 text-slate-400 hover:text-slate-200 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={onLocationClick}
                  disabled={isLoading}
                  title="Use Current GPS Location"
                  aria-label="Use Current GPS Location"
                  className="absolute right-2 p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/10 active:scale-95 transition-all"
                >
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Empty Search Prompt Notification */}
            {emptyPrompt && (
              <div className="absolute -bottom-8 left-2 flex items-center gap-1.5 text-xs font-semibold text-rose-400 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Please enter a city name to search.</span>
              </div>
            )}
          </div>

          {/* Right Action Tools (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Demo Mode Badge */}
            {isDemoMode && (
              <button
                onClick={onOpenSettings}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
                title="Click to enter your OpenWeatherMap API Key"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Demo Mode</span>
              </button>
            )}

            {/* Celsius / Fahrenheit Switcher */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
              <button
                type="button"
                onClick={() => unit !== 'metric' && onUnitToggle()}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  unit === 'metric'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °C
              </button>
              <button
                type="button"
                onClick={() => unit !== 'imperial' && onUnitToggle()}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  unit === 'imperial'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °F
              </button>
            </div>

            {/* Settings / API Key Button */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel hover:glass-panel-elevated text-xs font-semibold text-slate-200 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
            >
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>API Key</span>
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-0.5">
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 shrink-0">
            <Compass className="w-3 h-3 text-cyan-400/80" /> Popular:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {QUICK_CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => handleQuickCity(city)}
                className="px-2.5 py-1 rounded-full text-xs font-medium text-slate-300 bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all duration-200"
              >
                {city}
              </button>
            ))}
          </div>
        </div>

      </div>
    </header>
  );
}
