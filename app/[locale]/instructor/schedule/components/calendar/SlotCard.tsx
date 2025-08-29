// app/[locale]/instructor/schedule/components/calendar/SlotCard.tsx
'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { 
  Clock, MapPin, User, Phone, Mail, Car, 
  CreditCard, AlertCircle, MoreVertical, 
  Edit2, Trash2, CheckCircle, XCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Slot, SlotStatus } from '../../types/schedule.types'

interface SlotCardProps {
  slot: Slot
  view?: 'compact' | 'expanded' | 'minimal'
  showDate?: boolean
  showActions?: boolean
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

// Konfiguracja kolorów statusów
const STATUS_COLORS: Record<SlotStatus, {
  bg: string
  border: string
  text: string
}> = {
  'dostępny': {
    bg: 'bg-green-50 hover:bg-green-100',
    border: 'border-green-300',
    text: 'text-green-900'
  },
  'zarezerwowany': {
    bg: 'bg-blue-50 hover:bg-blue-100',
    border: 'border-blue-300',
    text: 'text-blue-900'
  },
  'zablokowany': {
    bg: 'bg-gray-50 hover:bg-gray-100',
    border: 'border-gray-300',
    text: 'text-gray-700'
  },
  'zakończony': {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-800'
  },
  'anulowany': {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700'
  },
  'nieobecność': {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700'
  },
  'w_trakcie': {
    bg: 'bg-yellow-50 animate-pulse',
    border: 'border-yellow-300',
    text: 'text-yellow-900'
  }
}

const LESSON_TYPE_ICONS = {
  'jazda': <Car className="w-3 h-3" />,
  'plac': <MapPin className="w-3 h-3" />,
  'teoria': <AlertCircle className="w-3 h-3" />,
  'egzamin': <CheckCircle className="w-3 h-3" />
}

export default function SlotCard({
  slot,
  view = 'expanded',
  showDate = true,
  showActions = false,
  onClick,
  onEdit,
  onDelete,
  className
}: SlotCardProps) {
  const t = useTranslations('instructor.schedule.calendar.slotCard')
  const colors = STATUS_COLORS[slot.status]
  
  // Minimalna wersja - tylko czas i status
  if (view === 'minimal') {
    return (
      <div
        onClick={onClick}
        className={cn(
          "px-2 py-1 rounded border cursor-pointer transition-all",
          colors.bg,
          colors.border,
          className
        )}
      >
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs font-medium">{slot.startTime}</span>
          {slot.student && (
            <User className="w-3 h-3 text-gray-500" />
          )}
        </div>
      </div>
    )
  }

  // Kompaktowa wersja
  if (view === 'compact') {
    return (
      <div
        onClick={onClick}
        className={cn(
          "p-2 rounded-lg border cursor-pointer transition-all",
          colors.bg,
          colors.border,
          "hover:shadow-sm",
          className
        )}
      >
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-xs">
              <Clock className="w-3 h-3" />
              <span className="font-medium">{slot.startTime} - {slot.endTime}</span>
            </div>
            {slot.student && (
              <p className="text-xs mt-1 truncate">
                {slot.student.firstName} {slot.student.lastName}
              </p>
            )}
          </div>
          {slot.lessonType && LESSON_TYPE_ICONS[slot.lessonType]}
        </div>
      </div>
    )
  }

  // Pełna wersja
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative h-full rounded-lg border-2 p-2 cursor-pointer transition-all group",
        colors.bg,
        colors.border,
        "hover:shadow-md",
        className
      )}
    >
      {/* Nagłówek */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-gray-600" />
          <span className={cn("text-xs font-semibold", colors.text)}>
            {slot.startTime} - {slot.endTime}
          </span>
        </div>
        
        {showActions && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                className="p-0.5 hover:bg-white/50 rounded"
                aria-label={t('aria.editSlot')}
              >
                <Edit2 className="w-3 h-3" />
              </button>
            )}
            {onDelete && slot.status === 'dostępny' && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="p-0.5 hover:bg-white/50 rounded text-red-600"
                aria-label={t('aria.deleteSlot')}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Zawartość */}
      <div className="space-y-1">
        {/* Kursant */}
        {slot.student && (
          <div className="flex items-center gap-1">
            <User className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <span className="text-xs text-gray-700 truncate">
              {slot.student.firstName} {slot.student.lastName}
            </span>
          </div>
        )}

        {/* Lokalizacja */}
        {slot.location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <span className="text-xs text-gray-600 truncate">
              {slot.location.name}
            </span>
          </div>
        )}

        {/* Typ zajęć */}
        {slot.lessonType && (
          <div className="flex items-center gap-1">
            {LESSON_TYPE_ICONS[slot.lessonType]}
            <span className="text-xs text-gray-600">
              {slot.lessonType === 'jazda' && t('lessonTypes.driving')}
              {slot.lessonType === 'plac' && t('lessonTypes.practiceArea')}
              {slot.lessonType === 'teoria' && t('lessonTypes.theory')}
              {slot.lessonType === 'egzamin' && t('lessonTypes.exam')}
            </span>
          </div>
        )}

        {/* Status płatności */}
        {slot.payment && slot.payment.status !== 'opłacony' && (
          <div className="flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-amber-500 flex-shrink-0" />
            <span className="text-xs text-amber-700">
              {slot.payment.status === 'nieopłacony' 
                ? t('payment.unpaid') 
                : t('payment.partial')
              }
            </span>
          </div>
        )}

        {/* Notatki */}
        {slot.notes && (
          <div className="flex items-start gap-1">
            <AlertCircle className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
            <span className="text-xs text-gray-600 line-clamp-2">
              {slot.notes}
            </span>
          </div>
        )}
      </div>

      {/* Status bar dla zajęć w trakcie */}
      {slot.status === 'w_trakcie' && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-b animate-pulse" />
      )}
    </div>
  )
}