// app/[locale]/instructor/lessons/check-in/[id]/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { 
  Camera, Check, X, AlertCircle, ChevronRight, ChevronLeft,
  FileCheck, Car, MapPin, User, Clock, Fuel, Gauge,
  AlertTriangle, Upload, Loader2, Save, Play, Navigation,
  Shield, Phone, MessageSquare, Battery, Wifi, WifiOff,
  CheckCircle, XCircle, Info, CameraOff
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

interface CheckInStep {
  id: string
  title: string
  description: string
  icon: any
  required: boolean
}

export default function LessonCheckInPage() {
  const t = useTranslations('instructor.lessons.checkIn')
  const router = useRouter()
  const params = useParams()
  const lessonId = params?.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [gpsEnabled, setGpsEnabled] = useState(true)

  const checkInSteps: CheckInStep[] = [
    {
      id: 'documents',
      title: t('steps.documents.title'),
      description: t('steps.documents.description'),
      icon: FileCheck,
      required: true
    },
    {
      id: 'vehicle',
      title: t('steps.vehicle.title'),
      description: t('steps.vehicle.description'),
      icon: Car,
      required: true
    },
    {
      id: 'safety',
      title: t('steps.safety.title'),
      description: t('steps.safety.description'),
      icon: Shield,
      required: true
    },
    {
      id: 'photos',
      title: t('steps.photos.title'),
      description: t('steps.photos.description'),
      icon: Camera,
      required: false
    },
    {
      id: 'confirmation',
      title: t('steps.confirmation.title'),
      description: t('steps.confirmation.description'),
      icon: Check,
      required: true
    }
  ]

  // Check-in data
  const [checkInData, setCheckInData] = useState({
    // Documents
    documents: {
      studentLicense: false,
      studentLicenseNumber: '',
      studentLicenseValid: false,
      studentCard: false,
      medicalCert: false,
      studentPresent: false,
      identityConfirmed: false
    },
    // Vehicle
    vehicle: {
      mileageStart: '',
      fuelLevel: '',
      exteriorClean: false,
      exteriorDamages: '',
      interiorClean: false,
      lightsWorking: false,
      tiresOk: false,
      fluidsOk: false,
      documentsPresent: false,
      emergencyKitPresent: false,
      issues: ''
    },
    // Safety
    safety: {
      seatbeltsWorking: false,
      mirrorsAdjusted: false,
      brakesChecked: false,
      handbrakeWorking: false,
      hornWorking: false,
      studentBriefed: false,
      emergencyProcedures: false,
      phoneOnSilent: false
    },
    // Photos
    photos: {
      front: null as string | null,
      back: null as string | null,
      left: null as string | null,
      right: null as string | null,
      interior: null as string | null,
      dashboard: null as string | null,
      damages: [] as string[]
    },
    // Final
    notes: '',
    studentSignature: '',
    instructorSignature: '',
    agreedToTerms: false,
    startTime: new Date().toISOString(),
    location: null as GeolocationPosition | null
  })

  // Mock lesson data
  const lesson = {
    id: lessonId,
    student: {
      name: 'Марія Коваленко',
      avatar: 'https://ui-avatars.com/api/?name=MK&background=10B981&color=fff',
      phone: '+380 501 234 567',
      licenseNumber: 'ABC123456',
      category: 'B',
      progress: 85,
      lessonsCompleted: 24
    },
    type: 'city',
    duration: 90,
    startTime: '14:30',
    location: 'вул. Шевченка 100',
    vehicle: {
      model: 'Toyota Corolla',
      number: 'АА 1234 КА',
      lastMileage: 125450
    }
  }

  // Get current location
  useEffect(() => {
    if ('geolocation' in navigator && gpsEnabled) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCheckInData(prev => ({
            ...prev,
            location: position
          }))
        },
        (error) => {
          console.error('Error getting location:', error)
          setGpsEnabled(false)
        },
        { enableHighAccuracy: true }
      )
    }

    // Check online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Check battery level
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100))
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100))
        })
      })
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [gpsEnabled])

  const handlePhotoCapture = (type: string) => {
    // In mobile app, would open camera
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
            front: e.target?.result as string
          }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const isStepComplete = (stepIndex: number): boolean => {
    const step = checkInSteps[stepIndex]
    switch (step.id) {
      case 'documents':
        return checkInData.documents.studentPresent && 
               checkInData.documents.studentLicense &&
               checkInData.documents.identityConfirmed
      case 'vehicle':
        return checkInData.vehicle.mileageStart !== '' &&
               checkInData.vehicle.fuelLevel !== '' &&
               checkInData.vehicle.exteriorClean &&
               checkInData.vehicle.interiorClean &&
               checkInData.vehicle.lightsWorking
      case 'safety':
        return checkInData.safety.seatbeltsWorking &&
               checkInData.safety.mirrorsAdjusted &&
               checkInData.safety.brakesChecked &&
               checkInData.safety.studentBriefed
      case 'photos':
        return true // Optional step
      case 'confirmation':
        return checkInData.agreedToTerms
      default:
        return false
    }
  }

  const canProceed = (): boolean => {
    const currentStepData = checkInSteps[currentStep]
    if (currentStepData.required) {
      return isStepComplete(currentStep)
    }
    return true
  }

  const handleStartLesson = async () => {
    setIsLoading(true)
    
    // Save check-in data
    const checkInPayload = {
      lessonId,
      ...checkInData,
      timestamp: new Date().toISOString()
    }
    
    // In real app, would save to backend
    console.log('Starting lesson with check-in data:', checkInPayload)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Navigate to active lesson view
    router.push(`/instructor/today`)
  }

  const renderStepContent = () => {
    const step = checkInSteps[currentStep]

    switch (step.id) {
      case 'documents':
        return (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('steps.documents.important')}</AlertTitle>
              <AlertDescription>
                {t('steps.documents.importantText')}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <Checkbox
                  checked={checkInData.documents.studentPresent}
                  onCheckedChange={(checked) =>
                    setCheckInData(prev => ({
                      ...prev,
                      documents: {
                        ...prev.documents,
                        studentPresent: checked as boolean
                      }
                    }))
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium">{t('steps.documents.studentPresent')}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('steps.documents.studentPresentDesc', {name: lesson.student.name})}
                  </p>
                </div>
                <Badge variant="destructive">{t('steps.documents.required')}</Badge>
              </label>

              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <Checkbox
                  checked={checkInData.documents.studentLicense}
                  onCheckedChange={(checked) =>
                    setCheckInData(prev => ({
                      ...prev,
                      documents: {
                        ...prev.documents,
                        studentLicense: checked as boolean
                      }
                    }))
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium">{t('steps.documents.studentLicense')}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      placeholder={t('steps.documents.licenseNumber')}
                      value={checkInData.documents.studentLicenseNumber}
                      onChange={(e) =>
                        setCheckInData(prev => ({
                          ...prev,
                          documents: {
                            ...prev.documents,
                            studentLicenseNumber: e.target.value
                          }
                        }))
                      }
                      className="max-w-xs"
                    />
                    <Badge variant="outline">{lesson.student.licenseNumber}</Badge>
                  </div>
                </div>
                <Badge variant="destructive">{t('steps.documents.required')}</Badge>
              </label>

              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <Checkbox
                  checked={checkInData.documents.studentCard}
                  onCheckedChange={(checked) =>
                    setCheckInData(prev => ({
                      ...prev,
                      documents: {
                        ...prev.documents,
                        studentCard: checked as boolean
                      }
                    }))
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium">{t('steps.documents.studentCard')}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('steps.documents.studentCardDesc')}
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <Checkbox
                  checked={checkInData.documents.medicalCert}
                  onCheckedChange={(checked) =>
                    setCheckInData(prev => ({
                      ...prev,
                      documents: {
                        ...prev.documents,
                        medicalCert: checked as boolean
                      }
                    }))
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium">{t('steps.documents.medicalCert')}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('steps.documents.medicalCertDesc')}
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100">
                <Checkbox
                  checked={checkInData.documents.identityConfirmed}
                  onCheckedChange={(checked) =>
                    setCheckInData(prev => ({
                      ...prev,
                      documents: {
                        ...prev.documents,
                        identityConfirmed: checked as boolean
                      }
                    }))
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium">{t('steps.documents.identityConfirmed')}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('steps.documents.identityConfirmedDesc', {name: lesson.student.name})}
                  </p>
                </div>
                <Badge variant="destructive">{t('steps.documents.required')}</Badge>
              </label>
            </div>
          </div>
        )

      case 'vehicle':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('steps.vehicle.mileageStart')}</Label>
                <Input
                  type="number"
                  placeholder={lesson.vehicle.lastMileage.toString()}
                  value={checkInData.vehicle.mileageStart}
                  onChange={(e) =>
                    setCheckInData(prev => ({
                      ...prev,
                      vehicle: {
                        ...prev.vehicle,
                        mileageStart: e.target.value
                      }
                    }))
                  }
                  className="mt-2 text-lg font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('steps.vehicle.lastMileage', {mileage: lesson.vehicle.lastMileage})}
                </p>
              </div>

              <div>
                <Label>{t('steps.vehicle.fuelLevel')}</Label>
                <Select
                  value={checkInData.vehicle.fuelLevel}
                  onValueChange={(value) =>
                    setCheckInData(prev => ({
                      ...prev,
                      vehicle: {
                        ...prev.vehicle,
                        fuelLevel: value
                      }
                    }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={t('steps.vehicle.selectLevel')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">{t('steps.vehicle.fuelFull')}</SelectItem>
                    <SelectItem value="3/4">{t('steps.vehicle.fuel3_4')}</SelectItem>
                    <SelectItem value="1/2">{t('steps.vehicle.fuel1_2')}</SelectItem>
                    <SelectItem value="1/4">{t('steps.vehicle.fuel1_4')}</SelectItem>
                    <SelectItem value="reserve">{t('steps.vehicle.fuelReserve')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-base mb-3 block">{t('steps.vehicle.exteriorCheck')}</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={checkInData.vehicle.exteriorClean}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({
                        ...prev,
                        vehicle: {
                          ...prev.vehicle,
                          exteriorClean: checked as boolean
                        }
                      }))
                    }
                  />
                  <span>{t('steps.vehicle.exteriorClean')}</span>
                </label>

                {!checkInData.vehicle.exteriorClean && (
                  <Textarea
                    placeholder={t('steps.vehicle.describeDamages')}
                    value={checkInData.vehicle.exteriorDamages}
                    onChange={(e) =>
                      setCheckInData(prev => ({
                        ...prev,
                        vehicle: {
                          ...prev.vehicle,
                          exteriorDamages: e.target.value
                        }
                      }))
                    }
                    className="mt-2"
                  />
                )}

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={checkInData.vehicle.lightsWorking}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({
                        ...prev,
                        vehicle: {
                          ...prev.vehicle,
                          lightsWorking: checked as boolean
                        }
                      }))
                    }
                  />
                  <span>{t('steps.vehicle.lightsWorking')}</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={checkInData.vehicle.tiresOk}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({
                        ...prev,
                        vehicle: {
                          ...prev.vehicle,
                          tiresOk: checked as boolean
                        }
                      }))
                    }
                  />
                  <span>{t('steps.vehicle.tiresOk')}</span>
                </label>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-base mb-3 block">{t('steps.vehicle.interiorCheck')}</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={checkInData.vehicle.interiorClean}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({
                        ...prev,
                        vehicle: {
                          ...prev.vehicle,
                          interiorClean: checked as boolean
                        }
                      }))
                    }
                  />
                  <span>{t('steps.vehicle.interiorClean')}</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={checkInData.vehicle.fluidsOk}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({
                        ...prev,
                        vehicle: {
                          ...prev.vehicle,
                          fluidsOk: checked as boolean
                        }
                      }))
                    }
                  />
                  <span>{t('steps.vehicle.fluidsOk')}</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={checkInData.vehicle.documentsPresent}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({
                        ...prev,
                        vehicle: {
                          ...prev.vehicle,
                          documentsPresent: checked as boolean
                        }
                      }))
                    }
                  />
                  <span>{t('steps.vehicle.documentsPresent')}</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={checkInData.vehicle.emergencyKitPresent}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({
                        ...prev,
                        vehicle: {
                          ...prev.vehicle,
                          emergencyKitPresent: checked as boolean
                        }
                      }))
                    }
                  />
                  <span>{t('steps.vehicle.emergencyKitPresent')}</span>
                </label>
              </div>
            </div>

            {checkInData.vehicle.issues && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  {t('steps.vehicle.issuesWarning')}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )

      case 'safety':
        return (
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>{t('steps.safety.safetyFirst')}</AlertTitle>
              <AlertDescription>
                {t('steps.safety.safetyFirstDesc')}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label className="text-base mb-3 block">{t('steps.safety.safetySystems')}</Label>
              
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <Checkbox
                  checked={checkInData.safety.seatbeltsWorking}
                  onCheckedChange={(checked) =>
                    setCheckInData(prev => ({
                      ...prev,
                      safety: {
                        ...prev.safety,
                        seatbeltsWorking: checked as boolean
                      }
                    }))
                  }
                />
                <span>{t('steps.safety.seatbelts')}</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <Checkbox
                  checked={checkInData.safety.mirrorsAdjusted}
                  onCheckedChange={(checked) =>
                    setCheckInData(prev => ({
                      ...prev,
                      safety: {
                        ...prev.safety,
                        mirrorsAdjusted: checked as boolean
                      }
                    }))
                  }
                />
                <span>{t('steps.safety.mirrors')}</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <Checkbox
                  checked={checkInData.safety.brakesChecked}
                  onCheckedChange={(checked) =>
                    setCheckInData(prev => ({
                      ...prev,
                      safety: {
                        ...prev.safety,
                        brakesChecked: checked as boolean
                      }
                    }))
                  }
                />
                <span>{t('steps.safety.brakes')}</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <Checkbox
                  checked={checkInData.safety.handbrakeWorking}
                  onCheckedChange={(checked) =>
                    setCheckInData(prev => ({
                      ...prev,
                      safety: {
                        ...prev.safety,
                        handbrakeWorking: checked as boolean
                      }
                    }))
                  }
                />
                <span>{t('steps.safety.handbrake')}</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <Checkbox
                  checked={checkInData.safety.hornWorking}
                  onCheckedChange={(checked) =>
                    setCheckInData(prev => ({
                      ...prev,
                      safety: {
                        ...prev.safety,
                        hornWorking: checked as boolean
                      }
                    }))
                  }
                />
                <span>{t('steps.safety.horn')}</span>
              </label>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-base mb-3 block">{t('steps.safety.studentBriefing')}</Label>
              
              <label className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100">
                <Checkbox
                  checked={checkInData.safety.studentBriefed}
                  onCheckedChange={(checked) =>
                    setCheckInData(prev => ({
                      ...prev,
                      safety: {
                        ...prev.safety,
                        studentBriefed: checked as boolean
                      }
                    }))
                  }
                />
                <span className="font-medium">{t('steps.safety.briefed')}</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100">
                <Checkbox
                  checked={checkInData.safety.emergencyProcedures}
                  onCheckedChange={(checked) =>
                    setCheckInData(prev => ({
                      ...prev,
                      safety: {
                        ...prev.safety,
                        emergencyProcedures: checked as boolean
                      }
                    }))
                  }
                />
                <span className="font-medium">{t('steps.safety.emergencyProcedures')}</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100">
                <Checkbox
                  checked={checkInData.safety.phoneOnSilent}
                  onCheckedChange={(checked) =>
                    setCheckInData(prev => ({
                      ...prev,
                      safety: {
                        ...prev.safety,
                        phoneOnSilent: checked as boolean
                      }
                    }))
                  }
                />
                <span className="font-medium">{t('steps.safety.phoneOnSilent')}</span>
              </label>
            </div>
          </div>
        )

      case 'photos':
        return (
          <div className="space-y-4">
            <Alert>
              <Camera className="h-4 w-4" />
              <AlertDescription>
                {t('steps.photos.instruction')}
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              {['front', 'back', 'left', 'right', 'interior', 'dashboard'].map((side) => (
                <div key={side}>
                  <Label className="mb-2 block capitalize">
                    {t(`steps.photos.${side}`)}
                  </Label>
                  {checkInData.photos[side as keyof typeof checkInData.photos] ? (
                    <div className="relative">
                      <img
                        src={checkInData.photos[side as keyof typeof checkInData.photos] as string}
                        alt={side}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          setCheckInData(prev => ({
                            ...prev,
                            photos: {
                              ...prev.photos,
                              [side]: null
                            }
                          }))
                        }
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePhotoCapture(side)}
                      className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Camera className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">{t('buttons.takePhoto')}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileSelect}
            />

            <div>
              <Label>{t('steps.photos.damagesTitle')}</Label>
              <button
                onClick={() => handlePhotoCapture('damage')}
                className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 hover:bg-red-50 transition-colors mt-2"
              >
                <AlertTriangle className="w-6 h-6 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">{t('buttons.addDamagePhotos')}</span>
              </button>
            </div>
          </div>
        )

      case 'confirmation':
        return (
          <div className="space-y-4">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{t('steps.confirmation.summary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">{t('steps.confirmation.student')}</span>
                  <span className="font-medium">{lesson.student.name}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">{t('steps.confirmation.lessonType')}</span>
                  <Badge>{t('steps.confirmation.practiceCity')}</Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">{t('steps.confirmation.time')}</span>
                  <span className="font-medium">{lesson.startTime} ({t('minutes', {duration: lesson.duration})})</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">{t('steps.confirmation.vehicle')}</span>
                  <span className="font-medium">{lesson.vehicle.model} • {lesson.vehicle.number}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">{t('steps.confirmation.initialMileage')}</span>
                  <span className="font-medium">{checkInData.vehicle.mileageStart || lesson.vehicle.lastMileage} км</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">{t('steps.confirmation.fuel')}</span>
                  <span className="font-medium">{checkInData.vehicle.fuelLevel || t('steps.confirmation.notSpecified')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Check results */}
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="p-4 text-center">
                  {isStepComplete(0) ? (
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  )}
                  <p className="text-sm font-medium">{t('steps.confirmation.documents')}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  {isStepComplete(1) ? (
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  )}
                  <p className="text-sm font-medium">{t('steps.confirmation.vehicle')}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  {isStepComplete(2) ? (
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  )}
                  <p className="text-sm font-medium">{t('steps.confirmation.safety')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Notes */}
            <div>
              <Label>{t('steps.confirmation.additionalNotes')}</Label>
              <Textarea
                placeholder={t('steps.confirmation.notesPlaceholder')}
                value={checkInData.notes}
                onChange={(e) =>
                  setCheckInData(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))
                }
                className="mt-2"
                rows={3}
              />
            </div>

            {/* Agreement */}
            <label className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100">
              <Checkbox
                checked={checkInData.agreedToTerms}
                onCheckedChange={(checked) =>
                  setCheckInData(prev => ({
                    ...prev,
                    agreedToTerms: checked as boolean
                  }))
                }
                className="mt-1"
              />
              <div>
                <p className="font-medium text-sm">
                  {t('steps.confirmation.agreement')}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {t('steps.confirmation.agreementDesc')}
                </p>
              </div>
            </label>

            {/* GPS and Network Status */}
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {gpsEnabled ? (
                        <Navigation className="w-4 h-4 text-green-500" />
                      ) : (
                        <Navigation className="w-4 h-4 text-red-500" />
                      )}
                      <span className={gpsEnabled ? 'text-green-600' : 'text-red-600'}>
                        {gpsEnabled ? t('steps.confirmation.gpsActive') : t('steps.confirmation.gpsUnavailable')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isOnline ? (
                        <Wifi className="w-4 h-4 text-green-500" />
                      ) : (
                        <WifiOff className="w-4 h-4 text-red-500" />
                      )}
                      <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                        {isOnline ? t('steps.confirmation.online') : t('steps.confirmation.offline')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4 text-gray-500" />
                      <span>{batteryLevel}%</span>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {format(new Date(), 'HH:mm:ss')}
                  </Badge>
                </div>
                {checkInData.location && (
                  <p className="text-xs text-gray-500 mt-2">
                    {t('steps.confirmation.coordinates')} {checkInData.location.coords.latitude.toFixed(6)}, {checkInData.location.coords.longitude.toFixed(6)}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('subtitle')}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <X className="w-4 h-4 mr-2" />
          {t('buttons.cancel')}
        </Button>
      </div>

      {/* Student Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={lesson.student.avatar} />
                <AvatarFallback>{lesson.student.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{lesson.student.name}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {lesson.student.phone}
                  </span>
                  <Badge variant="outline">{lesson.student.category}</Badge>
                  <span>{t('student.lessons', {count: lesson.student.lessonsCompleted})}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{t('student.progress')}</p>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={lesson.student.progress} className="w-24 h-2" />
                <span className="text-sm font-medium">{lesson.student.progress}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <CardTitle>{t('steps.title')}</CardTitle>
          <CardDescription>
            {t('steps.current', {current: currentStep + 1, total: checkInSteps.length})}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            {checkInSteps.map((step, index) => {
              const Icon = step.icon
              const isComplete = index < currentStep || (index === currentStep && isStepComplete(index))
              const isCurrent = index === currentStep
              const isPending = index > currentStep

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full transition-all",
                    isComplete && "bg-green-500 text-white",
                    isCurrent && !isComplete && "bg-blue-500 text-white",
                    isPending && "bg-gray-200 text-gray-400"
                  )}>
                    {isComplete ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < checkInSteps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-1 mx-2 transition-all",
                      index < currentStep ? "bg-green-500" : "bg-gray-200"
                    )} />
                  )}
                </div>
              )
            })}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              {checkInSteps[currentStep].title}
            </h3>
            <p className="text-gray-600">
              {checkInSteps[currentStep].description}
            </p>
          </div>

          {renderStepContent()}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t('buttons.back')}
          </Button>

          {currentStep < checkInSteps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
            >
              {t('buttons.next')}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleStartLesson}
              disabled={!canProceed() || isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('buttons.starting')}
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {t('buttons.startLesson')}
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <Button variant="outline" className="w-full" onClick={() => {
              window.location.href = `tel:${lesson.student.phone}`
            }}>
              <Phone className="w-4 h-4 mr-2" />
              {t('buttons.callStudent')}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Button variant="outline" className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              {t('buttons.message')}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Warning for offline mode */}
      {!isOnline && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">{t('offlineMode.title')}</AlertTitle>
          <AlertDescription className="text-yellow-700">
            {t('offlineMode.description')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}