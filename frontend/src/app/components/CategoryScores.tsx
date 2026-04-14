"use client";

import ScoreCircle from "./ScoreCircle";

interface CategoryScoresProps {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

export default function CategoryScores({
  performance,
  accessibility,
  bestPractices,
  seo,
}: CategoryScoresProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="glass-card">
        <ScoreCircle score={performance} label="Performance" />
      </div>
      <div className="glass-card">
        <ScoreCircle score={accessibility} label="Accessibility" />
      </div>
      <div className="glass-card">
        <ScoreCircle score={bestPractices} label="Best Practices" />
      </div>
      <div className="glass-card">
        <ScoreCircle score={seo} label="SEO" />
      </div>
    </div>
  );
}
