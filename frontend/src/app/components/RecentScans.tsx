"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Clock, Globe, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function RecentScans({
  onSelect,
}: {
  onSelect: (id: string, url: string) => void;
}) {
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get(`${API_BASE}/recent`);
        setRecent(res.data);
      } catch (e) {
        console.error("Failed to fetch recent scans", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  if (loading) return null;
  if (recent.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mt-12 mb-20 mx-auto"
    >
      <div className="flex items-center gap-2 mb-6 px-4">
        <Clock className="w-5 h-5 text-blue-500" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Recent Analysis History
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
        {recent.map((scan) => (
          <button
            key={scan.id}
            onClick={() => onSelect(scan.id, scan.url)}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/20 hover:border-blue-500/50 hover:bg-white dark:hover:bg-white/5 transition-all group text-left"
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Globe className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <div className="font-semibold text-slate-900 dark:text-gray-200 truncate pr-2">
                  {scan.url.replace(/^https?:\/\//i, "")}
                </div>
                <div className="text-xs text-slate-500 dark:text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${scan.status === "done" ? "bg-green-500" : "bg-yellow-500"}`}
                  ></span>
                  {new Date(scan.created_at).toLocaleDateString()} at{" "}
                  {new Date(scan.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
