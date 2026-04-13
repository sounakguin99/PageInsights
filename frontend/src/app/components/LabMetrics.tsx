"use client";

import { Activity } from "lucide-react";

interface LabMetricsProps {
  report: any;
}

// Official Lighthouse thresholds for metric color coding
const getMetricStatus = (metricKey: string, value: number | null): 'fast' | 'average' | 'slow' => {
  if (value === null || value === undefined) return 'average';

  const thresholds: Record<string, [number, number]> = {
    fcp:  [1800, 3000],
    lcp:  [2500, 4000],
    tbt:  [200, 600],
    cls:  [0.1, 0.25],
    si:   [3400, 5800],
    tti:  [3800, 7300],
  };

  const t = thresholds[metricKey];
  if (!t) return 'average';
  if (value < t[0]) return 'fast';
  if (value < t[1]) return 'average';
  return 'slow';
};

const statusColors: Record<string, string> = {
  fast: 'text-green-400 border-green-500/20 bg-green-500/5',
  average: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5',
  slow: 'text-red-400 border-red-500/20 bg-red-500/5',
};

interface MetricCardProps {
  title: string;
  value: string | undefined;
  status: 'fast' | 'average' | 'slow';
}

function MetricCard({ title, value, status }: MetricCardProps) {
  return (
    <div className={`p-4 rounded-xl border ${statusColors[status]}`}>
      <h4 className="text-xs uppercase font-semibold opacity-70 mb-2 tracking-wide">{title}</h4>
      <div className="text-2xl font-bold font-mono">{value || '--'}</div>
    </div>
  );
}

export default function LabMetrics({ report }: LabMetricsProps) {
  const metrics = [
    { key: 'fcp', title: 'First Contentful Paint (FCP)', value: report.fcp_display, ms: report.fcp_ms },
    { key: 'lcp', title: 'Largest Contentful Paint (LCP)', value: report.lcp_display, ms: report.lcp_ms },
    { key: 'tbt', title: 'Total Blocking Time (TBT)', value: report.tbt_display, ms: report.tbt_ms },
    { key: 'cls', title: 'Cumulative Layout Shift (CLS)', value: report.cls_display, ms: report.cls_score },
    { key: 'si', title: 'Speed Index (SI)', value: report.si_display, ms: report.si_ms },
    { key: 'tti', title: 'Time to Interactive (TTI)', value: report.tti_display, ms: report.tti_ms },
  ];

  return (
    <div className="glass-card p-6 border border-white/10">
      <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
        <Activity className="text-blue-400" />
        Lab Metrics
      </h3>
      <p className="text-gray-500 text-sm mb-6">Simulated environment load performance.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <MetricCard
            key={m.key}
            title={m.title}
            value={m.value}
            status={getMetricStatus(m.key, m.ms)}
          />
        ))}
      </div>
    </div>
  );
}
