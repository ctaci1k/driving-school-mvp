// /app/[locale]/instructor/vehicle/report-issue/page.tsx

'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  AlertTriangle, Camera, Upload, Send, X, 
  ChevronLeft, Loader2, Info, Car, MapPin,
  Gauge, Calendar, AlertCircle, Image
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export default function ReportIssuePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  
  const [issueData, setIssueData] = useState({
    category: '',
    severity: 'medium',
    description: '',
    occurredAt: new Date().toISOString().slice(0, 16),
    location: '',
    mileage: '',
    affectsOperation: false,
    needsImmediateAttention: false,
    images: [] as string[],
    additionalNotes: ''
  })

  // Mock vehicle data
  const vehicle = {
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    registrationNumber: 'AA 1234 AA',
    currentMileage: 125467
  }

  const issueCategories = [
    { value: 'engine', label: 'Silnik', icon: '🔧' },
    { value: 'transmission', label: 'Skrzynia biegów', icon: '⚙️' },
    { value: 'brakes', label: 'Hamulce', icon: '🛑' },
    { value: 'suspension', label: 'Zawieszenie', icon: '🚗' },
    { value: 'electrical', label: 'Elektryka', icon: '⚡' },
    { value: 'lights', label: 'Oświetlenie', icon: '💡' },
    { value: 'tires', label: 'Opony', icon: '⭕' },
    { value: 'interior', label: 'Wnętrze', icon: '🪑' },
    { value: 'exterior', label: 'Nadwozie', icon: '🚙' },
    { value: 'fluids', label: 'Płyny', icon: '💧' },
    { value: 'other', label: 'Inne', icon: '📝' }
  ]

  const severityLevels = [
    { 
      value: 'low', 
      label: 'Niska', 
      description: 'Można kontynuować pracę',
      color: 'text-green-600 bg-green-50' 
    },
    { 
      value: 'medium', 
      label: 'Średnia', 
      description: 'Wymaga uwagi wkrótce',
      color: 'text-yellow-600 bg-yellow-50' 
    },
    { 
      value: 'high', 
      label: 'Wysoka', 
      description: 'Wymaga natychmiastowej uwagi',
      color: 'text-orange-600 bg-orange-50' 
    },
    { 
      value: 'critical', 
      label: 'Krytyczna', 
      description: 'Nie można używać pojazdu',
      color: 'text-red-600 bg-red-50' 
    }
  ]

  const commonIssues = [
    'Dziwny dźwięk podczas jazdy',
    'Wibracje kierownicy',
    'Trudności z uruchomieniem',
    'Wyciek płynu',
    'Problemy z hamowaniem',
    'Światła nie działają prawidłowo'
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (event) => {
          setUploadedImages(prev => [...prev, event.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Submitting issue:', {
      ...issueData,
      images: uploadedImages,
      vehicle
    })
    
    router.push('/instructor/vehicle')
  }

  const isFormValid = () => {
    return issueData.category && 
           issueData.description.length > 10 && 
           issueData.mileage
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zgłoś problem</h1>
          <p className="text-gray-600">
            {vehicle.make} {vehicle.model} • {vehicle.registrationNumber}
          </p>
        </div>
      </div>

      {/* Severity Alert */}
      {issueData.severity === 'critical' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Problem krytyczny!</strong> Po zgłoszeniu pojazd zostanie automatycznie wycofany z użytku do czasu naprawy.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Form */}
      <Card>
        <CardHeader>
          <CardTitle>Szczegóły problemu</CardTitle>
          <CardDescription>
            Opisz dokładnie problem, aby mechanik mógł szybko go rozwiązać
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Selection */}
          <div>
            <Label>Kategoria problemu *</Label>
            <Select 
              value={issueData.category} 
              onValueChange={(value) => setIssueData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Wybierz kategorię" />
              </SelectTrigger>
              <SelectContent>
                {issueCategories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Severity Level */}
          <div>
            <Label>Poziom krytyczności *</Label>
            <RadioGroup 
              value={issueData.severity} 
              onValueChange={(value) => setIssueData(prev => ({ ...prev, severity: value }))}
              className="mt-2 space-y-2"
            >
              {severityLevels.map(level => (
                <label 
                  key={level.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                    issueData.severity === level.value ? level.color : ''
                  }`}
                >
                  <RadioGroupItem value={level.value} className="mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{level.label}</p>
                    <p className="text-sm text-gray-600">{level.description}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Description */}
          <div>
            <Label>Opis problemu *</Label>
            <Textarea
              value={issueData.description}
              onChange={(e) => setIssueData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Opisz szczegółowo problem..."
              className="mt-2 h-32"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              <p className="text-xs text-gray-500">Szybkie opcje:</p>
              {commonIssues.map((issue, idx) => (
                <Badge 
                  key={idx}
                  variant="outline" 
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => setIssueData(prev => ({ 
                    ...prev, 
                    description: prev.description + (prev.description ? ', ' : '') + issue 
                  }))}
                >
                  {issue}
                </Badge>
              ))}
            </div>
          </div>

          {/* When and Where */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Kiedy wystąpił problem</Label>
              <Input
                type="datetime-local"
                value={issueData.occurredAt}
                onChange={(e) => setIssueData(prev => ({ ...prev, occurredAt: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Lokalizacja</Label>
              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={issueData.location}
                  onChange={(e) => setIssueData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="np. ul. Główna 15, Warszawa"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Current Mileage */}
          <div>
            <Label>Aktualny przebieg (km) *</Label>
            <div className="relative mt-2">
              <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="number"
                value={issueData.mileage}
                onChange={(e) => setIssueData(prev => ({ ...prev, mileage: e.target.value }))}
                placeholder={vehicle.currentMileage.toString()}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Ostatni znany: {vehicle.currentMileage.toLocaleString()} km
            </p>
          </div>

          {/* Critical Checkboxes */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={issueData.affectsOperation}
                onCheckedChange={(checked) => 
                  setIssueData(prev => ({ ...prev, affectsOperation: checked as boolean }))
                }
              />
              <div>
                <p className="font-medium">Problem wpływa na bezpieczną eksploatację</p>
                <p className="text-sm text-gray-600">Pojazd może stwarzać zagrożenie</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={issueData.needsImmediateAttention}
                onCheckedChange={(checked) => 
                  setIssueData(prev => ({ ...prev, needsImmediateAttention: checked as boolean }))
                }
              />
              <div>
                <p className="font-medium">Wymaga natychmiastowej uwagi</p>
                <p className="text-sm text-gray-600">Mechanik powinien sprawdzić jak najszybciej</p>
              </div>
            </label>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Zdjęcia problemu</Label>
            <div className="mt-2 space-y-4">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img 
                      src={img} 
                      alt={`Problem ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {uploadedImages.length < 6 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <Camera className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Dodaj</span>
                  </button>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />

              <p className="text-xs text-gray-500">
                Maksymalnie 6 zdjęć. Zdjęcia pomogą mechanikowi szybciej zidentyfikować problem.
              </p>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label>Dodatkowe uwagi (opcjonalne)</Label>
            <Textarea
              value={issueData.additionalNotes}
              onChange={(e) => setIssueData(prev => ({ ...prev, additionalNotes: e.target.value }))}
              placeholder="Inne istotne informacje..."
              className="mt-2 h-20"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Anuluj
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            className={issueData.severity === 'critical' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Wysyłanie...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Zgłoś problem
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Co się dzieje po zgłoszeniu?</p>
              <ul className="space-y-1 ml-4">
                <li>• Mechanik otrzymuje powiadomienie</li>
                <li>• Problem jest analizowany i priorytetyzowany</li>
                <li>• Otrzymasz informację o planowanej naprawie</li>
                <li>• W przypadku problemu krytycznego pojazd jest blokowany</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}