// components/calendar/schedule-template.tsx

'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import { Calendar, Clock, MapPin, Car } from 'lucide-react'

interface WeekPattern {
  dayOfWeek: number
  startTime: string
  endTime: string
  location?: string
  vehicleId?: string
}

interface ScheduleTemplate {
  id: string
  name: string
  weekPattern: WeekPattern[]
  validFrom: Date
  validTo?: Date
  bufferBefore: number
  bufferAfter: number
  baseLocation: string
}

export function ScheduleTemplate() {
  const t = useTranslations('calendar.scheduleTemplates')
  const tDays = useTranslations('calendar.weekDays')
  
  const [templates, setTemplates] = useState<ScheduleTemplate[]>([
    {
      id: '1',
      name: 'winterSchedule',
      weekPattern: [
        { dayOfWeek: 1, startTime: '08:00', endTime: '16:00' },
        { dayOfWeek: 2, startTime: '10:00', endTime: '18:00' },
        { dayOfWeek: 3, startTime: '08:00', endTime: '16:00' },
        { dayOfWeek: 4, startTime: '10:00', endTime: '18:00' },
        { dayOfWeek: 5, startTime: '08:00', endTime: '14:00' },
      ],
      validFrom: new Date('2024-01-01'),
      validTo: new Date('2024-03-31'),
      bufferBefore: 15,
      bufferAfter: 15,
      baseLocation: 'Warszawa Centrum'
    }
  ])
  
  const [activeTemplateId, setActiveTemplateId] = useState<string>('1')
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  const activeTemplate = templates.find(t => t.id === activeTemplateId)
  
  return (
    <div className="space-y-4">
      {/* Lista szablonów */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('title')}</span>
            <Button 
              size="sm" 
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {t('createTemplate')}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-colors ${
                  activeTemplateId === template.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveTemplateId(template.id)}
              >
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">
                    {t(template.name)}
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {t('validFrom')}: {template.validFrom.toLocaleDateString('pl-PL')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>
                        {t('bufferTime')}: {template.bufferBefore + template.bufferAfter} min
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>{template.baseLocation}</span>
                    </div>
                  </div>
                  {activeTemplateId === template.id && (
                    <div className="mt-2 text-xs text-blue-600 font-medium">
                      {t('activeTemplate')}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Szczegóły aktywnego szablonu */}
      {activeTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>{t(activeTemplate.name)} - Harmonogram tygodniowy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeTemplate.weekPattern.map((pattern) => (
                <div 
                  key={pattern.dayOfWeek}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="font-medium">
                    {tDays(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][pattern.dayOfWeek])}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {pattern.startTime} - {pattern.endTime}
                    </span>
                    {pattern.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {pattern.location}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button className="flex-1">
                {t('applyTemplate')}
              </Button>
              <Button variant="outline">
                {t('editTemplate')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}