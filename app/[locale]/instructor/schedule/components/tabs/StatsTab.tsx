// app/[locale]/instructor/schedule/components/tabs/StatsTab.tsx
// Zakładka statystyk z wykresami, metrykami i generowaniem raportów

'use client'

import React, { useState, useMemo } from 'react'
import { 
  TrendingUp, TrendingDown, Calendar, DollarSign,
  Users, Clock, Car, Award, AlertCircle,
  Download, Filter, ChevronUp, ChevronDown,
  BarChart3, PieChart, LineChart, Activity,
  FileText, Star, Target, Percent,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScheduleContext } from '../../providers/ScheduleProvider'
import { Slot } from '../../types/schedule.types'
import { 
  formatDate, getMonthDays, getPolishMonthName,
  getCurrentWeek, formatPolishDate, diffInDays
} from '../../utils/dateHelpers'

interface StatsTabProps {
  currentDate: Date
  className?: string
}

// Komponent karty metryki
const StatCard: React.FC<{
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: { value: number; isPositive: boolean }
  color?: string
}> = ({ title, value, subtitle, icon, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    gray: 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className={cn('p-2 rounded-lg', colorClasses[color as keyof typeof colorClasses])}>
          {icon}
        </div>
        {trend && (
          <div className={cn(
            'flex items-center gap-1 text-sm',
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          )}>
            {trend.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  )
}

// Komponent wykresu słupkowego
const BarChart: React.FC<{
  data: { label: string; value: number; color?: string }[]
  height?: number
}> = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className="relative" style={{ height }}>
      <div className="absolute inset-0 flex items-end justify-between gap-2">
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0
          const bgColor = item.color || 'bg-blue-500'
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center justify-end">
              <span className="text-xs font-medium mb-1">{item.value}</span>
              <div 
                className={cn('w-full rounded-t transition-all hover:opacity-80', bgColor)}
                style={{ height: `${percentage}%` }}
                title={`${item.label}: ${item.value}`}
              />
              <span className="text-xs text-gray-600 mt-1 text-center">{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Komponent wykresu kołowego
const PieChartSimple: React.FC<{
  data: { label: string; value: number; color: string }[]
  size?: number
}> = ({ data, size = 150 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = -90 // Start od góry
  
  const paths = data.map((item, index) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0
    const angle = (percentage / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle
    
    const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
    const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
    const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180)
    const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180)
    
    const largeArc = angle > 180 ? 1 : 0
    
    return {
      path: `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`,
      color: item.color,
      label: item.label,
      value: item.value,
      percentage: Math.round(percentage)
    }
  })
  
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox="0 0 100 100">
        {paths.map((item, index) => (
          <path
            key={index}
            d={item.path}
            fill={item.color}
            stroke="white"
            strokeWidth="1"
            className="hover:opacity-80 transition-opacity cursor-pointer"
          >
            <title>{`${item.label}: ${item.value} (${item.percentage}%)`}</title>
          </path>
        ))}
      </svg>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className={cn('w-3 h-3 rounded', item.color)} />
            <span className="text-gray-600">{item.label}:</span>
            <span className="font-medium">{item.value}</span>
            <span className="text-gray-500">
              ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Komponent tabeli rankingowej
const RankingTable: React.FC<{
  title: string
  data: { name: string; value: number; subtitle?: string }[]
  valueLabel: string
}> = ({ title, data, valueLabel }) => {
  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-medium text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2">
        {data.slice(0, 5).map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
            <div className="flex items-center gap-3">
              <span className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                index === 0 && 'bg-yellow-100 text-yellow-700',
                index === 1 && 'bg-gray-100 text-gray-700',
                index === 2 && 'bg-orange-100 text-orange-700',
                index > 2 && 'bg-gray-50 text-gray-600'
              )}>
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                {item.subtitle && (
                  <p className="text-xs text-gray-500">{item.subtitle}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{item.value}</p>
              <p className="text-xs text-gray-500">{valueLabel}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function StatsTab({
  currentDate,
  className
}: StatsTabProps) {
  const { slots, cancellationRequests, stats } = useScheduleContext()
  
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [showDetails, setShowDetails] = useState(false)

  // Obliczanie statystyk
  const periodStats = useMemo(() => {
    let periodSlots: Slot[] = []
    let previousPeriodSlots: Slot[] = []
    
    if (period === 'week') {
      const weekDays = getCurrentWeek(currentDate)
      const prevWeekDays = getCurrentWeek(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))
      
      periodSlots = slots.filter(slot => {
        const slotDate = new Date(slot.date)
        return weekDays.some(day => 
          slotDate.toDateString() === day.toDateString()
        )
      })
      
      previousPeriodSlots = slots.filter(slot => {
        const slotDate = new Date(slot.date)
        return prevWeekDays.some(day => 
          slotDate.toDateString() === day.toDateString()
        )
      })
    } else if (period === 'month') {
      const monthDays = getMonthDays(currentDate)
      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      const prevMonthDays = getMonthDays(prevMonth)
      
      periodSlots = slots.filter(slot => {
        const slotDate = new Date(slot.date)
        return slotDate.getMonth() === currentDate.getMonth() &&
               slotDate.getFullYear() === currentDate.getFullYear()
      })
      
      previousPeriodSlots = slots.filter(slot => {
        const slotDate = new Date(slot.date)
        return slotDate.getMonth() === prevMonth.getMonth() &&
               slotDate.getFullYear() === prevMonth.getFullYear()
      })
    } else {
      periodSlots = slots.filter(slot => {
        const slotDate = new Date(slot.date)
        return slotDate.getFullYear() === currentDate.getFullYear()
      })
      
      previousPeriodSlots = slots.filter(slot => {
        const slotDate = new Date(slot.date)
        return slotDate.getFullYear() === currentDate.getFullYear() - 1
      })
    }
    
    // Oblicz metryki
    const completed = periodSlots.filter(s => s.status === 'zakończony').length
    const cancelled = periodSlots.filter(s => s.status === 'anulowany').length
    const noShow = periodSlots.filter(s => s.status === 'nieobecność').length
    const booked = periodSlots.filter(s => s.status === 'zarezerwowany').length
    const available = periodSlots.filter(s => s.status === 'dostępny').length
    
    const prevCompleted = previousPeriodSlots.filter(s => s.status === 'zakończony').length
    
    const earnings = periodSlots
      .filter(s => s.status === 'zakończony' && s.payment)
      .reduce((sum, s) => sum + (s.payment?.amount || 0), 0)
    
    const prevEarnings = previousPeriodSlots
      .filter(s => s.status === 'zakończony' && s.payment)
      .reduce((sum, s) => sum + (s.payment?.amount || 0), 0)
    
    // Oblicz trendy
    const completedTrend = prevCompleted > 0 
      ? Math.round(((completed - prevCompleted) / prevCompleted) * 100)
      : 0
    
    const earningsTrend = prevEarnings > 0
      ? Math.round(((earnings - prevEarnings) / prevEarnings) * 100)
      : 0
    
    // Statystyki po dniach tygodnia
    const byWeekDay = {
      'Pon': 0, 'Wt': 0, 'Śr': 0, 'Czw': 0, 'Pt': 0, 'Sob': 0, 'Niedz': 0
    }
    
    periodSlots.forEach(slot => {
      const day = new Date(slot.date).getDay()
      const dayNames = ['Niedz', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob']
      if (slot.status === 'zakończony') {
        byWeekDay[dayNames[day] as keyof typeof byWeekDay]++
      }
    })
    
    // Statystyki po godzinach
    const byHour: Record<number, number> = {}
    periodSlots.forEach(slot => {
      if (slot.status === 'zakończony') {
        const hour = parseInt(slot.startTime.split(':')[0])
        byHour[hour] = (byHour[hour] || 0) + 1
      }
    })
    
    // Top kursanci
    const studentStats: Record<string, { name: string; count: number; earnings: number }> = {}
    periodSlots.forEach(slot => {
      if (slot.student && slot.status === 'zakończony') {
        const key = slot.student.id
        if (!studentStats[key]) {
          studentStats[key] = {
            name: `${slot.student.firstName} ${slot.student.lastName}`,
            count: 0,
            earnings: 0
          }
        }
        studentStats[key].count++
        studentStats[key].earnings += slot.payment?.amount || 0
      }
    })
    
    const topStudents = Object.values(studentStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    return {
      total: periodSlots.length,
      completed,
      cancelled,
      noShow,
      booked,
      available,
      earnings,
      completedTrend,
      earningsTrend,
      occupancyRate: periodSlots.length > 0 
        ? Math.round((completed / periodSlots.length) * 100)
        : 0,
      cancellationRate: periodSlots.length > 0
        ? Math.round(((cancelled + noShow) / periodSlots.length) * 100)
        : 0,
      byWeekDay,
      byHour,
      topStudents,
      averagePerDay: Math.round(completed / (period === 'week' ? 7 : 30))
    }
  }, [slots, currentDate, period])

  // Dane dla wykresów
  const weekDayData = Object.entries(periodStats.byWeekDay).map(([day, value]) => ({
    label: day,
    value,
    color: value > 10 ? 'bg-green-500' : value > 5 ? 'bg-yellow-500' : 'bg-gray-400'
  }))

  const hourData = Object.entries(periodStats.byHour)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([hour, value]) => ({
      label: `${hour}:00`,
      value,
      color: 'bg-blue-500'
    }))

  const statusData = [
    { label: 'Zakończone', value: periodStats.completed, color: 'bg-green-500' },
    { label: 'Zarezerwowane', value: periodStats.booked, color: 'bg-blue-500' },
    { label: 'Dostępne', value: periodStats.available, color: 'bg-gray-400' },
    { label: 'Anulowane', value: periodStats.cancelled, color: 'bg-red-500' },
    { label: 'Nieobecności', value: periodStats.noShow, color: 'bg-orange-500' }
  ]

  // Generowanie raportu
  const generateReport = () => {
    const reportData = {
      okres: period === 'week' ? 'Tydzień' : period === 'month' ? 'Miesiąc' : 'Rok',
      data: formatDate(currentDate),
      statystyki: {
        'Wszystkie terminy': periodStats.total,
        'Zakończone zajęcia': periodStats.completed,
        'Anulowane': periodStats.cancelled,
        'Nieobecności': periodStats.noShow,
        'Przychód': `${periodStats.earnings} zł`,
        'Zajętość': `${periodStats.occupancyRate}%`,
        'Średnio dziennie': periodStats.averagePerDay
      },
      'Top kursanci': periodStats.topStudents.map(s => ({
        'Imię i nazwisko': s.name,
        'Liczba zajęć': s.count,
        'Przychód': `${s.earnings} zł`
      }))
    }

    const json = JSON.stringify(reportData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `raport_${period}_${formatDate(currentDate)}.json`
    link.click()
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Nagłówek */}
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Statystyki i raporty</h2>
            <p className="text-sm text-gray-600">
              Analiza wyników i wydajności
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Wybór okresu */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <button
                onClick={() => setPeriod('week')}
                className={cn(
                  "px-3 py-1 rounded text-sm transition-colors",
                  period === 'week' ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                )}
              >
                Tydzień
              </button>
              <button
                onClick={() => setPeriod('month')}
                className={cn(
                  "px-3 py-1 rounded text-sm transition-colors",
                  period === 'month' ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                )}
              >
                Miesiąc
              </button>
              <button
                onClick={() => setPeriod('year')}
                className={cn(
                  "px-3 py-1 rounded text-sm transition-colors",
                  period === 'year' ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                )}
              >
                Rok
              </button>
            </div>
            
            <button
              onClick={generateReport}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <Download className="w-4 h-4" />
              Pobierz raport
            </button>
          </div>
        </div>

        {/* Okres */}
        <div className="text-center py-2 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {period === 'week' && 'Statystyki tygodniowe'}
            {period === 'month' && `${getPolishMonthName(currentDate)} ${currentDate.getFullYear()}`}
            {period === 'year' && `Rok ${currentDate.getFullYear()}`}
          </p>
        </div>
      </div>

      {/* Główne metryki */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Zakończone zajęcia"
          value={periodStats.completed}
          subtitle={`z ${periodStats.total} zaplanowanych`}
          icon={<CheckCircle className="w-5 h-5" />}
          trend={{ value: periodStats.completedTrend, isPositive: periodStats.completedTrend > 0 }}
          color="green"
        />
        
        <StatCard
          title="Przychód"
          value={`${periodStats.earnings} zł`}
          subtitle={`śr. ${periodStats.completed > 0 ? Math.round(periodStats.earnings / periodStats.completed) : 0} zł/zajęcia`}
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: periodStats.earningsTrend, isPositive: periodStats.earningsTrend > 0 }}
          color="blue"
        />
        
        <StatCard
          title="Zajętość"
          value={`${periodStats.occupancyRate}%`}
          subtitle={`${periodStats.completed}/${periodStats.total}`}
          icon={<Activity className="w-5 h-5" />}
          color="purple"
        />
        
        <StatCard
          title="Anulowania"
          value={periodStats.cancelled + periodStats.noShow}
          subtitle={`${periodStats.cancellationRate}% wszystkich`}
          icon={<XCircle className="w-5 h-5" />}
          color="red"
        />
      </div>

      {/* Wykresy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Wykres statusów */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-medium text-gray-900 mb-4">Podział terminów</h3>
          <PieChartSimple data={statusData} />
        </div>

        {/* Wykres po dniach tygodnia */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-medium text-gray-900 mb-4">Zajęcia w tygodniu</h3>
          <BarChart data={weekDayData} />
        </div>
      </div>

      {/* Wykres godzinowy */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-medium text-gray-900 mb-4">Rozkład godzinowy</h3>
        <BarChart data={hourData} height={150} />
      </div>

      {/* Rankingi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RankingTable
          title="Top kursanci"
          data={periodStats.topStudents.map(s => ({
            name: s.name,
            value: s.count,
            subtitle: `${s.earnings} zł przychodu`
          }))}
          valueLabel="zajęć"
        />
        
        <RankingTable
          title="Najpopularniejsze godziny"
          data={Object.entries(periodStats.byHour)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([hour, count]) => ({
              name: `Godzina ${hour}:00`,
              value: count,
              subtitle: `${Math.round((count / periodStats.completed) * 100)}% wszystkich`
            }))}
          valueLabel="zajęć"
        />
      </div>

      {/* Szczegółowe statystyki */}
      <div className="bg-white rounded-lg border">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-gray-900">Szczegółowe statystyki</span>
          {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {showDetails && (
          <div className="border-t p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Średnia dzienna:</p>
                <p className="font-semibold">{periodStats.averagePerDay} zajęć</p>
              </div>
              <div>
                <p className="text-gray-600">Łączny czas:</p>
                <p className="font-semibold">{periodStats.completed * 2} godzin</p>
              </div>
              <div>
                <p className="text-gray-600">Średni przychód dzienny:</p>
                <p className="font-semibold">
                  {Math.round(periodStats.earnings / (period === 'week' ? 7 : 30))} zł
                </p>
              </div>
              <div>
                <p className="text-gray-600">Współczynnik anulowań:</p>
                <p className="font-semibold">{periodStats.cancellationRate}%</p>
              </div>
              <div>
                <p className="text-gray-600">Nieobecności:</p>
                <p className="font-semibold">{periodStats.noShow}</p>
              </div>
              <div>
                <p className="text-gray-600">Wolne terminy:</p>
                <p className="font-semibold">{periodStats.available}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Porady */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">Wskazówki optymalizacji</p>
            {periodStats.occupancyRate < 70 && (
              <p className="text-blue-700">
                • Twoja zajętość wynosi {periodStats.occupancyRate}%. Rozważ promocje lub elastyczne godziny.
              </p>
            )}
            {periodStats.cancellationRate > 15 && (
              <p className="text-blue-700">
                • Wysoki współczynnik anulowań ({periodStats.cancellationRate}%). Sprawdź przyczyny rezygnacji.
              </p>
            )}
            {periodStats.averagePerDay < 3 && (
              <p className="text-blue-700">
                • Niska średnia dzienna ({periodStats.averagePerDay} zajęć). Możesz zwiększyć dostępność.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}