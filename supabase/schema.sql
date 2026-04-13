-- Supabase Schema for PageInsights

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    status TEXT NOT NULL, -- pending | processing | done | failed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    strategy TEXT NOT NULL, -- mobile | desktop
    
    -- Category Scores
    performance_score INTEGER,
    accessibility_score INTEGER,
    best_practice_score INTEGER,
    seo_score INTEGER,
    overall_score INTEGER,
    
    -- Core Performance Metrics
    fcp_ms REAL,
    fcp_display TEXT,
    lcp_ms REAL,
    lcp_display TEXT,
    tbt_ms REAL,
    tbt_display TEXT,
    cls_score REAL,
    cls_display TEXT,
    si_ms REAL,
    si_display TEXT,
    tti_ms REAL,
    tti_display TEXT,
    
    -- Field Data (CrUX)
    field_fcp_ms REAL,
    field_fcp_category TEXT,
    field_lcp_ms REAL,
    field_lcp_category TEXT,
    field_inp_ms REAL,
    field_inp_category TEXT,
    field_cls_score REAL,
    field_cls_category TEXT,
    field_ttfb_ms REAL,
    field_ttfb_category TEXT,
    field_overall_category TEXT,
    
    -- Screenshots
    final_screenshot_url TEXT,
    filmstrip_data JSONB,
    
    -- Raw JSON
    raw_lighthouse_json JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    audit_id TEXT,
    category TEXT, -- performance | accessibility | seo | best-practices
    group_type TEXT, -- metric | opportunity | diagnostic | passed | not-applicable
    title TEXT,
    description TEXT,
    score REAL,
    score_display_mode TEXT,
    display_value TEXT,
    savings_ms REAL,
    savings_bytes INTEGER,
    details_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    audit_id TEXT,
    type TEXT,
    severity TEXT,
    message TEXT,
    fix_suggestion TEXT,
    savings_ms REAL,
    savings_bytes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
