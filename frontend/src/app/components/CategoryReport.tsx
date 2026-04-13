"use client";

import ScoreCircle from "./ScoreCircle";
import AuditSection from "./AuditSection";

interface CategoryReportProps {
  categoryKey: string;
  categoryLabel: string;
  score: number;
  audits: any[];
  description?: string;
}

export default function CategoryReport({ categoryKey, categoryLabel, score, audits, description }: CategoryReportProps) {
  // Filter audits for this category
  const categoryAudits = audits.filter((a: any) => a.category === categoryKey);

  // Separate into groups
  const failingAudits = categoryAudits.filter((a: any) =>
    a.score !== null && a.score < 1 &&
    a.score_display_mode !== 'notApplicable' &&
    a.score_display_mode !== 'informative' &&
    a.score_display_mode !== 'manual' &&
    a.group_type !== 'passed' &&
    a.group_type !== 'not-applicable'
  );

  const manualAudits = categoryAudits.filter((a: any) =>
    a.score_display_mode === 'manual'
  );

  const passedAudits = categoryAudits.filter((a: any) =>
    a.group_type === 'passed' || (a.score === 1 && a.score_display_mode !== 'manual' && a.score_display_mode !== 'informative' && a.score_display_mode !== 'notApplicable')
  );

  const notApplicable = categoryAudits.filter((a: any) =>
    a.group_type === 'not-applicable' || a.score_display_mode === 'notApplicable'
  );

  // Don't render if there are no audits at all for this category
  if (categoryAudits.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Score + Header */}
      <div className="glass-card p-6 border border-white/10">
        <div className="flex items-center gap-6">
          <ScoreCircle score={score} label={categoryLabel} size="md" />
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white">{categoryLabel}</h3>
            {description && (
              <p className="text-gray-500 text-sm mt-1" dangerouslySetInnerHTML={{ __html: description }} />
            )}
            <div className="flex gap-4 mt-3 text-sm">
              {failingAudits.length > 0 && (
                <span className="text-red-400 font-medium">{failingAudits.length} failing</span>
              )}
              {manualAudits.length > 0 && (
                <span className="text-gray-400 font-medium">{manualAudits.length} manual</span>
              )}
              <span className="text-green-400 font-medium">{passedAudits.length} passed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Failing Audits */}
      {failingAudits.length > 0 && (
        <AuditSection
          title={`${categoryLabel} — Issues`}
          audits={failingAudits}
          type="failing"
        />
      )}

      {/* Manual Audits */}
      {manualAudits.length > 0 && (
        <AuditSection
          title="Additional items to manually check"
          audits={manualAudits}
          type="manual"
          defaultCollapsed
        />
      )}

      {/* Passed Audits */}
      {passedAudits.length > 0 && (
        <AuditSection
          title="Passed audits"
          audits={passedAudits}
          type="passed"
          defaultCollapsed
        />
      )}

      {/* Not Applicable */}
      {notApplicable.length > 0 && (
        <AuditSection
          title="Not applicable"
          audits={notApplicable}
          type="not-applicable"
          defaultCollapsed
        />
      )}
    </div>
  );
}
