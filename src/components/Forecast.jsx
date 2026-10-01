import React, { useState } from 'react';
import { Calendar, Clock, Umbrella } from 'lucide-react';
import { getWeatherIconUrl } from '../services/weatherService';

export default function Forecast({ forecast, unit }) {
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'hourly'

  if (!forecast || (!forecast.daily?.length && !forecast.hourly?.length)) {
    return null;
  }

  const unitSymbol = unit === 'metric' ? '°C' : '°F';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
          {activeTab === 'daily' ? (
            <>
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span>5-Day Weather Forecast</span>
            </>
          ) : (
            <>
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>24-Hour Horizon (3h Intervals)</span>
            </>
          )}
        </h3>

        {/* Tab Toggle */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'daily'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            5-Day Outlook
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hourly')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'hourly'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hourly
          </button>
        </div>
      </div>

      {/* Tab 1: 5-Day Forecast Grid */}
      {activeTab === 'daily' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {forecast.daily.map((day, idx) => (
            <div
              key={idx}
              className="glass-panel hover:glass-panel-elevated p-4 rounded-2xl flex flex-col items-center justify-between text-center transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-full text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 group-hover:text-cyan-300 transition-colors">
                  {idx === 0 ? 'Today' : day.date}
                </span>
                <p className="text-[11px] text-slate-400 capitalize truncate mt-0.5">
                  {day.condition}
                </p>
              </div>

              {/* Weather Icon */}
              <div className="my-2 relative">
                <img
                  src={getWeatherIconUrl(day.icon)}
                  alt={day.description}
                  className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow"
                />
              </div>

              {/* High / Low temps */}
              <div className="w-full flex items-center justify-center gap-2 text-sm pt-2 border-t border-white/5">
                <span className="font-bold text-white">
                  {day.maxTemp}{unitSymbol}
                </span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-400 font-medium">
                  {day.minTemp}{unitSymbol}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Hourly Breakdown (Horizontal Scroll) */}
      {activeTab === 'hourly' && (
        <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-3 pt-1">
          {forecast.hourly.map((hour, idx) => (
            <div
              key={idx}
              className="glass-panel hover:glass-panel-elevated p-3.5 rounded-2xl flex flex-col items-center justify-between min-w-[100px] shrink-0 text-center transition-all duration-200"
            >
              <span className="text-xs font-semibold text-slate-300">
                {hour.time}
              </span>

              <img
                src={getWeatherIconUrl(hour.icon)}
                alt={hour.description}
                className="w-12 h-12 object-contain my-1"
              />

              <span className="text-base font-bold text-white">
                {hour.temp}{unitSymbol}
              </span>

              {hour.pop > 0 && (
                <div className="flex items-center gap-1 text-[11px] text-cyan-400 mt-1 font-medium">
                  <Umbrella className="w-3 h-3" />
                  <span>{hour.pop}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
