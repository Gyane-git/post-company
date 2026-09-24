'use client';

import React, { useState } from 'react';
import { TimeSeriesPoint } from '@/types/analytics';

interface AreaChartProps {
  data: TimeSeriesPoint[];
  metricKey: keyof Omit<TimeSeriesPoint, 'date'>;
  metricLabel: string;
  color?: string;
  height?: number;
}

export function AreaChart({
  data,
  metricKey,
  metricLabel,
  color = '#2563eb',
  height = 240,
}: AreaChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="h-60 flex items-center justify-center text-xs text-slate-400">No chart data available</div>;
  }

  const values = data.map((d) => Number(d[metricKey]) || 0);
  const maxValue = Math.max(...values, 10);
  const minValue = 0;
  const range = maxValue - minValue;

  const width = 800;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((Number(d[metricKey]) - minValue) / range) * chartHeight;
    return { x, y, data: d, val: Number(d[metricKey]) };
  });

  const pathD = points.reduce((acc, pt, index) => {
    return index === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${paddingTop + chartHeight} L ${points[0].x},${
    paddingTop + chartHeight
  } Z`;

  // Horizontal grid lines
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const y = paddingTop + chartHeight * (1 - ratio);
    const value = Math.round(minValue + range * ratio);
    return { y, value };
  });

  const gradientId = `area-grad-${metricKey}`;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridLines.map((line, idx) => (
          <g key={idx}>
            <line
              x1={paddingLeft}
              y1={line.y}
              x2={width - paddingRight}
              y2={line.y}
              stroke="currentColor"
              className="text-slate-100 dark:text-slate-800/80"
              strokeDasharray="4 4"
            />
            <text
              x={paddingLeft - 8}
              y={line.y + 3}
              textAnchor="end"
              className="text-[10px] fill-slate-400 dark:fill-slate-500 font-mono"
            >
              {line.value >= 1000 ? `${(line.value / 1000).toFixed(0)}k` : line.value}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Main line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((pt, idx) => {
          const isHovered = hoveredIndex === idx;
          return (
            <g
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 6 : 4}
                fill={color}
                className="transition-all duration-150 stroke-white dark:stroke-slate-900"
                strokeWidth={isHovered ? 3 : 2}
              />
              <rect
                x={pt.x - 20}
                y={paddingTop}
                width={40}
                height={chartHeight}
                fill="transparent"
              />
            </g>
          );
        })}

        {/* Date labels at bottom */}
        {points.map((pt, idx) => {
          // Show every 2nd or 3rd label if many
          const showLabel = data.length <= 8 || idx % Math.ceil(data.length / 7) === 0 || idx === data.length - 1;
          if (!showLabel) return null;
          return (
            <text
              key={`label-${idx}`}
              x={pt.x}
              y={height - 8}
              textAnchor="middle"
              className="text-[11px] fill-slate-400 dark:fill-slate-500 font-sans"
            >
              {pt.data.date}
            </text>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoveredIndex !== null && points[hoveredIndex] && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs px-3 py-1.5 rounded-lg shadow-lg font-medium whitespace-nowrap"
          style={{
            left: `${(points[hoveredIndex].x / width) * 100}%`,
            top: `${(points[hoveredIndex].y / height) * 100 - 15}%`,
          }}
        >
          <div className="font-semibold">{points[hoveredIndex].data.date}</div>
          <div className="text-[11px] opacity-80">
            {metricLabel}: {points[hoveredIndex].val.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
