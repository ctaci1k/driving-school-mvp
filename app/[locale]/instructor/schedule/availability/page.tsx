// /app/[locale]/instructor/schedule/availability/page.tsx
'use client'

import { useState } from 'react'
import { 
  Calendar, Clock, Copy, Save, Plus, Minus,
  Sun, Moon, Coffee, Settings, AlertCircle,
  ChevronRight, Check, X, Repeat
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function InstructorAvailabilityPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  // Working hours for each day
  const [workingHours, setWorkingHours] = useState({
    monday: {
      enabled: true,
      slots: [
        { start: '08:00', end: '12:00' },
        { start: '13:00', end: '20:00' }
      ]
    },
    tuesday: {
      enabled: true,
      slots: [
        { start: '08:00', end: '12:00' },
        { start: '13:00', end: '20:00' }
      ]
    },
    wednesday: {
      enabled: true,
      slots: [
        { start: '08:00', end: '12:00' },
        { start: '13:00', end: '20:00' }
      ]
    },
    thursday: {
      enabled: true,
      slots: [
        { start: '08:00', end: '12:00' },
        { start: '13:00', end: '20:00' }
      ]
    },
    friday: {
      enabled: true,
      slots: [
        { start: '08:00', end: '12:00' },
        { start: '13:00', end: '18:00' }
      ]
    },
    saturday: {
      enabled: true,
      slots: [
        { start: '09:00', end: '14:00' }
      ]
    },
    sunday: {
      enabled: false,
      slots: []
    }
  })

  // Templates
  const templates = [
    {
      id: 'morning',
      name: 'Ранкова зміна',
      icon: Sun,
      hours: '08:00 - 14:00',
      description: 'Робота в першій половині дня'
    },
    {
      id: 'evening',
      name: 'Вечірня зміна',
      icon: Moon,
      hours: '14:00 - 20:00',
      description: 'Робота в другій половині дня'
    },
    {
      id: 'full',
      name: 'Повний день',
      icon: Clock,
      hours: '08:00 - 20:00',
      description: 'З перервою на обід'
    },
    {
      id: 'weekend',
      name: 'Вихідні',
      icon: Coffee,
      hours: '10:00 - 16:00',
      description: 'Скорочений графік'
    }
  ]

  const weekDays = [
    { key: 'monday', name: 'Понеділок', short: 'Пн' },
    { key: 'tuesday', name: 'Вівторок', short: 'Вт' },
    { key: 'wednesday', name: 'Середа', short: 'Ср' },
    { key: 'thursday', name: 'Четвер', short: 'Чт' },
    { key: 'friday', name: "П'ятниця", short: 'Пт' },
    { key: 'saturday', name: 'Субота', short: 'Сб' },
    { key: 'sunday', name: 'Неділя', short: 'Нд' }
  ]

  const addTimeSlot = (day: string) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        slots: [...prev[day as keyof typeof prev].slots, { start: '09:00', end: '17:00' }]
      }
    }))
  }

  const removeTimeSlot = (day: string, index: number) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        slots: prev[day as keyof typeof prev].slots.filter((_, i) => i !== index)
      }
    }))
  }

  const applyTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    // Apply template logic here
  }

  const copyToAllDays = (sourceDay: string) => {
    const sourceDayData = workingHours[sourceDay as keyof typeof workingHours]
    const newHours = { ...workingHours }
    
Object.keys(newHours).forEach(day => {
  if (day !== sourceDay) {
    newHours[day as keyof typeof newHours] = {
      enabled: sourceDayData.enabled,
      slots: sourceDayData.slots.map(slot => ({ ...slot }))
    }
  }
})
    
    setWorkingHours(newHours)
  }

  const handleSave = () => {
    setIsEditing(false)
    console.log('Saving availability:', workingHours)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Робочі години</h1>
          <p className="text-gray-600 mt-1">Налаштуйте свій графік доступності</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                Скасувати
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Зберегти
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Редагувати
            </Button>
          )}
        </div>
      </div>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Швидкі шаблони</CardTitle>
          <CardDescription>Оберіть готовий шаблон робочого графіку</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {templates.map(template => (
              <button
                key={template.id}
                onClick={() => applyTemplate(template.id)}
                disabled={!isEditing}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <template.icon className="w-6 h-6 mb-2 mx-auto text-gray-600" />
                <p className="font-medium text-sm">{template.name}</p>
                <p className="text-xs text-gray-500 mt-1">{template.hours}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Тижневий розклад</CardTitle>
          <CardDescription>Налаштуйте робочі години для кожного дня</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {weekDays.map(day => (
              <div key={day.key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={workingHours[day.key as keyof typeof workingHours].enabled}
                      onCheckedChange={(checked) =>
                        setWorkingHours(prev => ({
                          ...prev,
                          [day.key]: { ...prev[day.key as keyof typeof prev], enabled: checked }
                        }))
                      }
                      disabled={!isEditing}
                    />
                    <Label className="text-base font-medium">
                      {day.name}
                      {!workingHours[day.key as keyof typeof workingHours].enabled && (
                        <Badge variant="secondary" className="ml-2">Вихідний</Badge>
                      )}
                    </Label>
                  </div>
                  {isEditing && workingHours[day.key as keyof typeof workingHours].enabled && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToAllDays(day.key)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Копіювати на всі дні
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addTimeSlot(day.key)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {workingHours[day.key as keyof typeof workingHours].enabled && (
                  <div className="space-y-2">
                    {workingHours[day.key as keyof typeof workingHours].slots.map((slot, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Select
                          value={slot.start}
                          onValueChange={(value) => {
                            const newSlots = [...workingHours[day.key as keyof typeof workingHours].slots]
                            newSlots[index].start = value
                            setWorkingHours(prev => ({
                              ...prev,
                              [day.key]: { ...prev[day.key as keyof typeof prev], slots: newSlots }
                            }))
                          }}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 48 }, (_, i) => {
                              const hour = Math.floor(i / 2)
                              const minute = i % 2 === 0 ? '00' : '30'
                              const time = `${hour.toString().padStart(2, '0')}:${minute}`
                              return <SelectItem key={time} value={time}>{time}</SelectItem>
                            })}
                          </SelectContent>
                        </Select>

                        <span className="text-gray-500">—</span>

                        <Select
                          value={slot.end}
                          onValueChange={(value) => {
                            const newSlots = [...workingHours[day.key as keyof typeof workingHours].slots]
                            newSlots[index].end = value
                            setWorkingHours(prev => ({
                              ...prev,
                              [day.key]: { ...prev[day.key as keyof typeof prev], slots: newSlots }
                            }))
                          }}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 48 }, (_, i) => {
                              const hour = Math.floor(i / 2)
                              const minute = i % 2 === 0 ? '00' : '30'
                              const time = `${hour.toString().padStart(2, '0')}:${minute}`
                              return <SelectItem key={time} value={time}>{time}</SelectItem>
                            })}
                          </SelectContent>
                        </Select>

                        {isEditing && workingHours[day.key as keyof typeof workingHours].slots.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTimeSlot(day.key, index)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Додаткові налаштування</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Автоматичне підтвердження бронювань</Label>
                <p className="text-sm text-gray-500">Студенти можуть бронювати без вашого схвалення</p>
              </div>
              <Switch disabled={!isEditing} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Повторювати щотижня</Label>
                <p className="text-sm text-gray-500">Застосувати розклад для всіх тижнів</p>
              </div>
              <Switch defaultChecked disabled={!isEditing} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Тривалість заняття</Label>
                <Select defaultValue="90" disabled={!isEditing}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">60 хвилин</SelectItem>
                    <SelectItem value="90">90 хвилин</SelectItem>
                    <SelectItem value="120">120 хвилин</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Перерва між заняттями</Label>
                <Select defaultValue="15" disabled={!isEditing}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Без перерви</SelectItem>
                    <SelectItem value="15">15 хвилин</SelectItem>
                    <SelectItem value="30">30 хвилин</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}