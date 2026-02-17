"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface LineConfig {
  dataKey: string;
  name: string;
  color: string;
  yAxisId?: 'left' | 'right';
}

interface ProgressChartProps {
  data: Array<Record<string, string | number>>;
  lines: LineConfig[];
  xAxisKey: string;
  height?: number;
  yAxisLabels?: { left?: string; right?: string };
  className?: string;
}

export function ProgressChart({ 
  data, 
  lines, 
  xAxisKey, 
  height = 400,
  yAxisLabels,
  className 
}: ProgressChartProps) {
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl border border-black/10 rounded-2xl p-4 shadow-xl">
          <p className="text-sm font-semibold text-black mb-2">
            {payload[0].payload[xAxisKey]}
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-xs font-medium" style={{ color: entry.color }}>
                {entry.name}: <span className="font-mono font-semibold">{entry.value}</span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const hasLeftAxis = lines.some(line => !line.yAxisId || line.yAxisId === 'left');
  const hasRightAxis = lines.some(line => line.yAxisId === 'right');

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: hasRightAxis ? 20 : 10, left: hasLeftAxis ? 0 : 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis 
            dataKey={xAxisKey} 
            stroke="#6b7280"
            style={{ fontSize: '12px', fontWeight: 500 }}
            tick={{ fill: '#6b7280' }}
          />
          
          {hasLeftAxis && (
            <YAxis 
              yAxisId="left"
              stroke="#374151"
              style={{ fontSize: '12px', fontWeight: 500 }}
              tick={{ fill: '#374151' }}
              label={yAxisLabels?.left ? { 
                value: yAxisLabels.left, 
                angle: -90, 
                position: 'insideLeft', 
                style: { fill: '#374151', fontWeight: 600 } 
              } : undefined}
            />
          )}
          
          {hasRightAxis && (
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              style={{ fontSize: '12px', fontWeight: 500 }}
              tick={{ fill: '#6b7280' }}
              label={yAxisLabels?.right ? { 
                value: yAxisLabels.right, 
                angle: 90, 
                position: 'insideRight', 
                style: { fill: '#6b7280', fontWeight: 600 } 
              } : undefined}
            />
          )}
          
          <Tooltip content={<CustomTooltip />} />
          
          {lines.map((line, index) => (
            <Line 
              key={index}
              yAxisId={line.yAxisId || 'left'}
              type="monotone" 
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color} 
              strokeWidth={3}
              dot={{ fill: line.color, strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
