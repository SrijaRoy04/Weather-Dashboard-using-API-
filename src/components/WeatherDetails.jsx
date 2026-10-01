import React from 'react';
import { 
  Droplets, 
  Wind, 
  Sunrise, 
  Sunset, 
  Gauge, 
  Eye, 
  Cloud,
  Navigation,
  Sun
} from 'lucide-react';
import { formatLocalTime, getDaylightProgress } from '../services/weatherService';

export default function WeatherDetails({ weather, unit }) {
  if (!weather) return null;

  const sunriseTime = formatLocalTime(weather.sunrise, weather.timezoneOffset);
  const sunsetTime = formatLocalTime(weather.sunset, weather.timezoneOffset);
  const daylightProgress = getDaylightProgress(weather.sunrise, weather.sunset, weather.timezoneOffset);

  // Qualitative humidity status
  const getHumidityStatus = (val) => {
    if (val < 30) return { label: 'Dry air', color: 'text-amber-400' };
    if (val <= 60) return { label: 'Comfortable', color: 'text-emerald-400' };
    return { label: 'High humidity', color: 'text-cyan-400' };
  };

  // Wind Beaufort scale estimation
  const getWindStatus = (speedKmh) => {
    if (speedKmh < 12) return 'Light Breeze';
    if (speedKmh < 28) return 'Moderate Wind';
    if (speedKmh < 50) return 'Strong Breeze';
    return 'Gale Force';
  };

  const humidityInfo = getHumidityStatus(weather.humidity);
  const windUnit = unit === 'metric' ? 'km/h' : 'mph';
  const windStatus = getWindStatus(unit === 'metric' ? weather.windSpeed : Math.round(weather.windSpeed * 1.60934));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white tracking-wide">
          Weather Conditions & Dynamics
        </h3>
        <span className="text-xs text-slate-400 font-medium">Real-time parameters</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Card 1: Humidity */}
        <div className="glass-panel hover:glass-panel-elevated rounded-2xl p-5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-400" /> Humidity
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 ${humidityInfo.color}`}>
              {humidityInfo.label}
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl sm:text-4xl font-black text-white">
              {weather.humidity}<span className="text-lg font-light text-cyan-400 ml-0.5">%</span>
            </span>
            <span className="text-xs text-slate-400">
              Dew point ~{Math.round(weather.temp - ((100 - weather.humidity) / 5))}°
            </span>
          </div>

          {/* Humidity Progress Bar */}
          <div className="mt-4 w-full bg-slate-800/80 rounded-full h-2 overflow-hidden p-0.5 border border-white/5">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${weather.humidity}%` }}
            />
          </div>
        </div>

        {/* Card 2: Wind Speed & Compass Direction */}
        <div className="glass-panel hover:glass-panel-elevated rounded-2xl p-5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-sky-400" /> Wind Speed
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-sky-300">
              {windStatus}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              <span className="text-3xl sm:text-4xl font-black text-white">
                {weather.windSpeed}
              </span>
              <span className="text-sm font-medium text-slate-400 ml-1.5">
                {windUnit}
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Direction: <strong className="text-slate-200">{weather.windDirection}</strong> ({weather.windDeg || 0}°)
              </p>
            </div>

            {/* Visual Compass Needle */}
            <div className="relative w-12 h-12 rounded-full border border-white/15 bg-black/20 flex items-center justify-center shrink-0">
              <span className="absolute top-1 text-[8px] font-bold text-slate-400">N</span>
              <div 
                className="transition-transform duration-500 ease-out"
                style={{ transform: `rotate(${weather.windDeg || 0}deg)` }}
              >
                <Navigation className="w-5 h-5 text-cyan-400 fill-cyan-400" />
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-2">
            <span>Steady flow</span>
            <span>Gusts active</span>
          </div>
        </div>

        {/* Card 3: Sunrise & Sunset with Daylight Arc Progress */}
        <div className="glass-panel hover:glass-panel-elevated rounded-2xl p-5 transition-all duration-300 relative overflow-hidden sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" /> Sun Cycle
            </span>
            <span className="text-xs font-medium text-amber-300/90 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              {daylightProgress}% of Day
            </span>
          </div>

          {/* Visual Sunrise & Sunset Values */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 bg-black/20 p-2.5 rounded-xl border border-white/5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Sunrise className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Sunrise</p>
                <p className="text-sm font-bold text-white">{sunriseTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-black/20 p-2.5 rounded-xl border border-white/5">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                <Sunset className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Sunset</p>
                <p className="text-sm font-bold text-white">{sunsetTime}</p>
              </div>
            </div>
          </div>

          {/* Daylight Sun Progress Indicator */}
          <div className="mt-3 relative">
            <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-white/5">
              <div 
                className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${daylightProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 4: Atmospheric Pressure */}
        <div className="glass-panel hover:glass-panel-elevated rounded-2xl p-5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-emerald-400" /> Air Pressure
            </span>
            <span className="text-xs text-slate-400">Barometric</span>
          </div>

          <div className="mt-4">
            <span className="text-3xl font-black text-white">{weather.pressure}</span>
            <span className="text-xs font-medium text-slate-400 ml-1.5">hPa</span>
          </div>

          <p className="text-xs text-slate-400 mt-2">
            {weather.pressure > 1013 ? 'High pressure system (stable)' : 'Low pressure system (active)'}
          </p>
        </div>

        {/* Card 5: Visibility */}
        <div className="glass-panel hover:glass-panel-elevated rounded-2xl p-5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-indigo-400" /> Visibility
            </span>
            <span className="text-xs font-medium text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
              Clear View
            </span>
          </div>

          <div className="mt-4">
            <span className="text-3xl font-black text-white">{weather.visibility}</span>
            <span className="text-xs font-medium text-slate-400 ml-1.5">km</span>
          </div>

          <p className="text-xs text-slate-400 mt-2">
            Horizon line is sharp and unobstructed
          </p>
        </div>

        {/* Card 6: Cloud Cover */}
        <div className="glass-panel hover:glass-panel-elevated rounded-2xl p-5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-blue-400" /> Cloud Cover
            </span>
            <span className="text-xs text-slate-400">Sky coverage</span>
          </div>

          <div className="mt-4">
            <span className="text-3xl font-black text-white">{weather.clouds}</span>
            <span className="text-lg font-light text-blue-400 ml-0.5">%</span>
          </div>

          <p className="text-xs text-slate-400 mt-2">
            {weather.clouds < 20 ? 'Clear blue skies' : weather.clouds < 70 ? 'Partly cloudy sky' : 'Overcast skies'}
          </p>
        </div>

      </div>
    </div>
  );
}
