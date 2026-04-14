"use client";

import { Activity, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface LabMetricsProps {
  report: any;
}

// Official Lighthouse thresholds for metric color coding
const getMetricStatus = (
  metricKey: string,
  value: number | null,
): "fast" | "average" | "slow" => {
  if (value === null || value === undefined) return "average";

  const thresholds: Record<string, [number, number]> = {
    fcp: [1800, 3000],
    lcp: [2500, 4000],
    tbt: [200, 600],
    cls: [0.1, 0.25],
    si: [3400, 5800],
    tti: [3800, 7300],
  };

  const t = thresholds[metricKey];
  if (!t) return "average";
  if (value < t[0]) return "fast";
  if (value < t[1]) return "average";
  return "slow";
};

const statusColors: Record<string, string> = {
  fast: "text-green-600 dark:text-green-400 border-green-500/20 bg-green-500/5",
  average:
    "text-yellow-600 dark:text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
  slow: "text-red-600 dark:text-red-400 border-red-500/20 bg-red-500/5",
};

interface MetricCardProps {
  title: string;
  value: string | undefined;
  status: "fast" | "average" | "slow";
  description?: string;
  isExpanded?: boolean;
}

function MetricCard({ title, value, status, description, isExpanded }: MetricCardProps) {
  const StatusIcon = () => {
    if (status === "fast") return <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />;
    if (status === "average") return <span className="inline-block w-2.5 h-2.5 bg-yellow-500 flex-shrink-0" />; // square
    return <span className="inline-block w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8.6px] border-l-transparent border-r-transparent border-b-red-500 flex-shrink-0" />; // triangle
  };

  return (
    <div className={`p-4 rounded-xl border ${statusColors[status]} flex flex-col justify-start transition-all duration-300`}>
      <div className="flex items-center gap-2 mb-2">
        <StatusIcon />
        <h4 className="text-xs uppercase font-semibold opacity-70 tracking-wide m-0">
          {title}
        </h4>
      </div>
      <div className="text-2xl font-bold font-mono mb-1">{value || "--"}</div>
      
      {isExpanded && description && (
        <div className="text-sm mt-3 opacity-90 leading-relaxed font-sans normal-case text-slate-700 dark:text-slate-300 border-t border-current pt-3 border-opacity-10 dark:border-opacity-10 transition-all duration-300">
          {description}
        </div>
      )}
    </div>
  );
}

export default function LabMetrics({ report }: LabMetricsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const metrics = [
    {
      key: "fcp",
      title: "First Contentful Paint (FCP)",
      value: report.fcp_display,
      ms: report.fcp_ms,
      description: "First Contentful Paint marks the time at which the first text or image is painted.",
    },
    {
      key: "lcp",
      title: "Largest Contentful Paint (LCP)",
      value: report.lcp_display,
      ms: report.lcp_ms,
      description: "Largest Contentful Paint marks the time at which the largest text or image is painted.",
    },
    {
      key: "tbt",
      title: "Total Blocking Time (TBT)",
      value: report.tbt_display,
      ms: report.tbt_ms,
      description: "Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds.",
    },
    {
      key: "cls",
      title: "Cumulative Layout Shift (CLS)",
      value: report.cls_display,
      ms: report.cls_score,
      description: "Cumulative Layout Shift measures the movement of visible elements within the viewport.",
    },
    {
      key: "si",
      title: "Speed Index (SI)",
      value: report.si_display,
      ms: report.si_ms,
      description: "Speed Index shows how quickly the contents of a page are visibly populated.",
    },
    {
      key: "tti",
      title: "Time to Interactive (TTI)",
      value: report.tti_display,
      ms: report.tti_ms,
      description: "Time to interactive is the amount of time it takes for the page to become fully interactive.",
    },
  ];

  return (
    <div className="glass-card p-6 border border-slate-200 dark:border-white/10 relative">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold mb-1 flex items-center gap-2 text-slate-900 dark:text-white">
            <Activity className="text-blue-500 dark:text-blue-400" />
            Lab Metrics
          </h3>
          <p className="text-slate-500 dark:text-gray-500 text-sm">
            Simulated environment load performance.
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg"
        >
          {isExpanded ? (
            <>
              Collapse view <ChevronUp className="w-4 h-4 ml-0.5 opacity-70 group-hover:opacity-100" />
            </>
          ) : (
            <>
              Expand view <ChevronDown className="w-4 h-4 ml-0.5 opacity-70 group-hover:opacity-100" />
            </>
          )}
        </button>
      </div>

      <div className={`grid gap-4 transition-all duration-300 ${isExpanded ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2 md:grid-cols-3"}`}>
        {metrics.map((m) => (
          <MetricCard
            key={m.key}
            title={m.title}
            value={m.value}
            status={getMetricStatus(m.key, m.ms)}
            description={m.description}
            isExpanded={isExpanded}
          />
        ))}
      </div>
    </div>
  );
}
