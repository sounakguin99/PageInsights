"use client";

import { Image as ImageIcon } from "lucide-react";

interface FilmstripTimelineProps {
  filmstripData: any[];
}

export default function FilmstripTimeline({ filmstripData }: FilmstripTimelineProps) {
  if (!filmstripData || filmstripData.length === 0) return null;

  return (
    <div className="glass-card p-6 border border-white/10 overflow-hidden">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ImageIcon className="text-blue-400" />
        Load Timeline
      </h3>
      <div className="flex overflow-x-auto gap-3 pb-4 snap-x scrollbar-thin">
        {filmstripData.map((frame: any, idx: number) => (
          <div key={idx} className="flex flex-col items-center flex-shrink-0 snap-start">
            <div className="w-28 h-44 bg-black/50 border border-white/10 rounded-lg overflow-hidden mb-2 shadow-lg">
              <img src={frame.data} alt={`Load frame at ${frame.timing}ms`} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-gray-500 font-mono">{frame.timing}ms</span>
          </div>
        ))}
      </div>
    </div>
  );
}
