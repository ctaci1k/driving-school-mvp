// /app/[locale]/instructor/lessons/check-in/[id]/page.tsx
'use client'

import { useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Camera, Check, X, AlertCircle, ChevronRight, ChevronLeft,
  FileCheck, Car, MapPin, User, Clock, Fuel, Gauge,
  AlertTriangle, Upload, Loader2, Save, Play
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SignatureCanvas from 'react-signature-canvas'

export default function LessonCheckInPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params?.id as string
  const signaturePadRef = useRef<SignatureCanvas>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [checkInData, setCheckInData] = useState({
    // Step 1: Documents
    documents: {
      studentLicense: false,
      studentCard: false,
      medicalCert: false,
      studentPresent: false,
      studentCondition: 'good'
    },
    // Step 2: Vehicle condition
    vehicle: {
      mileageStart: '',
      fuelLevel: '',
      exteriorOk: false,
      interiorOk: false,
      lightsOk: false,
      tiresOk: false,
      fluidsOk: false,
      brakesOk: false,
      issues: ''
    },
    // Step 3: Safety check
    safety: {
      seatbelts: false,
      mirrors: false,
      emergencyKit: false,
      fireExtinguisher: false,
      warningTriangle: false,
      studentBriefed: false
    },
    // Step 4: Photos
    photos: {
      studentCard: null as string | null,
      vehicleFront: null as string | null,
      vehicleBack: null as string | null,
      damages: [] as string[]
    },
    // Step 5: Confirmation
    signature: '',
    agreedToTerms: false,
    notes: '',
    lessonObjectives: ''
  })

  // Mock lesson data
  const lesson = {
    id: lessonId,
    student: {
      name: 'Марія Шевчук',
      avatar: 'https://ui-avatars.com/api/?name=MS&background=10B981&color=fff',
      phone: '+380501234569',
      licenseNumber: 'ABC123456',
      lessonsCompleted: 22,
      progress: 85
    },
    type: 'Підготовка до іспиту',
    duration: 90,
    startTime: '14:30',
    location: 'вул. Шевченка, 100',
    vehicle: {
      model: 'Toyota Corolla',
      number: 'AA 1234 AA',
      lastMileage: 125450,
      lastFuelLevel: 65
    }
  }

  const steps = [
    { title: 'Документи', icon: FileCheck, description: 'Перевірка документів студента' },
    { title: 'Стан авто', icon: Car, description: 'Технічний стан автомобіля' },
    { title: 'Безпека', icon: AlertTriangle, description: 'Перевірка безпеки' },
    { title: 'Фото', icon: Camera, description: 'Фотофіксація' },
    { title: 'Підтвердження', icon: Check, description: 'Підпис та початок' }
  ]

  const handlePhotoCapture = (type: string) => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCheckInData(prev => ({
          ...prev,
          photos: {
            ...prev.photos,
            studentCard: e.target?.result as string
          }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleStartLesson = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    router.push(`/instructor/lessons/today`)
  }

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return checkInData.documents.studentLicense && 
               checkInData.documents.studentPresent
      case 1:
        return checkInData.vehicle.mileageStart !== '' &&
               checkInData.vehicle.fuelLevel !== '' &&
               checkInData.vehicle.exteriorOk &&
               checkInData.vehicle.lightsOk
      case 2:
        return checkInData.safety.seatbelts &&
               checkInData.safety.mirrors &&
               checkInData.safety.studentBriefed
      case 3:
        return checkInData.photos.studentCard !== null
      case 4:
        return checkInData.signature !== '' && checkInData.agreedToTerms
      default:
        return false
    }
  }

  const calculateProgress = () => {
    return ((currentStep + 1) / steps.length) * 100
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Початок заняття</h1>
          <p className="text-gray-600 mt-1">
            {lesson.student.name} • {lesson.startTime} • {lesson.type}
          </p>
        </div>
        <Badge variant="outline">
          Крок {currentStep + 1} з {steps.length}
        </Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <Progress value={calculateProgress()} className="h-2" />
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full mb-1
                  ${index < currentStep ? 'bg-green-100 text-green-600' : ''}
                  ${index === currentStep ? 'bg-blue-100 text-blue-600' : ''}
                  ${index > currentStep ? 'bg-gray-100' : ''}
                `}
              >
                {index < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <step.icon className="w-4 h-4" />
                )}
              </div>
              <span className="text-xs hidden md:block">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Student Info Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={lesson.student.avatar} />
              <AvatarFallback>{lesson.student.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{lesson.student.name}</p>
              <p className="text-sm text-gray-500">{lesson.student.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Прогрес</p>
              <p className="font-semibold">{lesson.student.progress}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Documents */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Перевірте наявність та дійсність всіх документів студента
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={checkInData.documents.studentLicense}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({
                      ...prev,
                      vehicle: { ...prev.vehicle, issues: e.target.value }
                    }))
                  }
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {/* Step 3: Safety check */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Обов'язково проведіть інструктаж з безпеки перед початком руху
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={checkInData.safety.seatbelts}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({
                        ...prev,
                        safety: { ...prev.safety, seatbelts: checked as boolean }
                      }))
                    }
                  />
                  <div className="flex-1">
                    <p className="font-medium">Ремені безпеки</p>
                    <p className="text-sm text-gray-600">Перевірено справність та використання</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={checkInData.safety.mirrors}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({
                        ...prev,
                        safety: { ...prev.safety, mirrors: checked as boolean }
                      }))
                    }
                  />
                  <div className="flex-1">
                    <p className="font-medium">Дзеркала налаштовані</p>
                    <p className="text-sm text-gray-600">Правильно налаштовані під студента</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={checkInData.safety.emergencyKit}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({
                        ...prev,
                        safety: { ...prev.safety, emergencyKit: checked as boolean }
                      }))
                    }
                  />
                  <div className="flex-1">
                    <p className="font-medium">Аптечка</p>
                    <p className="text-sm text-gray-600">Наявна та укомплектована</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={checkInData.safety.fireExtinguisher}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({
                        ...prev,
                        safety: { ...prev.safety, fireExtinguisher: checked as boolean }
                      }))
                    }
                  />
                  <div className="flex-1">
                    <p className="font-medium">Вогнегасник</p>
                    <p className="text-sm text-gray-600">Наявний та справний</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100">
                  <Checkbox
                    checked={checkInData.safety.studentBriefed}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({
                        ...prev,
                        safety: { ...prev.safety, studentBriefed: checked as boolean }
                      }))
                    }
                  />
                  <div className="flex-1">
                    <p className="font-medium">Інструктаж проведено</p>
                    <p className="text-sm text-gray-600">Студент ознайомлений з правилами безпеки</p>
                  </div>
                  <Badge variant="destructive">Обов'язково</Badge>
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <Alert>
                <Camera className="h-4 w-4" />
                <AlertDescription>
                  Зробіть фото для документування початку заняття
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label>Фото студентської картки</Label>
                  {checkInData.photos.studentCard ? (
                    <div className="relative mt-2">
                      <img
                        src={checkInData.photos.studentCard}
                        alt="Student card"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          setCheckInData(prev => ({
                            ...prev,
                            photos: { ...prev.photos, studentCard: null }
                          }))
                        }
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePhotoCapture('studentCard')}
                      className="w-full h-32 mt-2 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Camera className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Натисніть для фото</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Фото авто спереду</Label>
                    <button
                      onClick={() => handlePhotoCapture('vehicleFront')}
                      className="w-full h-24 mt-2 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Camera className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>
                  <div>
                    <Label>Фото авто ззаду</Label>
                    <button
                      onClick={() => handlePhotoCapture('vehicleBack')}
                      className="w-full h-24 mt-2 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Camera className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold mb-2">Підсумок перевірки</h3>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Студент:</span>
                    <p className="font-medium">{lesson.student.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Тип заняття:</span>
                    <p className="font-medium">{lesson.type}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Час:</span>
                    <p className="font-medium">{lesson.startTime} ({lesson.duration} хв)</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Автомобіль:</span>
                    <p className="font-medium">{lesson.vehicle.model}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Пробіг:</span>
                    <p className="font-medium">{checkInData.vehicle.mileageStart || lesson.vehicle.lastMileage} км</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Паливо:</span>
                    <p className="font-medium">{checkInData.vehicle.fuelLevel || 'Не вказано'}</p>
                  </div>
                </div>
              </div>

              {/* Lesson objectives */}
              <div>
                <Label>Цілі заняття</Label>
                <Textarea
                  placeholder="Вкажіть, що плануєте відпрацювати на цьому занятті..."
                  value={checkInData.lessonObjectives}
                  onChange={(e) =>
                    setCheckInData(prev => ({
                      ...prev,
                      lessonObjectives: e.target.value
                    }))
                  }
                  className="mt-2"
                />
              </div>

              {/* Additional notes */}
              <div>
                <Label>Додаткові нотатки (опціонально)</Label>
                <Textarea
                  placeholder="Будь-які коментарі щодо початку заняття..."
                  value={checkInData.notes}
                  onChange={(e) =>
                    setCheckInData(prev => ({
                      ...prev,
                      notes: e.target.value
                    }))
                  }
                  className="mt-2"
                />
              </div>

              {/* Digital signature */}
              <div>
                <Label>Підпис студента</Label>
                <div className="border-2 border-gray-200 rounded-lg h-32 mt-2 relative bg-white">
                  <SignatureCanvas
                    ref={signaturePadRef}
                    canvasProps={{
                      className: 'w-full h-full'
                    }}
                    onEnd={() => {
                      if (signaturePadRef.current) {
                        setCheckInData(prev => ({
                          ...prev,
                          signature: signaturePadRef.current?.toDataURL() || ''
                        }))
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      signaturePadRef.current?.clear()
                      setCheckInData(prev => ({
                        ...prev,
                        signature: ''
                      }))
                    }}
                  >
                    Очистити
                  </Button>
                </div>
              </div>

              {/* Agreement */}
              <label className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100">
                <Checkbox
                  checked={checkInData.agreedToTerms}
                  onCheckedChange={(checked) =>
                    setCheckInData(prev => ({
                      ...prev,
                      agreedToTerms: checked as boolean
                    }))
                  }
                  className="mt-0.5"
                />
                <div>
                  <p className="font-medium text-sm">
                    Я підтверджую правильність всіх даних
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Студент ознайомлений з правилами безпеки та готовий до заняття.
                    Автомобіль перевірено та він готовий до експлуатації.
                  </p>
                </div>
              </label>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!isStepComplete(currentStep)}
            >
              Далі
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleStartLesson}
              disabled={!isStepComplete(currentStep) || isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Починаємо...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Розпочати заняття
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Safety reminder */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Пам'ятайте про безпеку!</strong> Перед початком руху обов'язково переконайтесь, 
          що студент пристебнутий, дзеркала налаштовані, і всі системи автомобіля працюють справно.
        </AlertDescription>
      </Alert>
    </div>
  )
}
                        ...prev,
                        documents: { ...prev.documents, studentLicense: checked as boolean }
                      }))
                    }
                  />
                  <div className="flex-1">
                    <p className="font-medium">Учнівське посвідчення водія</p>
                    <p className="text-sm text-gray-600">Номер: {lesson.student.licenseNumber}</p>
                  </div>
                  <Badge variant="destructive">Обов'язково</Badge>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={checkInData.documents.studentCard}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({
                        ...prev,
                        documents: { ...prev.documents, studentCard: checked as boolean }
                      }))
                    }
                  />
                  <div className="flex-1">
                    <p className="font-medium">Картка студента автошколи</p>
                    <p className="text-sm text-gray-600">Для ідентифікації в системі</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={checkInData.documents.medicalCert}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({
                        ...prev,
                        documents: { ...prev.documents, medicalCert: checked as boolean }
                      }))
                    }
                  />
                  <div className="flex-1">
                    <p className="font-medium">Медична довідка</p>
                    <p className="text-sm text-gray-600">За необхідності</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100">
                  <Checkbox
                    checked={checkInData.documents.studentPresent}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({
                        ...prev,
                        documents: { ...prev.documents, studentPresent: checked as boolean }
                      }))
                    }
                  />
                  <div className="flex-1">
                    <p className="font-medium">Студент присутній та готовий</p>
                    <p className="text-sm text-gray-600">В адекватному стані</p>
                  </div>
                  <Badge variant="destructive">Обов'язково</Badge>
                </label>
              </div>

              <div>
                <Label>Стан студента</Label>
                <Select
                  value={checkInData.documents.studentCondition}
                  onValueChange={(value) =>
                    setCheckInData(prev => ({
                      ...prev,
                      documents: { ...prev.documents, studentCondition: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Добрий</SelectItem>
                    <SelectItem value="tired">Втомлений</SelectItem>
                    <SelectItem value="nervous">Нервує</SelectItem>
                    <SelectItem value="sick">Погане самопочуття</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Vehicle condition */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Пробіг (км)</Label>
                  <Input
                    type="number"
                    placeholder={lesson.vehicle.lastMileage.toString()}
                    value={checkInData.vehicle.mileageStart}
                    onChange={(e) =>
                      setCheckInData(prev => ({
                        ...prev,
                        vehicle: { ...prev.vehicle, mileageStart: e.target.value }
                      }))
                    }
                    className="h-12 text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Останній: {lesson.vehicle.lastMileage} км
                  </p>
                </div>

                <div>
                  <Label>Рівень палива</Label>
                  <Select
                    value={checkInData.vehicle.fuelLevel}
                    onValueChange={(value) =>
                      setCheckInData(prev => ({
                        ...prev,
                        vehicle: { ...prev.vehicle, fuelLevel: value }
                      }))
                    }
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Оберіть" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Повний бак</SelectItem>
                      <SelectItem value="3/4">3/4 бака</SelectItem>
                      <SelectItem value="1/2">1/2 бака</SelectItem>
                      <SelectItem value="1/4">1/4 бака</SelectItem>
                      <SelectItem value="reserve">Резерв</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Технічний стан</Label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <Checkbox
                      checked={checkInData.vehicle.exteriorOk}
                      onCheckedChange={(checked) =>
                        setCheckInData(prev => ({
                          ...prev,
                          vehicle: { ...prev.vehicle, exteriorOk: checked as boolean }
                        }))
                      }
                    />
                    <span>Кузов без пошкоджень</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <Checkbox
                      checked={checkInData.vehicle.interiorOk}
                      onCheckedChange={(checked) =>
                        setCheckInData(prev => ({
                          ...prev,
                          vehicle: { ...prev.vehicle, interiorOk: checked as boolean }
                        }))
                      }
                    />
                    <span>Салон чистий та справний</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <Checkbox
                      checked={checkInData.vehicle.lightsOk}
                      onCheckedChange={(checked) =>
                        setCheckInData(prev => ({
                          ...prev,
                          vehicle: { ...prev.vehicle, lightsOk: checked as boolean }
                        }))
                      }
                    />
                    <span>Всі фари працюють</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <Checkbox
                      checked={checkInData.vehicle.tiresOk}
                      onCheckedChange={(checked) =>
                        setCheckInData(prev => ({
                          ...prev,
                          vehicle: { ...prev.vehicle, tiresOk: checked as boolean }
                        }))
                      }
                    />
                    <span>Шини в нормальному стані</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <Checkbox
                      checked={checkInData.vehicle.brakesOk}
                      onCheckedChange={(checked) =>
                        setCheckInData(prev => ({
                          ...prev,
                          vehicle: { ...prev.vehicle, brakesOk: checked as boolean }
                        }))
                      }
                    />
                    <span>Гальма працюють</span>
                  </label>
                </div>
              </div>

              <div>
                <Label>Виявлені проблеми (за наявності)</Label>
                <Textarea
                  placeholder="Опишіть будь-які проблеми..."
                  value={checkInData.vehicle.issues}
                  onChange={(e) =>
                    setCheckInData(prev => ({