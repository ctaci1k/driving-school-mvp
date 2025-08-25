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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

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
  
  const tomorrow = addDays(new Date(), 1).toISOString().split('T')[0]
  
  const [newException, setNewException] = useState<Partial<ScheduleException>>({
    type: 'vacation',
    allDay: true,
    startDate: tomorrow,
    endDate: tomorrow,
    reason: '',
  })
  
  // ✅ Виправлено
  const { data: exceptions = [], refetch, isLoading } = trpc.schedule.getExceptions.useQuery()
  
  const createException = trpc.schedule.createException.useMutation({
    onSuccess: (data) => {
      toast.success(data.message || 'Wyjątek został dodany')
      setShowAddForm(false)
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
  
  const categorizedExceptions = useMemo(() => {
    const today = startOfToday()
    
    const current = exceptions.filter(e => {
      const endDate = new Date(e.endDate)
      return isAfter(endDate, today) || isToday(endDate)
    })
    
    const past = exceptions.filter(e => {
      const endDate = new Date(e.endDate)
      return isBefore(endDate, today) && !isToday(endDate)
    })
    
    return { current, past }
  }, [exceptions])
  
  const handleSubmit = () => {
    if (!newException.reason?.trim()) {
      toast.error(t('reasonRequired'))
      return
    }
    
    if (!newException.startDate || !newException.endDate) {
      toast.error(t('datesRequired'))
      return
    }
    
    createException.mutate({
      type: newException.type!,
      startDate: newException.startDate as string,
      endDate: newException.endDate as string,
      allDay: newException.allDay!,
      startTime: newException.allDay ? null : newException.startTime,
      endTime: newException.allDay ? null : newException.endTime,
      reason: newException.reason,
      description: newException.description
    })
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
  
  const getExceptionColor = (type: string) => {
    switch(type) {
      case 'vacation': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'sickLeave': return 'bg-red-100 text-red-800 border-red-200'
      case 'holiday': return 'bg-green-100 text-green-800 border-green-200'
      case 'personalLeave': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'training': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'vehicleMaintenance': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('title')}</span>
            <Button
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('addException')}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>{t('exceptionType')}</Label>
                  <Select
                    value={newException.type}
                    onValueChange={(value) => setNewException({...newException, type: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacation">{t('types.vacation')}</SelectItem>
                      <SelectItem value="sickLeave">{t('types.sickLeave')}</SelectItem>
                      <SelectItem value="holiday">{t('types.holiday')}</SelectItem>
                      <SelectItem value="personalLeave">{t('types.personalLeave')}</SelectItem>
                      <SelectItem value="training">{t('types.training')}</SelectItem>
                      <SelectItem value="vehicleMaintenance">{t('types.vehicleMaintenance')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allDay"
                    checked={newException.allDay}
                    onCheckedChange={(checked) => setNewException({...newException, allDay: checked})}
                  />
                  <Label htmlFor="allDay">{t('allDay')}</Label>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>{t('startDate')}</Label>
                  <Input
                    type="date"
                    value={newException.startDate}
                    onChange={(e) => setNewException({...newException, startDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <Label>{t('endDate')}</Label>
                  <Input
                    type="date"
                    value={newException.endDate}
                    onChange={(e) => setNewException({...newException, endDate: e.target.value})}
                    min={newException.startDate}
                  />
                </div>
              </div>
              
              {!newException.allDay && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t('startTime')}</Label>
                    <Input
                      type="time"
                      value={newException.startTime || ''}
                      onChange={(e) => setNewException({...newException, startTime: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label>{t('endTime')}</Label>
                    <Input
                      type="time"
                      value={newException.endTime || ''}
                      onChange={(e) => setNewException({...newException, endTime: e.target.value})}
                    />
                  </div>
                </div>
              )}
              
              <div>
                <Label>{t('reason')}</Label>
                <Input
                  value={newException.reason}
                  onChange={(e) => setNewException({...newException, reason: e.target.value})}
                  placeholder={t('reasonPlaceholder')}
                />
              </div>
              
              <div>
                <Label>{t('description')} ({t('optional')})</Label>
                <Textarea
                  value={newException.description || ''}
                  onChange={(e) => setNewException({...newException, description: e.target.value})}
                  placeholder={t('descriptionPlaceholder')}
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={createException.isLoading}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {t('save')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    const newTomorrow = addDays(new Date(), 1).toISOString().split('T')[0]
                    setNewException({
                      type: 'vacation',
                      allDay: true,
                      startDate: newTomorrow,
                      endDate: newTomorrow,
                      reason: '',
                    })
                  }}
                >
                  {t('cancel')}
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {categorizedExceptions.current.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t('currentExceptions')}
                </h4>
                <div className="space-y-2">
                  {categorizedExceptions.current.map((exception) => (
                    <div
                      key={exception.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border",
                        getExceptionColor(exception.type)
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getExceptionIcon(exception.type)}</span>
                        <div>
                          <p className="font-medium">
                            {t(`types.${exception.type}`)}
                          </p>
                          <p className="text-sm opacity-75">
                            {format(new Date(exception.startDate), 'dd MMM yyyy')} - 
                            {format(new Date(exception.endDate), 'dd MMM yyyy')}
                            {!exception.allDay && exception.startTime && exception.endTime && (
                              <span> ({exception.startTime} - {exception.endTime})</span>
                            )}
                          </p>
                          <p className="text-sm">{exception.reason}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteException.mutate({ id: exception.id })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {categorizedExceptions.past.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {t('pastExceptions')}
                </h4>
                <div className="space-y-2 opacity-60">
                  {categorizedExceptions.past.slice(0, 3).map((exception) => (
                    <div
                      key={exception.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <span>{getExceptionIcon(exception.type)}</span>
                        <div>
                          <p className="text-sm">
                            {t(`types.${exception.type}`)} - {exception.reason}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(exception.startDate), 'dd MMM yyyy')} - 
                            {format(new Date(exception.endDate), 'dd MMM yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {exceptions.length === 0 && !showAddForm && (
              <p className="text-center text-muted-foreground py-8">
                {t('noExceptions')}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}