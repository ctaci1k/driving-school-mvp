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
import { pl } from 'date-fns/locale'

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
    number: 'WA 1234K',
    year: 2020,
    mileage: 125467,
    lastInspection: '2024-02-01'
  }

  // Previous inspections
  const previousInspections = [
    {
      id: 1,
      date: '2024-02-01',
      type: 'Codzienny',
      status: 'passed',
      issues: 0,
      inspector: 'Piotr Kierowca'
    },
    {
      id: 2,
      date: '2024-01-31',
      type: 'Codzienny',
      status: 'passed',
      issues: 1,
      inspector: 'Piotr Kierowca'
    },
    {
      id: 3,
      date: '2024-01-30',
      type: 'Codzienny',
      status: 'warning',
      issues: 2,
      inspector: 'Piotr Kierowca'
    }
  ]

  const inspectionSteps = [
    { title: 'Przegląd zewnętrzny', icon: Car },
    { title: 'Wnętrze', icon: Eye },
    { title: 'Silnik', icon: Gauge },
    { title: 'Bezpieczeństwo', icon: Shield },
    { title: 'Dokumenty', icon: FileText }
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
          <h1 className="text-2xl font-bold text-gray-900">Przegląd pojazdu</h1>
          <p className="text-gray-600 mt-1">
            {vehicle.model} • {vehicle.number} • {vehicle.mileage} km
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Clock className="w-4 h-4 mr-2" />
            Historia
          </Button>
          <Button onClick={handleSaveInspection}>
            <Save className="w-4 h-4 mr-2" />
            Zapisz
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Postęp przeglądu</span>
            <span className="text-sm font-medium">{currentStep + 1} z {inspectionSteps.length}</span>
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
              <CardTitle>Przegląd zewnętrzny</CardTitle>
              <CardDescription>Sprawdź zewnętrzny stan pojazdu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Stan karoserii</Label>
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
                      <Label htmlFor="body-good">Dobry - bez uszkodzeń</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="minor" id="body-minor" />
                      <Label htmlFor="body-minor">Drobne rysy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="major" id="body-major" />
                      <Label htmlFor="body-major">Znaczne uszkodzenia</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Sprawdzenie komponentów</Label>
                  
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
                    <span>Szyby czyste i bez pęknięć</span>
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
                    <span>Wszystkie światła działają (mijania/drogowe/kierunkowskazy/hamowania)</span>
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
                    <span>Lusterka czyste i prawidłowo ustawione</span>
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
                    <span>Ciśnienie w oponach zgodne z normą</span>
                  </label>
                </div>

                <div>
                  <Label>Stan opon</Label>
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
                      <Label htmlFor="tires-good">Dobry bieżnik (powyżej 4mm)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="worn" id="tires-worn" />
                      <Label htmlFor="tires-worn">Zużyte (2-4mm)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="replace" id="tires-replace" />
                      <Label htmlFor="tires-replace">Wymagana wymiana (poniżej 2mm)</Label>
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
              <CardTitle>Przegląd wnętrza</CardTitle>
              <CardDescription>Sprawdź stan i czystość wnętrza</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Sprawdzenie komponentów</Label>
                  
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
                    <span>Pasy bezpieczeństwa sprawne</span>
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
                    <span>Deska rozdzielcza czysta</span>
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
                    <span>Wszystkie przyciski i przełączniki działają</span>
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
                    <span>Klimatyzacja/ogrzewanie działa</span>
                  </label>
                </div>

                <div>
                  <Label>Poziom czystości</Label>
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
                      <Label htmlFor="clean">Czysty</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="acceptable" id="acceptable" />
                      <Label htmlFor="acceptable">Akceptowalny</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dirty" id="dirty" />
                      <Label htmlFor="dirty">Wymaga sprzątania</Label>
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
              <CardTitle>Sprawdzenie silnika</CardTitle>
              <CardDescription>Sprawdź poziomy płynów i stan silnika</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Uwaga!</AlertTitle>
                <AlertDescription>
                  Sprawdzenie silnika przeprowadzać tylko przy wyłączonym i ostygniętym silniku
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Poziom oleju</Label>
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
                        <Label htmlFor="oil-normal">Prawidłowy</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="oil-low" />
                        <Label htmlFor="oil-low">Niski</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="critical" id="oil-critical" />
                        <Label htmlFor="oil-critical">Krytycznie niski</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Poziom płynu chłodzącego</Label>
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
                        <Label htmlFor="coolant-normal">Prawidłowy</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="coolant-low" />
                        <Label htmlFor="coolant-low">Niski</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="critical" id="coolant-critical" />
                        <Label htmlFor="coolant-critical">Krytycznie niski</Label>
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
                    <span>Wystarczający poziom płynu do spryskiwaczy</span>
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
                    <span>Brak wycieków płynów</span>
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
              <CardTitle>Sprawdzenie bezpieczeństwa</CardTitle>
              <CardDescription>Sprawdź wszystkie systemy bezpieczeństwa</CardDescription>
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
                  <span>Hamulce robocze działają skutecznie</span>
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
                  <span>Hamulec postojowy utrzymuje pojazd</span>
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
                  <span>Klakson działa</span>
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
                  <span>Apteczka obecna i skompletowana</span>
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
                  <span>Gaśnica obecna i nieprzeterminowana</span>
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
                  <span>Trójkąt ostrzegawczy obecny</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Check */}
        <TabsContent value="step-4" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sprawdzenie dokumentów</CardTitle>
              <CardDescription>Upewnij się o obecności wszystkich wymaganych dokumentów</CardDescription>
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
                  <span>Dowód rejestracyjny</span>
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
                  <span>Polisa ubezpieczeniowa (ważna)</span>
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
                  <span>Badania techniczne (ważne)</span>
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
                  <span>Prawo jazdy</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notes and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Dodatkowe uwagi</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Podaj wszelkie dodatkowe obserwacje lub problemy..."
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
          Wstecz
        </Button>
        {currentStep < inspectionSteps.length - 1 ? (
          <Button onClick={() => setCurrentStep(currentStep + 1)}>
            Dalej
          </Button>
        ) : (
          <Button onClick={handleSaveInspection}>
            Zakończ przegląd
          </Button>
        )}
      </div>

      {/* Previous Inspections */}
      <Card>
        <CardHeader>
          <CardTitle>Poprzednie przeglądy</CardTitle>
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
                    {format(new Date(inspection.date), 'd MMMM yyyy', { locale: pl })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {inspection.issues > 0 && (
                    <Badge variant="outline">{inspection.issues} problemów</Badge>
                  )}
                  <Badge variant={
                    inspection.status === 'passed' ? 'default' :
                    inspection.status === 'warning' ? 'secondary' :
                    'destructive'
                  }>
                    {inspection.status === 'passed' ? 'Zaliczony' :
                     inspection.status === 'warning' ? 'Z uwagami' :
                     'Niezaliczony'}
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