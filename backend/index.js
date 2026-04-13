import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Basic health check route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const psiKey = process.env.PSI_API_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions (safe_float, overall score)
const safeFloat = (v) => {
    if (v === null || v === undefined) return null;
    const n = parseFloat(v);
    return isNaN(n) ? null : n;
};

const calculateOverallScore = (perf, seo, a11y, bp) => {
    try {
        return Math.round((perf * 0.4) + (seo * 0.3) + (a11y * 0.2) + (bp * 0.1));
    } catch (e) {
        return 0;
    }
};

// PSI API Caller
async function callPsiApi(targetUrl, strategy) {
    const baseUrl = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

    // Build URL params manually — Google's API expects repeated `category=X` params
    const params = new URLSearchParams();
    params.append('url', targetUrl);
    params.append('strategy', strategy);
    params.append('category', 'performance');
    params.append('category', 'seo');
    params.append('category', 'accessibility');
    params.append('category', 'best-practices');
    
    if (psiKey) {
        params.append('key', psiKey);
    }

    const response = await axios.get(`${baseUrl}?${params.toString()}`);
    return response.data;
}

// Parser and Saver
async function parseAndSaveReport(jobId, targetUrl, strategy, data) {
    const lighthouse = data.lighthouseResult || {};
    const categories = lighthouse.categories || {};
    const audits = lighthouse.audits || {};
    
    const perf = Math.round((categories.performance?.score || 0) * 100);
    const a11y = Math.round((categories.accessibility?.score || 0) * 100);
    const bp = Math.round((categories['best-practices']?.score || 0) * 100);
    const seo = Math.round((categories.seo?.score || 0) * 100);
    
    const overall = calculateOverallScore(perf, seo, a11y, bp);
    
    const loadingExperience = data.loadingExperience || {};
    const fieldMetrics = loadingExperience.metrics || {};
    
    const reportRow = {
        project_id: jobId,
        strategy: strategy,
        performance_score: perf,
        accessibility_score: a11y,
        best_practice_score: bp,
        seo_score: seo,
        overall_score: overall,
        fcp_ms: safeFloat(audits['first-contentful-paint']?.numericValue),
        fcp_display: audits['first-contentful-paint']?.displayValue,
        lcp_ms: safeFloat(audits['largest-contentful-paint']?.numericValue),
        lcp_display: audits['largest-contentful-paint']?.displayValue,
        tbt_ms: safeFloat(audits['total-blocking-time']?.numericValue),
        tbt_display: audits['total-blocking-time']?.displayValue,
        cls_score: safeFloat(audits['cumulative-layout-shift']?.numericValue),
        cls_display: audits['cumulative-layout-shift']?.displayValue,
        si_ms: safeFloat(audits['speed-index']?.numericValue),
        si_display: audits['speed-index']?.displayValue,
        tti_ms: safeFloat(audits.interactive?.numericValue),
        tti_display: audits.interactive?.displayValue,
        field_overall_category: loadingExperience.overall_category,
        final_screenshot_url: audits['final-screenshot']?.details?.data,
        filmstrip_data: audits['screenshot-thumbnails']?.details?.items || [],
        raw_lighthouse_json: data
    };

    if (fieldMetrics.FIRST_CONTENTFUL_PAINT_MS) {
        reportRow.field_fcp_ms = fieldMetrics.FIRST_CONTENTFUL_PAINT_MS.percentile;
        reportRow.field_fcp_category = fieldMetrics.FIRST_CONTENTFUL_PAINT_MS.category;
    }
    if (fieldMetrics.LARGEST_CONTENTFUL_PAINT_MS) {
        reportRow.field_lcp_ms = fieldMetrics.LARGEST_CONTENTFUL_PAINT_MS.percentile;
        reportRow.field_lcp_category = fieldMetrics.LARGEST_CONTENTFUL_PAINT_MS.category;
    }
    if (fieldMetrics.INTERACTION_TO_NEXT_PAINT) {
        reportRow.field_inp_ms = fieldMetrics.INTERACTION_TO_NEXT_PAINT.percentile;
        reportRow.field_inp_category = fieldMetrics.INTERACTION_TO_NEXT_PAINT.category;
    }
    if (fieldMetrics.CUMULATIVE_LAYOUT_SHIFT_SCORE) {
        reportRow.field_cls_score = fieldMetrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile;
        reportRow.field_cls_category = fieldMetrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.category;
    }
    if (fieldMetrics.EXPERIMENTAL_TIME_TO_FIRST_BYTE) {
        reportRow.field_ttfb_ms = fieldMetrics.EXPERIMENTAL_TIME_TO_FIRST_BYTE.percentile;
        reportRow.field_ttfb_category = fieldMetrics.EXPERIMENTAL_TIME_TO_FIRST_BYTE.category;
    }

    const { data: reportInsertData, error: reportError } = await supabase
        .from('reports')
        .insert(reportRow)
        .select();

    if (reportError) throw reportError;
    const reportId = reportInsertData[0].id;

    // Helper maps for audits (one audit can belong to multiple categories)
    const auditToCats = {}; // aId -> Set of categories
    const auditToGroup = {};
    
    Object.entries(categories).forEach(([catName, catObj]) => {
        catObj.auditRefs?.forEach(ref => {
            if (!auditToCats[ref.id]) auditToCats[ref.id] = new Set();
            auditToCats[ref.id].add(catName);
            if (ref.group) auditToGroup[ref.id] = ref.group;
        });
    });

    const auditRows = [];
    const issuesRows = [];

    Object.entries(audits).forEach(([aId, aData]) => {
        const cats = Array.from(auditToCats[aId] || ['other']);
        const grp = auditToGroup[aId];
        const scoreDisp = aData.scoreDisplayMode;
        const score = aData.score;
        
        let groupType = 'other';
        if (scoreDisp === 'notApplicable') groupType = 'not-applicable';
        else if (score === 1 || scoreDisp === 'passed') groupType = 'passed';
        else {
            if (grp === 'metrics') groupType = 'metric';
            else if (grp === 'load-opportunities') groupType = 'opportunity';
            else if (grp === 'diagnostics') groupType = 'diagnostic';
            else groupType = grp || 'other';
        }

        const details = aData.details || {};
        const savingsMs = safeFloat(details.overallSavingsMs);
        const savingsBytes = details.overallSavingsBytes ? parseInt(details.overallSavingsBytes) : null;

        // Create a row for each category this audit belongs to
        cats.forEach(cat => {
            auditRows.push({
                report_id: reportId,
                audit_id: aId,
                category: cat,
                group_type: groupType,
                title: aData.title,
                description: aData.description,
                score: safeFloat(score),
                score_display_mode: scoreDisp,
                display_value: aData.displayValue,
                savings_ms: savingsMs,
                savings_bytes: savingsBytes,
                details_json: details
            });
        });

        // Issues are project-wide, so only add once
        if (score !== null && score < 1 && !['notApplicable', 'informative', 'manual'].includes(scoreDisp)) {
            let severity = 'low';
            if (score < 0.5) severity = 'high';
            else if (score < 0.9) severity = 'medium';

            issuesRows.push({
                project_id: jobId,
                report_id: reportId,
                audit_id: aId,
                type: cats[0], // Primary category for the issue
                severity: severity,
                message: aData.title,
                fix_suggestion: aData.description,
                savings_ms: savingsMs,
                savings_bytes: savingsBytes
            });
        }
    });

    // Chunked inserts
    const chunkSize = 50;
    for (let i = 0; i < auditRows.length; i += chunkSize) {
        const chunk = auditRows.slice(i, i + chunkSize);
        await supabase.from('audits').insert(chunk);
    }
    for (let i = 0; i < issuesRows.length; i += chunkSize) {
        const chunk = issuesRows.slice(i, i + chunkSize);
        await supabase.from('issues').insert(chunk);
    }
}

