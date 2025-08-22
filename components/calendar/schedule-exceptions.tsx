// components/calendar/schedule-exceptions.tsx

'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useTranslations } from 'next-intl'
import { Calendar, Clock, AlertCircle, Plus, X } from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface ScheduleException {
  id: string
  type: 'vacation' | 'sickLeave' | 'holiday' | 'personalLeave' | 'training' | 'vehicleMaintenance'
  startDate: Date
  endDate: Date
  allDay: boolean
  startTime?: string
  endTime?: string
  reason: string
  description?: string
}

export function ScheduleExceptions() {
  const t = useTranslations('calendar.scheduleExceptions')
  
  const [exceptions, setExceptions] = useState<ScheduleException[]>([
    {
      id: '1',
      type: 'vacation',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-07'),
      allDay: true,
      reason: 'Urlop wypoczynkowy'
    },
    {
      id: '2',
      type: 'personalLeave',
      startDate: new Date('2024-01-25'),
      endDate: new Date('2024-01-25'),
      allDay: false,
      startTime: '14:00',
      endTime: '18:00',
      reason: 'Wizyta u lekarza'
    }
  ])
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [newException, setNewException] = useState<Partial<ScheduleException>>({
    type: 'vacation',
    allDay: true
  })
  
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
  
  const upcomingExceptions = exceptions.filter(e => e.startDate >= new Date())
  const pastExceptions = exceptions.filter(e => e.startDate < new Date())
  
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
                <option value="vacation">{t('vacation')}</option>
                <option value="sickLeave">{t('sickLeave')}</option>
                <option value="holiday">{t('holiday')}</option>
                <option value="personalLeave">{t('personalLeave')}</option>
                <option value="training">{t('training')}</option>
                <option value="vehicleMaintenance">{t('vehicleMaintenance')}</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('startDate')}</Label>
                <Input type="date" className="mt-1" />
              </div>
              <div>
                <Label>{t('endDate')}</Label>
                <Input type="date" className="mt-1" />
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
                  <Input type="time" className="mt-1" />
                </div>
                <div>
                  <Label>{t('endTime')}</Label>
                  <Input type="time" className="mt-1" />
                </div>
              </div>
            )}
            
            <div>
              <Label>{t('reason')}</Label>
              <Input placeholder={t('reason')} className="mt-1" />
            </div>
            
            <Button className="w-full">
              {t('applyException')}
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
          {/* Nadchodzące wyjątki */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{t('upcomingExceptions')}</h4>
            {upcomingExceptions.length > 0 ? (
              <div className="space-y-2">
                {upcomingExceptions.map((exception) => (
                  <div
                    key={exception.id}
                    className={cn(
                      "p-3 rounded-lg border flex items-center justify-between",
                      getExceptionColor(exception.type)
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{t(exception.type)}</div>
                        <div className="text-sm opacity-90">
                          {format(exception.startDate, 'd MMM', { locale: pl })} - 
                          {format(exception.endDate, 'd MMM yyyy', { locale: pl })}
                          {!exception.allDay && (
                            <span className="ml-2">
                              ({exception.startTime} - {exception.endTime})
                            </span>
                          )}
                        </div>
                        <div className="text-xs mt-1">{exception.reason}</div>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">{t('noExceptions')}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}