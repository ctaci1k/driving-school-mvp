// components/ui/lesson-type-selector.tsx
"use client"

import * as React from "react"
import { 
  BookOpen, 
  Car, 
  Zap, 
  Target, 
  CheckCircle, 
  Moon,
  Navigation,
  MapPin,
  AlertTriangle,
  Mountain,
  RotateCw,
  GraduationCap,
  Gauge
} from "lucide-react"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export type LessonType = 
  | 'STANDARD'
  | 'CITY_TRAFFIC'
  | 'HIGHWAY'
  | 'PARKING'
  | 'EXAM_PREPARATION'
  | 'NIGHT_DRIVING'
  | 'MANEUVERS'
  | 'THEORY'
  | 'EMERGENCY_BRAKING'
  | 'HILL_START'
  | 'COUNTRY_ROADS'
  | 'ROUNDABOUTS'
  | 'FIRST_LESSON'

interface LessonTypeConfig {
  value: LessonType
  icon: React.ElementType
  color: string
  bgColor: string
  borderColor: string
  label: string
  description: string
  recommended?: boolean
  duration?: number
}

const lessonTypes: LessonTypeConfig[] = [
  {
    value: 'STANDARD',
    icon: BookOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    label: 'Standard Lesson',
    description: 'Regular driving lesson in mixed conditions'
  },
  {
    value: 'CITY_TRAFFIC',
    icon: Car,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200',
    label: 'City Traffic',
    description: 'Focus on city driving, traffic lights, and intersections'
  },
  {
    value: 'HIGHWAY',
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200',
    label: 'Highway Driving',
    description: 'Highway driving, merging, and high-speed maneuvers'
  },
  {
    value: 'PARKING',
    icon: Target,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    label: 'Parking Practice',
    description: 'Parallel parking, reverse parking, and tight spaces'
  },
  {
    value: 'EXAM_PREPARATION',
    icon: GraduationCap,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    label: 'Exam Preparation',
    description: 'Mock exam conditions and final preparation',
    recommended: true
  },
  {
    value: 'NIGHT_DRIVING',
    icon: Moon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    borderColor: 'border-indigo-200',
    label: 'Night Driving',
    description: 'Driving in low visibility and night conditions'
  },
  {
    value: 'MANEUVERS',
    icon: RotateCw,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    borderColor: 'border-teal-200',
    label: 'Maneuvers',
    description: 'Three-point turns, U-turns, and complex maneuvers'
  },
  {
    value: 'EMERGENCY_BRAKING',
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200',
    label: 'Emergency Braking',
    description: 'Emergency stops and hazard avoidance'
  },
  {
    value: 'HILL_START',
    icon: Mountain,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    label: 'Hill Start',
    description: 'Starting on inclines and hill driving'
  },
  {
    value: 'COUNTRY_ROADS',
    icon: Navigation,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200',
    label: 'Country Roads',
    description: 'Rural driving and narrow roads'
  },
  {
    value: 'ROUNDABOUTS',
    icon: RotateCw,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    borderColor: 'border-cyan-200',
    label: 'Roundabouts',
    description: 'Multi-lane roundabouts and complex junctions'
  },
  {
    value: 'FIRST_LESSON',
    icon: CheckCircle,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    borderColor: 'border-pink-200',
    label: 'First Lesson',
    description: 'Introduction to driving and basic controls'
  }
]

interface LessonTypeSelectorProps {
  value?: LessonType
  onChange?: (value: LessonType) => void
  variant?: 'grid' | 'list' | 'compact'
  showDescription?: boolean
  disabled?: boolean
  className?: string
  availableTypes?: LessonType[]
}

export function LessonTypeSelector({
  value,
  onChange,
  variant = 'grid',
  showDescription = true,
  disabled = false,
  className,
  availableTypes
}: LessonTypeSelectorProps) {
  const types = availableTypes 
    ? lessonTypes.filter(t => availableTypes.includes(t.value))
    : lessonTypes.slice(0, 6) // Show first 6 by default

  if (variant === 'compact') {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {types.map((type) => {
          const Icon = type.icon
          const isSelected = value === type.value
          
          return (
            <button
              key={type.value}
              onClick={() => !disabled && onChange?.(type.value)}
              disabled={disabled}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all",
                "hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
                isSelected 
                  ? `${type.bgColor} ${type.borderColor} border-2` 
                  : "bg-white border-gray-200 hover:border-gray-300"
              )}
            >
              <Icon className={cn("h-4 w-4", isSelected ? type.color : "text-gray-500")} />
              <span className={cn("text-sm font-medium", isSelected ? type.color : "text-gray-700")}>
                {type.label}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <RadioGroup 
      value={value} 
      onValueChange={(v) => onChange?.(v as LessonType)} 
      disabled={disabled}
      className={className}
    >
      <div className={cn(
        variant === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-3"
      )}>
        {types.map((type) => {
          const Icon = type.icon
          
          return (
            <div key={type.value} className="relative">
              <RadioGroupItem
                value={type.value}
                id={type.value}
                className="peer sr-only"
              />
              <Label
                htmlFor={type.value}
                className={cn(
                  "flex cursor-pointer rounded-lg border-2 transition-all",
                  "hover:shadow-md",
                  "peer-checked:border-blue-600 peer-checked:bg-blue-50",
                  variant === 'grid' ? "flex-col p-4" : "flex-row items-start gap-3 p-4"
                )}
              >
                {type.recommended && (
                  <Badge 
                    variant="default" 
                    className="absolute -top-2 -right-2 text-xs"
                  >
                    Recommended
                  </Badge>
                )}
                
                <div className={cn(
                  "rounded-lg p-2 w-fit",
                  type.bgColor
                )}>
                  <Icon className={cn("h-5 w-5", type.color)} />
                </div>
                
                <div className={variant === 'grid' ? "mt-3" : "flex-1"}>
                  <p className="font-semibold text-gray-900">
                    {type.label}
                  </p>
                  {showDescription && (
                    <p className="text-sm text-gray-600 mt-1">
                      {type.description}
                    </p>
                  )}
                  {type.duration && (
                    <div className="flex items-center gap-1 mt-2">
                      <Gauge className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {type.duration} min
                      </span>
                    </div>
                  )}
                </div>
              </Label>
            </div>
          )
        })}
      </div>
    </RadioGroup>
  )
}