// components/schedule/QuickBooking.tsx
'use client'

import { useState } from 'react'
import { 
  Calendar, Clock, User, MapPin, Car, Plus,
  Zap, ChevronRight, Check, AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { format, addMinutes, setHours, setMinutes } from 'date-fns'
import { uk } from 'date-fns/locale'

interface Student {
  id: string
  name: string
  avatar?: string
  progress: number
  lastLesson?: Date
  preferredTime?: string
  preferredLocation?: string
}

interface QuickBookingProps {
  students: Student[]
  selectedDate?: Date
  selectedTime?: string
  onSubmit: (booking: BookingData) => void
  onCancel?: () => void
  defaultDuration?: number
  availableSlots?: string[]
  className?: string
}

export interface BookingData {
  studentId: string
  date: Date
  startTime: string
  duration: number
  type: 'city' | 'highway' | 'parking' | 'exam-prep' | 'night' | 'theory'
  location: string
  notes?: string
  sendReminder: boolean
  vehicle?: string
}

const lessonTypes = [
  { value: 'city', label: 'Місто', icon: '🏙️', duration: 90 },
  { value: 'highway', label: 'Траса', icon: '🛣️', duration: 120 },
  { value: 'parking', label: 'Паркування', icon: '🅿️', duration: 60 },
  { value: 'exam-prep', label: 'Іспит', icon: '📝', duration: 90 },
  { value: 'night', label: 'Ніч', icon: '🌙', duration: 90 },
  { value: 'theory', label: 'Теорія', icon: '📚', duration: 45 }
]

const durations = [
  { value: 45, label: '45 хв' },
  { value: 60, label: '1 год' },
  { value: 90, label: '1.5 год' },
  { value: 120, label: '2 год' }
]

const defaultLocations = [
  'вул. Хрещатик, 1 (центр)',
  'пл. Незалежності',
  'вул. Шевченка, 100', 
  'Автодром (майданчик)',
  'Київ-Житомир (траса)',
  'Оболонь (житловий район)'
]

export function QuickBooking({
  students,
  selectedDate = new Date(),
  selectedTime,
  onSubmit,
  onCancel,
  defaultDuration = 90,
  availableSlots,
  className
}: QuickBookingProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<Partial<BookingData>>({
    date: selectedDate,
    startTime: selectedTime || '09:00',
    duration: defaultDuration,
    type: 'city',
    location: '',
    sendReminder: true
  })
  const [customLocation, setCustomLocation] = useState(false)

  // Generate time slots
  const timeSlots = availableSlots || [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', 
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ]

  // Get student info
  const selectedStudent = students.find(s => s.id === formData.studentId)

  // Handle student selection
  const handleStudentSelect = (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    setFormData(prev => ({
      ...prev,
      studentId,
      location: student?.preferredLocation || prev.location
    }))
  }

  // Handle lesson type selection
  const handleTypeSelect = (type: string) => {
    const lessonType = lessonTypes.find(t => t.value === type)
    setFormData(prev => ({
      ...prev,
      type: type as BookingData['type'],
      duration: lessonType?.duration || prev.duration
    }))
  }

  // Handle form submission
  const handleSubmit = () => {
    if (!formData.studentId || !formData.location) {
      return
    }

    onSubmit(formData as BookingData)
  }

  // Calculate end time
  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const startDate = setMinutes(setHours(new Date(), hours), minutes)
    const endDate = addMinutes(startDate, duration)
    return format(endDate, 'HH:mm')
  }

  const isStepComplete = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return !!formData.studentId
      case 2:
        return !!formData.type && !!formData.date && !!formData.startTime
      case 3:
        return !!formData.location
      default:
        return false
    }
  }

  return (
    <Card className={cn("w-full max-w-2xl", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <CardTitle>Швидке бронювання</CardTitle>
          </div>
          <Badge variant="outline">Крок {step} з 3</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                s < step ? "bg-green-500 text-white" :
                s === step ? "bg-blue-500 text-white" :
                "bg-gray-200 text-gray-400"
              )}>
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div className={cn(
                  "flex-1 h-1 mx-2 transition-all",
                  s < step ? "bg-green-500" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Student */}
        {step === 1 && (
          <div className="space-y-4">
            <Label>Оберіть студента</Label>
            <div className="grid grid-cols-2 gap-3">
              {students.map(student => (
                <button
                  key={student.id}
                  onClick={() => handleStudentSelect(student.id)}
                  className={cn(
                    "p-3 rounded-lg border-2 text-left transition-all hover:shadow-md",
                    formData.studentId === student.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{student.name}</span>
                    {formData.studentId === student.id && (
                      <Check className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Прогрес:</span>
                      <span className="font-medium">{student.progress}%</span>
                    </div>
                    {student.lastLesson && (
                      <div className="text-xs text-gray-500">
                        Останнє: {format(student.lastLesson, 'dd.MM', { locale: uk })}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Recently active students */}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">Або введіть ім'я:</p>
              <Input 
                placeholder="Почніть вводити ім'я студента..."
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Step 2: Select Time & Type */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Lesson Type */}
            <div>
              <Label>Тип заняття</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {lessonTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => handleTypeSelect(type.value)}
                    className={cn(
                      "p-3 rounded-lg border-2 text-center transition-all",
                      formData.type === type.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                    <div className="text-xs text-gray-500">{type.duration} хв</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Дата</Label>
                <Input
                  type="date"
                  value={format(formData.date || new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    date: new Date(e.target.value) 
                  }))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Час початку</Label>
                <Select 
                  value={formData.startTime}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    startTime: value 
                  }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Duration */}
            <div>
              <Label>Тривалість</Label>
              <RadioGroup 
                value={formData.duration?.toString()}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  duration: parseInt(value) 
                }))}
                className="flex gap-3 mt-2"
              >
                {durations.map(duration => (
                  <label
                    key={duration.value}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all",
                      formData.duration === duration.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <RadioGroupItem value={duration.value.toString()} />
                    <span className="text-sm">{duration.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Time summary */}
            {formData.startTime && formData.duration && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Заняття: {formData.startTime} - {calculateEndTime(formData.startTime, formData.duration)}
                  {' '}({formData.duration} хвилин)
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Step 3: Location & Notes */}
        {step === 3 && (
          <div className="space-y-4">
            {/* Location */}
            <div>
              <Label>Місце зустрічі</Label>
              {!customLocation ? (
                <div className="space-y-2 mt-2">
                  {defaultLocations.map(location => (
                    <button
                      key={location}
                      onClick={() => setFormData(prev => ({ ...prev, location }))}
                      className={cn(
                        "w-full p-3 rounded-lg border-2 text-left transition-all flex items-center justify-between",
                        formData.location === location
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{location}</span>
                      </div>
                      {formData.location === location && (
                        <Check className="w-4 h-4 text-blue-500" />
                      )}
                    </button>
                  ))}
                  <button
                    onClick={() => setCustomLocation(true)}
                    className="w-full p-3 rounded-lg border-2 border-dashed border-gray-300 text-center text-sm text-gray-600 hover:border-gray-400"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Інша адреса
                  </button>
                </div>
              ) : (
                <div className="mt-2 space-y-2">
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Введіть адресу..."
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCustomLocation(false)
                      setFormData(prev => ({ ...prev, location: '' }))
                    }}
                  >
                    Обрати зі списку
                  </Button>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <Label>Нотатки (опціонально)</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Додаткова інформація про заняття..."
                className="mt-2"
                rows={3}
              />
            </div>

            {/* Reminder */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.sendReminder}
                onCheckedChange={(checked) => setFormData(prev => ({ 
                  ...prev, 
                  sendReminder: checked as boolean 
                }))}
              />
              <Label className="cursor-pointer">
                Надіслати нагадування студенту за годину
              </Label>
            </div>

            {/* Summary */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <p className="font-medium mb-2">Підсумок:</p>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Студент:</span>
                  <span className="font-medium">{selectedStudent?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Дата:</span>
                  <span className="font-medium">
                    {format(formData.date || new Date(), 'd MMMM yyyy', { locale: uk })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Час:</span>
                  <span className="font-medium">
                    {formData.startTime} - {calculateEndTime(formData.startTime!, formData.duration!)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Тип:</span>
                  <span className="font-medium">
                    {lessonTypes.find(t => t.value === formData.type)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Місце:</span>
                  <span className="font-medium text-right text-xs">
                    {formData.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <div>
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                Назад
              </Button>
            )}
            {step === 1 && onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
              >
                Скасувати
              </Button>
            )}
          </div>
          <div>
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!isStepComplete(step)}
              >
                Далі
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepComplete(3)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Забронювати
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}