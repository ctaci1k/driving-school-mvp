// app/[locale]/instructor/schedule/providers/ScheduleProvider.tsx
// Provider контексту для глобального стану розкладу

'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { 
  Slot, 
  WorkingHours, 
  ScheduleTemplate, 
  Exception, 
  CancellationRequest,
  ScheduleStats 
} from '../types/schedule.types'
import { mockSlots, mockTemplates, mockExceptions, mockCancellationRequests } from '../data/mockData'
import { loadFromStorage, saveToStorage } from '../utils/storage'
import { generateSlotsFromWorkingHours } from '../utils/slotGenerator'
import { useToast } from '@/hooks/use-toast'

// Типи для контексту
interface ScheduleContextType {
  // Стан даних
  slots: Slot[]
  workingHours: Record<string, WorkingHours>
  templates: ScheduleTemplate[]
  exceptions: Exception[]
  cancellationRequests: CancellationRequest[]
  stats: ScheduleStats
  
  // Стан UI
  isLoading: boolean
  error: string | null
  
  // Методи для слотів
  updateSlot: (slotId: string, updates: Partial<Slot>) => Promise<void>
  deleteSlot: (slotId: string) => Promise<void>
  createSlot: (slot: Omit<Slot, 'id'>) => Promise<void>
  generateSlots: (startDate: Date, endDate: Date) => Promise<void>
  
  // Методи для робочих годин
  updateWorkingHours: (day: string, hours: WorkingHours) => Promise<void>
  applyWorkingHoursToWeek: (weekStart: Date) => Promise<void>
  
  // Методи для шаблонів
  createTemplate: (template: Omit<ScheduleTemplate, 'id' | 'createdAt'>) => Promise<void>
  updateTemplate: (templateId: string, updates: Partial<ScheduleTemplate>) => Promise<void>
  deleteTemplate: (templateId: string) => Promise<void>
  applyTemplate: (templateId: string) => Promise<void>
  
  // Методи для винятків
  createException: (exception: Omit<Exception, 'id' | 'createdAt'>) => Promise<void>
  deleteException: (exceptionId: string) => Promise<void>
  
  // Методи для заявок на скасування
  processCancellationRequest: (requestId: string, action: 'approve' | 'reject', comment?: string) => Promise<void>
  
  // Допоміжні методи
  refreshData: () => Promise<void>
  exportSchedule: () => string
  importSchedule: (data: string) => Promise<void>
  checkDayHasReservations: (date: Date) => boolean
}

// Основні робочі години
const defaultWorkingHours: Record<string, WorkingHours> = {
  poniedziałek: {
    enabled: true,
    intervals: [
      { start: '08:00', end: '12:00' },
      { start: '14:00', end: '18:00' }
    ],
    slotDuration: 120,
    breakDuration: 15
  },
  wtorek: {
    enabled: true,
    intervals: [
      { start: '08:00', end: '12:00' },
      { start: '14:00', end: '18:00' }
    ],
    slotDuration: 120,
    breakDuration: 15
  },
  środa: {
    enabled: true,
    intervals: [
      { start: '08:00', end: '12:00' },
      { start: '14:00', end: '18:00' }
    ],
    slotDuration: 120,
    breakDuration: 15
  },
  czwartek: {
    enabled: true,
    intervals: [
      { start: '08:00', end: '12:00' },
      { start: '14:00', end: '18:00' }
    ],
    slotDuration: 120,
    breakDuration: 15
  },
  piątek: {
    enabled: true,
    intervals: [
      { start: '08:00', end: '12:00' },
      { start: '14:00', end: '18:00' }
    ],
    slotDuration: 120,
    breakDuration: 15
  },
  sobota: {
    enabled: true,
    intervals: [
      { start: '08:00', end: '12:00' }
    ],
    slotDuration: 120,
    breakDuration: 15
  },
  niedziela: {
    enabled: false,
    intervals: [],
    slotDuration: 120,
    breakDuration: 15
  }
}

// Створення контексту
const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined)

