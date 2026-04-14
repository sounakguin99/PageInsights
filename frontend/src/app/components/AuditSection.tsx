"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Zap,
  Info,
  AlertTriangle,
} from "lucide-react";
import AuditItem from "./AuditItem";

interface AuditSectionProps {
  title: string;
  audits: any[];
  type:
    | "opportunity"
    | "diagnostic"
    | "passed"
    | "failing"
    | "manual"
    | "not-applicable";
  defaultCollapsed?: boolean;
  icon?: React.ReactNode;
  badgeColor?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  opportunity: <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />,
  diagnostic: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
  passed: (
    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />
  ),
  failing: <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />,
  manual: <Info className="w-5 h-5 text-slate-500 dark:text-gray-400" />,
  "not-applicable": (
    <Info className="w-5 h-5 text-slate-400 dark:text-gray-500" />
  ),
};

const badgeColorMap: Record<string, string> = {
  opportunity: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500",
  diagnostic: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  passed: "bg-green-500/10 text-green-600 dark:text-green-500",
  failing: "bg-red-500/10 text-red-600 dark:text-red-500",
  manual: "bg-slate-500/10 text-slate-500 dark:text-gray-400",
  "not-applicable": "bg-slate-500/10 text-slate-400 dark:text-gray-500",
};

export default function AuditSection({
  title,
  audits,
  type,
  defaultCollapsed = false,
  icon,
  badgeColor,
}: AuditSectionProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  if (audits.length === 0) {
    if (type === "opportunity" || type === "diagnostic") {
      return (
        <div className="glass-card border border-slate-200 dark:border-white/10 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.03] flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              {icon || iconMap[type]}
              {title}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColor || badgeColorMap[type]}`}
            >
              0
            </span>
          </div>
          <div className="p-8 text-center text-slate-500 dark:text-gray-500">
            No {title.toLowerCase()} found!
          </div>
        </div>
      );
    }
    return null;
  }

  // Collapsible sections (passed, manual, not-applicable)
  if (defaultCollapsed) {
    return (
      <div className="glass-card border border-white/10 dark:border-white/5 overflow-hidden">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors"
        >
          <div className="flex items-center gap-3">
            {icon || iconMap[type]}
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              {" "}
              {title} ({audits.length})
            </h3>
          </div>
          {collapsed ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          )}
        </button>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
                {audits.map((audit: any, idx: number) => (
                  <div key={idx} className="px-6 py-3 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                    <h4 className="font-medium text-slate-600 dark:text-gray-400 text-sm">
                      {audit.title}
                    </h4>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Standard sections (opportunity, diagnostic, failing)
  return (
    <div className="glass-card border border-white/10 dark:border-white/5 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03] flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
          {icon || iconMap[type]}
          {title}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColor || badgeColorMap[type]}`}
        >
          {audits.length}
        </span>
      </div>
      <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
        {audits.map((audit: any, idx: number) => (
          <AuditItem key={idx} audit={audit} />
        ))}
      </div>
    </div>
  );
}
