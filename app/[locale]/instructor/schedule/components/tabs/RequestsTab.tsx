// app/[locale]/instructor/schedule/components/tabs/RequestsTab.tsx
// Zakładka zarządzania wnioskami o anulowanie zajęć z filtrowaniem i przetwarzaniem

'use client'

import React, { useState, useMemo } from 'react'
import { 
  Clock, User, Calendar, MapPin, MessageSquare,
  CheckCircle, XCircle, AlertCircle, Filter,
  Phone, Mail, FileText, TrendingDown, Search,
  ChevronRight, Eye, DollarSign, Info, History
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScheduleContext } from '../../providers/ScheduleProvider'
import { CancellationRequest, CancellationRequestStatus } from '../../types/schedule.types'
import { formatDate, formatTime, formatRelativeDate, diffInHours } from '../../utils/dateHelpers'

interface RequestsTabProps {
  searchTerm?: string
  className?: string
}

// Komponent karty wniosku
const RequestCard: React.FC<{
  request: CancellationRequest
  onApprove: () => void
  onReject: () => void
  onViewDetails: () => void
}> = ({ request, onApprove, onReject, onViewDetails }) => {
  const slot = request.slot
  const timeDiff = slot ? diffInHours(new Date(`${slot.date}T${slot.startTime}`), new Date()) : 0
  const isUrgent = timeDiff < 24 && timeDiff > 0
  
  // Konfiguracja statusów
  const statusConfig = {
    'oczekujący': {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      text: 'text-yellow-900',
      icon: <Clock className="w-4 h-4" />,
      label: 'Oczekujący'
    },
    'zatwierdzony': {
      bg: 'bg-green-50',
      border: 'border-green-300',
      text: 'text-green-900',
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Zatwierdzony'
    },
    'odrzucony': {
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-900',
      icon: <XCircle className="w-4 h-4" />,
      label: 'Odrzucony'
    }
  }
  
  const config = statusConfig[request.status]

  return (
    <div className={cn(
      "border-l-4 rounded-lg p-4 hover:shadow-md transition-all",
      config.border,
      config.bg,
      isUrgent && request.status === 'oczekujący' && "animate-pulse"
    )}>
      {/* Nagłówek */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-full", config.bg)}>
            {config.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {request.student.firstName} {request.student.lastName}
            </h3>
            <p className="text-sm text-gray-600">
              Wniosek z: {formatRelativeDate(new Date(request.requestDate))}
            </p>
            {isUrgent && request.status === 'oczekujący' && (
              <span className="inline-flex items-center gap-1 text-xs text-red-600 mt-1">
                <AlertCircle className="w-3 h-3" />
                Zajęcia za {Math.round(timeDiff)} godzin!
              </span>
            )}
          </div>
        </div>
        
        <div className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          config.bg,
          config.text
        )}>
          {config.label}
        </div>
      </div>

      {/* Informacje o zajęciach */}
      {slot && (
        <div className="bg-white rounded-lg p-3 mb-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-600">Data zajęć</p>
                <p className="font-medium">{formatDate(new Date(slot.date))}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-600">Godzina</p>
                <p className="font-medium">{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</p>
              </div>
            </div>
            
            {slot.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-600">Lokalizacja</p>
                  <p className="font-medium">{slot.location.name}</p>
                </div>
              </div>
            )}
            
            {slot.payment && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-600">Opłata</p>
                  <p className="font-medium">
                    {slot.payment.amount} zł
                    {request.refundAmount && (
                      <span className="text-xs text-green-600 ml-1">
                        (zwrot: {request.refundAmount} zł)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Powód anulowania */}
      <div className="mb-3">
        <div className="flex items-start gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-1">Powód anulowania:</p>
            <p className="text-sm text-gray-600 italic">"{request.reason}"</p>
          </div>
        </div>
      </div>

      {/* Kontakt z kursantem */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={(e) => {
            e.stopPropagation()
            window.location.href = `tel:${request.student.phone}`
          }}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
        >
          <Phone className="w-3 h-3" />
          {request.student.phone}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            window.location.href = `mailto:${request.student.email}`
          }}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
        >
          <Mail className="w-3 h-3" />
          {request.student.email}
        </button>
      </div>

      {/* Komentarz administratora */}
      {request.adminComment && (
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <p className="text-xs font-medium text-gray-700 mb-1">Komentarz:</p>
          <p className="text-sm text-gray-600">{request.adminComment}</p>
          {request.processedBy && request.processedAt && (
            <p className="text-xs text-gray-500 mt-2">
              Przetworzony przez: {request.processedBy} • {formatDate(new Date(request.processedAt))}
            </p>
          )}
        </div>
      )}

      {/* Akcje */}
      {request.status === 'oczekujący' ? (
        <div className="flex gap-2">
          <button
            onClick={onApprove}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Zatwierdź
          </button>
          <button
            onClick={onReject}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            <XCircle className="w-4 h-4" />
            Odrzuć
          </button>
          <button
            onClick={onViewDetails}
            className="px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={onViewDetails}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <Eye className="w-4 h-4" />
          Zobacz szczegóły
        </button>
      )}
    </div>
  )
}

// Modal przetwarzania wniosku
const ProcessModal: React.FC<{
  request: CancellationRequest
  action: 'approve' | 'reject'
  onConfirm: (comment: string, refundAmount?: number) => void
  onCancel: () => void
}> = ({ request, action, onConfirm, onCancel }) => {
  const [comment, setComment] = useState('')
  const [refundAmount, setRefundAmount] = useState(request.slot?.payment?.amount || 0)
  
  const isApprove = action === 'approve'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">
          {isApprove ? 'Zatwierdzanie wniosku' : 'Odrzucanie wniosku'}
        </h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Kursant: <span className="font-medium">{request.student.firstName} {request.student.lastName}</span>
          </p>
          {request.slot && (
            <p className="text-sm text-gray-600">
              Termin: <span className="font-medium">
                {formatDate(new Date(request.slot.date))} {formatTime(request.slot.startTime)}
              </span>
            </p>
          )}
        </div>

        {isApprove && request.slot?.payment && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kwota zwrotu
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(Number(e.target.value))}
                className="flex-1 px-3 py-2 border rounded-lg"
                min="0"
                max={request.slot.payment.amount}
              />
              <span className="text-sm text-gray-600">
                z {request.slot.payment.amount} zł
              </span>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Komentarz {!isApprove && '(wymagany)'}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            rows={3}
            placeholder={isApprove 
              ? "Opcjonalny komentarz..." 
              : "Podaj powód odrzucenia wniosku..."}
            required={!isApprove}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onConfirm(comment, isApprove ? refundAmount : undefined)}
            disabled={!isApprove && !comment}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg text-white transition-colors",
              isApprove 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-red-600 hover:bg-red-700",
              !isApprove && !comment && "opacity-50 cursor-not-allowed"
            )}
          >
            {isApprove ? 'Zatwierdź anulowanie' : 'Odrzuć wniosek'}
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RequestsTab({
  searchTerm = '',
  className
}: RequestsTabProps) {
  const { cancellationRequests, processCancellationRequest } = useScheduleContext()
  
  const [filter, setFilter] = useState<CancellationRequestStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'urgency'>('urgency')
  const [selectedRequest, setSelectedRequest] = useState<CancellationRequest | null>(null)
  const [processModal, setProcessModal] = useState<{
    request: CancellationRequest
    action: 'approve' | 'reject'
  } | null>(null)

  // Filtrowanie i sortowanie wniosków
  const filteredRequests = useMemo(() => {
    let filtered = [...cancellationRequests]
    
    // Filtr wyszukiwania
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(request =>
        request.student.firstName.toLowerCase().includes(term) ||
        request.student.lastName.toLowerCase().includes(term) ||
        request.reason.toLowerCase().includes(term)
      )
    }
    
    // Filtr statusu
    if (filter !== 'all') {
      filtered = filtered.filter(request => request.status === filter)
    }
    
    // Sortowanie
    filtered.sort((a, b) => {
      if (sortBy === 'urgency') {
        // Najpierw oczekujące, potem po czasie do zajęć
        if (a.status === 'oczekujący' && b.status !== 'oczekujący') return -1
        if (a.status !== 'oczekujący' && b.status === 'oczekujący') return 1
        
        if (a.slot && b.slot) {
          const timeA = new Date(`${a.slot.date}T${a.slot.startTime}`).getTime()
          const timeB = new Date(`${b.slot.date}T${b.slot.startTime}`).getTime()
          return timeA - timeB
        }
      } else {
        // Po dacie złożenia wniosku
        return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
      }
      return 0
    })
    
    return filtered
  }, [cancellationRequests, searchTerm, filter, sortBy])

  // Statystyki
  const stats = useMemo(() => ({
    total: cancellationRequests.length,
    pending: cancellationRequests.filter(r => r.status === 'oczekujący').length,
    approved: cancellationRequests.filter(r => r.status === 'zatwierdzony').length,
    rejected: cancellationRequests.filter(r => r.status === 'odrzucony').length,
    urgent: cancellationRequests.filter(r => {
      if (r.status !== 'oczekujący' || !r.slot) return false
      const hours = diffInHours(new Date(`${r.slot.date}T${r.slot.startTime}`), new Date())
      return hours < 24 && hours > 0
    }).length
  }), [cancellationRequests])

  // Handlery
  const handleProcessRequest = async (
    request: CancellationRequest,
    action: 'approve' | 'reject',
    comment: string,
    refundAmount?: number
  ) => {
    // Dodaj kwotę zwrotu do komentarza jeśli została podana
    const finalComment = refundAmount !== undefined 
      ? `${comment}${comment ? '. ' : ''}Kwota zwrotu: ${refundAmount} zł`
      : comment
    
    await processCancellationRequest(request.id, action, finalComment)
    setProcessModal(null)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Nagłówek ze statystykami */}
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Wnioski o anulowanie</h2>
            <p className="text-sm text-gray-600">
              Zarządzaj wnioskami kursantów o anulowanie zajęć
            </p>
          </div>
          
          {stats.urgent > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {stats.urgent} {stats.urgent === 1 ? 'pilny wniosek' : 'pilne wnioski'}
              </span>
            </div>
          )}
        </div>

        {/* Statystyki */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600">Wszystkie</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
            <div className="text-xs text-gray-600">Oczekujące</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
            <div className="text-xs text-gray-600">Zatwierdzone</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
            <div className="text-xs text-gray-600">Odrzucone</div>
          </div>
        </div>

        {/* Filtry i sortowanie */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "px-3 py-1 rounded-lg text-sm",
                filter === 'all' ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              )}
            >
              Wszystkie
            </button>
            <button
              onClick={() => setFilter('oczekujący')}
              className={cn(
                "px-3 py-1 rounded-lg text-sm",
                filter === 'oczekujący' ? "bg-yellow-100 text-yellow-700" : "hover:bg-gray-100"
              )}
            >
              Oczekujące
            </button>
            <button
              onClick={() => setFilter('zatwierdzony')}
              className={cn(
                "px-3 py-1 rounded-lg text-sm",
                filter === 'zatwierdzony' ? "bg-green-100 text-green-700" : "hover:bg-gray-100"
              )}
            >
              Zatwierdzone
            </button>
            <button
              onClick={() => setFilter('odrzucony')}
              className={cn(
                "px-3 py-1 rounded-lg text-sm",
                filter === 'odrzucony' ? "bg-red-100 text-red-700" : "hover:bg-gray-100"
              )}
            >
              Odrzucone
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sortuj:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'urgency')}
              className="px-3 py-1 border rounded-lg text-sm"
            >
              <option value="urgency">Według pilności</option>
              <option value="date">Według daty</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista wniosków */}
      {filteredRequests.length > 0 ? (
        <div className="grid gap-4">
          {filteredRequests.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              onApprove={() => setProcessModal({ request, action: 'approve' })}
              onReject={() => setProcessModal({ request, action: 'reject' })}
              onViewDetails={() => setSelectedRequest(request)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Brak wniosków
          </h3>
          <p className="text-sm text-gray-600">
            {filter !== 'all' 
              ? 'Brak wniosków spełniających wybrane kryteria'
              : 'Nie ma żadnych wniosków o anulowanie zajęć'}
          </p>
        </div>
      )}

      {/* Modal przetwarzania */}
      {processModal && (
        <ProcessModal
          request={processModal.request}
          action={processModal.action}
          onConfirm={(comment, refund) => 
            handleProcessRequest(processModal.request, processModal.action, comment, refund)
          }
          onCancel={() => setProcessModal(null)}
        />
      )}

      {/* Modal szczegółów */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Szczegóły wniosku</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Dane kursanta */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Dane kursanta</h4>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-600">Imię i nazwisko:</span>{' '}
                    <span className="font-medium">
                      {selectedRequest.student.firstName} {selectedRequest.student.lastName}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Telefon:</span>{' '}
                    <span className="font-medium">{selectedRequest.student.phone}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Email:</span>{' '}
                    <span className="font-medium">{selectedRequest.student.email}</span>
                  </p>
                </div>
              </div>

              {/* Historia wniosku */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Historia</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <History className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Złożono:</span>
                    <span className="font-medium">
                      {formatDate(new Date(selectedRequest.requestDate))} {formatTime(new Date(selectedRequest.requestDate).toISOString())}
                    </span>
                  </div>
                  {selectedRequest.processedAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Przetworzono:</span>
                      <span className="font-medium">
                        {formatDate(new Date(selectedRequest.processedAt))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}