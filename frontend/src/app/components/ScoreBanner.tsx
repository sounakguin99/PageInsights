"use client";

import { Monitor, Smartphone, CheckCircle2, Download } from "lucide-react";

interface ScoreBannerProps {
  device: string;
  overallScore: number;
}

export default function ScoreBanner({ device, overallScore }: ScoreBannerProps) {
  return (
    <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          {device === 'desktop' ? <Monitor className="text-blue-400" /> : <Smartphone className="text-blue-400" />}
          {device === 'mobile' ? 'Mobile' : 'Desktop'} Analysis Report
        </h2>
        <p className="text-gray-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          Scan completed successfully
        </p>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold">PageInsights Score</div>
          <div className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {overallScore}/100
          </div>
        </div>
        <div className="h-12 w-px bg-white/10 hidden md:block"></div>
        <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors font-medium">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
}
