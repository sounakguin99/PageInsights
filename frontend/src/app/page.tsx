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

  useEffect(() => {
    setReport(reportsCache[device] || null);
  }, [device, reportsCache]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (jobId && isScanning) {
      interval = setInterval(async () => {
        try {
          const res = await axios.get(`${API_BASE}/status/${jobId}`);
          setStatus(res.data.status);
          setProgress(res.data.progress);

          if (res.data.status === "done") {
            setIsScanning(false);
            const reportRes = await axios.get(`${API_BASE}/report/${jobId}`);
            setReportsCache(reportRes.data);
            setReport(reportRes.data[device]);
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
      targetUrl = 'https://' + targetUrl;
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
  const perfAudits = allAudits.filter((a: any) => a.category === 'performance');
  const oppAudits = perfAudits.filter((a: any) => a.group_type === 'opportunity' && a.score !== null && a.score < 1)
    .sort((a: any, b: any) => (b.savings_ms || 0) - (a.savings_ms || 0));
  const diagAudits = perfAudits.filter((a: any) => a.group_type === 'diagnostic' && a.score !== null && a.score < 1);
  const perfPassedAudits = perfAudits.filter((a: any) =>
    a.group_type === 'passed' || (a.score === 1 && a.score_display_mode !== 'manual' && a.score_display_mode !== 'informative' && a.score_display_mode !== 'notApplicable')
  );

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

              {/* Section 2: Score Banner */}
              <ScoreBanner device={device} overallScore={report.overall_score} />

              {/* Section 3: Category Score Circles */}
              <CategoryScores
                performance={report.performance_score}
                accessibility={report.accessibility_score}
                bestPractices={report.best_practice_score}
                seo={report.seo_score}
              />

              {/* Section 4: Field Data (CrUX) */}
              <FieldDataSection report={report} />

              {/* ── PERFORMANCE SECTION ── */}
              <div className="border-t border-slate-200 dark:border-white/5 pt-6">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  Performance
                </h2>

                {/* Section 5: Lab Metrics */}
                <div className="space-y-6">
                  <LabMetrics report={report} />

                  {/* Section 6: Filmstrip */}
                  <FilmstripTimeline filmstripData={report.filmstrip_data} />

                  {/* Section 7: Opportunities */}
                  {/* Section 8: Diagnostics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AuditSection title="Opportunities" audits={oppAudits} type="opportunity" />
                    <AuditSection title="Diagnostics" audits={diagAudits} type="diagnostic" />
                  </div>

                  {/* Section 9: Performance Passed Audits */}
                  <AuditSection
                    title="Passed audits"
                    audits={perfPassedAudits}
                    type="passed"
                    defaultCollapsed
                  />
                </div>
              </div>

              {/* ── ACCESSIBILITY SECTION (Section 10) ── */}
              <div className="border-t border-slate-200 dark:border-white/5 pt-6">
                <CategoryReport
                  categoryKey="accessibility"
                  categoryLabel="Accessibility"
                  score={report.accessibility_score}
                  audits={allAudits}
                  description="These checks highlight opportunities to improve the accessibility of your web app. Only a subset of accessibility issues can be automatically detected so manual testing is also encouraged."
                />
              </div>

              {/* ── BEST PRACTICES SECTION (Section 11) ── */}
              <div className="border-t border-slate-200 dark:border-white/5 pt-6">
                <CategoryReport
                  categoryKey="best-practices"
                  categoryLabel="Best Practices"
                  score={report.best_practice_score}
                  audits={allAudits}
                />
              </div>

              {/* ── SEO SECTION (Section 12) ── */}
              <div className="border-t border-slate-200 dark:border-white/5 pt-6">
                <CategoryReport
                  categoryKey="seo"
                  categoryLabel="SEO"
                  score={report.seo_score}
                  audits={allAudits}
                  description="These checks ensure that your page is following basic search engine optimization advice."
                />
              </div>

              {/* Stats Footer Details */}
              <div className="text-center py-8 text-slate-500 dark:text-gray-600 text-sm border-t border-slate-200 dark:border-white/5 mt-12">
                <p>Powered by Google PageSpeed Insights API v5</p>
                <p className="mt-1">Data identical to <a href="https://pagespeed.web.dev" target="_blank" className="text-blue-500 hover:underline">pagespeed.web.dev</a></p>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