async function runScanAsync(targetUrl, projectId) {
    try {
        console.log(`[${projectId}] Starting scan for ${targetUrl}`);
        await supabase.from('projects').update({ status: 'processing' }).eq('id', projectId);

        // Mobile scan
        console.log(`[${projectId}] Running Mobile Scan...`);
        const mobileData = await callPsiApi(targetUrl, 'mobile');
        await parseAndSaveReport(projectId, targetUrl, 'mobile', mobileData);
        
        // Desktop scan
        console.log(`[${projectId}] Running Desktop Scan...`);
        const desktopData = await callPsiApi(targetUrl, 'desktop');
        await parseAndSaveReport(projectId, targetUrl, 'desktop', desktopData);
        
        await supabase.from('projects').update({ status: 'done' }).eq('id', projectId);
        console.log(`[${projectId}] Scan completed successfully`);
        
    } catch (e) {
        console.error(`[${projectId}] Error during scan: ${e.message}`);
        await supabase.from('projects').update({ status: 'failed' }).eq('id', projectId);
    }
}

// Routes
app.post('/analyze', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: "URL is required" });

        const { data, error } = await supabase
            .from('projects')
            .insert({ url, status: 'pending' })
            .select();

        if (error) throw error;
        const projectId = data[0].id;
        
        // Run background scan
        runScanAsync(url, projectId);

        res.json({ job_id: projectId });
    } catch (e) {
        res.status(500).json({ error: `Database error: ${e.message}` });
    }
});

