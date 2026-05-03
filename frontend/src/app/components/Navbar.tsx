"use client";

import * as React from "react";
import { Zap } from "lucide-react";

export default function Navbar() {

  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav aria-label="Main navigation" className="sticky top-0 z-50 w-full glass border-b border-white/10 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" aria-label="PageInsights home" className="flex items-center gap-2 group cursor-pointer">
          <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Page<span className="text-blue-500">Insights</span>
          </span>
        </a>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-blue-500 transition-colors">
              Analyzer
            </a>
            <a href="#" className="hover:text-blue-500 transition-colors">
              Documentation
            </a>
            <a href="#" className="hover:text-blue-500 transition-colors">
              History
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
}