// Provider компонент
export function ScheduleProvider({ 
  children, 
  locale = 'uk' 
}: { 
  children: ReactNode
  locale?: string 
}) {
  // Переклади
  const t = useTranslations('instructor.schedule.provider')
  
  // Стан основний
  const [slots, setSlots] = useState<Slot[]>([])
  const [workingHours, setWorkingHours] = useState<Record<string, WorkingHours>>(defaultWorkingHours)
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([])
  const [exceptions, setExceptions] = useState<Exception[]>([])
  const [cancellationRequests, setCancellationRequests] = useState<CancellationRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Hook для повідомлень
  const { toast } = useToast()

  // Обчислення статистики
  const stats: ScheduleStats = {
    totalSlots: slots.length,
    bookedSlots: slots.filter(s => s.status === 'zarezerwowany').length,
    availableSlots: slots.filter(s => s.status === 'dostępny').length,
    blockedSlots: slots.filter(s => s.status === 'zablokowany').length,
    completedLessons: slots.filter(s => s.status === 'zakończony').length,
    cancelledLessons: slots.filter(s => s.status === 'anulowany').length,
    noShowCount: slots.filter(s => s.status === 'nieobecność').length,
    occupancyRate: slots.length > 0 
      ? Math.round((slots.filter(s => s.status === 'zarezerwowany').length / slots.length) * 100)
      : 0,
    weeklyHours: slots.filter(s => {
      const today = new Date()
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay() + 1)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      const slotDate = new Date(s.date)
      return slotDate >= weekStart && slotDate <= weekEnd && 
             (s.status === 'zarezerwowany' || s.status === 'zakończony')
    }).reduce((total, slot) => {
      const start = new Date(`2000-01-01T${slot.startTime}`)
      const end = new Date(`2000-01-01T${slot.endTime}`)
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      return total + hours
    }, 0),
    monthlyEarnings: slots.filter(s => {
      const today = new Date()
      const slotDate = new Date(s.date)
      return slotDate.getMonth() === today.getMonth() &&
             slotDate.getFullYear() === today.getFullYear() &&
             s.status === 'zakończony' &&
             s.payment?.status === 'opłacony'
    }).reduce((total, slot) => total + (slot.payment?.amount || 0), 0),
    upcomingLessons: slots.filter(s => {
      const today = new Date()
      const slotDate = new Date(s.date)
      return slotDate >= today && s.status === 'zarezerwowany'
    }).length,
    pendingRequests: cancellationRequests.filter(r => r.status === 'oczekujący').length
  }

  // Завантаження початкових даних
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)
      try {
        // Завантаж дані з localStorage або використовуй mock data
        const savedSlots = loadFromStorage('schedule_slots', null)
        const savedWorkingHours = loadFromStorage('schedule_workingHours', null)
        const savedTemplates = loadFromStorage('schedule_templates', null)
        
        if (savedSlots) {
          setSlots(savedSlots)
        } else {
          setSlots(mockSlots)
        }
        
        if (savedWorkingHours) {
          setWorkingHours(savedWorkingHours)
        } else {
          setWorkingHours(defaultWorkingHours)
        }
        
        if (savedTemplates) {
          setTemplates(savedTemplates)
        } else {
          setTemplates(mockTemplates)
        }
        
        setExceptions(mockExceptions)
        setCancellationRequests(mockCancellationRequests)
        
      } catch (err) {
        setError(t('toast.dataLoadError'))
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [t])

  // Автоматичне збереження
  useEffect(() => {
    if (!isLoading) {
      saveToStorage('schedule_slots', slots)
      saveToStorage('schedule_workingHours', workingHours)
      saveToStorage('schedule_templates', templates)
    }
  }, [slots, workingHours, templates, isLoading])

  // 🆕 АВТОМАТИЧНА ГЕНЕРАЦІЯ СЛОТІВ ПІСЛЯ ЗМІНИ РОБОЧИХ ГОДИН
  useEffect(() => {
    // Тільки якщо дані завантажені і маємо робочі години
    if (!isLoading && Object.keys(workingHours).length > 0) {
      // Генеруй слоти на наступні 30 днів
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 30)
      
      // Затримай генерацію на 500ms щоб уникнути багатократних викликів
      const timeoutId = setTimeout(() => {
        generateSlots(startDate, endDate)
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [workingHours, isLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  // 🆕 ФУНКЦІЯ ПЕРЕВІРКИ ЧИ ДЕНЬ МАЄ РЕЗЕРВАЦІЇ
  const checkDayHasReservations = useCallback((date: Date): boolean => {
    // Перевір чи є будь-які слоти з резерваціями в даний день
    const daySlots = slots.filter(slot => {
      const slotDate = new Date(slot.date)
      return (
        slotDate.toDateString() === date.toDateString() &&
        (slot.status === 'zarezerwowany' || slot.status === 'w_trakcie')
      )
    })
    
    return daySlots.length > 0
  }, [slots])

  // Методи для слотів
  const updateSlot = useCallback(async (slotId: string, updates: Partial<Slot>) => {
    try {
      setSlots(prev => prev.map(slot =>
        slot.id === slotId ? { ...slot, ...updates } : slot
      ))
      toast({
        title: t('toast.success'),
        description: t('toast.slot.updated'),
      })
    } catch (err) {
      toast({
        title: t('toast.error'),
        description: t('toast.slot.updateError'),
        variant: "destructive",
      })
      throw err
    }
  }, [toast, t])

  const deleteSlot = useCallback(async (slotId: string) => {
    try {
      setSlots(prev => prev.filter(slot => slot.id !== slotId))
      toast({
        title: t('toast.success'),
        description: t('toast.slot.deleted'),
      })
    } catch (err) {
      toast({
        title: t('toast.error'),
        description: t('toast.slot.deleteError'),
        variant: "destructive",
      })
      throw err
    }
  }, [toast, t])

  const createSlot = useCallback(async (slotData: Omit<Slot, 'id'>) => {
    try {
      const newSlot: Slot = {
        ...slotData,
        id: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
      setSlots(prev => [...prev, newSlot])
      toast({
        title: t('toast.success'),
        description: t('toast.slot.created'),
      })
    } catch (err) {
      toast({
        title: t('toast.error'),
        description: t('toast.slot.createError'),
        variant: "destructive",
      })
      throw err
    }
  }, [toast, t])

  // 🔄 ОНОВЛЕНА ФУНКЦІЯ ГЕНЕРАЦІЇ СЛОТІВ З ЗАХИСТОМ РЕЗЕРВАЦІЙ
  const generateSlots = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      const newSlots: Slot[] = []
      const skippedDays: string[] = []
      const currentDate = new Date(startDate)
      let generatedCount = 0
      let protectedCount = 0
      
      while (currentDate <= endDate) {
        const dayName = currentDate.toLocaleDateString('pl-PL', { weekday: 'long' }).toLowerCase()
        const dayWorkingHours = workingHours[dayName]
        
        // Перевір чи день має резервації
        const hasReservations = checkDayHasReservations(currentDate)
        
        if (hasReservations) {
          // Збережи інформацію про пропущений день
          skippedDays.push(currentDate.toLocaleDateString(locale === 'uk' ? 'uk-UA' : 'pl-PL', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          }))
          protectedCount++
        } else if (dayWorkingHours && dayWorkingHours.enabled) {
          // Видали тільки слоти зі статусом 'dostępny' для цього дня
          const dateString = currentDate.toISOString().split('T')[0]
          setSlots(prev => prev.filter(slot => {
            const slotDate = new Date(slot.date).toISOString().split('T')[0]
            return !(slotDate === dateString && slot.status === 'dostępny')
          }))
          
          // Генеруй нові слоти
          const daySlots = generateSlotsFromWorkingHours(currentDate, dayWorkingHours)
          newSlots.push(...daySlots)
          generatedCount++
        }
        
        currentDate.setDate(currentDate.getDate() + 1)
      }
      
      // Додай нові слоти
      if (newSlots.length > 0) {
        setSlots(prev => [...prev, ...newSlots])
      }
      
      // Покажи інформацію про результат
      if (skippedDays.length > 0) {
        toast({
          title: t('toast.slots.generateTitle'),
          description: (
            <div>
              <p>{t('toast.slots.generateDescription', { generated: generatedCount })}</p>
              <p className="mt-2 font-semibold">{t('toast.slots.protectedDays', { protected: protectedCount })}</p>
              <ul className="mt-1 text-sm">
                {skippedDays.slice(0, 3).map((day, idx) => (
                  <li key={idx}>• {day}</li>
                ))}
                {skippedDays.length > 3 && (
                  <li>• {t('toast.slots.moreSkipped', { count: skippedDays.length - 3 })}</li>
                )}
              </ul>
            </div>
          ),
        })
      } else {
        toast({
          title: t('toast.success'),
          description: t('toast.slots.generateSuccess', { slots: newSlots.length, days: generatedCount }),
        })
      }
    } catch (err) {
      toast({
        title: t('toast.error'),
        description: t('toast.slots.generateError'),
        variant: "destructive",
      })
      throw err
    }
  }, [workingHours, checkDayHasReservations, toast, t, locale])

  // Методи для робочих годин
  const updateWorkingHours = useCallback(async (day: string, hours: WorkingHours) => {
    try {
      setWorkingHours(prev => ({ ...prev, [day]: hours }))
      toast({
        title: t('toast.success'),
        description: t('toast.workingHours.updated'),
      })
    } catch (err) {
      toast({
        title: t('toast.error'),
        description: t('toast.workingHours.updateError'),
        variant: "destructive",
      })
      throw err
    }
  }, [toast, t])

  const applyWorkingHoursToWeek = useCallback(async (weekStart: Date) => {
    try {
      await generateSlots(weekStart, new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000))
    } catch (err) {
      console.error('Помилка застосування робочих годин:', err)
      throw err
    }
  }, [generateSlots])

  // Методи для шаблонів
  const createTemplate = useCallback(async (templateData: Omit<ScheduleTemplate, 'id' | 'createdAt'>) => {
    try {
      const newTemplate: ScheduleTemplate = {
        ...templateData,
        id: `template-${Date.now()}`,
        createdAt: new Date()
      }
      setTemplates(prev => [...prev, newTemplate])
      toast({
        title: t('toast.success'),
        description: t('toast.template.created'),
      })
    } catch (err) {
      toast({
        title: t('toast.error'),
        description: t('toast.template.createError'),
        variant: "destructive",
      })
      throw err
    }
  }, [toast, t])

  const updateTemplate = useCallback(async (templateId: string, updates: Partial<ScheduleTemplate>) => {
    try {
      setTemplates(prev => prev.map(template =>
        template.id === templateId ? { ...template, ...updates } : template
      ))
      toast({
        title: t('toast.success'),
        description: t('toast.template.updated'),
      })
    } catch (err) {
      toast({
        title: t('toast.error'),
        description: t('toast.template.updateError'),
        variant: "destructive",
      })
      throw err
    }
  }, [toast, t])

  const deleteTemplate = useCallback(async (templateId: string) => {
    try {
      setTemplates(prev => prev.filter(template => template.id !== templateId))
      toast({
        title: t('toast.success'),
        description: t('toast.template.deleted'),
      })
    } catch (err) {
      toast({
        title: t('toast.error'),
        description: t('toast.template.deleteError'),
        variant: "destructive",
      })
      throw err
    }
  }, [toast, t])

  const applyTemplate = useCallback(async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId)
      if (template) {
        setWorkingHours(template.workingHours)
        toast({
          title: t('toast.success'),
          description: t('toast.template.applied'),
        })
      }
    } catch (err) {
      toast({
        title: t('toast.error'),
        description: t('toast.template.applyError'),
        variant: "destructive",
      })
      throw err
    }
  }, [templates, toast, t])

  // Інші методи
  const refreshData = useCallback(async () => {
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30)
    await generateSlots(startDate, endDate)
  }, [generateSlots])

  const exportSchedule = useCallback(() => {
    const data = {
      slots,
      workingHours,
      templates,
      exceptions,
      exportDate: new Date().toISOString()
    }
    return JSON.stringify(data, null, 2)
  }, [slots, workingHours, templates, exceptions])

  const importSchedule = useCallback(async (data: string) => {
    try {
      const parsed = JSON.parse(data)
      if (parsed.slots) setSlots(parsed.slots)
      if (parsed.workingHours) setWorkingHours(parsed.workingHours)
      if (parsed.templates) setTemplates(parsed.templates)
      if (parsed.exceptions) setExceptions(parsed.exceptions)
      toast({
        title: t('toast.success'),
        description: t('toast.schedule.imported'),
      })
    } catch (err) {
      toast({
        title: t('toast.error'),
        description: t('toast.schedule.importError'),
        variant: "destructive",
      })
      throw err
    }
  }, [toast, t])

  // Значення контексту
  const value: ScheduleContextType = {
    slots,
    workingHours,
    templates,
    exceptions,
    cancellationRequests,
    stats,
    isLoading,
    error,
    updateSlot,
    deleteSlot,
    createSlot,
    generateSlots,
    updateWorkingHours,
    applyWorkingHoursToWeek,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    applyTemplate,
    createException: async () => {}, // TODO: Implement
    deleteException: async () => {}, // TODO: Implement
    processCancellationRequest: async () => {}, // TODO: Implement
    refreshData,
    exportSchedule,
    importSchedule,
    checkDayHasReservations
  }

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  )
}

// Hook для використання контексту
export function useScheduleContext() {
  const context = useContext(ScheduleContext)
  if (context === undefined) {
    throw new Error('useScheduleContext must be used within a ScheduleProvider')
  }
  return context
}