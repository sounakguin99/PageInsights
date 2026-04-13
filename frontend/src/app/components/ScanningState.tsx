"use client";

import { Activity } from "lucide-react";

interface ScanningStateProps {
  device: string;
  progress: string;
}

export default function ScanningState({ device, progress }: ScanningStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 glass-card rounded-2xl">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        <div className="absolute inset-4 rounded-full border-b-2 border-cyan-500 animate-spin" style={{ animationDuration: '2s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity className="w-8 h-8 text-blue-400 animate-pulse" />
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-2">Analyzing your page ({device})</h2>
      <p className="text-gray-400 flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
        {progress || "Initializing diagnostic engines..."}
      </p>
      <p className="text-gray-600 text-sm mt-4">Running mobile + desktop scans via Google PageSpeed Insights API</p>
    </div>
  );
}
