// app/[locale]/instructor/schedule/providers/ScheduleProvider.tsx
// Provider kontekstu dla globalnego stanu harmonogramu

'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
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

// Typy dla kontekstu
interface ScheduleContextType {
  // Stan danych
  slots: Slot[]
  workingHours: Record<string, WorkingHours>
  templates: ScheduleTemplate[]
  exceptions: Exception[]
  cancellationRequests: CancellationRequest[]
  stats: ScheduleStats
  
  // Stan UI
  isLoading: boolean
  error: string | null
  
  // Metody dla slotów
  updateSlot: (slotId: string, updates: Partial<Slot>) => Promise<void>
  deleteSlot: (slotId: string) => Promise<void>
  createSlot: (slot: Omit<Slot, 'id'>) => Promise<void>
  generateSlots: (startDate: Date, endDate: Date) => Promise<void>
  
  // Metody dla godzin pracy
  updateWorkingHours: (day: string, hours: WorkingHours) => Promise<void>
  applyWorkingHoursToWeek: (weekStart: Date) => Promise<void>
  
  // Metody dla szablonów
  createTemplate: (template: Omit<ScheduleTemplate, 'id' | 'createdAt'>) => Promise<void>
  updateTemplate: (templateId: string, updates: Partial<ScheduleTemplate>) => Promise<void>
  deleteTemplate: (templateId: string) => Promise<void>
  applyTemplate: (templateId: string) => Promise<void>
  
  // Metody dla wyjątków
  createException: (exception: Omit<Exception, 'id' | 'createdAt'>) => Promise<void>
  deleteException: (exceptionId: string) => Promise<void>
  
  // Metody dla wniosków o anulowanie
  processCancellationRequest: (requestId: string, action: 'approve' | 'reject', comment?: string) => Promise<void>
  
  // Metody pomocnicze
  refreshData: () => Promise<void>
  exportSchedule: () => string
  importSchedule: (data: string) => Promise<void>
}

// Domyślne godziny pracy
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

// Utworzenie kontekstu
const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined)

