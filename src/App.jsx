import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import WeatherHero from './components/WeatherHero';
import WeatherDetails from './components/WeatherDetails';
import Forecast from './components/Forecast';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import ApiKeyModal from './components/ApiKeyModal';
import { 
  fetchCurrentWeather, 
  fetchWeatherForecast, 
  getWeatherTheme, 
  isDemoModeActive 
} from './services/weatherService';

export default function App() {
  const [query, setQuery] = useState('London');
  const [unit, setUnit] = useState('metric'); // 'metric' (°C) | 'imperial' (°F)
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(isDemoModeActive());

  /**
   * Core API integration using async/await and fetch
   */
  const loadWeatherData = useCallback(async (searchTarget, currentUnit = unit, showFullLoading = true) => {
    if (showFullLoading) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setErrorMessage(null);

    try {
      // Parallel fetch for current weather and 5-day forecast using Promise.all & async/await
      const [current, forecast] = await Promise.all([
        fetchCurrentWeather(searchTarget, currentUnit),
        fetchWeatherForecast(searchTarget, currentUnit)
      ]);

      setWeatherData(current);
      setForecastData(forecast);
      setIsDemo(current.isDemo);
    } catch (err) {
      console.error('Weather load error:', err);
      setErrorMessage(err.message || 'Failed to retrieve meteorological data.');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [unit]);

  /**
   * Pre-requisite useEffect: triggers on mount and whenever search query or unit updates
   */
  useEffect(() => {
    loadWeatherData(query, unit, true);
  }, [query, unit, loadWeatherData]);

  // Handle City Search
  const handleSearch = (newCity) => {
    setQuery(newCity);
  };

  // Handle Unit Toggle (°C <-> °F)
  const handleUnitToggle = () => {
    const nextUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(nextUnit);
  };

  // Handle Geolocation Click
  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your current browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        loadWeatherData(coords, unit, true);
      },
      (geoError) => {
        setIsLoading(false);
        let errorTxt = 'Unable to access your location.';
        if (geoError.code === 1) {
          errorTxt = 'Location access permission was denied. Please search for your city name instead.';
        } else if (geoError.code === 2) {
          errorTxt = 'Location position unavailable. Please search for your city name.';
        }
        setErrorMessage(errorTxt);
      },
      { timeout: 10000 }
    );
  };

  // Refresh current city
  const handleRefresh = () => {
    loadWeatherData(query, unit, false);
  };

  // Switch to demo mode fallback
  const handleSwitchToDemo = () => {
    setDemoModeActive(true);
    setIsDemo(true);
    loadWeatherData(query, unit, true);
  };

  // Dynamic weather-driven background theme
  const theme = weatherData 
    ? getWeatherTheme(weatherData.weatherId, weatherData.icon)
    : { gradient: 'from-slate-950 via-slate-900 to-slate-950', accent: 'cyan', glow: 'rgba(56, 189, 248, 0.2)' };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} text-slate-100 flex flex-col transition-colors duration-1000 relative overflow-hidden`}>
      
      {/* Dynamic ambient atmospheric background glows */}
      <div 
        className="absolute top-10 left-1/4 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none -z-10 transition-all duration-1000 animate-pulse-subtle"
        style={{ background: theme.glow }}
      />
      <div 
        className="absolute bottom-10 right-1/4 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none -z-10 opacity-30 transition-all duration-1000"
        style={{ background: theme.glow }}
      />

      {/* Main Navbar */}
      <Navbar
        onSearch={handleSearch}
        onLocationClick={handleLocationClick}
        unit={unit}
        onUnitToggle={handleUnitToggle}
        onOpenSettings={() => setIsApiKeyModalOpen(true)}
        isDemoMode={isDemo}
        isLoading={isLoading}
      />

      {/* Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Loading Spinner View */}
        {isLoading && !weatherData && (
          <LoadingSpinner message={`Gathering satellite and radar data for "${typeof query === 'string' ? query : 'your location'}"...`} />
        )}

        {/* Error Alert Display */}
        {errorMessage && (
          <ErrorMessage
            error={errorMessage}
            onRetry={() => loadWeatherData(query, unit, true)}
            onOpenSettings={() => setIsApiKeyModalOpen(true)}
            onSelectCity={handleSearch}
            onSwitchToDemo={handleSwitchToDemo}
          />
        )}

        {/* Weather Dashboard View */}
        {!errorMessage && weatherData && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Card */}
            <WeatherHero
              weather={weatherData}
              unit={unit}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />

            {/* Weather Metrics Grid */}
            <WeatherDetails
              weather={weatherData}
              unit={unit}
            />

            {/* 5-Day & Hourly Forecast */}
            <Forecast
              forecast={forecastData}
              unit={unit}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-6 mt-12 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">SkyPulse Weather</span>
            <span>•</span>
            <span>Powered by OpenWeatherMap API</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="hover:text-cyan-400 transition-colors"
            >
              Configure API Key
            </button>
            <span>•</span>
            <span className="text-slate-500">React + Vite + Tailwind CSS</span>
          </div>
        </div>
      </footer>

      {/* Settings / API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={() => {
          setIsDemo(isDemoModeActive());
          loadWeatherData(query, unit, true);
        }}
      />

    </div>
  );
}
