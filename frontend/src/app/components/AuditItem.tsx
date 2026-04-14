"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  XCircle,
  Info,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AIFixAssistant from "./AIFixAssistant";

interface AuditItemProps {
  audit: any;
  defaultExpanded?: boolean;
}

const getSeverityIcon = (score: number | null) => {
  if (score === null || score === undefined)
    return (
      <Info className="w-4 h-4 text-slate-400 dark:text-gray-400 flex-shrink-0" />
    );
  if (score < 0.5)
    return (
      <XCircle className="w-4 h-4 text-red-600 dark:text-red-500 flex-shrink-0" />
    );
  if (score < 0.9)
    return (
      <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
    );
  return (
    <Info className="w-4 h-4 text-slate-400 dark:text-gray-400 flex-shrink-0" />
  );
};

const getSeverityBorder = (score: number | null) => {
  if (score === null || score === undefined) return "border-l-gray-500/30";
  if (score < 0.5) return "border-l-red-500/50";
  if (score < 0.9) return "border-l-yellow-500/50";
  return "border-l-gray-500/30";
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / 1048576).toFixed(1)} MiB`;
}

function DetailsTable({ details }: { details: any }) {
  if (!details) return null;

  if (details.type === "table" || details.type === "opportunity") {
    const headings = details.headings;
    const items = details.items;
    if (!headings || !items || items.length === 0) return null;

    return (
      <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-white/5">
              {headings.map((h: any, i: number) => (
                <th
                  key={i}
                  className="px-3 py-2 text-left text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {h.label || h.text || h.key || ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {items.slice(0, 10).map((item: any, rowIdx: number) => (
              <tr key={rowIdx} className="hover:bg-white/[0.02]">
                {headings.map((h: any, colIdx: number) => {
                  const key = h.key;
                  let cellValue = item[key];

                  // Handle nested objects (like url objects)
                  if (typeof cellValue === "object" && cellValue !== null) {
                    cellValue =
                      cellValue.url ||
                      cellValue.text ||
                      JSON.stringify(cellValue);
                  }

                  // Format bytes
                  if (
                    h.valueType === "bytes" &&
                    typeof cellValue === "number"
                  ) {
                    cellValue = formatBytes(cellValue);
                  }
                  // Format ms
                  if (
                    h.valueType === "timespanMs" &&
                    typeof cellValue === "number"
                  ) {
                    cellValue = `${cellValue.toFixed(0)} ms`;
                  }

                  const isUrl =
                    typeof cellValue === "string" &&
                    (cellValue.startsWith("http") || cellValue.startsWith("/"));

                  return (
                    <td
                      key={colIdx}
                      className="px-3 py-2 text-slate-700 dark:text-gray-300 text-xs max-w-[300px]"
                    >
                      {isUrl ? (
                        <span
                          className="text-blue-600 dark:text-blue-400 truncate block"
                          title={cellValue}
                        >
                          {cellValue.length > 60
                            ? "..." + cellValue.slice(-57)
                            : cellValue}
                        </span>
                      ) : (
                        <span className="truncate block">
                          {cellValue ?? "—"}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {items.length > 10 && (
          <div className="px-3 py-2 text-xs text-gray-500 border-t border-white/5">
            ...and {items.length - 10} more items
          </div>
        )}
      </div>
    );
  }

  if (details.type === "list" && details.items) {
    return (
      <ul className="mt-3 space-y-1 text-sm text-gray-400">
        {details.items.slice(0, 5).map((item: any, i: number) => (
          <li key={i} className="pl-4 border-l-2 border-white/10">
            {typeof item === "string"
              ? item
              : item.text || item.url || JSON.stringify(item)}
          </li>
        ))}
      </ul>
    );
  }

  return null;
}

export default function AuditItem({
  audit,
  defaultExpanded = false,
}: AuditItemProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasDetails =
    audit.details_json &&
    (audit.details_json.type === "table" ||
      audit.details_json.type === "opportunity" ||
      audit.details_json.type === "list") &&
    audit.details_json.items?.length > 0;

  return (
    <div
      className={`border-l-2 ${getSeverityBorder(audit.score)} transition-colors`}
    >
      <button
        onClick={() => hasDetails && setExpanded(!expanded)}
        className={`w-full px-5 py-4 flex items-start gap-3 text-left hover:bg-slate-100 dark:hover:bg-white/[0.03] transition-colors ${hasDetails ? "cursor-pointer" : "cursor-default"}`}
      >
        {getSeverityIcon(audit.score)}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-slate-900 dark:text-gray-200 text-sm">
              {audit.title}
            </h4>
            {audit.display_value && (
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-white/5">
                {audit.display_value}
              </span>
            )}
          </div>
          {(audit.savings_ms || audit.savings_bytes) && (
            <div className="flex gap-3 mt-1.5">
              {audit.savings_ms && audit.savings_ms > 0 && (
                <span className="text-xs font-mono text-purple-600 dark:text-purple-400">
                  Est. savings: {Math.round(audit.savings_ms)} ms
                </span>
              )}
              {audit.savings_bytes && audit.savings_bytes > 0 && (
                <span className="text-xs font-mono text-purple-600 dark:text-purple-400">
                  Est. savings: {formatBytes(audit.savings_bytes)}
                </span>
              )}
            </div>
          )}
        </div>
        {hasDetails && (
          <div className="mt-1">
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </div>
        )}
      </button>
      <AnimatePresence>
        {expanded && hasDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden px-5 pb-4"
          >
            <p
              className="text-xs text-gray-500 mb-2 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: audit.description || "" }}
            />
            <DetailsTable details={audit.details_json} />

            {/* AI Fix Assistant (for audits that need attention) */}
            {audit.score !== null && audit.score < 1 && (
              <AIFixAssistant
                auditTitle={audit.title}
                auditDescription={audit.description}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
