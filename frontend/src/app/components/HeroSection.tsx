"use client";

import { motion } from "framer-motion";
import { Globe, Smartphone, Monitor, Zap, Search, Activity } from "lucide-react";

interface HeroSectionProps {
  url: string;
  setUrl: (url: string) => void;
  device: string;
  setDevice: (device: string) => void;
  isScanning: boolean;
  onAnalyze: (e: React.FormEvent) => void;
}

export default function HeroSection({ url, setUrl, device, setDevice, isScanning, onAnalyze }: HeroSectionProps) {
  return (
    <>
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-sm font-medium text-blue-600 dark:text-blue-400 border-blue-500/30">
          <Zap className="w-4 h-4" />
          <span>Next-Gen Page Analyzer Engine</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 pb-2 md:pb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-600 to-slate-700 dark:from-white dark:via-blue-100 dark:to-gray-400">
          Page<span className="text-blue-500">Insights</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
          Instant SEO, Performance, and Accessibility analysis matching Google PageSpeed Insights.
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-4xl glass-card p-2 mb-8 relative z-10"
      >
        <form onSubmit={onAnalyze} className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex items-center bg-white/50 dark:bg-black/40 rounded-lg px-4 py-3 border border-slate-200 dark:border-white/5 focus-within:border-blue-500/50 transition-colors">
            <Globe className="w-5 h-5 text-slate-400 dark:text-gray-500 mr-3 hidden sm:block" />
            <input
              type="text"
              required
              placeholder="Enter website URL (e.g. example.com)..."
              className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white text-lg placeholder:text-slate-400 dark:placeholder:text-gray-600"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isScanning}
            />
          </div>

          <div className="flex bg-white/50 dark:bg-black/40 rounded-lg p-1 border border-slate-200 dark:border-white/5">
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`px-4 py-3 rounded-md transition-all flex items-center gap-2 ${device === 'mobile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'}`}
            >
              <Smartphone className="w-5 h-5" />
              <span className="hidden md:inline font-medium">Mobile</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`px-4 py-3 rounded-md transition-all flex items-center gap-2 ${device === 'desktop' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 dark:text-gray-400 hover:text-blue-500 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'}`}
            >
              <Monitor className="w-5 h-5" />
              <span className="hidden md:inline font-medium">Desktop</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isScanning || !url}
            className="glow-btn bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-gray-200 px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? (
              <Activity className="w-5 h-5 text-blue-600 animate-pulse" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span>{isScanning ? 'Analyzing...' : 'Analyze'}</span>
          </button>
        </form>
      </motion.div>
    </>
  );
}
