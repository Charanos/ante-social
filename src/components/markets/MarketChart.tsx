"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";

interface MarketChartProps {
  data: number[];
  height?: number | string;
  color?: string;
  showAxes?: boolean;
}

export function MarketChart({
  data,
  height = 200,
  color = "#10b981", // emerald-500
  showAxes = false,
}: MarketChartProps) {
  // Transform flat array to recharts format
  const chartData = data.map((val, i) => ({
    name: i,
    value: val,
  }));

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {showAxes && (
            <>
              <XAxis dataKey="name" hide />
              <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
            </>
          )}
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white/80 backdrop-blur-md border border-black/5 p-2 rounded-lg shadow-xl">
                    <p className="text-xs font-bold text-black/80">
                      {payload[0].value}%
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorValue)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
