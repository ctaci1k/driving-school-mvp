// components/charts/PredictionChart.tsx

'use client';

import { useMemo } from 'react';

interface PredictionChartProps {
  currentReadiness: number;
}

export default function PredictionChart({ currentReadiness }: PredictionChartProps) {
  const data = useMemo(() => {
    const weeks = 8;
    const growthRate = (100 - currentReadiness) / weeks * 0.8; // 80% of remaining progress
    
    return Array.from({ length: weeks + 1 }, (_, i) => {
      const progress = Math.min(100, currentReadiness + (growthRate * i * (1 + i * 0.1)));
      return {
        week: i,
        value: Math.round(progress),
        label: i === 0 ? 'Teraz' : `Tydzień ${i}`
      };
    });
  }, [currentReadiness]);

  const maxValue = 100;
  const chartHeight = 200;
  const chartWidth = 400;
  const padding = 20;

  return (
    <div className="bg-white rounded-lg p-4">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto"
        style={{ maxHeight: '200px' }}
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((value) => {
          const y = padding + ((100 - value) / 100) * (chartHeight - padding * 2);
          return (
            <g key={value}>
              <line
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="#e5e7eb"
                strokeDasharray="2 2"
              />
              <text
                x={5}
                y={y + 4}
                fontSize="10"
                fill="#6b7280"
              >
                {value}%
              </text>
            </g>
          );
        })}

        {/* Line chart */}
        <polyline
          points={data.map((point, i) => {
            const x = padding + (i / (data.length - 1)) * (chartWidth - padding * 2);
            const y = padding + ((100 - point.value) / 100) * (chartHeight - padding * 2);
            return `${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Data points */}
        {data.map((point, i) => {
          const x = padding + (i / (data.length - 1)) * (chartWidth - padding * 2);
          const y = padding + ((100 - point.value) / 100) * (chartHeight - padding * 2);
          const isTarget = point.value >= 80;
          
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="4"
                fill={isTarget ? '#10b981' : '#3b82f6'}
                stroke="white"
                strokeWidth="2"
              />
              {isTarget && (
                <text
                  x={x}
                  y={y - 10}
                  fontSize="10"
                  fill="#10b981"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  CEL
                </text>
              )}
            </g>
          );
        })}

        {/* Target line at 80% */}
        <line
          x1={padding}
          y1={padding + (20 / 100) * (chartHeight - padding * 2)}
          x2={chartWidth - padding}
          y2={padding + (20 / 100) * (chartHeight - padding * 2)}
          stroke="#10b981"
          strokeWidth="2"
          strokeDasharray="5 5"
        />
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {data.filter((_, i) => i % 2 === 0).map((point) => (
          <span key={point.week}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}