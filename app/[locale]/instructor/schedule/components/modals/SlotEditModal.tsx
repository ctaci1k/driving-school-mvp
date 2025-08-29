// app/[locale]/instructor/schedule/components/modals/SlotEditModal.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { 
  X, Calendar, Clock, User, MapPin, Car, CreditCard, 
  AlertCircle, Save, Trash2, Phone, Mail, Hash, BookOpen,
  CheckCircle, XCircle, Loader2, MessageSquare, Euro
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  Slot, 
  SlotStatus, 
  Student, 
  Location 
} from '../../types/schedule.types'
import { useScheduleContext } from '../../providers/ScheduleProvider'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

interface SlotEditModalProps {
  isOpen: boolean
  onClose: () => void
  slot: Slot | null
  onSave?: (updatedSlot: Slot) => void
  onDelete?: (slotId: string) => void
  mode?: 'edit' | 'create'
  initialDate?: Date
  initialTime?: string
}

// Mock data - w przyszłości z API
const MOCK_STUDENTS: Student[] = [
  { id: '1', firstName: 'Anna', lastName: 'Nowak', email: 'anna.nowak@email.pl', phone: '+48 600 111 222', packageType: 'podstawowy', lessonsCompleted: 12 },
  { id: '2', firstName: 'Piotr', lastName: 'Kowalski', email: 'piotr.kowalski@email.pl', phone: '+48 600 333 444', packageType: 'rozszerzony', lessonsCompleted: 8 },
  { id: '3', firstName: 'Katarzyna', lastName: 'Wiśniewska', email: 'k.wisniewska@email.pl', phone: '+48 600 555 666', packageType: 'premium', lessonsCompleted: 5 },
  { id: '4', firstName: 'Michał', lastName: 'Kamiński', email: 'm.kaminski@email.pl', phone: '+48 600 777 888', packageType: 'podstawowy', lessonsCompleted: 20 }
]

const MOCK_LOCATIONS: Location[] = [
  { id: '1', name: 'Plac Manewrowy Ochota', address: 'ul. Grójecka 125', city: 'Warszawa', type: 'plac' },
  { id: '2', name: 'Start - Centrum', address: 'ul. Marszałkowska 100', city: 'Warszawa', type: 'miasto' },
  { id: '3', name: 'Plac Manewrowy Bemowo', address: 'ul. Powstańców Śląskich 50', city: 'Warszawa', type: 'plac' },
  { id: '4', name: 'Trasa S8', address: 'Zjazd Bemowo', city: 'Warszawa', type: 'trasa' },
  { id: '5', name: 'Rynek Główny', address: 'Rynek Główny 1', city: 'Kraków', type: 'miasto' },
  { id: '6', name: 'Plac Manewrowy', address: 'ul. Ptasia 10', city: 'Wrocław', type: 'plac' }
]

