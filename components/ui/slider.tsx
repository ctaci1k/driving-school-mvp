// components/ui/slider.tsx

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ 
    className, 
    value, 
    defaultValue = [0], 
    onValueChange, 
    min = 0, 
    max = 100, 
    step = 1,
    disabled,
    name,
    id
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const currentValue = value ?? internalValue;
    const percentage = ((currentValue[0] - min) / (max - min)) * 100;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [parseFloat(event.target.value)];
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };

    return (
      <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
        <div className="relative w-full">
          <div className="absolute h-2 w-full rounded-full bg-gray-200" />
          <div 
            className="absolute h-2 rounded-full bg-blue-600"
            style={{ width: `${percentage}%` }}
          />
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue[0]}
            onChange={handleChange}
            disabled={disabled}
            name={name}
            id={id}
            className={cn(
              "relative w-full cursor-pointer appearance-none bg-transparent",
              "[&::-webkit-slider-thumb]:h-5",
              "[&::-webkit-slider-thumb]:w-5",
              "[&::-webkit-slider-thumb]:appearance-none",
              "[&::-webkit-slider-thumb]:rounded-full",
              "[&::-webkit-slider-thumb]:bg-white",
              "[&::-webkit-slider-thumb]:shadow-md",
              "[&::-webkit-slider-thumb]:border-2",
              "[&::-webkit-slider-thumb]:border-blue-600",
              "[&::-webkit-slider-thumb]:transition-all",
              "[&::-webkit-slider-thumb]:hover:scale-110",
              "[&::-moz-range-thumb]:h-5",
              "[&::-moz-range-thumb]:w-5",
              "[&::-moz-range-thumb]:appearance-none",
              "[&::-moz-range-thumb]:rounded-full",
              "[&::-moz-range-thumb]:bg-white",
              "[&::-moz-range-thumb]:shadow-md",
              "[&::-moz-range-thumb]:border-2",
              "[&::-moz-range-thumb]:border-blue-600",
              "[&::-moz-range-thumb]:transition-all",
              "[&::-moz-range-thumb]:hover:scale-110",
              "disabled:pointer-events-none",
              "disabled:opacity-50"
            )}
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export { Slider };