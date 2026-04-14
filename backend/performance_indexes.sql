-- SQL Script to add indexes for PageInsights DB performance

-- Indexes for 'projects' table
CREATE INDEX IF NOT EXISTS idx_projects_url ON projects(url);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Indexes for 'reports' table
CREATE INDEX IF NOT EXISTS idx_reports_project_id ON reports(project_id);
CREATE INDEX IF NOT EXISTS idx_reports_strategy ON reports(strategy);

-- Indexes for 'audits' table
CREATE INDEX IF NOT EXISTS idx_audits_report_id ON audits(report_id);
CREATE INDEX IF NOT EXISTS idx_audits_category ON audits(category);
CREATE INDEX IF NOT EXISTS idx_audits_group_type ON audits(group_type);

-- Indexes for 'issues' table
CREATE INDEX IF NOT EXISTS idx_issues_project_id ON issues(project_id);
CREATE INDEX IF NOT EXISTS idx_issues_report_id ON issues(report_id);
