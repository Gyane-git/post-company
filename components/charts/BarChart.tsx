'use client';

import React, { useState } from 'react';
import { TimeSeriesPoint } from '@/types/analytics';

interface BarChartProps {
  data: TimeSeriesPoint[];
  metricKey: keyof Omit<TimeSeriesPoint, 'date'>;
  metricLabel: string;
  color?: string;
  height?: number;
}

export function BarChart({
  data,
  metricKey,
  metricLabel,
  color = '#3b82f6',
  height = 220,
}: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="h-52 flex items-center justify-center text-xs text-slate-400">No chart data available</div>;
  }

  const values = data.map((d) => Number(d[metricKey]) || 0);
  const maxValue = Math.max(...values, 5);

  const width = 800;
  const paddingLeft = 35;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const barWidth = Math.min(28, (chartWidth / data.length) * 0.55);

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        {/* Horizontal grid */}
        {[0, 0.5, 1].map((ratio) => {
          const y = paddingTop + chartHeight * (1 - ratio);
          const val = Math.round(maxValue * ratio);
          return (
            <g key={ratio}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="currentColor"
                className="text-slate-100 dark:text-slate-800"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={y + 3}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, index) => {
          const val = Number(d[metricKey]);
          const barHeight = (val / maxValue) * chartHeight;
          const x = paddingLeft + (index + 0.5) * (chartWidth / data.length) - barWidth / 2;
          const y = paddingTop + chartHeight - barHeight;
          const isHovered = hoveredIndex === index;

          return (
            <g
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 2)}
                rx={4}
                fill={color}
                opacity={isHovered ? 1 : 0.82}
                className="transition-opacity duration-150"
              />
              {/* Invisible touch/hover target */}
              <rect
                x={x - 8}
                y={paddingTop}
                width={barWidth + 16}
                height={chartHeight}
                fill="transparent"
              />
              <text
                x={x + barWidth / 2}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] fill-slate-400 dark:fill-slate-500 font-sans"
              >
                {d.date}
              </text>
            </g>
          );
        })}
      </svg>

      {hoveredIndex !== null && data[hoveredIndex] && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs px-3 py-1.5 rounded-lg shadow-lg font-medium whitespace-nowrap"
          style={{
            left: `${
              ((paddingLeft + (hoveredIndex + 0.5) * (chartWidth / data.length)) / width) * 100
            }%`,
            top: '30%',
          }}
        >
          <span className="font-semibold">{data[hoveredIndex].date}: </span>
          <span>{metricLabel}: {Number(data[hoveredIndex][metricKey]).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
