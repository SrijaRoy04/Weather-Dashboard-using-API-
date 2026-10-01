import React, { useState, useEffect } from 'react';
import { Key, Sparkles, ExternalLink, X, Check, ShieldAlert } from 'lucide-react';
import { 
  getStoredApiKey, 
  setStoredApiKey, 
  isDemoModeActive, 
  setDemoModeActive 
} from '../services/weatherService';

export default function ApiKeyModal({ isOpen, onClose, onKeyUpdated }) {
  const [keyInput, setKeyInput] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeyInput(getStoredApiKey());
      setDemoMode(isDemoModeActive());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setStoredApiKey(keyInput.trim());
    setDemoModeActive(demoMode);
    setSavedSuccess(true);
    setTimeout(() => {
      onKeyUpdated();
      onClose();
    }, 600);
  };

  const handleSwitchToDemo = () => {
    setDemoMode(true);
    setDemoModeActive(true);
    setSavedSuccess(true);
    setTimeout(() => {
      onKeyUpdated();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-3xl glass-panel-elevated p-6 sm:p-8 relative border border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              OpenWeatherMap API Settings
            </h3>
            <p className="text-xs text-slate-400">
              Configure your API key or test in Interactive Demo Mode
            </p>
          </div>
        </div>

        {/* Demo Mode Banner / Toggle */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm font-bold text-white">Interactive Demo Mode</p>
                <p className="text-xs text-slate-300">
                  Runs with realistic weather simulations without requiring an API key
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        </div>

        {/* API Key Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Your OpenWeatherMap API Key
            </label>
            <input
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="e.g. 9f4a8e2b7c6d5e1f0a3b2c1d0e..."
              disabled={demoMode}
              className={`w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-100 placeholder-slate-500 outline-none transition-all ${
                demoMode ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
            <p className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
              <span>Saved locally in your browser (`localStorage`).</span>
              <a 
                href="https://home.openweathermap.org/api_keys" 
                target="_blank" 
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-medium hover:underline"
              >
                Get Free API Key <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <Check className="w-4 h-4" />
              <span>Settings updated successfully! Loading weather...</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all"
            >
              Save Configuration
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
