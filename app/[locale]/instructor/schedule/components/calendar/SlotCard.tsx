// app/[locale]/instructor/schedule/components/calendar/SlotCard.tsx
// Komponent karty slotu z wyświetlaniem informacji, kolorowaniem i szybkimi akcjami

'use client'

import React, { useState } from 'react'
import { 
  Clock, MapPin, User, Phone, Mail, Car, DollarSign,
  MoreVertical, Edit2, Trash2, Copy, CheckCircle, XCircle,
  Calendar, AlertCircle, Eye, MessageSquare, FileText,
  UserCheck, Ban, RefreshCw, ChevronRight, Star
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Slot, SlotStatus } from '../../types/schedule.types'
import { formatTime, formatRelativeDate, diffInMinutes } from '../../utils/dateHelpers'

interface SlotCardProps {
  slot: Slot
  view?: 'compact' | 'normal' | 'expanded'
  showDate?: boolean
  showActions?: boolean
  isDragging?: boolean
  isHighlighted?: boolean
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onStatusChange?: (status: SlotStatus) => void
  onStudentClick?: () => void
  className?: string
}

// Konfiguracja kolorów dla statusów
const statusConfig: Record<SlotStatus, {
  bg: string
  border: string
  text: string
  icon: React.ReactNode
  label: string
}> = {
  'dostępny': {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-900',
    icon: <CheckCircle className="w-4 h-4" />,
    label: 'Dostępny'
  },
  'zarezerwowany': {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-900',
    icon: <Calendar className="w-4 h-4" />,
    label: 'Zarezerwowany'
  },
  'zablokowany': {
    bg: 'bg-gray-50',
    border: 'border-gray-300',
    text: 'text-gray-700',
    icon: <Ban className="w-4 h-4" />,
    label: 'Zablokowany'
  },
  'zakończony': {
    bg: 'bg-gray-100',
    border: 'border-gray-400',
    text: 'text-gray-800',
    icon: <CheckCircle className="w-4 h-4" />,
    label: 'Zakończony'
  },
  'anulowany': {
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-900',
    icon: <XCircle className="w-4 h-4" />,
    label: 'Anulowany'
  },
  'nieobecność': {
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    text: 'text-orange-900',
    icon: <AlertCircle className="w-4 h-4" />,
    label: 'Nieobecność'
  },
  'w_trakcie': {
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    text: 'text-purple-900',
    icon: <RefreshCw className="w-4 h-4 animate-spin" />,
    label: 'W trakcie'
  }
}

// Konfiguracja typów lekcji
const lessonTypeConfig = {
  'jazda': { icon: <Car className="w-4 h-4" />, label: 'Jazda w mieście' },
  'plac': { icon: <Car className="w-4 h-4" />, label: 'Plac manewrowy' },
  'teoria': { icon: <FileText className="w-4 h-4" />, label: 'Teoria' },
  'egzamin': { icon: <UserCheck className="w-4 h-4" />, label: 'Egzamin' }
}

// Komponent statusu płatności
const PaymentBadge: React.FC<{ status: string }> = ({ status }) => {
  const config = {
    'opłacony': { bg: 'bg-green-100', text: 'text-green-800', label: 'Opłacone' },
    'nieopłacony': { bg: 'bg-red-100', text: 'text-red-800', label: 'Nieopłacone' },
    'częściowo': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Częściowo' }
  }
  
  const style = config[status as keyof typeof config] || config.nieopłacony
  
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', style.bg, style.text)}>
      {style.label}
    </span>
  )
}

