// /app/[locale]/instructor/vehicle/inspection/page.tsx
'use client'

import { useState } from 'react'
import { 
  CheckCircle, XCircle, AlertCircle, AlertTriangle, Car,
  Gauge, Battery, Droplets, Wind, Eye, Volume2,
  Shield, Wrench, Save, Clock, Camera, FileText
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

export default function VehicleInspectionPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [inspectionNotes, setInspectionNotes] = useState('')
  
  // Inspection state
  const [inspection, setInspection] = useState({
    // Exterior
    exterior: {
      bodyCondition: 'good',
      paintCondition: 'good',
      windowsClean: false,
      lightsWorking: false,
      mirrorsClean: false,
      tiresCondition: 'good',
      tirePressure: false,
      issues: []
    },
    // Interior
    interior: {
      seatsCondition: 'good',
      seatbeltsWorking: false,
      dashboardClean: false,
      controlsWorking: false,
      acHeatingWorking: false,
      audioWorking: false,
      cleanlinessLevel: 'clean',
      issues: []
    },
    // Engine
    engine: {
      oilLevel: 'normal',
      coolantLevel: 'normal',
      brakeFluidLevel: 'normal',
      windshieldFluid: false,
      batteryCondition: 'good',
      beltsCondition: 'good',
      noLeaks: false,
      issues: []
    },
    // Safety
    safety: {
      brakeTest: false,
      emergencyBrake: false,
      hornWorking: false,
      seatbelts: false,
      airbagIndicator: false,
      firstAidKit: false,
      fireExtinguisher: false,
      warningTriangle: false,
      issues: []
    },
    // Documents
    documents: {
      registration: false,
      insurance: false,
      inspection: false,
      driverLicense: false,
      vehicleManual: false,
      issues: []
    }
  })

  // Vehicle info
  const vehicle = {
    model: 'Toyota Corolla',
    number: 'AA 1234 AA',
    year: 2020,
    mileage: 125467,
    lastInspection: '2024-02-01'
  }

  // Previous inspections
  const previousInspections = [
    {
      id: 1,
      date: '2024-02-01',
      type: 'Щоденна',
      status: 'passed',
      issues: 0,
      inspector: 'Петро Водій'
    },
    {
      id: 2,
      date: '2024-01-31',
      type: 'Щоденна',
      status: 'passed',
      issues: 1,
      inspector: 'Петро Водій'
    },
    {
      id: 3,
      date: '2024-01-30',
      type: 'Щоденна',
      status: 'warning',
      issues: 2,
      inspector: 'Петро Водій'
    }
  ]

  const inspectionSteps = [
    { title: 'Зовнішній огляд', icon: Car },
    { title: 'Салон', icon: Eye },
    { title: 'Двигун', icon: Gauge },
    { title: 'Безпека', icon: Shield },
    { title: 'Документи', icon: FileText }
  ]

  const calculateInspectionScore = () => {
    let totalChecks = 0
    let passedChecks = 0

    // Count exterior checks
    Object.values(inspection.exterior).forEach(value => {
      if (typeof value === 'boolean') {
        totalChecks++
        if (value) passedChecks++
      } else if (value === 'good' || value === 'normal' || value === 'clean') {
        totalChecks++
        passedChecks++
      } else if (value !== undefined && Array.isArray(value) === false) {
        totalChecks++
      }
    })

    // Similar for other categories...
    
    return Math.round((passedChecks / totalChecks) * 100)
  }

  const handleSaveInspection = () => {
    const inspectionData = {
      date: new Date(),
      vehicle: vehicle,
      inspection: inspection,
      notes: inspectionNotes,
      score: calculateInspectionScore()
    }
    console.log('Saving inspection:', inspectionData)
  }

  const addIssue = (category: string, issue: string) => {
    setInspection(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        issues: [...prev[category as keyof typeof prev].issues, issue]
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Інспекція автомобіля</h1>
          <p className="text-gray-600 mt-1">
            {vehicle.model} • {vehicle.number} • {vehicle.mileage} км
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Clock className="w-4 h-4 mr-2" />
            Історія
          </Button>
          <Button onClick={handleSaveInspection}>
            <Save className="w-4 h-4 mr-2" />
            Зберегти
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Прогрес інспекції</span>
            <span className="text-sm font-medium">{currentStep + 1} з {inspectionSteps.length}</span>
          </div>
          <Progress value={(currentStep + 1) / inspectionSteps.length * 100} className="h-2" />
          <div className="flex justify-between mt-4">
            {inspectionSteps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full mb-2
                    ${index < currentStep ? 'bg-green-100 text-green-600' : ''}
                    ${index === currentStep ? 'bg-blue-100 text-blue-600' : ''}
                    ${index > currentStep ? 'bg-gray-100' : ''}
                  `}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className="text-xs hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={`step-${currentStep}`} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {inspectionSteps.map((step, index) => (
            <TabsTrigger
              key={index}
              value={`step-${index}`}
              onClick={() => setCurrentStep(index)}
            >
              {step.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Exterior Inspection */}
        <TabsContent value="step-0" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Зовнішній огляд</CardTitle>
              <CardDescription>Перевірте зовнішній стан автомобіля</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Стан кузова</Label>
                  <RadioGroup
                    value={inspection.exterior.bodyCondition}
                    onValueChange={(value) =>
                      setInspection(prev => ({
                        ...prev,
                        exterior: { ...prev.exterior, bodyCondition: value }
                      }))
                    }
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="body-good" />
                      <Label htmlFor="body-good">✅ Добрий - без пошкоджень</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="minor" id="body-minor" />
                      <Label htmlFor="body-minor">⚠️ Незначні подряпини</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="major" id="body-major" />
                      <Label htmlFor="body-major">❌ Значні пошкодження</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Перевірка компонентів</Label>
                  
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <Checkbox
                      checked={inspection.exterior.windowsClean}
                      onCheckedChange={(checked) =>
                        setInspection(prev => ({
                          ...prev,
                          exterior: { ...prev.exterior, windowsClean: checked as boolean }
                        }))
                      }
                    />
                    <span>Вікна чисті та без тріщин</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <Checkbox
                      checked={inspection.exterior.lightsWorking}
                      onCheckedChange={(checked) =>
                        setInspection(prev => ({
                          ...prev,
                          exterior: { ...prev.exterior, lightsWorking: checked as boolean }
                        }))
                      }
                    />
                    <span>Всі фари працюють (ближнє/дальнє/поворотники/стоп)</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <Checkbox
                      checked={inspection.exterior.mirrorsClean}
                      onCheckedChange={(checked) =>
                        setInspection(prev => ({
                          ...prev,
                          exterior: { ...prev.exterior, mirrorsClean: checked as boolean }
                        }))
                      }
                    />
                    <span>Дзеркала чисті та правильно налаштовані</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <Checkbox
                      checked={inspection.exterior.tirePressure}
                      onCheckedChange={(checked) =>
                        setInspection(prev => ({
                          ...prev,
                          exterior: { ...prev.exterior, tirePressure: checked as boolean }
                        }))
                      }
                    />
                    <span>Тиск в шинах відповідає нормі</span>
                  </label>
                </div>

                <div>
                  <Label>Стан шин</Label>
                  <RadioGroup
                    value={inspection.exterior.tiresCondition}
                    onValueChange={(value) =>
                      setInspection(prev => ({
                        ...prev,
                        exterior: { ...prev.exterior, tiresCondition: value }
                      }))
                    }
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="tires-good" />
                      <Label htmlFor="tires-good">Добрий протектор ({'>'}4мм)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="worn" id="tires-worn" />
                      <Label htmlFor="tires-worn">Зношені (2-4мм)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="replace" id="tires-replace" />
                      <Label htmlFor="tires-replace">Потрібна заміна ({'>'}2мм)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interior Inspection */}
        <TabsContent value="step-1" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Огляд салону</CardTitle>
              <CardDescription>Перевірте стан та чистоту салону</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Перевірка компонентів</Label>
                  
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <Checkbox
                      checked={inspection.interior.seatbeltsWorking}
                      onCheckedChange={(checked) =>
                        setInspection(prev => ({
                          ...prev,
                          interior: { ...prev.interior, seatbeltsWorking: checked as boolean }
                        }))
                      }
                    />
                    <span>Ремені безпеки справні</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <Checkbox
                      checked={inspection.interior.dashboardClean}
                      onCheckedChange={(checked) =>
                        setInspection(prev => ({
                          ...prev,
                          interior: { ...prev.interior, dashboardClean: checked as boolean }
                        }))
                      }
                    />
                    <span>Приладова панель чиста</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <Checkbox
                      checked={inspection.interior.controlsWorking}
                      onCheckedChange={(checked) =>
                        setInspection(prev => ({
                          ...prev,
                          interior: { ...prev.interior, controlsWorking: checked as boolean }
                        }))
                      }
                    />
                    <span>Всі кнопки та перемикачі працюють</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <Checkbox
                      checked={inspection.interior.acHeatingWorking}
                      onCheckedChange={(checked) =>
                        setInspection(prev => ({
                          ...prev,
                          interior: { ...prev.interior, acHeatingWorking: checked as boolean }
                        }))
                      }
                    />
                    <span>Кондиціонер/обігрів працює</span>
                  </label>
                </div>

                <div>
                  <Label>Рівень чистоти</Label>
                  <RadioGroup
                    value={inspection.interior.cleanlinessLevel}
                    onValueChange={(value) =>
                      setInspection(prev => ({
                        ...prev,
                        interior: { ...prev.interior, cleanlinessLevel: value }
                      }))
                    }
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="clean" id="clean" />
                      <Label htmlFor="clean">Чистий</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="acceptable" id="acceptable" />
                      <Label htmlFor="acceptable">Прийнятний</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dirty" id="dirty" />
                      <Label htmlFor="dirty">Потребує прибирання</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engine Inspection */}
        <TabsContent value="step-2" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Перевірка двигуна</CardTitle>
              <CardDescription>Перевірте рівні рідин та стан двигуна</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Увага!</AlertTitle>
                <AlertDescription>
                  Перевірку двигуна проводити тільки при вимкненому та охолодженому двигуні
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Рівень масла</Label>
                    <RadioGroup
                      value={inspection.engine.oilLevel}
                      onValueChange={(value) =>
                        setInspection(prev => ({
                          ...prev,
                          engine: { ...prev.engine, oilLevel: value }
                        }))
                      }
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normal" id="oil-normal" />
                        <Label htmlFor="oil-normal">Нормальний</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="oil-low" />
                        <Label htmlFor="oil-low">Низький</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="critical" id="oil-critical" />
                        <Label htmlFor="oil-critical">Критично низький</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Рівень охолоджуючої рідини</Label>
                    <RadioGroup
                      value={inspection.engine.coolantLevel}
                      onValueChange={(value) =>
                        setInspection(prev => ({
                          ...prev,
                          engine: { ...prev.engine, coolantLevel: value }
                        }))
                      }
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normal" id="coolant-normal" />
                        <Label htmlFor="coolant-normal">Нормальний</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="coolant-low" />
                        <Label htmlFor="coolant-low">Низький</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="critical" id="coolant-critical" />
                        <Label htmlFor="coolant-critical">Критично низький</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <Checkbox
                      checked={inspection.engine.windshieldFluid}
                      onCheckedChange={(checked) =>
                        setInspection(prev => ({
                          ...prev,
                          engine: { ...prev.engine, windshieldFluid: checked as boolean }
                        }))
                      }
                    />
                    <span>Достатній рівень омивача</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <Checkbox
                      checked={inspection.engine.noLeaks}
                      onCheckedChange={(checked) =>
                        setInspection(prev => ({
                          ...prev,
                          engine: { ...prev.engine, noLeaks: checked as boolean }
                        }))
                      }
                    />
                    <span>Відсутність витоків рідин</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safety Inspection */}
        <TabsContent value="step-3" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Перевірка безпеки</CardTitle>
              <CardDescription>Перевірте всі системи безпеки</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={inspection.safety.brakeTest}
                    onCheckedChange={(checked) =>
                      setInspection(prev => ({
                        ...prev,
                        safety: { ...prev.safety, brakeTest: checked as boolean }
                      }))
                    }
                  />
                  <span>Робочі гальма працюють ефективно</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={inspection.safety.emergencyBrake}
                    onCheckedChange={(checked) =>
                      setInspection(prev => ({
                        ...prev,
                        safety: { ...prev.safety, emergencyBrake: checked as boolean }
                      }))
                    }
                  />
                  <span>Стоянкове гальмо утримує автомобіль</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={inspection.safety.hornWorking}
                    onCheckedChange={(checked) =>
                      setInspection(prev => ({
                        ...prev,
                        safety: { ...prev.safety, hornWorking: checked as boolean }
                      }))
                    }
                  />
                  <span>Звуковий сигнал працює</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={inspection.safety.firstAidKit}
                    onCheckedChange={(checked) =>
                      setInspection(prev => ({
                        ...prev,
                        safety: { ...prev.safety, firstAidKit: checked as boolean }
                      }))
                    }
                  />
                  <span>Аптечка наявна та укомплектована</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={inspection.safety.fireExtinguisher}
                    onCheckedChange={(checked) =>
                      setInspection(prev => ({
                        ...prev,
                        safety: { ...prev.safety, fireExtinguisher: checked as boolean }
                      }))
                    }
                  />
                  <span>Вогнегасник наявний та не прострочений</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={inspection.safety.warningTriangle}
                    onCheckedChange={(checked) =>
                      setInspection(prev => ({
                        ...prev,
                        safety: { ...prev.safety, warningTriangle: checked as boolean }
                      }))
                    }
                  />
                  <span>Знак аварійної зупинки наявний</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Check */}
        <TabsContent value="step-4" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Перевірка документів</CardTitle>
              <CardDescription>Переконайтесь в наявності всіх необхідних документів</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={inspection.documents.registration}
                    onCheckedChange={(checked) =>
                      setInspection(prev => ({
                        ...prev,
                        documents: { ...prev.documents, registration: checked as boolean }
                      }))
                    }
                  />
                  <span>Свідоцтво про реєстрацію ТЗ</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={inspection.documents.insurance}
                    onCheckedChange={(checked) =>
                      setInspection(prev => ({
                        ...prev,
                        documents: { ...prev.documents, insurance: checked as boolean }
                      }))
                    }
                  />
                  <span>Страховий поліс (дійсний)</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={inspection.documents.inspection}
                    onCheckedChange={(checked) =>
                      setInspection(prev => ({
                        ...prev,
                        documents: { ...prev.documents, inspection: checked as boolean }
                      }))
                    }
                  />
                  <span>Техогляд (дійсний)</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <Checkbox
                    checked={inspection.documents.driverLicense}
                    onCheckedChange={(checked) =>
                      setInspection(prev => ({
                        ...prev,
                        documents: { ...prev.documents, driverLicense: checked as boolean }
                      }))
                    }
                  />
                  <span>Посвідчення водія</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notes and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Додаткові нотатки</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Вкажіть будь-які додаткові спостереження або проблеми..."
            value={inspectionNotes}
            onChange={(e) => setInspectionNotes(e.target.value)}
            className="h-24"
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Назад
        </Button>
        {currentStep < inspectionSteps.length - 1 ? (
          <Button onClick={() => setCurrentStep(currentStep + 1)}>
            Далі
          </Button>
        ) : (
          <Button onClick={handleSaveInspection}>
            Завершити інспекцію
          </Button>
        )}
      </div>

      {/* Previous Inspections */}
      <Card>
        <CardHeader>
          <CardTitle>Попередні інспекції</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {previousInspections.map((inspection) => (
              <div
                key={inspection.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{inspection.type}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(inspection.date), 'd MMMM yyyy', { locale: uk })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {inspection.issues > 0 && (
                    <Badge variant="outline">{inspection.issues} проблем</Badge>
                  )}
                  <Badge variant={
                    inspection.status === 'passed' ? 'default' :
                    inspection.status === 'warning' ? 'secondary' :
                    'destructive'
                  }>
                    {inspection.status === 'passed' ? 'Пройдено' :
                     inspection.status === 'warning' ? 'З зауваженнями' :
                     'Не пройдено'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}