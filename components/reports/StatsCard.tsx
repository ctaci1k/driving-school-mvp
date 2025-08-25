// components/reports/StatsCard.tsx
'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  trend?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
  }
  change?: {
    value: string
    period: string
  }
  loading?: boolean
  variant?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  change,
  loading = false,
  variant = 'default',
  className
}: StatsCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null
    
    switch (trend.type) {
      case 'increase':
        return <TrendingUp className="h-4 w-4" />
      case 'decrease':
        return <TrendingDown className="h-4 w-4" />
      case 'neutral':
        return <Minus className="h-4 w-4" />
    }
  }
  
  const getTrendColor = () => {
    if (!trend) return ''
    
    switch (trend.type) {
      case 'increase':
        return 'text-green-600'
      case 'decrease':
        return 'text-red-600'
      case 'neutral':
        return 'text-gray-600'
    }
  }
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50/50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50/50'
      case 'danger':
        return 'border-red-200 bg-red-50/50'
      default:
        return ''
    }
  }
  
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[60px] mb-1" />
          <Skeleton className="h-3 w-[80px]" />
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className={cn(getVariantStyles(), className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          
          {trend && (
            <div className={cn(
              "flex items-center gap-1",
              getTrendColor()
            )}>
              {getTrendIcon()}
              <span className="text-sm font-medium">
                {trend.value}%
              </span>
            </div>
          )}
        </div>
        
        {change && (
          <div className="flex items-center gap-1 mt-3 pt-3 border-t">
            {parseFloat(change.value) > 0 ? (
              <ArrowUp className="h-3 w-3 text-green-600" />
            ) : parseFloat(change.value) < 0 ? (
              <ArrowDown className="h-3 w-3 text-red-600" />
            ) : (
              <Minus className="h-3 w-3 text-gray-600" />
            )}
            <span className={cn(
              "text-xs font-medium",
              parseFloat(change.value) > 0 && "text-green-600",
              parseFloat(change.value) < 0 && "text-red-600",
              parseFloat(change.value) === 0 && "text-gray-600"
            )}>
              {change.value}
            </span>
            <span className="text-xs text-muted-foreground">
              {change.period}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Compound component for grid layout
interface StatsGridProps {
  children: ReactNode
  columns?: 2 | 3 | 4
  className?: string
}

export function StatsGrid({ 
  children, 
  columns = 4,
  className 
}: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }
  
  return (
    <div className={cn(
      "grid gap-4",
      gridCols[columns],
      className
    )}>
      {children}
    </div>
  )
}

// Mini stats component for inline display
interface MiniStatsProps {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function MiniStats({
  label,
  value,
  icon,
  trend,
  className
}: MiniStatsProps) {
  const getTrendStyles = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50'
      case 'down':
        return 'text-red-600 bg-red-50'
      case 'neutral':
        return 'text-gray-600 bg-gray-50'
      default:
        return 'bg-gray-50'
    }
  }
  
  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg",
      getTrendStyles(),
      className
    )}>
      <div className="flex items-center gap-2">
        {icon && (
          <div className="h-4 w-4 opacity-70">
            {icon}
          </div>
        )}
        <span className="text-sm font-medium opacity-80">
          {label}
        </span>
      </div>
      <span className="text-sm font-bold">
        {value}
      </span>
    </div>
  )
}

// Stats comparison component
interface StatsComparisonProps {
  title: string
  current: {
    label: string
    value: string | number
  }
  previous: {
    label: string
    value: string | number
  }
  className?: string
}

export function StatsComparison({
  title,
  current,
  previous,
  className
}: StatsComparisonProps) {
  const currentNum = typeof current.value === 'string' 
    ? parseFloat(current.value.replace(/[^0-9.-]/g, ''))
    : current.value
    
  const previousNum = typeof previous.value === 'string'
    ? parseFloat(previous.value.replace(/[^0-9.-]/g, ''))
    : previous.value
    
  const percentChange = previousNum !== 0
    ? ((currentNum - previousNum) / previousNum * 100).toFixed(1)
    : '0'
    
  const isIncrease = currentNum > previousNum
  const isDecrease = currentNum < previousNum
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {current.label}
            </span>
            <span className="text-lg font-bold">
              {current.value}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {previous.label}
            </span>
            <span className="text-sm">
              {previous.value}
            </span>
          </div>
        </div>
        
        <div className="pt-3 border-t">
          <div className="flex items-center justify-center gap-2">
            {isIncrease && (
              <>
                <ArrowUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  +{percentChange}%
                </span>
              </>
            )}
            {isDecrease && (
              <>
                <ArrowDown className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">
                  {percentChange}%
                </span>
              </>
            )}
            {!isIncrease && !isDecrease && (
              <>
                <Minus className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">
                  0%
                </span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}