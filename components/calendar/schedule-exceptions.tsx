// components/calendar/schedule-exceptions.tsx

'use client'

import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useTranslations } from 'next-intl'
import { Calendar, Clock, AlertCircle, Plus, X, AlertTriangle, CheckCircle } from 'lucide-react'
import { format, isAfter, isBefore, isToday, startOfToday, addDays } from 'date-fns'
import { pl } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { trpc } from '@/lib/trpc/client'
import { toast } from '@/lib/toast'

interface ScheduleException {
  id: string
  type: 'vacation' | 'sickLeave' | 'holiday' | 'personalLeave' | 'training' | 'vehicleMaintenance'
  startDate: Date | string
  endDate: Date | string
  allDay: boolean
  startTime?: string | null
  endTime?: string | null
  reason: string
  description?: string | null
}

export function ScheduleExceptions() {
  const t = useTranslations('calendar.scheduleExceptions')
  
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Початкові значення з ЗАВТРАШНЬОЮ датою
  const tomorrow = addDays(new Date(), 1).toISOString().split('T')[0]
  
  const [newException, setNewException] = useState<Partial<ScheduleException>>({
    type: 'vacation',
    allDay: true,
    startDate: tomorrow,
    endDate: tomorrow,
    reason: '',
  })
  
  // tRPC queries
  const { data: exceptions = [], refetch, isLoading } = trpc.schedule.getExceptions.useQuery()
  
  // tRPC mutations
  const createException = trpc.schedule.createException.useMutation({
    onSuccess: (data) => {
      toast.success(data.message || 'Wyjątek został dodany')
      setShowAddForm(false)
      // Reset форми
      const newTomorrow = addDays(new Date(), 1).toISOString().split('T')[0]
      setNewException({
        type: 'vacation',
        allDay: true,
        startDate: newTomorrow,
        endDate: newTomorrow,
        reason: '',
      })
      refetch()
    },
    onError: (error) => {
      toast.error(error.message || 'Błąd podczas dodawania wyjątku')
    }
  })
  
  const deleteException = trpc.schedule.deleteException.useMutation({
    onSuccess: (data) => {
      toast.success(data.message || 'Wyjątek został usunięty')
      refetch()
    },
    onError: (error) => {
      toast.error(error.message || 'Błąd podczas usuwania')
    }
  })
  
  // Розділяємо винятки на категорії
  const categorizedExceptions = useMemo(() => {
    const today = startOfToday()
    
    const current = exceptions.filter(e => {
      const startDate = new Date(e.startDate)
      const endDate = new Date(e.endDate)
      return startDate <= today && endDate >= today
    })
    
    const upcoming = exceptions.filter(e => {
      const startDate = new Date(e.startDate)
      return isAfter(startDate, today)
    })
    
    const past = exceptions.filter(e => {
      const endDate = new Date(e.endDate)
      return isBefore(endDate, today)
    })
    
    return { current, upcoming, past }
  }, [exceptions])
  
  // Валідація форми
  const formValidation = useMemo(() => {
    const errors: string[] = []
    const warnings: string[] = []
    
    if (!newException.reason || newException.reason.trim().length < 3) {
      errors.push('Powód musi mieć minimum 3 znaki')
    }
    
    if (!newException.startDate || !newException.endDate) {
      errors.push('Wybierz daty')
    } else {
      const start = new Date(newException.startDate)
      const end = new Date(newException.endDate)
      const today = startOfToday()
      
      if (isAfter(start, end)) {
        errors.push('Data końcowa nie może być przed datą początkową')
      }
      
      if (isBefore(start, today)) {
        warnings.push('Uwaga: Tworzysz wyjątek dla przeszłej daty')
      }
      
      // Sprawdzamy czy nie ma konfliktu z innymi wyjątkami
      const hasConflict = exceptions.some(exc => {
        const excStart = new Date(exc.startDate)
        const excEnd = new Date(exc.endDate)
        return (
          (start >= excStart && start <= excEnd) ||
          (end >= excStart && end <= excEnd) ||
          (start <= excStart && end >= excEnd)
        )
      })
      
      if (hasConflict) {
        warnings.push('Uwaga: Ten okres pokrywa się z innym wyjątkiem')
      }
    }
    
    if (!newException.allDay) {
      if (!newException.startTime || !newException.endTime) {
        errors.push('Określ godziny dla wyjątku częściowego')
      } else if (newException.startTime >= newException.endTime) {
        errors.push('Godzina końcowa musi być po godzinie początkowej')
      }
    }
    
    return { errors, warnings, isValid: errors.length === 0 }
  }, [newException, exceptions])
  
  const getExceptionColor = (type: string) => {
    switch(type) {
      case 'vacation': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'sickLeave': return 'bg-red-100 text-red-700 border-red-200'
      case 'holiday': return 'bg-green-100 text-green-700 border-green-200'
      case 'personalLeave': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'training': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'vehicleMaintenance': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }
  
  const getExceptionIcon = (type: string) => {
    switch(type) {
      case 'vacation': return '🏖️'
      case 'sickLeave': return '🏥'
      case 'holiday': return '🎉'
      case 'personalLeave': return '👤'
      case 'training': return '📚'
      case 'vehicleMaintenance': return '🔧'
      default: return '📅'
    }
  }
  
  const handleSubmit = () => {
    if (!formValidation.isValid) {
      toast.error(formValidation.errors[0])
      return
    }
    
    if (formValidation.warnings.length > 0) {
      const confirmMessage = formValidation.warnings.join('\n') + '\n\nCzy chcesz kontynuować?'
      if (!confirm(confirmMessage)) {
        return
      }
    }
    
    createException.mutate({
      type: newException.type as any,
      startDate: newException.startDate as string,
      endDate: newException.endDate as string,
      allDay: newException.allDay || true,
      startTime: newException.allDay ? undefined : (newException.startTime || undefined),
      endTime: newException.allDay ? undefined : (newException.endTime || undefined),
      reason: newException.reason || '',
      description: newException.description || undefined,
    })
  }
  
  const handleDelete = (id: string, reason: string) => {
    if (confirm(`Czy na pewno chcesz usunąć wyjątek "${reason}"?`)) {
      deleteException.mutate({ id })
    }
  }
  
  return (
    <div className="space-y-4">
      {/* Formularz dodawania */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t('addException')}</span>
              <Button 
                size="icon" 
                variant="ghost"
                onClick={() => setShowAddForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t('exceptionType')}</Label>
              <select 
                className="w-full p-2 border rounded-md mt-1"
                value={newException.type}
                onChange={(e) => setNewException({...newException, type: e.target.value as any})}
              >
                <option value="vacation">🏖️ {t('vacation')}</option>
                <option value="sickLeave">🏥 {t('sickLeave')}</option>
                <option value="holiday">🎉 {t('holiday')}</option>
                <option value="personalLeave">👤 {t('personalLeave')}</option>
                <option value="training">📚 {t('training')}</option>
                <option value="vehicleMaintenance">🔧 {t('vehicleMaintenance')}</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('startDate')}</Label>
                <Input 
                  type="date" 
                  className="mt-1"
                  value={newException.startDate as string}
                  onChange={(e) => setNewException({...newException, startDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]} // Minimum dzisiaj
                />
              </div>
              <div>
                <Label>{t('endDate')}</Label>
                <Input 
                  type="date" 
                  className="mt-1"
                  value={newException.endDate as string}
                  onChange={(e) => setNewException({...newException, endDate: e.target.value})}
                  min={newException.startDate as string} // Minimum data początkowa
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="allDay">{t('allDay')}</Label>
              <Switch 
                id="allDay"
                checked={newException.allDay}
                onCheckedChange={(checked) => setNewException({...newException, allDay: checked})}
              />
            </div>
            
            {!newException.allDay && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('startTime')}</Label>
                  <Input 
                    type="time" 
                    className="mt-1"
                    value={newException.startTime || ''}
                    onChange={(e) => setNewException({...newException, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label>{t('endTime')}</Label>
                  <Input 
                    type="time" 
                    className="mt-1"
                    value={newException.endTime || ''}
                    onChange={(e) => setNewException({...newException, endTime: e.target.value})}
                    min={newException.startTime || undefined}
                  />
                </div>
              </div>
            )}
            
            <div>
              <Label>{t('reason')} *</Label>
              <Input 
                placeholder={t('reasonPlaceholder') || 'np. Urlop wypoczynkowy'} 
                className="mt-1"
                value={newException.reason || ''}
                onChange={(e) => setNewException({...newException, reason: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label>{t('description')} (opcjonalne)</Label>
              <textarea 
                placeholder={t('descriptionPlaceholder') || 'Dodatkowe informacje...'}
                className="w-full mt-1 p-2 border rounded-md"
                rows={3}
                value={newException.description || ''}
                onChange={(e) => setNewException({...newException, description: e.target.value})}
              />
            </div>
            
            {/* Walidacja - błędy i ostrzeżenia */}
            {formValidation.errors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                {formValidation.errors.map((error, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-red-700 text-sm">
                    <X className="h-4 w-4" />
                    {error}
                  </div>
                ))}
              </div>
            )}
            
            {formValidation.warnings.length > 0 && formValidation.errors.length === 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                {formValidation.warnings.map((warning, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-yellow-700 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    {warning}
                  </div>
                ))}
              </div>
            )}
            
            <Button 
              className="w-full"
              onClick={handleSubmit}
              disabled={createException.isLoading || !formValidation.isValid}
            >
              {createException.isLoading ? 'Zapisywanie...' : t('applyException')}
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Lista wyjątków */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('title')}</span>
            {!showAddForm && (
              <Button 
                size="sm"
                onClick={() => setShowAddForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('addException')}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-4 text-gray-500">Ładowanie...</p>
          ) : (
            <>
              {/* Aktywne wyjątki (dzisiaj) */}
              {categorizedExceptions.current.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {t('activeExceptions') || 'Aktywne wyjątki'}
                  </h4>
                  <div className="space-y-2">
                    {categorizedExceptions.current.map((exception) => (
                      <div
                        key={exception.id}
                        className="p-3 rounded-lg border-2 border-red-300 bg-red-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getExceptionIcon(exception.type)}</span>
                            <div>
                              <div className="font-medium text-red-700">{t(exception.type)}</div>
                              <div className="text-sm">
                                {format(new Date(exception.startDate), 'd MMM', { locale: pl })} - 
                                {format(new Date(exception.endDate), 'd MMM yyyy', { locale: pl })}
                                {!exception.allDay && exception.startTime && exception.endTime && (
                                  <span className="ml-2 font-medium">
                                    ({exception.startTime} - {exception.endTime})
                                  </span>
                                )}
                              </div>
                              <div className="text-xs mt-1 font-medium">{exception.reason}</div>
                            </div>
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => handleDelete(exception.id, exception.reason)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Nadchodzące wyjątki */}
              {categorizedExceptions.upcoming.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">{t('upcomingExceptions')}</h4>
                  <div className="space-y-2">
                    {categorizedExceptions.upcoming.map((exception) => (
                      <div
                        key={exception.id}
                        className={cn(
                          "p-3 rounded-lg border flex items-center justify-between",
                          getExceptionColor(exception.type)
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{getExceptionIcon(exception.type)}</span>
                          <div>
                            <div className="font-medium">{t(exception.type)}</div>
                            <div className="text-sm opacity-90">
                              {format(new Date(exception.startDate), 'd MMM', { locale: pl })} - 
                              {format(new Date(exception.endDate), 'd MMM yyyy', { locale: pl })}
                              {!exception.allDay && exception.startTime && exception.endTime && (
                                <span className="ml-2">
                                  ({exception.startTime} - {exception.endTime})
                                </span>
                              )}
                            </div>
                            <div className="text-xs mt-1">{exception.reason}</div>
                          </div>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => handleDelete(exception.id, exception.reason)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Przeszłe wyjątki */}
              {categorizedExceptions.past.length > 0 && (
                <div className="mb-6">
                  <details>
                    <summary className="font-medium mb-3 cursor-pointer text-gray-500">
                      {t('pastExceptions') || 'Przeszłe wyjątki'} ({categorizedExceptions.past.length})
                    </summary>
                    <div className="space-y-2 mt-3 opacity-60">
                      {categorizedExceptions.past.map((exception) => (
                        <div
                          key={exception.id}
                          className="p-3 rounded-lg border bg-gray-50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-lg grayscale">{getExceptionIcon(exception.type)}</span>
                              <div>
                                <div className="font-medium text-gray-600">{t(exception.type)}</div>
                                <div className="text-sm text-gray-500">
                                  {format(new Date(exception.startDate), 'd MMM', { locale: pl })} - 
                                  {format(new Date(exception.endDate), 'd MMM yyyy', { locale: pl })}
                                </div>
                                <div className="text-xs mt-1 text-gray-500">{exception.reason}</div>
                              </div>
                            </div>
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => handleDelete(exception.id, exception.reason)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}
              
              {/* Brak wyjątków */}
              {exceptions.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-500">{t('noExceptions')}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Twój harmonogram działa normalnie
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}