// Provider komponent
export function ScheduleProvider({ 
  children, 
  locale = 'pl' 
}: { 
  children: ReactNode
  locale?: string 
}) {
  // Stan podstawowy
  const [slots, setSlots] = useState<Slot[]>([])
  const [workingHours, setWorkingHours] = useState<Record<string, WorkingHours>>(defaultWorkingHours)
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([])
  const [exceptions, setExceptions] = useState<Exception[]>([])
  const [cancellationRequests, setCancellationRequests] = useState<CancellationRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Hook dla powiadomień
  const { toast } = useToast()

  // Obliczanie statystyk
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
    weeklyHours: 40, // TODO: Calculate from actual slots
    monthlyEarnings: 4500, // TODO: Calculate from completed lessons
    upcomingLessons: slots.filter(s => s.status === 'zarezerwowany' && new Date(s.date) >= new Date()).length,
    pendingRequests: cancellationRequests.filter(r => r.status === 'oczekujący').length
  }

  // Ładowanie danych przy montowaniu
  useEffect(() => {
    loadInitialData()
  }, [])

  // Zapisywanie do localStorage przy zmianach
  useEffect(() => {
    if (!isLoading) {
      saveToStorage('schedule_slots', slots)
      saveToStorage('schedule_working_hours', workingHours)
      saveToStorage('schedule_templates', templates)
      saveToStorage('schedule_exceptions', exceptions)
    }
  }, [slots, workingHours, templates, exceptions, isLoading])

  // Funkcja ładowania początkowych danych
  const loadInitialData = async () => {
    try {
      setIsLoading(true)
      
      // Ładowanie z localStorage lub użycie mock danych
      const savedSlots = loadFromStorage('schedule_slots', mockSlots)
      const savedWorkingHours = loadFromStorage('schedule_working_hours', defaultWorkingHours)
      const savedTemplates = loadFromStorage('schedule_templates', mockTemplates)
      const savedExceptions = loadFromStorage('schedule_exceptions', mockExceptions)
      const savedRequests = loadFromStorage('schedule_requests', mockCancellationRequests)
      
      setSlots(savedSlots)
      setWorkingHours(savedWorkingHours)
      setTemplates(savedTemplates)
      setExceptions(savedExceptions)
      setCancellationRequests(savedRequests)
    } catch (err) {
      console.error('Błąd ładowania danych:', err)
      setError('Nie udało się załadować danych harmonogramu')
    } finally {
      setIsLoading(false)
    }
  }

  // Metody dla slotów
  const updateSlot = useCallback(async (slotId: string, updates: Partial<Slot>) => {
    try {
      setSlots(prev => prev.map(slot => 
        slot.id === slotId ? { ...slot, ...updates } : slot
      ))
      toast({
        title: "Sukces",
        description: "Slot został zaktualizowany",
      })
    } catch (err) {
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować slotu",
        variant: "destructive",
      })
      throw err
    }
  }, [toast])

  const deleteSlot = useCallback(async (slotId: string) => {
    try {
      setSlots(prev => prev.filter(slot => slot.id !== slotId))
      toast({
        title: "Sukces",
        description: "Slot został usunięty",
      })
    } catch (err) {
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć slotu",
        variant: "destructive",
      })
      throw err
    }
  }, [toast])

  const createSlot = useCallback(async (slotData: Omit<Slot, 'id'>) => {
    try {
      const newSlot: Slot = {
        ...slotData,
        id: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
      setSlots(prev => [...prev, newSlot])
      toast({
        title: "Sukces",
        description: "Nowy slot został utworzony",
      })
    } catch (err) {
      toast({
        title: "Błąd",
        description: "Nie udało się utworzyć slotu",
        variant: "destructive",
      })
      throw err
    }
  }, [toast])

  const generateSlots = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      const newSlots: Slot[] = []
      const currentDate = new Date(startDate)
      
      while (currentDate <= endDate) {
        const dayName = currentDate.toLocaleDateString('pl-PL', { weekday: 'long' }).toLowerCase()
        const dayWorkingHours = workingHours[dayName]
        
        if (dayWorkingHours && dayWorkingHours.enabled) {
          const daySlots = generateSlotsFromWorkingHours(currentDate, dayWorkingHours)
          newSlots.push(...daySlots)
        }
        
        currentDate.setDate(currentDate.getDate() + 1)
      }
      
      setSlots(prev => [...prev, ...newSlots])
      toast({
        title: "Sukces",
        description: `Wygenerowano ${newSlots.length} nowych slotów`,
      })
    } catch (err) {
      toast({
        title: "Błąd",
        description: "Nie udało się wygenerować slotów",
        variant: "destructive",
      })
      throw err
    }
  }, [workingHours, toast])

  // Metody dla godzin pracy
  const updateWorkingHours = useCallback(async (day: string, hours: WorkingHours) => {
    try {
      setWorkingHours(prev => ({ ...prev, [day]: hours }))
      toast({
        title: "Sukces",
        description: "Godziny pracy zostały zaktualizowane",
      })
    } catch (err) {
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować godzin pracy",
        variant: "destructive",
      })
      throw err
    }
  }, [toast])

  const applyWorkingHoursToWeek = useCallback(async (weekStart: Date) => {
    try {
      await generateSlots(weekStart, new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000))
    } catch (err) {
      console.error('Błąd stosowania godzin pracy:', err)
      throw err
    }
  }, [generateSlots])

  // Metody dla szablonów
  const createTemplate = useCallback(async (templateData: Omit<ScheduleTemplate, 'id' | 'createdAt'>) => {
    try {
      const newTemplate: ScheduleTemplate = {
        ...templateData,
        id: `template-${Date.now()}`,
        createdAt: new Date()
      }
      setTemplates(prev => [...prev, newTemplate])
      toast({
        title: "Sukces",
        description: "Szablon został utworzony",
      })
    } catch (err) {
      toast({
        title: "Błąd",
        description: "Nie udało się utworzyć szablonu",
        variant: "destructive",
      })
      throw err
    }
  }, [toast])

  const updateTemplate = useCallback(async (templateId: string, updates: Partial<ScheduleTemplate>) => {
    try {
      setTemplates(prev => prev.map(template =>
        template.id === templateId ? { ...template, ...updates } : template
      ))
      toast({
        title: "Sukces",
        description: "Szablon został zaktualizowany",
      })
    } catch (err) {
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować szablonu",
        variant: "destructive",
      })
      throw err
    }
  }, [toast])

  const deleteTemplate = useCallback(async (templateId: string) => {
    try {
      setTemplates(prev => prev.filter(template => template.id !== templateId))
      toast({
        title: "Sukces",
        description: "Szablon został usunięty",
      })
    } catch (err) {
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć szablonu",
        variant: "destructive",
      })
      throw err
    }
  }, [toast])

  const applyTemplate = useCallback(async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId)
      if (template) {
        setWorkingHours(template.workingHours)
        toast({
          title: "Sukces",
          description: "Szablon został zastosowany",
        })
      }
    } catch (err) {
      toast({
        title: "Błąd",
        description: "Nie udało się zastosować szablonu",
        variant: "destructive",
      })
      throw err
    }
  }, [templates, toast])

  // Pozostałe metody
  const refreshData = useCallback(async () => {
    await loadInitialData()
  }, [])

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
        title: "Sukces",
        description: "Harmonogram został zaimportowany",
      })
    } catch (err) {
      toast({
        title: "Błąd",
        description: "Nieprawidłowy format danych",
        variant: "destructive",
      })
      throw err
    }
  }, [toast])

  // Wartość kontekstu
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
    importSchedule
  }

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  )
}

// Hook do używania kontekstu
export function useScheduleContext() {
  const context = useContext(ScheduleContext)
  if (context === undefined) {
    throw new Error('useScheduleContext must be used within a ScheduleProvider')
  }
  return context
}