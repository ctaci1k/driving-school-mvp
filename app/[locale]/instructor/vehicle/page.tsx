// /app/[locale]/instructor/vehicle/page.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Car, Fuel, Gauge, AlertTriangle, CheckCircle, Clock,
  FileText, Calendar, MapPin, Settings, Wrench, Shield,
  Camera, Upload, Download, AlertCircle, Battery, 
  Thermometer, Wind, Droplets, Info, TrendingUp,
  Heart, RefreshCw, FileCheck, ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

export default function InstructorVehicle() {
  const router = useRouter()
  const [mileageInput, setMileageInput] = useState('')
  const [fuelInput, setFuelInput] = useState('')

  // Vehicle data
  const vehicle = {
    id: '1',
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    registrationNumber: 'AA 1234 AA',
    vin: 'JT2BG22K1Y0123456',
    color: 'Srebrny',
    transmission: 'Manualna',
    fuelType: 'Benzyna',
    engineSize: '1.8L',
    
    // Current status
    status: 'active',
    currentMileage: 125467,
    todayMileage: 87,
    fuelLevel: 65,
    
    // Maintenance
    lastServiceMileage: 120000,
    nextServiceMileage: 130000,
    nextServiceDate: '2024-03-15',
    oilChangeIn: 4533,
    tireRotationIn: 2467,
    
    // Documents
    insuranceExpiry: '2024-06-15',
    inspectionExpiry: '2024-08-20',
    registrationExpiry: '2024-12-31',
    
    // Health metrics
    engineHealth: 92,
    transmissionHealth: 88,
    brakesHealth: 75,
    tiresHealth: 70,
    batteryHealth: 85,
    overallHealth: 82
  }

  // Daily checklist items
  const [dailyChecks, setDailyChecks] = useState({
    exteriorInspection: false,
    interiorCleanliness: false,
    lightsCheck: false,
    tiresCheck: false,
    fluidsCheck: false,
    brakesTest: false,
    documentsPresent: false,
    firstAidKit: false,
    fireExtinguisher: false,
    warningTriangle: false
  })

  // Mileage history
  const mileageHistory = [
    { date: '28.01', mileage: 125100, daily: 92 },
    { date: '29.01', mileage: 125185, daily: 85 },
    { date: '30.01', mileage: 125270, daily: 85 },
    { date: '31.01', mileage: 125380, daily: 110 },
    { date: '01.02', mileage: 125380, daily: 0 },
    { date: '02.02', mileage: 125467, daily: 87 },
    { date: '03.02', mileage: 125467, daily: 0 }
  ]

  // Fuel consumption history
  const fuelHistory = [
    { date: '28.01', consumption: 7.2, cost: 420 },
    { date: '29.01', consumption: 6.8, cost: 400 },
    { date: '30.01', consumption: 6.9, cost: 410 },
    { date: '31.01', consumption: 7.5, cost: 450 },
    { date: '01.02', consumption: 0, cost: 0 },
    { date: '02.02', consumption: 7.1, cost: 430 },
    { date: '03.02', consumption: 0, cost: 0 }
  ]

  // Recent issues
  const recentIssues = [
    {
      id: 1,
      date: '2024-01-25',
      category: 'Opony',
      description: 'Niskie ciśnienie w przednim lewym kole',
      severity: 'low',
      status: 'resolved',
      resolvedDate: '2024-01-25'
    },
    {
      id: 2,
      date: '2024-01-20',
      category: 'Oświetlenie',
      description: 'Nie działa lewy reflektor mijania',
      severity: 'medium',
      status: 'resolved',
      resolvedDate: '2024-01-21'
    }
  ]

  // Maintenance history
  const maintenanceHistory = [
    {
      id: 1,
      date: '2024-01-15',
      type: 'Przegląd okresowy',
      mileage: 120000,
      cost: 3500,
      items: ['Wymiana oleju', 'Wymiana filtrów', 'Kontrola hamulców']
    },
    {
      id: 2,
      date: '2023-10-20',
      type: 'Wymiana opon',
      mileage: 115000,
      cost: 8000,
      items: ['Opony zimowe (4 szt.)']
    }
  ]

  const handleUpdateMileage = () => {
    console.log('Updating mileage:', mileageInput)
    setMileageInput('')
  }

  const handleChecklistSubmit = () => {
    console.log('Daily checks:', dailyChecks)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mój pojazd</h1>
          <p className="text-gray-600 mt-1">
            {vehicle.make} {vehicle.model} • {vehicle.registrationNumber}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Raport
          </Button>
          <Button 
            variant="destructive"
            onClick={() => router.push('/instructor/vehicle/report-issue')}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Zgłoś problem
          </Button>
        </div>
      </div>

      {/* Vehicle Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Informacje o pojeździe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Marka/Model</p>
              <p className="font-semibold">{vehicle.make} {vehicle.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rok produkcji</p>
              <p className="font-semibold">{vehicle.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Skrzynia biegów</p>
              <p className="font-semibold">{vehicle.transmission}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Paliwo</p>
              <p className="font-semibold">{vehicle.fuelType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Kolor</p>
              <p className="font-semibold">{vehicle.color}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pojemność silnika</p>
              <p className="font-semibold">{vehicle.engineSize}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">VIN</p>
              <p className="font-semibold text-xs">{vehicle.vin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge variant="default">Aktywny</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mileage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Przebieg</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-3xl font-bold">{vehicle.currentMileage.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">km</span>
                </div>
                <p className="text-sm text-gray-600">+{vehicle.todayMileage} km dzisiaj</p>
              </div>

              <div>
                <Label>Aktualizuj przebieg</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    placeholder="Nowy przebieg"
                    value={mileageInput}
                    onChange={(e) => setMileageInput(e.target.value)}
                  />
                  <Button onClick={handleUpdateMileage} disabled={!mileageInput}>
                    Aktualizuj
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fuel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Paliwo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Fuel className={`w-8 h-8 ${vehicle.fuelLevel < 25 ? 'text-red-500' : 'text-green-500'}`} />
                  <span className="text-3xl font-bold">{vehicle.fuelLevel}%</span>
                </div>
                <Progress value={vehicle.fuelLevel} className={`h-3 ${vehicle.fuelLevel < 25 ? 'bg-red-100' : ''}`} />
                {vehicle.fuelLevel < 25 && (
                  <p className="text-sm text-red-600 mt-2">Niski poziom paliwa!</p>
                )}
              </div>

              <div>
                <Label>Zużycie</Label>
                <p className="text-sm text-gray-600 mt-1">7.2 l/100km (średnie)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stan pojazdu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{vehicle.overallHealth}%</span>
                <div className={`p-3 rounded-lg ${
                  vehicle.overallHealth >= 80 ? 'bg-green-100' : 
                  vehicle.overallHealth >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <Heart className={`w-6 h-6 ${
                    vehicle.overallHealth >= 80 ? 'text-green-600' : 
                    vehicle.overallHealth >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Silnik</span>
                  <span className="font-medium">{vehicle.engineHealth}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hamulce</span>
                  <span className="font-medium text-yellow-600">{vehicle.brakesHealth}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Opony</span>
                  <span className="font-medium text-yellow-600">{vehicle.tiresHealth}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance & Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle>Nadchodzące serwisowanie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Przegląd okresowy</AlertTitle>
                <AlertDescription>
                  Za {vehicle.nextServiceMileage - vehicle.currentMileage} km lub {format(new Date(vehicle.nextServiceDate), 'd MMMM', { locale: pl })}
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded">
                      <Droplets className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">Wymiana oleju</p>
                      <p className="text-sm text-gray-500">Za {vehicle.oilChangeIn} km</p>
                    </div>
                  </div>
                  <Progress value={75} className="w-20 h-2" />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded">
                      <RefreshCw className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Rotacja opon</p>
                      <p className="text-sm text-gray-500">Za {vehicle.tireRotationIn} km</p>
                    </div>
                  </div>
                  <Progress value={85} className="w-20 h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Dokumenty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Ubezpieczenie</p>
                    <p className="text-sm text-gray-500">Do {format(new Date(vehicle.insuranceExpiry), 'dd.MM.yyyy')}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600">
                  Ważne
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">Przegląd techniczny</p>
                    <p className="text-sm text-gray-500">Do {format(new Date(vehicle.inspectionExpiry), 'dd.MM.yyyy')}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600">
                  Ważny
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Rejestracja</p>
                    <p className="text-sm text-gray-500">Do {format(new Date(vehicle.registrationExpiry), 'dd.MM.yyyy')}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600">
                  Ważna
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="checklist" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checklist">Codzienna kontrola</TabsTrigger>
          <TabsTrigger value="history">Historia</TabsTrigger>
          <TabsTrigger value="statistics">Statystyki</TabsTrigger>
          <TabsTrigger value="maintenance">Serwisowanie</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Codzienna kontrola</CardTitle>
              <CardDescription>Sprawdź wszystkie punkty przed rozpoczęciem pracy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(dailyChecks).map(([key, checked]) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(value) => 
                          setDailyChecks(prev => ({ ...prev, [key]: value as boolean }))
                        }
                      />
                      <span className="flex-1">
                        {key === 'exteriorInspection' && 'Kontrola zewnętrzna nadwozia'}
                        {key === 'interiorCleanliness' && 'Czystość wnętrza'}
                        {key === 'lightsCheck' && 'Sprawdzenie wszystkich świateł'}
                        {key === 'tiresCheck' && 'Stan opon i ciśnienie'}
                        {key === 'fluidsCheck' && 'Poziom płynów'}
                        {key === 'brakesTest' && 'Test hamulców'}
                        {key === 'documentsPresent' && 'Obecność dokumentów'}
                        {key === 'firstAidKit' && 'Apteczka'}
                        {key === 'fireExtinguisher' && 'Gaśnica'}
                        {key === 'warningTriangle' && 'Trójkąt ostrzegawczy'}
                      </span>
                    </label>
                  ))}
                </div>

                <Button 
                  onClick={handleChecklistSubmit}
                  className="w-full"
                  disabled={!Object.values(dailyChecks).every(v => v)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Potwierdź kontrolę
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historia przebiegu</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mileageHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="daily" stroke="#3B82F6" name="Dzienny przebieg (km)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ostatnie problemy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentIssues.map((issue) => (
                  <div key={issue.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{issue.category}</p>
                        <Badge variant={
                          issue.severity === 'low' ? 'secondary' :
                          issue.severity === 'medium' ? 'outline' :
                          'destructive'
                        }>
                          {issue.severity === 'low' ? 'Niska' :
                           issue.severity === 'medium' ? 'Średnia' :
                           'Wysoka'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{issue.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(issue.date), 'dd.MM.yyyy')}
                        {issue.status === 'resolved' && ` • Rozwiązano ${format(new Date(issue.resolvedDate), 'dd.MM.yyyy')}`}
                      </p>
                    </div>
                    <Badge variant={issue.status === 'resolved' ? 'default' : 'secondary'}>
                      {issue.status === 'resolved' ? 'Rozwiązano' : 'Aktywny'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Zużycie paliwa</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={fuelHistory}>
                    <defs>
                      <linearGradient id="colorFuel" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="consumption" stroke="#3B82F6" fillOpacity={1} fill="url(#colorFuel)" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Średnie zużycie</p>
                    <p className="text-lg font-bold">7.1 l/100km</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Koszty paliwa</p>
                    <p className="text-lg font-bold">2,510 zł/mies.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wykorzystanie pojazdu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Średni przebieg/dzień</span>
                      <span className="font-semibold">85 km</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Godziny pracy/dzień</span>
                      <span className="font-semibold">6.5 godz.</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Wykorzystanie</span>
                      <span className="font-semibold">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ten miesiąc:</span>
                      <span className="font-semibold">2,340 km</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">Ten rok:</span>
                      <span className="font-semibold">25,467 km</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Prognozowany przebieg</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Za miesiąc</p>
                  <p className="text-xl font-bold">2,550 km</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Za kwartał</p>
                  <p className="text-xl font-bold">7,650 km</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Za rok</p>
                  <p className="text-xl font-bold">30,600 km</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historia serwisowania</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceHistory.map((maintenance) => (
                  <div key={maintenance.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{maintenance.type}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(maintenance.date), 'dd MMMM yyyy', { locale: pl })} • {maintenance.mileage.toLocaleString()} km
                        </p>
                      </div>
                      <p className="text-lg font-bold">{maintenance.cost.toLocaleString()} zł</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {maintenance.items.map((item, index) => (
                        <Badge key={index} variant="secondary">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Zalecenia serwisowe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Na podstawie przebiegu i historii serwisowania zalecamy:
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="font-medium">Sprawdzić klocki hamulcowe</p>
                      <p className="text-sm text-gray-600">Stan hamulców spadł do 75%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="font-medium">Planowa wymiana opon</p>
                      <p className="text-sm text-gray-600">Zużycie osiągnęło 70%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Info className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium">Wymiana filtra powietrza</p>
                      <p className="text-sm text-gray-600">Zalecana za 2,000 km</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}