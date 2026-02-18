"use client";

import { useMemo } from "react";

interface ProbabilityTrendProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  trend?: "up" | "down" | "neutral";
}

export function ProbabilityTrend({
  data,
  width = 60,
  height = 20,
  color = "#10b981", // emerald-500
  trend,
}: ProbabilityTrendProps) {
  const points = useMemo(() => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    return data
      .map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
      })
      .join(" ");
  }, [data, width, height]);

  const trendColor =
    trend === "up"
      ? "#10b981" // emerald-500
      : trend === "down"
        ? "#ef4444" // red-500
        : "#6b7280"; // gray-500

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color || trendColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* End dot */}
      {points.length > 0 && (
        <circle
          cx={points.split(" ").pop()?.split(",")[0]}
          cy={points.split(" ").pop()?.split(",")[1]}
          r="2"
          fill={color || trendColor}
        />
      )}
    </svg>
  );
}
