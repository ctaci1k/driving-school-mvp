// app/[locale]/instructor/schedule/availability/page.tsx
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

// Dodajemy interfejsy dla typizacji
interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

interface WorkingHoursState {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

type DayKey = keyof WorkingHoursState;

export default function InstructorAvailabilityPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  // Godziny pracy dla każdego dnia z wyraźną typizacją
  const [workingHours, setWorkingHours] = useState<WorkingHoursState>({
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

  // Szablony
  const templates = [
    {
      id: 'morning',
      name: 'Zmiana poranna',
      icon: Sun,
      hours: '08:00 - 14:00',
      description: 'Praca w pierwszej połowie dnia'
    },
    {
      id: 'evening',
      name: 'Zmiana wieczorna',
      icon: Moon,
      hours: '14:00 - 20:00',
      description: 'Praca w drugiej połowie dnia'
    },
    {
      id: 'full',
      name: 'Pełny dzień',
      icon: Clock,
      hours: '08:00 - 20:00',
      description: 'Z przerwą na obiad'
    },
    {
      id: 'weekend',
      name: 'Weekend',
      icon: Coffee,
      hours: '10:00 - 16:00',
      description: 'Skrócony grafik'
    }
  ]

  const weekDays = [
    { key: 'monday' as DayKey, name: 'Poniedziałek', short: 'Pn' },
    { key: 'tuesday' as DayKey, name: 'Wtorek', short: 'Wt' },
    { key: 'wednesday' as DayKey, name: 'Środa', short: 'Śr' },
    { key: 'thursday' as DayKey, name: 'Czwartek', short: 'Cz' },
    { key: 'friday' as DayKey, name: 'Piątek', short: 'Pt' },
    { key: 'saturday' as DayKey, name: 'Sobota', short: 'Sb' },
    { key: 'sunday' as DayKey, name: 'Niedziela', short: 'Nd' }
  ]

  const addTimeSlot = (day: DayKey) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: '09:00', end: '17:00' }]
      }
    }))
  }

  const removeTimeSlot = (day: DayKey, index: number) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index)
      }
    }))
  }

  const applyTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    // Logika aplikowania szablonu tutaj
  }

  const copyToAllDays = (sourceDay: DayKey) => {
    const sourceDayData = workingHours[sourceDay]
    
    setWorkingHours(prev => {
      const newHours: WorkingHoursState = { ...prev }
      
      // Kopiujemy na wszystkie dni, oprócz dnia źródłowego
      Object.keys(newHours).forEach(day => {
        if (day !== sourceDay) {
          newHours[day as DayKey] = {
            enabled: sourceDayData.enabled,
            slots: sourceDayData.slots.map(slot => ({ ...slot }))
          }
        }
      })
      
      return newHours
    })
  }

  const handleSave = () => {
    setIsEditing(false)
    console.log('Zapisywanie dostępności:', workingHours)
  }

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Godziny pracy</h1>
          <p className="text-gray-600 mt-1">Skonfiguruj swój harmonogram dostępności</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                Anuluj
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Zapisz
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Edytuj
            </Button>
          )}
        </div>
      </div>

      {/* Szybkie szablony */}
      <Card>
        <CardHeader>
          <CardTitle>Szybkie szablony</CardTitle>
          <CardDescription>Wybierz gotowy szablon harmonogramu pracy</CardDescription>
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

      {/* Harmonogram tygodniowy */}
      <Card>
        <CardHeader>
          <CardTitle>Harmonogram tygodniowy</CardTitle>
          <CardDescription>Skonfiguruj godziny pracy dla każdego dnia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {weekDays.map(day => (
              <div key={day.key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={workingHours[day.key].enabled}
                      onCheckedChange={(checked) =>
                        setWorkingHours(prev => ({
                          ...prev,
                          [day.key]: { ...prev[day.key], enabled: checked }
                        }))
                      }
                      disabled={!isEditing}
                    />
                    <Label className="text-base font-medium">
                      {day.name}
                      {!workingHours[day.key].enabled && (
                        <Badge variant="secondary" className="ml-2">Dzień wolny</Badge>
                      )}
                    </Label>
                  </div>
                  {isEditing && workingHours[day.key].enabled && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToAllDays(day.key)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Kopiuj na wszystkie dni
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

                {workingHours[day.key].enabled && (
                  <div className="space-y-2">
                    {workingHours[day.key].slots.map((slot, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Select
                          value={slot.start}
                          onValueChange={(value) => {
                            setWorkingHours(prev => ({
                              ...prev,
                              [day.key]: {
                                ...prev[day.key],
                                slots: prev[day.key].slots.map((s, i) =>
                                  i === index ? { ...s, start: value } : s
                                )
                              }
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
                            setWorkingHours(prev => ({
                              ...prev,
                              [day.key]: {
                                ...prev[day.key],
                                slots: prev[day.key].slots.map((s, i) =>
                                  i === index ? { ...s, end: value } : s
                                )
                              }
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

                        {isEditing && workingHours[day.key].slots.length > 1 && (
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

      {/* Ustawienia */}
      <Card>
        <CardHeader>
          <CardTitle>Dodatkowe ustawienia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Automatyczne potwierdzanie rezerwacji</Label>
                <p className="text-sm text-gray-500">Kursanci mogą rezerwować bez Twojego zatwierdzenia</p>
              </div>
              <Switch disabled={!isEditing} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Powtarzaj co tydzień</Label>
                <p className="text-sm text-gray-500">Zastosuj harmonogram dla wszystkich tygodni</p>
              </div>
              <Switch defaultChecked disabled={!isEditing} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Czas trwania lekcji</Label>
                <Select defaultValue="90" disabled={!isEditing}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">60 minut</SelectItem>
                    <SelectItem value="90">90 minut</SelectItem>
                    <SelectItem value="120">120 minut</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Przerwa między lekcjami</Label>
                <Select defaultValue="15" disabled={!isEditing}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Bez przerwy</SelectItem>
                    <SelectItem value="15">15 minut</SelectItem>
                    <SelectItem value="30">30 minut</SelectItem>
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