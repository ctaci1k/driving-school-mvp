// components/schedule/LessonTypeSelector.tsx
'use client'

import { useState } from 'react'
import { 
  MapPin, Moon, Sun, Car, BookOpen, GraduationCap,
  Info, Clock, DollarSign, Users, Check
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

export interface LessonType {
  id: string
  name: string
  description: string
  icon: string
  duration: number
  price: number
  color: string
  requirements?: string[]
  locations?: string[]
  maxStudents: number
  minExperience?: number // Minimum lessons completed
  examPrep?: boolean
  popular?: boolean
}

interface LessonTypeSelectorProps {
  lessonTypes?: LessonType[]
  value: string
  onChange: (typeId: string) => void
  studentProgress?: number // Student's current progress to show/hide advanced types
  showPrices?: boolean
  showDuration?: boolean
  showRequirements?: boolean
  variant?: 'grid' | 'list' | 'compact'
  disabled?: boolean
  error?: string
  className?: string
}

const defaultLessonTypes: LessonType[] = [
  {
    id: 'city',
    name: 'Місто',
    description: 'Навчання водінню в умовах міського трафіку',
    icon: '🏙️',
    duration: 90,
    price: 350,
    color: 'bg-blue-500',
    locations: ['Центр міста', 'Житлові райони'],
    maxStudents: 1,
    popular: true
  },
  {
    id: 'highway',
    name: 'Траса',
    description: 'Водіння на високій швидкості по трасі',
    icon: '🛣️',
    duration: 120,
    price: 400,
    color: 'bg-green-500',
    requirements: ['Мінімум 10 занять', 'Базові навички'],
    locations: ['Київ-Житомир', 'Київ-Одеса'],
    maxStudents: 1,
    minExperience: 10
  },
  {
    id: 'parking',
    name: 'Паркування',
    description: 'Відпрацювання навичок паркування',
    icon: '🅿️',
    duration: 60,
    price: 300,
    color: 'bg-purple-500',
    locations: ['Автодром', 'Парковка ТРЦ'],
    maxStudents: 1
  },
  {
    id: 'exam-prep',
    name: 'Підготовка до іспиту',
    description: 'Інтенсивна підготовка до практичного іспиту',
    icon: '📝',
    duration: 90,
    price: 450,
    color: 'bg-orange-500',
    requirements: ['80% прогресу', 'Теорія здана'],
    locations: ['Маршрут ДАІ'],
    maxStudents: 1,
    minExperience: 20,
    examPrep: true,
    popular: true
  },
  {
    id: 'night',
    name: 'Нічна їзда',
    description: 'Водіння в темний час доби',
    icon: '🌙',
    duration: 90,
    price: 400,
    color: 'bg-indigo-500',
    requirements: ['Мінімум 15 занять', 'Впевнене водіння'],
    locations: ['Місто', 'Траса'],
    maxStudents: 1,
    minExperience: 15
  },
  {
    id: 'theory',
    name: 'Теорія',
    description: 'Вивчення правил дорожнього руху',
    icon: '📚',
    duration: 45,
    price: 200,
    color: 'bg-yellow-500',
    locations: ['Клас', 'Онлайн'],
    maxStudents: 5
  }
]

export function LessonTypeSelector({
  lessonTypes = defaultLessonTypes,
  value,
  onChange,
  studentProgress = 0,
  showPrices = true,
  showDuration = true,
  showRequirements = true,
  variant = 'grid',
  disabled = false,
  error,
  className
}: LessonTypeSelectorProps) {
  const [showInfo, setShowInfo] = useState<string | null>(null)

  // Filter available lesson types based on student progress
  const availableLessonTypes = lessonTypes.map(type => ({
    ...type,
    isAvailable: !type.minExperience || studentProgress >= type.minExperience,
    isRecommended: type.examPrep ? studentProgress >= 80 : 
                   type.minExperience ? studentProgress >= type.minExperience && studentProgress < type.minExperience + 10 :
                   true
  }))

  const selectedType = availableLessonTypes.find(t => t.id === value)

  // Grid variant
  if (variant === 'grid') {
    return (
      <div className={cn("space-y-2", className)}>
        <Label>
          Тип заняття
        </Label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {availableLessonTypes.map(type => (
            <button
              key={type.id}
              onClick={() => type.isAvailable && !disabled && onChange(type.id)}
              disabled={!type.isAvailable || disabled}
              className={cn(
                "relative p-4 rounded-lg border-2 text-center transition-all",
                value === type.id 
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" 
                  : "border-gray-200 hover:border-gray-300",
                !type.isAvailable && "opacity-50 cursor-not-allowed",
                disabled && "cursor-not-allowed"
              )}
            >
              {/* Popular badge */}
              {type.popular && (
                <Badge className="absolute -top-2 -right-2 text-xs" variant="default">
                  Популярне
                </Badge>
              )}

              {/* Recommended badge */}
              {type.isRecommended && type.isAvailable && (
                <Badge className="absolute -top-2 -left-2 text-xs" variant="secondary">
                  Рекомендовано
                </Badge>
              )}

              <div className="text-3xl mb-2">{type.icon}</div>
              <div className="font-medium">{type.name}</div>
              
              {showDuration && (
                <div className="text-xs text-gray-500 mt-1">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {type.duration} хв
                </div>
              )}
              
              {showPrices && (
                <div className="text-sm font-medium text-gray-700 mt-1">
                  ₴{type.price}
                </div>
              )}

              {!type.isAvailable && type.minExperience && (
                <div className="text-xs text-red-500 mt-2">
                  Потрібно {type.minExperience} занять
                </div>
              )}

              {/* Selection indicator */}
              {value === type.id && (
                <Check className="absolute top-2 right-2 w-4 h-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>

        {/* Selected type details */}
        {selectedType && (
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">{selectedType.description}</p>
                
                {showRequirements && selectedType.requirements && (
                  <div>
                    <span className="text-sm font-medium">Вимоги:</span>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      {selectedType.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedType.locations && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {selectedType.locations.join(', ')}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {selectedType.duration} хвилин
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    ₴{selectedType.price}
                  </span>
                  {selectedType.maxStudents > 1 && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      До {selectedType.maxStudents} студентів
                    </span>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }

  // List variant
  if (variant === 'list') {
    return (
      <div className={cn("space-y-2", className)}>
        <Label>Тип заняття</Label>
        
        <RadioGroup value={value} onValueChange={onChange} disabled={disabled}>
          <div className="space-y-2">
            {availableLessonTypes.map(type => (
              <label
                key={type.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                  value === type.id 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-gray-300",
                  !type.isAvailable && "opacity-50 cursor-not-allowed",
                  disabled && "cursor-not-allowed"
                )}
              >
                <RadioGroupItem 
                  value={type.id} 
                  disabled={!type.isAvailable || disabled}
                />
                <div className="text-2xl">{type.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{type.name}</span>
                    {type.popular && (
                      <Badge variant="secondary" className="text-xs">Популярне</Badge>
                    )}
                    {type.examPrep && (
                      <Badge variant="outline" className="text-xs">Іспит</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{type.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span>{type.duration} хв</span>
                    <span>•</span>
                    <span>₴{type.price}</span>
                    {type.locations && (
                      <>
                        <span>•</span>
                        <span>{type.locations[0]}</span>
                      </>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </RadioGroup>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }

  // Compact variant
  return (
    <div className={cn("space-y-2", className)}>
      <Label>Тип заняття</Label>
      
      <div className="flex flex-wrap gap-2">
        {availableLessonTypes.map(type => (
          <button
            key={type.id}
            onClick={() => type.isAvailable && !disabled && onChange(type.id)}
            disabled={!type.isAvailable || disabled}
            className={cn(
              "px-3 py-2 rounded-lg border-2 transition-all flex items-center gap-2",
              value === type.id 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-200 hover:border-gray-300",
              !type.isAvailable && "opacity-50 cursor-not-allowed",
              disabled && "cursor-not-allowed"
            )}
          >
            <span>{type.icon}</span>
            <span className="text-sm font-medium">{type.name}</span>
            {showDuration && (
              <span className="text-xs text-gray-500">({type.duration} хв)</span>
            )}
            {value === type.id && (
              <Check className="w-3 h-3 text-blue-600" />
            )}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}