"use client";

import { Image as ImageIcon, LayoutTemplate } from "lucide-react";

interface FilmstripTimelineProps {
  filmstripData: any[];
  treemapAudit?: any;
  url?: string;
}

export default function FilmstripTimeline({
  filmstripData,
  treemapAudit,
  url
}: FilmstripTimelineProps) {
  if (!filmstripData || filmstripData.length === 0) return null;

  const openTreemap = () => {
    if (!treemapAudit || !treemapAudit.details_json) return;

    // Construct faux Lighthouse Report for Treemap viewer
    const lhr = {
      requestedUrl: url || "https://example.com",
      finalUrl: url || "https://example.com",
      configSettings: { locale: "en" },
      audits: {
        "script-treemap-data": {
          id: "script-treemap-data",
          title: "Script Treemap Data",
          details: treemapAudit.details_json,
        },
      },
    };

    const newWindow = window.open("https://googlechrome.github.io/lighthouse/treemap/", "_blank");
    if (!newWindow) return;

    // Listen for the 'opened' message from the Treemap viewer to send data
    const handleMessage = (e: MessageEvent) => {
      if (e.source !== newWindow) return;
      if (e.data && e.data.opened) {
        newWindow.postMessage({ lhr }, "https://googlechrome.github.io");
        window.removeEventListener("message", handleMessage);
      }
    };
    
    window.addEventListener("message", handleMessage);

    // Fallback in case viewer doesn't send the 'opened' ping in time
    setTimeout(() => {
      newWindow.postMessage({ lhr }, "https://googlechrome.github.io");
    }, 2500);
  };

  return (
    <div className="glass-card p-6 border border-slate-200 dark:border-white/10 overflow-hidden relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
          <ImageIcon className="text-blue-500 dark:text-blue-400" />
          Load Timeline
        </h3>
        
        {treemapAudit && (
          <button
            onClick={openTreemap}
            className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-white/10 rounded-md text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-300"
          >
            <LayoutTemplate className="w-4 h-4 text-blue-500" />
            View Treemap
          </button>
        )}
      </div>
      
      <div className="flex overflow-x-auto gap-3 pb-4 snap-x scrollbar-thin">
        {filmstripData.map((frame: any, idx: number) => (
          <div
            key={idx}
            className="flex flex-col items-center flex-shrink-0 snap-start"
          >
            <div className="w-28 h-44 bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden mb-2 shadow-sm dark:shadow-none">
              <img
                src={frame.data}
                alt={`Load frame at ${frame.timing}ms`}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs text-slate-500 dark:text-gray-500 font-mono">
              {frame.timing}ms
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
