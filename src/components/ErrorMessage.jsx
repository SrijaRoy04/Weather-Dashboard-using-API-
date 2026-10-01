import React from 'react';
import { AlertCircle, RefreshCw, Key, Search, Sparkles, Clock } from 'lucide-react';

export default function ErrorMessage({ 
  error, 
  onRetry, 
  onOpenSettings, 
  onSelectCity,
  onSwitchToDemo
}) {
  if (!error) return null;

  const isAuthError = error.toLowerCase().includes('api key') || error.includes('401');
  const isNotFoundError = error.toLowerCase().includes('not found') || error.includes('404');

  return (
    <div className="max-w-2xl mx-auto my-8 rounded-3xl glass-panel-elevated border-rose-500/30 p-6 sm:p-8 text-center relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute inset-0 bg-rose-500/5 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 mb-4 shadow-lg shadow-rose-500/10">
          <AlertCircle className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          {isAuthError ? 'OpenWeatherMap API Key Pending / Invalid' : isNotFoundError ? 'Location Not Found' : 'Weather Fetch Issue'}
        </h3>

        <p className="text-sm text-slate-300 max-w-md mx-auto mb-4 leading-relaxed">
          {error}
        </p>

        {isAuthError && (
          <div className="mb-6 max-w-md mx-auto p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2 text-left">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Note on newly created keys:</strong> OpenWeatherMap accounts require between <strong>10 minutes to 2 hours</strong> for newly registered API keys to activate across their global servers. You can explore in Demo Mode while activation finishes!
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {isAuthError ? (
            <>
              {onSwitchToDemo && (
                <button
                  onClick={onSwitchToDemo}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs shadow-lg shadow-amber-500/25 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Switch to Demo Mode</span>
                </button>
              )}

              <button
                onClick={onOpenSettings}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-all"
              >
                <Key className="w-4 h-4" />
                <span>API Settings</span>
              </button>

              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium text-xs border border-white/10 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Key</span>
              </button>
            </>
          ) : (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}

          {isNotFoundError && (
            <div className="w-full mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-slate-400 mb-2 font-medium">
                Try searching for one of these known hubs:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {['London', 'New York', 'Tokyo', 'Delhi', 'Paris'].map((c) => (
                  <button
                    key={c}
                    onClick={() => onSelectCity(c)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 transition-all"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
