"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, User, Sparkles, Loader2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface ChatBuddyProps {
  report?: any;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

type Message = {
  role: "user" | "model";
  text: string;
};

export default function ChatBuddy({ report }: ChatBuddyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hi there! I'm your optimization buddy. Run a scan and ask me how to fix your website's performance!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    // If a new report comes in, the buddy can introduce it.
    if (report && report.overall_score !== undefined) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `I see your new scan scored ${report.overall_score}/100 overall! Need any help fixing those specific issues?`,
        },
      ]);
    }
  }, [report?.id]); // depend on report id changing

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    
    const newMessages: Message[] = [...messages, { role: "user", text: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Build context from report
      let contextStr = "No report available yet.";
      if (report) {
         contextStr = `Performance: ${report.performance_score}, LCP: ${report.lcp_display}, TBT: ${report.tbt_display}. Issues: ${report.audits?.filter((a: any) => a.score < 1 && a.group_type === 'opportunity').slice(0,3).map((a:any) => a.title).join(", ")}`;
      }

      // Format for Gemini SDK expects { role: 'user'|'model', parts: [{text}] }
      const apiMessages = newMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const res = await axios.post(`${API_BASE}/ai-chat`, {
        messages: apiMessages,
        context: contextStr
      });

      setMessages((prev) => [
        ...prev,
        { role: "model", text: res.data.reply }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Oops, my circuits got tangled! Please try again later." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-80 sm:w-96 mb-4 glass-card border border-purple-500/30 shadow-2xl flex flex-col overflow-hidden rounded-2xl bg-white/90 dark:bg-[#0f111a]/95 backdrop-blur-xl"
            style={{ maxHeight: "calc(100vh - 120px)", height: "500px" }}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-full">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">PerfBuddy AI</h3>
                  <p className="text-[10px] text-blue-100 opacity-80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                title="Minimize"
              >
                <Minimize2 size={16} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ overscrollBehavior: 'contain' }}>
              {messages.map((m, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx}
                  className={`flex items-end gap-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300" : "bg-gradient-to-br from-blue-500 to-purple-500 text-white"}`}>
                    {m.role === "user" ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 shadow-sm ${m.role === "user" ? "bg-slate-100 dark:bg-white/10 rounded-br-none" : "bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-bl-none"}`}>
                    <pre className="whitespace-pre-wrap font-sans leading-relaxed">{m.text}</pre>
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    <Bot size={12} />
                  </div>
                  <div className="max-w-[75%] rounded-2xl rounded-bl-none px-4 py-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                    <Loader2 size={14} className="animate-spin text-blue-500" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0c10] shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your audits..."
                  className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white dark:focus:bg-[#0a0c10] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-colors"
                >
                  <Send size={16} className="-ml-0.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/30 flex items-center justify-center hover:shadow-purple-500/50 transition-all border-2 border-white/20 group relative"
      >
        {!isOpen && (
           <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse border-2 border-slate-900"></span>
        )}
        <Bot className="text-white w-7 h-7 group-hover:block transition-transform duration-300" />
      </motion.button>
    </div>
  );
}
