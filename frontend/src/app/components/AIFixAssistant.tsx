"use client";

import { useState } from "react";
import axios from "axios";
import { Sparkles, ArrowRight, Terminal, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AIFixAssistantProps {
  auditTitle: string;
  auditDescription: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function AIFixAssistant({ auditTitle, auditDescription }: AIFixAssistantProps) {
  const [fix, setFix] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestFix = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/ai-fix`, {
        title: auditTitle,
        description: auditDescription,
      });
      setFix(res.data.fix);
    } catch (err: any) {
      console.error("AI Fix Error:", err);
      setError("Failed to generate AI fix.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent dark:from-blue-600/10 dark:via-purple-600/5 dark:to-transparent overflow-hidden relative group"
    >
      <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
        <Sparkles className="w-12 h-12 text-blue-600 dark:text-blue-400" />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <h5 className="text-sm font-bold text-blue-700 dark:text-blue-300 tracking-tight">AI Fix Assistant</h5>
        {!fix && !loading && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase">Experimental</span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!fix && !loading && !error && (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-xs text-blue-900/70 dark:text-blue-100/70 mb-4 leading-relaxed italic">
              "Our AI engine can analyze <span className="text-blue-600 dark:text-blue-300 font-semibold">{auditTitle}</span> 
              and provide a step-by-step code tutorial to fix it instantly."
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/40 dark:bg-black/40 border border-slate-200 dark:border-white/5 flex items-center gap-3">
                <Terminal className="w-4 h-4 text-slate-400 dark:text-gray-400" />
                <div className="text-[10px] text-slate-500 dark:text-gray-500 font-mono">Ready to generate solution...</div>
              </div>
              <button 
                onClick={handleSuggestFix}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-95"
              >
                Suggest Fix
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}

        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-6"
          >
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-3" />
            <p className="text-xs text-blue-900/70 dark:text-blue-100/70 font-medium animate-pulse">
              Generating tailored fix for this issue...
            </p>
          </motion.div>
        )}

        {error && (
           <motion.div
             key="error"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
           >
             <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs mb-3">
               {error}
             </div>
             <button 
                onClick={handleSuggestFix}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                Try Again
             </button>
           </motion.div>
        )}

        {fix && !loading && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2"
          >
             <div className="p-4 bg-white/60 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg overflow-x-auto">
               <pre className="text-xs text-slate-800 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                 {fix}
               </pre>
             </div>
             <button 
                onClick={() => setFix(null)}
                className="mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors ml-auto"
              >
                Close
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
    </motion.div>
  );
}