export default function SlotEditModal({
  isOpen,
  onClose,
  slot,
  onSave,
  onDelete,
  mode = 'edit',
  initialDate,
  initialTime
}: SlotEditModalProps) {
  const t = useTranslations('instructor.schedule.modals.slotEdit')
  const { updateSlot, createSlot, deleteSlot } = useScheduleContext()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'student' | 'payment' | 'notes'>('details')
  
  // Form state
  const [formData, setFormData] = useState<Partial<Slot>>({
    status: 'dostępny',
    lessonType: 'jazda',
    date: '',
    startTime: '',
    endTime: '',
    notes: ''
  })
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [searchStudent, setSearchStudent] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Status options configuration
  const STATUS_OPTIONS: { value: SlotStatus; label: string; color: string; icon: React.ReactNode }[] = [
    { value: 'dostępny', label: t('status.available'), color: 'text-green-600 bg-green-50', icon: <CheckCircle className="w-4 h-4" /> },
    { value: 'zarezerwowany', label: t('status.reserved'), color: 'text-blue-600 bg-blue-50', icon: <Calendar className="w-4 h-4" /> },
    { value: 'zablokowany', label: t('status.blocked'), color: 'text-gray-600 bg-gray-50', icon: <XCircle className="w-4 h-4" /> },
    { value: 'zakończony', label: t('status.completed'), color: 'text-gray-500 bg-gray-50', icon: <CheckCircle className="w-4 h-4" /> },
    { value: 'anulowany', label: t('status.cancelled'), color: 'text-red-600 bg-red-50', icon: <XCircle className="w-4 h-4" /> },
    { value: 'nieobecność', label: t('status.noShow'), color: 'text-orange-600 bg-orange-50', icon: <AlertCircle className="w-4 h-4" /> },
    { value: 'w_trakcie', label: t('status.inProgress'), color: 'text-yellow-600 bg-yellow-50', icon: <Loader2 className="w-4 h-4 animate-spin" /> }
  ]

  const LESSON_TYPES = [
    { value: 'jazda', label: t('lessonType.driving'), icon: <Car className="w-4 h-4" /> },
    { value: 'plac', label: t('lessonType.practiceArea'), icon: <MapPin className="w-4 h-4" /> },
    { value: 'teoria', label: t('lessonType.theory'), icon: <BookOpen className="w-4 h-4" /> },
    { value: 'egzamin', label: t('lessonType.exam'), icon: <CheckCircle className="w-4 h-4" /> }
  ]

  const PAYMENT_STATUSES = [
    { value: 'opłacony', label: t('payment.status.paid'), color: 'text-green-600' },
    { value: 'nieopłacony', label: t('payment.status.unpaid'), color: 'text-red-600' },
    { value: 'częściowo', label: t('payment.status.partial'), color: 'text-orange-600' }
  ]

  const PAYMENT_METHODS = [
    { value: 'gotówka', label: t('payment.method.cash') },
    { value: 'przelew', label: t('payment.method.transfer') },
    { value: 'karta', label: t('payment.method.card') }
  ]

  // Initialize form data
  useEffect(() => {
    if (slot) {
      setFormData({
        ...slot,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime
      })
      setSelectedStudent(slot.student || null)
      setSelectedLocation(slot.location || null)
    } else if (mode === 'create') {
      const defaultEndTime = initialTime ? calculateEndTime(initialTime, 120) : ''
      setFormData({
        status: 'dostępny',
        lessonType: 'jazda',
        date: initialDate ? format(initialDate, 'yyyy-MM-dd') : '',
        startTime: initialTime || '',
        endTime: defaultEndTime,
        notes: '',
        payment: {
          status: 'nieopłacony',
          amount: 120,
          method: 'gotówka'
        }
      })
    }
  }, [slot, mode, initialDate, initialTime])

  // Helpers
  const calculateEndTime = (start: string, durationMinutes: number): string => {
    const [h, m] = start.split(':').map(Number)
    const totalMinutes = h * 60 + m + durationMinutes
    const endH = Math.floor(totalMinutes / 60)
    const endM = totalMinutes % 60
    return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`
  }

  const filteredStudents = MOCK_STUDENTS.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchStudent.toLowerCase())
  )

  // Handlers
  const handleSave = async () => {
    if (!formData.date || !formData.startTime || !formData.endTime) {
      return
    }

    setIsLoading(true)
    try {
      const slotData: Partial<Slot> = {
        ...formData,
        student: selectedStudent || undefined,
        location: selectedLocation || undefined,
        updatedAt: new Date()
      }

      if (mode === 'create') {
        await createSlot(slotData as Omit<Slot, 'id'>)
        onClose()
      } else if (slot) {
        await updateSlot(slot.id, slotData)
        onSave?.({ ...slot, ...slotData } as Slot)
        onClose()
      }
    } catch (error) {
      console.error('Error saving slot:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!slot) return
    
    setIsLoading(true)
    try {
      await deleteSlot(slot.id)
      onDelete?.(slot.id)
      onClose()
    } catch (error) {
      console.error('Error deleting slot:', error)
    } finally {
      setIsLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleStatusChange = (status: SlotStatus) => {
    setFormData(prev => ({ ...prev, status }))
    
    // Auto-update payment status based on slot status
    if (status === 'zakończony') {
      setFormData(prev => ({
        ...prev,
        payment: { 
          status: 'opłacony', 
          method: prev.payment?.method || 'gotówka',
          amount: prev.payment?.amount || 120 
        }
      }))
    } else if (status === 'anulowany' || status === 'nieobecność') {
      setFormData(prev => ({
        ...prev,
        payment: { 
          status: 'nieopłacony',
          method: prev.payment?.method || 'gotówka',
          amount: 0 
        }
      }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t(`title.${mode}`)}
              </h2>
              {formData.date && (
                <p className="text-sm text-gray-500 mt-1">
                  {format(new Date(formData.date), 'EEEE, d MMMM yyyy', { locale: uk })}
                  {formData.startTime && ` • ${formData.startTime} - ${formData.endTime}`}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            {[
              { key: 'details', label: t('tabs.details'), icon: <Calendar className="w-4 h-4" /> },
              { key: 'student', label: t('tabs.student'), icon: <User className="w-4 h-4" /> },
              { key: 'payment', label: t('tabs.payment'), icon: <CreditCard className="w-4 h-4" /> },
              { key: 'notes', label: t('tabs.notes'), icon: <MessageSquare className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === tab.key
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('status.label')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {STATUS_OPTIONS.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors",
                          formData.status === option.value
                            ? `${option.color} border-current`
                            : "border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        {option.icon}
                        <span className="text-sm font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lesson Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('lessonType.label')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {LESSON_TYPES.map(type => (
                      <button
                        key={type.value}
                        onClick={() => setFormData(prev => ({ ...prev, lessonType: type.value as any }))}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors",
                          formData.lessonType === type.value
                            ? "bg-blue-50 border-blue-300 text-blue-700"
                            : "border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        {type.icon}
                        <span className="text-sm">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('dateTime.date')}</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('dateTime.startTime')}</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('dateTime.endTime')}</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('location.label')}</label>
                  <select
                    value={selectedLocation?.id || ''}
                    onChange={(e) => {
                      const location = MOCK_LOCATIONS.find(l => l.id === e.target.value)
                      setSelectedLocation(location || null)
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{t('location.placeholder')}</option>
                    {MOCK_LOCATIONS.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name} - {location.city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Student Tab */}
            {activeTab === 'student' && (
              <div className="space-y-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('student.search')}</label>
                  <input
                    type="text"
                    placeholder={t('student.searchPlaceholder')}
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Student List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredStudents.map(student => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={cn(
                        "w-full p-3 rounded-lg border text-left transition-colors",
                        selectedStudent?.id === student.id
                          ? "bg-blue-50 border-blue-300"
                          : "border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500 space-y-1 mt-1">
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {student.phone}
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {student.email}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {student.packageType}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {student.lessonsCompleted} {t('student.lessons')}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedStudent && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-blue-900">
                          {t('student.selected')}: {selectedStudent.firstName} {selectedStudent.lastName}
                        </div>
                        <div className="text-sm text-blue-700 mt-1">
                          {t('student.package')}: {selectedStudent.packageType} • {t('student.completedLessons')}: {selectedStudent.lessonsCompleted}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedStudent(null)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('payment.status.label')}</label>
                    <select
                      value={formData.payment?.status || 'nieopłacony'}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        payment: { 
                          status: e.target.value as 'opłacony' | 'nieopłacony' | 'częściowo',
                          method: prev.payment?.method || 'gotówka',
                          amount: prev.payment?.amount || 0 
                        }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {PAYMENT_STATUSES.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('payment.method.label')}</label>
                    <select
                      value={formData.payment?.method || 'gotówka'}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        payment: { 
                          status: prev.payment?.status || 'nieopłacony',
                          method: e.target.value as 'gotówka' | 'przelew' | 'karta', 
                          amount: prev.payment?.amount || 0 
                        }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {PAYMENT_METHODS.map(method => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('payment.amount')}</label>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={formData.payment?.amount || 0}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        payment: { 
                          status: prev.payment?.status || 'nieopłacony',
                          method: prev.payment?.method || 'gotówka',
                          amount: parseFloat(e.target.value) || 0
                        }
                      }))}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between mb-2">
                      <span>{t('payment.lessonPrice')}:</span>
                      <span className="font-medium">{t('payment.currency', { amount: 120 })}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>{t('status.label')}:</span>
                      <span className={cn(
                        "font-medium",
                        PAYMENT_STATUSES.find(s => s.value === formData.payment?.status)?.color
                      )}>
                        {PAYMENT_STATUSES.find(s => s.value === formData.payment?.status)?.label}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{t('payment.toPay')}:</span>
                        <span className="font-bold text-lg">
                          {t('payment.currency', { 
                            amount: formData.payment?.status === 'opłacony' ? 0 : formData.payment?.amount || 0 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('notes.label')}</label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder={t('notes.placeholder')}
                    rows={6}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {formData.cancelReason && (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-red-900">{t('notes.cancelReason')}</div>
                        <div className="text-sm text-red-700 mt-1">{formData.cancelReason}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-700">
                    <div className="font-medium mb-2">{t('notes.tips.title')}</div>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>{t('notes.tips.tip1')}</li>
                      <li>{t('notes.tips.tip2')}</li>
                      <li>{t('notes.tips.tip3')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
            <div className="flex items-center gap-2">
              {mode === 'edit' && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {t('buttons.cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading || !formData.date || !formData.startTime}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('buttons.saving')}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {mode === 'create' ? t('buttons.create') : t('buttons.save')}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('delete.title')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('delete.confirm')}
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {t('buttons.cancel')}
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? t('delete.deleting') : t('buttons.delete')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}