app.get('/status/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        const { data, error } = await supabase
            .from('projects')
            .select('id, status')
            .eq('id', jobId)
            .single();

        if (error || !data) return res.status(404).json({ error: "Job not found" });

        const status = data.status;
        let progressMsg = "Pending...";
        if (status === "processing") progressMsg = "Fetching metrics from Google PageSpeed Insights...";
        else if (status === "done") progressMsg = "Analysis complete!";
        else if (status === "failed") progressMsg = "Scan failed due to an error.";

        res.json({
            id: jobId,
            status: status,
            progress: progressMsg
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/report/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        const { strategy } = req.query;

        let query = supabase.from('reports').select('*').eq('project_id', jobId);
        
        const { data: reports, error } = await query;

        if (error || !reports || reports.length === 0) {
            return res.status(404).json({ error: "Report not generated yet or job not found" });
        }

        let filteredReports = reports;
        if (strategy) {
            filteredReports = reports.filter(r => r.strategy === strategy);
        }

        const results = await Promise.all(filteredReports.map(async (report) => {
            const { data: audits } = await supabase.from('audits').select('*').eq('report_id', report.id);
            const { data: issues } = await supabase.from('issues').select('*').eq('report_id', report.id);
            
            const r = { ...report, audits, issues };

            // Extract field data distributions from raw JSON before deleting
            if (r.raw_lighthouse_json) {
                const rawData = r.raw_lighthouse_json;
                const fieldMetrics = rawData?.loadingExperience?.metrics || {};
                
                if (fieldMetrics.FIRST_CONTENTFUL_PAINT_MS) {
                    r.field_fcp_distributions = fieldMetrics.FIRST_CONTENTFUL_PAINT_MS.distributions;
                }
                if (fieldMetrics.LARGEST_CONTENTFUL_PAINT_MS) {
                    r.field_lcp_distributions = fieldMetrics.LARGEST_CONTENTFUL_PAINT_MS.distributions;
                }
                if (fieldMetrics.INTERACTION_TO_NEXT_PAINT) {
                    r.field_inp_distributions = fieldMetrics.INTERACTION_TO_NEXT_PAINT.distributions;
                }
                if (fieldMetrics.CUMULATIVE_LAYOUT_SHIFT_SCORE) {
                    r.field_cls_distributions = fieldMetrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.distributions;
                }
                if (fieldMetrics.EXPERIMENTAL_TIME_TO_FIRST_BYTE) {
                    r.field_ttfb_distributions = fieldMetrics.EXPERIMENTAL_TIME_TO_FIRST_BYTE.distributions;
                }

                delete r.raw_lighthouse_json;
            }

            return r;
        }));

        if (strategy) {
            if (results.length === 0) return res.status(404).json({ error: "Strategy not found" });
            return res.json({ report: results[0] });
        }

        const response = {};
        results.forEach(r => {
            response[r.strategy] = r;
        });

        res.json(response);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
