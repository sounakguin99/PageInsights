"use client";

import { Sparkles, ArrowRight, Terminal } from "lucide-react";
import { motion } from "framer-motion";

interface AIFixAssistantProps {
  auditTitle: string;
  auditDescription: string;
}

export default function AIFixAssistant({ auditTitle, auditDescription }: AIFixAssistantProps) {
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
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase">Future Feature</span>
      </div>

      <p className="text-xs text-blue-900/70 dark:text-blue-100/70 mb-4 leading-relaxed italic">
        "Our upcoming AI engine will analyze <span className="text-blue-600 dark:text-blue-300 font-semibold">{auditTitle}</span> 
        and provide a step-by-step code tutorial to fix it instantly."
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-60">
        <div className="p-3 rounded-lg bg-white/40 dark:bg-black/40 border border-slate-200 dark:border-white/5 flex items-center gap-3">
          <Terminal className="w-4 h-4 text-slate-400 dark:text-gray-400" />
          <div className="text-[10px] text-slate-500 dark:text-gray-500 font-mono">Generating fix snippet...</div>
        </div>
        <button disabled className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-400 dark:text-gray-400 cursor-not-allowed group-hover:border-blue-500/30 transition-colors">
          Suggest Fix
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Decorative pulse */}
      <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
    </motion.div>
  );
}