// Menu akcji
const ActionMenu: React.FC<{
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onStatusChange?: (status: SlotStatus) => void
  currentStatus: SlotStatus
}> = ({ onEdit, onDelete, onDuplicate, onStatusChange, currentStatus }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(false)
            }}
          />
          <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border z-20 py-1">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                  setIsOpen(false)
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Edit2 className="w-3 h-3" />
                Edytuj
              </button>
            )}
            
            {onDuplicate && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicate()
                  setIsOpen(false)
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Copy className="w-3 h-3" />
                Duplikuj
              </button>
            )}

            {onStatusChange && currentStatus === 'zarezerwowany' && (
              <>
                <hr className="my-1" />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onStatusChange('zakończony')
                    setIsOpen(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  Oznacz jako zakończone
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onStatusChange('nieobecność')
                    setIsOpen(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <AlertCircle className="w-3 h-3 text-orange-600" />
                  Nieobecność kursanta
                </button>
              </>
            )}

            {onDelete && (
              <>
                <hr className="my-1" />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                    setIsOpen(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 className="w-3 h-3" />
                  Usuń
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default function SlotCard({
  slot,
  view = 'normal',
  showDate = false,
  showActions = true,
  isDragging = false,
  isHighlighted = false,
  onClick,
  onEdit,
  onDelete,
  onDuplicate,
  onStatusChange,
  onStudentClick,
  className
}: SlotCardProps) {
  const config = statusConfig[slot.status]
  const duration = diffInMinutes(
    new Date(`2000-01-01T${slot.endTime}`),
    new Date(`2000-01-01T${slot.startTime}`)
  )

  // Widok kompaktowy dla widoku miesiąca
  if (view === 'compact') {
    return (
      <div
        onClick={onClick}
        className={cn(
          'px-2 py-1 rounded text-xs cursor-pointer transition-all',
          config.bg,
          config.border,
          config.text,
          'border',
          isDragging && 'opacity-50',
          isHighlighted && 'ring-2 ring-blue-400',
          'hover:shadow-sm',
          className
        )}
      >
        <div className="flex items-center gap-1">
          {config.icon}
          <span className="font-medium">{formatTime(slot.startTime)}</span>
          {slot.student && (
            <span className="truncate">
              {slot.student.firstName} {slot.student.lastName[0]}.
            </span>
          )}
        </div>
      </div>
    )
  }

  // Widok normalny i rozszerzony
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative rounded-lg border-2 transition-all cursor-pointer',
        config.bg,
        config.border,
        config.text,
        isDragging && 'opacity-50 rotate-2',
        isHighlighted && 'ring-2 ring-blue-400 shadow-lg',
        'hover:shadow-md',
        className
      )}
    >
      {/* Nagłówek */}
      <div className="px-3 py-2 border-b border-current border-opacity-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {config.icon}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </span>
                <span className="text-xs opacity-75">({duration} min)</span>
              </div>
              {showDate && (
                <span className="text-xs opacity-75">
                  {formatRelativeDate(new Date(slot.date))}
                </span>
              )}
            </div>
          </div>
          
          {showActions && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ActionMenu
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onStatusChange={onStatusChange}
                currentStatus={slot.status}
              />
            </div>
          )}
        </div>
      </div>

      {/* Treść */}
      <div className="px-3 py-2 space-y-2">
        {slot.student ? (
          <>
            {/* Informacje o kursncie */}
            <div
              onClick={(e) => {
                if (onStudentClick) {
                  e.stopPropagation()
                  onStudentClick()
                }
              }}
              className={cn(
                'flex items-center gap-2',
                onStudentClick && 'cursor-pointer hover:underline'
              )}
            >
              <User className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">
                  {slot.student.firstName} {slot.student.lastName}
                </p>
                {view === 'expanded' && (
                  <div className="flex items-center gap-3 text-xs opacity-75 mt-0.5">
                    {slot.student.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {slot.student.phone}
                      </span>
                    )}
                    {slot.student.lessonsCompleted && (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {slot.student.lessonsCompleted} lekcji
                      </span>
                    )}
                  </div>
                )}
              </div>
              {slot.student.packageType && (
                <span className={cn(
                  'px-2 py-0.5 rounded text-xs font-medium',
                  slot.student.packageType === 'premium' && 'bg-purple-100 text-purple-800',
                  slot.student.packageType === 'rozszerzony' && 'bg-blue-100 text-blue-800',
                  slot.student.packageType === 'podstawowy' && 'bg-gray-100 text-gray-800'
                )}>
                  {slot.student.packageType}
                </span>
              )}
            </div>

            {/* Typ lekcji */}
            {slot.lessonType && (
              <div className="flex items-center gap-2 text-sm">
                {lessonTypeConfig[slot.lessonType]?.icon}
                <span>{lessonTypeConfig[slot.lessonType]?.label}</span>
              </div>
            )}

            {/* Lokalizacja */}
            {slot.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{slot.location.name}</p>
                  {view === 'expanded' && slot.location.address && (
                    <p className="text-xs opacity-75">{slot.location.address}</p>
                  )}
                </div>
              </div>
            )}

            {/* Płatność */}
            {slot.payment && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>{slot.payment.amount} zł</span>
                </div>
                <PaymentBadge status={slot.payment.status} />
              </div>
            )}
          </>
        ) : (
          /* Slot bez kursanta */
          <div className="text-sm">
            {slot.status === 'dostępny' && (
              <p className="text-green-700">Wolny termin do rezerwacji</p>
            )}
            {slot.status === 'zablokowany' && (
              <p className="text-gray-600">{slot.notes || 'Termin niedostępny'}</p>
            )}
          </div>
        )}

        {/* Notatki */}
        {slot.notes && (view === 'normal' || view === 'expanded') && (
          <div className="pt-2 border-t border-current border-opacity-10">
            <div className="flex items-start gap-2 text-xs">
              <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <p className="italic opacity-90">{slot.notes}</p>
            </div>
          </div>
        )}

        {/* Powód anulowania */}
        {slot.status === 'anulowany' && slot.cancelReason && (
          <div className="pt-2 border-t border-current border-opacity-10">
            <div className="flex items-start gap-2 text-xs">
              <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-red-600" />
              <p className="text-red-600">Powód: {slot.cancelReason}</p>
            </div>
          </div>
        )}
      </div>

      {/* Stopka z szybkimi akcjami (tylko w widoku rozszerzonym) */}
      {view === 'expanded' && showActions && (
        <div className="px-3 py-2 border-t border-current border-opacity-10 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                // Otwórz szczegóły
              }}
              className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
              title="Zobacz szczegóły"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                // Wyślij wiadomość
              }}
              className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
              title="Wyślij wiadomość"
            >
              <Mail className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                // Zadzwoń
              }}
              className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
              title="Zadzwoń"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>
          
          <ChevronRight className="w-4 h-4 opacity-50" />
        </div>
      )}

      {/* Wskaźnik "w trakcie" */}
      {slot.status === 'w_trakcie' && (
        <div className="absolute -top-1 -right-1">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
          </span>
        </div>
      )}
    </div>
  )
}