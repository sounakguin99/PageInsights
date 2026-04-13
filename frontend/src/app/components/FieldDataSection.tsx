"use client";

import { Globe, CheckCircle2, XCircle } from "lucide-react";

interface FieldMetric {
  label: string;
  value: number | null;
  unit: string;
  category: string | null;
  distributions?: { min: number; max: number; proportion: number }[];
}

interface FieldDataSectionProps {
  report: any;
}

const getCategoryColor = (category: string | null) => {
  switch (category?.toUpperCase()) {
    case 'FAST': return { text: 'text-green-400', bg: 'bg-green-500', border: 'border-green-500/30', badge: 'bg-green-500/15 text-green-400' };
    case 'AVERAGE': return { text: 'text-yellow-400', bg: 'bg-yellow-500', border: 'border-yellow-500/30', badge: 'bg-yellow-500/15 text-yellow-400' };
    case 'SLOW': return { text: 'text-red-400', bg: 'bg-red-500', border: 'border-red-500/30', badge: 'bg-red-500/15 text-red-400' };
    default: return { text: 'text-gray-400', bg: 'bg-gray-500', border: 'border-white/10', badge: 'bg-white/10 text-gray-400' };
  }
};

function DistributionBar({ distributions }: { distributions?: { min: number; max: number; proportion: number }[] }) {
  if (!distributions || distributions.length < 3) return null;
  const fast = Math.round(distributions[0].proportion * 100);
  const avg = Math.round(distributions[1].proportion * 100);
  const slow = Math.round(distributions[2].proportion * 100);

  return (
    <div className="mt-3">
      <div className="flex h-2 rounded-full overflow-hidden gap-px">
        <div className="bg-green-500 rounded-l-full" style={{ width: `${fast}%` }} />
        <div className="bg-yellow-500" style={{ width: `${avg}%` }} />
        <div className="bg-red-500 rounded-r-full" style={{ width: `${slow}%` }} />
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] text-gray-500 font-mono">
        <span className="text-green-500">{fast}%</span>
        <span className="text-yellow-500">{avg}%</span>
        <span className="text-red-500">{slow}%</span>
      </div>
    </div>
  );
}

function FieldMetricCard({ metric }: { metric: FieldMetric }) {
  const colors = getCategoryColor(metric.category);
  const displayValue = metric.value !== null && metric.value !== undefined
    ? (metric.unit === 'ms' ? `${(metric.value / 1000).toFixed(1)} s` : `${metric.value}`)
    : '--';

  return (
    <div className={`p-4 rounded-xl border ${colors.border} bg-white/[0.02]`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs uppercase font-semibold text-gray-400 tracking-wide">{metric.label}</h4>
        {metric.category && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
            {metric.category}
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold font-mono ${colors.text}`}>
        {displayValue}
      </div>
      <DistributionBar distributions={metric.distributions} />
    </div>
  );
}

export default function FieldDataSection({ report }: FieldDataSectionProps) {
  const hasFieldData = report?.field_fcp_ms || report?.field_lcp_ms || report?.field_cls_score;
  if (!hasFieldData) return null;

  // Determine Core Web Vitals pass/fail: LCP, INP, CLS must all be "FAST" or "AVERAGE"
  const coreMetrics = [report.field_lcp_category, report.field_inp_category, report.field_cls_category];
  const coreWebVitalsPassed = coreMetrics.every((c: string) => c && c !== 'SLOW');

  const metrics: FieldMetric[] = [
    { label: "FCP", value: report.field_fcp_ms, unit: "ms", category: report.field_fcp_category, distributions: report.field_fcp_distributions },
    { label: "INP", value: report.field_inp_ms, unit: "ms", category: report.field_inp_category, distributions: report.field_inp_distributions },
    { label: "LCP", value: report.field_lcp_ms, unit: "ms", category: report.field_lcp_category, distributions: report.field_lcp_distributions },
    { label: "CLS", value: report.field_cls_score, unit: "", category: report.field_cls_category, distributions: report.field_cls_distributions },
    { label: "TTFB", value: report.field_ttfb_ms, unit: "ms", category: report.field_ttfb_category, distributions: report.field_ttfb_distributions },
  ];

  return (
    <div className="glass-card p-6 border border-white/10">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Globe className="text-blue-400" />
          Discover what your real users are experiencing
        </h3>
        <div className="flex items-center gap-2">
          {coreWebVitalsPassed ? (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-green-400">
              <CheckCircle2 className="w-4 h-4" /> Core Web Vitals Passed
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-red-400">
              <XCircle className="w-4 h-4" /> Core Web Vitals Failed
            </span>
          )}
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-6">Chrome User Experience Report (CrUX) — real-world field data collected over 28 days.</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {metrics.map((m) => (
          <FieldMetricCard key={m.label} metric={m} />
        ))}
      </div>
    </div>
  );
}
