"use client";

import { Monitor, Smartphone, CheckCircle2, Download } from "lucide-react";

interface ScoreBannerProps {
  device: string;
  overallScore: number;
}

export default function ScoreBanner({
  device,
  overallScore,
}: ScoreBannerProps) {
  return (
    <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-slate-50/50 to-transparent dark:from-white/5 dark:to-transparent border border-slate-200 dark:border-white/10">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-slate-900 dark:text-white">
          {device === "desktop" ? (
            <Monitor className="text-blue-500 dark:text-blue-400" />
          ) : (
            <Smartphone className="text-blue-500 dark:text-blue-400" />
          )}
          {device === "mobile" ? "Mobile" : "Desktop"} Analysis Report
        </h2>
        <p className="text-slate-500 dark:text-gray-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500" />
          Scan completed successfully
        </p>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-sm text-slate-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
            PageInsights Score
          </div>
          <div className="text-5xl font-black bg-clip-text text-slate-900 dark:text-transparent dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-500">
            {overallScore}/100
          </div>
        </div>
        <div className="h-12 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>
        <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg transition-colors font-medium text-slate-700 dark:text-white">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
}
