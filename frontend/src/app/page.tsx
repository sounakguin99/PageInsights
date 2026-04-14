"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import HeroSection from "./components/HeroSection";
import ScoreBanner from "./components/ScoreBanner";
import CategoryScores from "./components/CategoryScores";
import FieldDataSection from "./components/FieldDataSection";
import LabMetrics from "./components/LabMetrics";
import FilmstripTimeline from "./components/FilmstripTimeline";
import AuditSection from "./components/AuditSection";
import CategoryReport from "./components/CategoryReport";
import ScanningState from "./components/ScanningState";
import RecentScans from "./components/RecentScans";
import AIAssistant from "./components/AIAssistant";
import ChatBuddy from "./components/ChatBuddy";

const AUDIT_METRIC_MAP: Record<string, string[]> = {
  // FCP
  "server-response-time": ["FCP", "LCP"],
  "render-blocking-insight": ["FCP", "LCP"],
  "render-blocking-resources": ["FCP", "LCP"],
  "redirects": ["FCP", "LCP"],
  "unminified-css": ["FCP", "LCP"],
  "uses-rel-preconnect": ["FCP", "LCP"],
  "uses-rel-preload": ["FCP", "LCP", "TBT"],
  "font-display-insight": ["FCP", "LCP"],
  "font-display": ["FCP", "LCP"],
  "unused-css-rules": ["FCP", "LCP"],
  "network-server-latency": ["FCP", "LCP"],
  
  // LCP
  "largest-contentful-paint-element": ["LCP"],
  "lcp-lazy-loaded": ["LCP"],
  "prioritize-lcp-image": ["LCP"],
  "preload-lcp-image": ["LCP"],
  "uses-responsive-images": ["LCP"],
  "uses-optimized-images": ["LCP"],
  "modern-image-formats": ["LCP"],
  "offscreen-images": ["LCP"],
  "lcp-breakdown-insight": ["LCP"],
  "lcp-discovery-insight": ["LCP"],
  "image-delivery-insight": ["LCP"],

  // TBT
  "bootup-time": ["TBT"],
  "mainthread-work-breakdown": ["TBT"],
  "dom-size": ["TBT"],
  "dom-size-insight": ["TBT"],
  "unminified-javascript": ["TBT", "LCP"],
  "unused-javascript": ["TBT", "LCP"],
  "third-party-summary": ["TBT"],
  "third-parties-insight": ["TBT"],
  "third-party-facades": ["TBT"],
  "script-treemap-data": ["TBT"],
  "duplicate-javascript": ["TBT", "LCP"],
  "duplicated-javascript-insight": ["TBT", "LCP"],
  "legacy-javascript": ["TBT", "LCP"],
  "legacy-javascript-insight": ["TBT", "LCP"],
  "forced-reflow-insight": ["TBT"],
  "main-thread-tasks": ["TBT"],
  "long-tasks": ["TBT"],

  // CLS
  "layout-shift-elements": ["CLS"],
  "unsized-images": ["CLS", "LCP"],
  "non-composited-animations": ["CLS"],
  "cls-culprits-insight": ["CLS"],
  "layout-shifts": ["CLS"],
  "cumulative-layout-shift": ["CLS"],
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function Home() {
  const [url, setUrl] = useState("");
  const [device, setDevice] = useState("desktop");
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const [reportsCache, setReportsCache] = useState<Record<string, any>>({});
  const [report, setReport] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [metricFilter, setMetricFilter] = useState<string>("All");

  useEffect(() => {
    setReport(reportsCache[device] || null);
  }, [device, reportsCache]);

  const fetchReport = async (id: string) => {
    try {
      setIsScanning(false);
      const reportRes = await axios.get(`${API_BASE}/report/${id}`);
      setReportsCache(reportRes.data);
      setReport(reportRes.data[device]);
    } catch (error) {
      console.error("Error fetching report", error);
    }
  };

  const handleRecentSelect = (id: string, selectedUrl: string) => {
    setUrl(selectedUrl);
    setJobId(id);
    setReportsCache({});
    setReport(null);
    setIsScanning(false);
    fetchReport(id);

    // Smooth scroll to results
    setTimeout(() => {
      window.scrollTo({ top: 300, behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (jobId && isScanning) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`${API_BASE}/status/${jobId}`);
          setStatus(res.data.status);
          setProgress(res.data.progress);

          if (res.data.status === "done") {
            fetchReport(jobId);
          } else if (res.data.status === "failed") {
            setIsScanning(false);
            alert("Analysis failed. Please try again.");
          }
        } catch (error) {
          console.error("Error fetching status", error);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [jobId, isScanning, device]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    let targetUrl = url;
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = "https://" + targetUrl;
    }

    setIsScanning(true);
    setReportsCache({});
    setReport(null);
    setJobId(null);

    try {
      const res = await axios.post(`${API_BASE}/analyze`, { url: targetUrl });
      setJobId(res.data.job_id);
    } catch (error) {
      console.error("Error starting scan", error);
      setIsScanning(false);
    }
  };

  // Group audits by type for performance category
  const allAudits = report?.audits || [];
  const perfAudits = allAudits.filter((a: any) => a.category === "performance");
  const oppAudits = perfAudits
    .filter(
      (a: any) =>
        a.group_type === "opportunity" && a.score !== null && a.score < 1,
    )
    .sort((a: any, b: any) => (b.savings_ms || 0) - (a.savings_ms || 0));
  const diagAudits = perfAudits.filter(
    (a: any) =>
      a.group_type === "diagnostic" && a.score !== null && a.score < 1,
  );
  const perfPassedAudits = perfAudits.filter(
    (a: any) =>
      a.group_type === "passed" ||
      (a.score === 1 &&
        a.score_display_mode !== "manual" &&
        a.score_display_mode !== "informative" &&
        a.score_display_mode !== "notApplicable"),
  );

  const filterByMetric = (auditsList: any[]) => {
    if (metricFilter === "All") return auditsList;
    return auditsList.filter(a => {
      const mapped = AUDIT_METRIC_MAP[a.audit_id] || [];
      return mapped.includes(metricFilter);
    });
  };

  const filteredOppAudits = filterByMetric(oppAudits);
  const filteredDiagAudits = filterByMetric(diagAudits);
  const filteredPerfPassedAudits = filterByMetric(perfPassedAudits);

  return (
    <div className="p-6 md:p-12 lg:px-24 flex flex-col items-center">
      {/* Hero Header */}
      <div className="pt-4 w-full flex flex-col items-center">
        <HeroSection
          url={url}
          setUrl={setUrl}
          device={device}
          setDevice={setDevice}
          isScanning={isScanning}
          onAnalyze={handleAnalyze}
        />
      </div>

      {/* Results Area */}
      <div className="w-full max-w-6xl">
        <AnimatePresence mode="wait">
          {/* Scanning State */}
          {isScanning && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ScanningState device={device} progress={progress} />
            </motion.div>
          )}

          {/* Results State */}
          {report && !isScanning && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-8"
            >
              <ScoreBanner
                device={device}
                overallScore={report.overall_score}
              />

              <CategoryScores
                performance={report.performance_score}
                accessibility={report.accessibility_score}
                bestPractices={report.best_practice_score}
                seo={report.seo_score}
              />

              {jobId && <AIAssistant jobId={jobId} device={device} />}

              <FieldDataSection report={report} />

              <div className="border-t border-slate-200 dark:border-white/5 pt-6">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  Performance
                </h2>

                <div className="space-y-6">
                  <LabMetrics report={report} />
                  <FilmstripTimeline 
                    filmstripData={report.filmstrip_data} 
                    url={url}
                    treemapAudit={allAudits.find((a: any) => a.audit_id === "script-treemap-data")}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-8 mb-2 gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-gray-400 uppercase tracking-widest">
                      Insights & Audits
                    </h3>
                    <div className="flex items-center flex-wrap gap-1 md:gap-2 text-sm justify-start sm:justify-end">
                      <span className="text-slate-500 dark:text-gray-500 mr-1 md:mr-2">Show audits relevant to:</span>
                      {["All", "FCP", "LCP", "TBT", "CLS"].map(filter => (
                        <button
                          key={filter}
                          onClick={() => setMetricFilter(filter)}
                          className={`px-2 py-0.5 rounded transition-all ${
                            metricFilter === filter 
                              ? "bg-blue-600 text-white font-medium" 
                              : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AuditSection
                      title="Opportunities"
                      audits={filteredOppAudits}
                      type="opportunity"
                    />
                    <AuditSection
                      title="Diagnostics"
                      audits={filteredDiagAudits}
                      type="diagnostic"
                    />
                  </div>

                  <AuditSection
                    title="Passed audits"
                    audits={filteredPerfPassedAudits}
                    type="passed"
                    defaultCollapsed
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-white/5 pt-6">
                <CategoryReport
                  categoryKey="accessibility"
                  categoryLabel="Accessibility"
                  score={report.accessibility_score}
                  audits={allAudits}
                  description="These checks highlight opportunities to improve the accessibility of your web app."
                />
              </div>

              <div className="border-t border-slate-200 dark:border-white/5 pt-6">
                <CategoryReport
                  categoryKey="best-practices"
                  categoryLabel="Best Practices"
                  score={report.best_practice_score}
                  audits={allAudits}
                />
              </div>

              <div className="border-t border-slate-200 dark:border-white/5 pt-6">
                <CategoryReport
                  categoryKey="seo"
                  categoryLabel="SEO"
                  score={report.seo_score}
                  audits={allAudits}
                  description="These checks ensure that your page is following basic search engine optimization advice."
                />
              </div>

              <div className="text-center py-8 text-slate-500 dark:text-gray-600 text-sm border-t border-slate-200 dark:border-white/5 mt-12">
                <p>Powered by Google PageSpeed Insights API v5</p>
                <p className="mt-1">
                  Data identical to{" "}
                  <a
                    href="https://pagespeed.web.dev"
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    pagespeed.web.dev
                  </a>
                </p>
              </div>
            </motion.div>
          )}

          {/* Recent Scans */}
          {!report && !isScanning && (
            <RecentScans onSelect={handleRecentSelect} />
          )}
        </AnimatePresence>
      </div>

      <ChatBuddy report={report} />
    </div>
  );
}
