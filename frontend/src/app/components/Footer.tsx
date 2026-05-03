"use client";

import { Code, Share2, Globe, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer aria-label="Site footer" className="w-full py-12 px-6 border-t border-white/10 dark:border-white/5 bg-white/5 dark:bg-black/20 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1 rounded-md bg-blue-600 text-white">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="text-lg font-bold">PageInsights</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
            Leading the next generation of web performance analytics. Instant
            diagnostics, accessibility audits, and AI-powered fix suggestions
            for modern developers.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">
            Product
          </h4>
          <ul className="space-y-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            <li>
              <a href="#" className="hover:text-blue-500 transition-colors">
                Analyzer
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500 transition-colors">
                API Docs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500 transition-colors">
                Status
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500 transition-colors">
                History
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">
            Connect
          </h4>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/pageinsights"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg glass border border-white/10 hover:border-blue-500/30 transition-all text-gray-500 hover:text-blue-500"
              title="GitHub"
              aria-label="PageInsights on GitHub"
            >
              <Code className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com/pageinsights"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg glass border border-white/10 hover:border-blue-500/30 transition-all text-gray-500 hover:text-blue-500"
              title="Twitter / X"
              aria-label="PageInsights on Twitter"
            >
              <Share2 className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg glass border border-white/10 hover:border-blue-500/30 transition-all text-gray-500 hover:text-blue-500"
              title="LinkIn"
            >
              <Globe className="w-5 h-5" />
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-8">
            &copy; {new Date().getFullYear()} PageInsights Engine. Built on
            Google PSI v5.
          </p>
        </div>
      </div>
    </footer>
  );
}
