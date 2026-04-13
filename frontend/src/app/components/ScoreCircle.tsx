"use client";

import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

interface ScoreCircleProps {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
}

const getScoreColor = (score: number) => {
  if (score >= 90) return "#0cce6b";
  if (score >= 50) return "#ffa400";
  return "#ff4e42";
};

const getScoreBgColor = (score: number) => {
  if (score >= 90) return "rgba(12, 206, 107, 0.1)";
  if (score >= 50) return "rgba(255, 164, 0, 0.1)";
  return "rgba(255, 78, 66, 0.1)";
};

export default function ScoreCircle({ score, label, size = "md" }: ScoreCircleProps) {
  const sizeMap = { sm: { container: "h-20 w-20", text: "text-xl" }, md: { container: "h-28 w-28", text: "text-3xl" }, lg: { container: "h-36 w-36", text: "text-4xl" } };
  const s = sizeMap[size];
  const color = getScoreColor(score);
  const data = [{ name: label, value: score, fill: color }];

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`${s.container} relative`}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="50%"
            innerRadius="80%" outerRadius="100%"
            barSize={8} data={data}
            startAngle={90} endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: getScoreBgColor(score) }} dataKey="value" cornerRadius={5} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${s.text} font-bold font-mono`} style={{ color }}>
            {score !== null && score !== undefined ? score : '--'}
          </span>
        </div>
      </div>
      <span className="mt-2 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

export { getScoreColor, getScoreBgColor };
