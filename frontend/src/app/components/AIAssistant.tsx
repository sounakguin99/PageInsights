"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface AIAssistantProps {
  jobId: string;
  device: string;
}

import { API_BASE } from "../lib/api";

export default function AIAssistant({ jobId, device }: AIAssistantProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.post(`${API_BASE}/ai-insights/${jobId}`, {
          device,
        });
        setInsights(res.data.insights);
      } catch (err: any) {
        console.error("AI Error:", err);
        setError("Failed to generate AI insights.");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchInsights();
    }
  }, [jobId, device]);

  if (!jobId && !loading && !insights) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden border border-purple-500/30 shadow-lg shadow-purple-500/10 mt-8 mb-4 relative"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10 mix-blend-screen pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Performance Analysis
          </h3>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-3" />
            <p className="text-sm text-slate-400 font-medium animate-pulse">
              Google Gemini is analyzing your stack...
            </p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        ) : (
          <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-p:text-slate-300">
            {insights?.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
