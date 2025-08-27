// components/ui/ProgressBar.tsx

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProgressBar({ 
  value, 
  color = 'blue', 
  className,
  showLabel = false,
  size = 'md'
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    gray: 'bg-gray-400'
  };

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={cn('relative', className)}>
      <div className={cn(
        'w-full bg-gray-200 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full transition-all duration-300 ease-out rounded-full',
            colorClasses[color]
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="absolute -top-6 right-0 text-xs font-medium text-gray-600">
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  );
}