// components/charts/ReadinessGauge.tsx

'use client';

import { useEffect, useState } from 'react';

interface ReadinessGaugeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function ReadinessGauge({ value, size = 'md' }: ReadinessGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const sizeConfig = {
    sm: { width: 120, height: 120, strokeWidth: 8 },
    md: { width: 180, height: 180, strokeWidth: 12 },
    lg: { width: 240, height: 240, strokeWidth: 16 }
  };

  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = radius * Math.PI;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  const getColor = (val: number) => {
    if (val >= 80) return '#10b981'; // green
    if (val >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getLabel = (val: number) => {
    if (val >= 80) return 'Gotowy';
    if (val >= 60) return 'Prawie gotowy';
    return 'Wymaga pracy';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={config.width}
        height={config.height}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={config.strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={config.width / 2}
          cy={config.height / 2}
          r={radius}
          stroke={getColor(animatedValue)}
          strokeWidth={config.strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease-out'
          }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{animatedValue}%</span>
        <span className="text-sm text-gray-600 mt-1">{getLabel(animatedValue)}</span>
      </div>
    </div>
  );
}