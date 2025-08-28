// app/[locale]/instructor/schedule/components/shared/QuickStats.tsx
// Komponent szybkich statystyk wyświetlanych w nagłówku

'use client'

import React from 'react'
import { 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Car,
  DollarSign,
  CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScheduleStats } from '../../types/schedule.types'

interface QuickStatsProps {
  stats: ScheduleStats
  className?: string
}

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red'
  onClick?: () => void
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color,
  onClick
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  }

  const iconColorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    orange: 'text-orange-500',
    purple: 'text-purple-500',
    red: 'text-red-500'
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative p-4 rounded-lg border transition-all",
        colorClasses[color],
        onClick && "cursor-pointer hover:shadow-md hover:scale-[1.02]"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs mt-1 opacity-70">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp 
                className={cn(
                  "w-3 h-3",
                  trend.isPositive ? "text-green-600" : "text-red-600 rotate-180"
                )}
              />
              <span className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className={cn("p-2 rounded-lg bg-white", iconColorClasses[color])}>
          {icon}
        </div>
      </div>

      {/* Mini wykres (placeholder) */}
      <div className="mt-3 flex items-end justify-between h-8 gap-0.5">
        {[40, 65, 45, 80, 55, 70, 60].map((height, index) => (
          <div
            key={index}
            className="flex-1 bg-current opacity-20 rounded-t"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function QuickStats({ stats, className }: QuickStatsProps) {
  // Obliczanie dodatkowych metryk
  const occupancyTrend = stats.occupancyRate > 75 ? { value: 5, isPositive: true } : { value: -3, isPositive: false }
  const earningsTrend = stats.monthlyEarnings > 4000 ? { value: 12, isPositive: true } : { value: -5, isPositive: false }
  const completionRate = stats.totalSlots > 0 
    ? Math.round((stats.completedLessons / stats.totalSlots) * 100) 
    : 0

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop view - wszystkie karty */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-4">
        <StatCard
          title="Dzisiejsze zajęcia"
          value={stats.upcomingLessons}
          subtitle={`${stats.bookedSlots} zarezerwowanych`}
          icon={<Calendar className="w-5 h-5" />}
          color="blue"
          trend={{ value: 8, isPositive: true }}
        />
        
        <StatCard
          title="Obłożenie"
          value={`${stats.occupancyRate}%`}
          subtitle={`${stats.availableSlots} wolnych slotów`}
          icon={<Clock className="w-5 h-5" />}
          color="green"
          trend={occupancyTrend}
        />
        
        <StatCard
          title="Miesięczny przychód"
          value={`${stats.monthlyEarnings} zł`}
          subtitle={`${stats.completedLessons} ukończonych`}
          icon={<DollarSign className="w-5 h-5" />}
          color="purple"
          trend={earningsTrend}
        />
        
        <StatCard
          title="Oczekujące wnioski"
          value={stats.pendingRequests}
          subtitle={stats.pendingRequests > 0 ? "Wymaga uwagi" : "Wszystko rozpatrzone"}
          icon={<AlertCircle className="w-5 h-5" />}
          color={stats.pendingRequests > 0 ? "red" : "green"}
        />
      </div>

      {/* Tablet view - 2 kolumny */}
      <div className="hidden md:grid md:grid-cols-2 lg:hidden gap-4">
        <StatCard
          title="Dzisiejsze zajęcia"
          value={stats.upcomingLessons}
          subtitle={`${stats.bookedSlots} zarezerwowanych`}
          icon={<Calendar className="w-5 h-5" />}
          color="blue"
        />
        
        <StatCard
          title="Obłożenie"
          value={`${stats.occupancyRate}%`}
          subtitle={`${stats.availableSlots} wolnych`}
          icon={<Clock className="w-5 h-5" />}
          color="green"
        />
      </div>

      {/* Mobile view - kompaktowe karty */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        <div className="bg-white p-3 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-500">Dziś</span>
          </div>
          <p className="text-xl font-bold">{stats.upcomingLessons}</p>
          <p className="text-xs text-gray-500">zajęć</p>
        </div>

        <div className="bg-white p-3 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-500">Obłożenie</span>
          </div>
          <p className="text-xl font-bold">{stats.occupancyRate}%</p>
          <p className="text-xs text-gray-500">rezerwacji</p>
        </div>

        <div className="bg-white p-3 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-gray-500">Miesiąc</span>
          </div>
          <p className="text-xl font-bold">{stats.monthlyEarnings}</p>
          <p className="text-xs text-gray-500">zł</p>
        </div>

        <div className="bg-white p-3 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-xs text-gray-500">Wnioski</span>
          </div>
          <p className="text-xl font-bold">{stats.pendingRequests}</p>
          <p className="text-xs text-gray-500">oczekuje</p>
        </div>
      </div>

      {/* Dodatkowe statystyki - rozwijane na mobile */}
      <details className="mt-4 md:hidden">
        <summary className="text-sm text-gray-600 cursor-pointer">
          Więcej statystyk
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">Ukończone</p>
            <p className="text-lg font-semibold">{stats.completedLessons}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">Anulowane</p>
            <p className="text-lg font-semibold">{stats.cancelledLessons}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">Nieobecności</p>
            <p className="text-lg font-semibold">{stats.noShowCount}</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <p className="text-xs text-gray-500">Skuteczność</p>
            <p className="text-lg font-semibold">{completionRate}%</p>
          </div>
        </div>
      </details>

      {/* Podsumowanie tygodnia - tylko desktop */}
      <div className="hidden lg:block mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">
              Podsumowanie tygodnia:
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>
              <strong>{stats.weeklyHours}</strong> godzin pracy
            </span>
            <span className="text-gray-400">•</span>
            <span>
              <strong>{stats.completedLessons}</strong> ukończonych zajęć
            </span>
            <span className="text-gray-400">•</span>
            <span className={cn(
              "font-semibold",
              stats.occupancyRate > 75 ? "text-green-600" : "text-orange-600"
            )}>
              {stats.occupancyRate}% obłożenia
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}