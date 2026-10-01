import React from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  MapPin, 
  Clock, 
  RefreshCw,
  Sparkles,
  Thermometer
} from 'lucide-react';
import { formatLocalTime, formatLocalDate, getWeatherIconUrl } from '../services/weatherService';

export default function WeatherHero({ 
  weather, 
  unit, 
  onRefresh, 
  isRefreshing 
}) {
  if (!weather) return null;

  const unitSymbol = unit === 'metric' ? '°C' : '°F';
  const localTime = formatLocalTime(weather.dt, weather.timezoneOffset);
  const localDate = formatLocalDate(weather.dt, weather.timezoneOffset);
  const iconUrl = getWeatherIconUrl(weather.icon);

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel-elevated p-6 sm:p-8 transition-all duration-300">
      
      {/* Background radial glow */}
      <div 
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: weather.weatherId >= 800 ? 'radial-gradient(circle, #f59e0b, transparent)' : 'radial-gradient(circle, #38bdf8, transparent)'
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left Side: Location, Date & Weather Condition Details */}
        <div className="space-y-4">
          
          {/* Location & Tags */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 text-white">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {weather.city}
              </h2>
              {weather.country && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/10 text-cyan-300 border border-white/15">
                  {weather.country}
                </span>
              )}
            </div>

            {weather.isDemo && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3 h-3" /> Demo Preview
              </span>
            )}
          </div>

          {/* Time & Date */}
          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-cyan-400/80" />
              {localTime} Local Time
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{localDate}</span>
          </div>

          {/* Condition description badge */}
          <div className="pt-1">
            <span className="inline-block text-base sm:text-lg font-medium capitalize px-3.5 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-slate-100 shadow-inner">
              {weather.description || weather.weatherCondition}
            </span>
          </div>

          {/* Min / Max & Feels Like pill bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-2">
            <div className="flex items-center gap-1.5 font-medium bg-black/20 px-3 py-1.5 rounded-xl border border-white/5">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span>Feels like <strong className="text-white font-bold">{weather.feelsLike}{unitSymbol}</strong></span>
            </div>

            <div className="flex items-center gap-3 bg-black/20 px-3 py-1.5 rounded-xl border border-white/5">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ArrowDown className="w-3.5 h-3.5" />
                {weather.tempMin}{unitSymbol}
              </span>
              <span className="text-slate-500">/</span>
              <span className="flex items-center gap-1 text-rose-400 font-semibold">
                <ArrowUp className="w-3.5 h-3.5" />
                {weather.tempMax}{unitSymbol}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Giant Temperature & Floating Weather Icon */}
        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
          
          <div className="relative group">
            <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-2xl group-hover:bg-cyan-400/30 transition-all pointer-events-none" />
            <img 
              src={iconUrl} 
              alt={weather.description} 
              className="w-28 h-28 sm:w-36 sm:h-36 object-contain relative z-10 animate-float drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)]"
              loading="eager"
            />
          </div>

          <div className="text-right">
            <div className="flex items-start justify-end">
              <span className="text-6xl sm:text-8xl font-black tracking-tighter bg-gradient-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                {weather.temp}
              </span>
              <span className="text-2xl sm:text-4xl font-light text-cyan-400 mt-2 ml-1">
                {unitSymbol}
              </span>
            </div>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 hover:bg-white/5 px-2.5 py-1 rounded-lg transition-all"
              title="Refresh weather data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Update now</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
