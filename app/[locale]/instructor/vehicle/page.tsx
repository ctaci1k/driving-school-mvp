// app/[locale]/instructor/vehicle/page.tsx
// Головна сторінка керування транспортним засобом інструктора

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
import { uk } from 'date-fns/locale'
import { useTranslations } from 'next-intl'

export default function InstructorVehicle() {
  const t = useTranslations('instructor.vehicle.main')
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
    color: 'Сріблястий',
    transmission: 'manual',
    fuelType: 'gasoline',
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
      category: 'Шини',
      description: 'Низький тиск у передньому лівому колесі',
      severity: 'low',
      status: 'resolved',
      resolvedDate: '2024-01-25'
    },
    {
      id: 2,
      date: '2024-01-20',
      category: 'Освітлення',
      description: 'Не працює ліва фара ближнього світла',
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
      type: 'periodicInspection',
      mileage: 120000,
      cost: 3500,
      items: ['oilChange', 'filterChange', 'brakeCheck']
    },
    {
      id: 2,
      date: '2023-10-20',
      type: 'tireChange',
      mileage: 115000,
      cost: 8000,
      items: ['winterTires']
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
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('vehicleInfo', {
              make: vehicle.make,
              model: vehicle.model,
              registrationNumber: vehicle.registrationNumber
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {t('buttons.report')}
          </Button>
          <Button 
            variant="destructive"
            onClick={() => router.push('/instructor/vehicle/report-issue')}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            {t('buttons.reportIssue')}
          </Button>
        </div>
      </div>

      {/* Vehicle Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{t('overview.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">{t('overview.make')}</p>
              <p className="font-semibold">{vehicle.make} {vehicle.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('overview.year')}</p>
              <p className="font-semibold">{vehicle.year}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('overview.transmission')}</p>
              <p className="font-semibold">{t(`overview.transmissionTypes.${vehicle.transmission}`)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('overview.fuel')}</p>
              <p className="font-semibold">{t(`overview.fuelTypes.${vehicle.fuelType}`)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('overview.color')}</p>
              <p className="font-semibold">{vehicle.color}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('overview.engineSize')}</p>
              <p className="font-semibold">{vehicle.engineSize}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('overview.vin')}</p>
              <p className="font-semibold text-xs">{vehicle.vin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('overview.status')}</p>
              <Badge variant="default">{t('overview.statusActive')}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mileage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('mileage.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-3xl font-bold">{vehicle.currentMileage}</span>
                  <span className="text-sm text-gray-500">{t('mileage.km')}</span>
                </div>
                <p className="text-sm text-gray-600">{t('mileage.today', { km: vehicle.todayMileage })}</p>
              </div>

              <div>
                <Label>{t('mileage.updateLabel')}</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="number"
                    placeholder={t('mileage.placeholder')}
                    value={mileageInput}
                    onChange={(e) => setMileageInput(e.target.value)}
                  />
                  <Button onClick={handleUpdateMileage} disabled={!mileageInput}>
                    {t('buttons.update')}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fuel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('fuel.title')}</CardTitle>
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
                  <p className="text-sm text-red-600 mt-2">{t('fuel.lowLevel')}</p>
                )}
              </div>

              <div>
                <Label>{t('fuel.consumption')}</Label>
                <p className="text-sm text-gray-600 mt-1">{t('fuel.average', { value: '7.2' })}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('health.title')}</CardTitle>
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
                  <span className="text-gray-600">{t('health.engine')}</span>
                  <span className="font-medium">{vehicle.engineHealth}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('health.brakes')}</span>
                  <span className="font-medium text-yellow-600">{vehicle.brakesHealth}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('health.tires')}</span>
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
            <CardTitle>{t('maintenance.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('maintenance.periodicInspection')}</AlertTitle>
                <AlertDescription>
                  {t('maintenance.inKmOrDate', {
                    km: vehicle.nextServiceMileage - vehicle.currentMileage,
                    date: format(new Date(vehicle.nextServiceDate), 'd MMMM', { locale: uk })
                  })}
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded">
                      <Droplets className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">{t('maintenance.oilChange')}</p>
                      <p className="text-sm text-gray-500">{t('maintenance.inKm', { km: vehicle.oilChangeIn })}</p>
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
                      <p className="font-medium">{t('maintenance.tireRotation')}</p>
                      <p className="text-sm text-gray-500">{t('maintenance.inKm', { km: vehicle.tireRotationIn })}</p>
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
            <CardTitle>{t('documents.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">{t('documents.insurance')}</p>
                    <p className="text-sm text-gray-500">{t('documents.validUntil', { date: format(new Date(vehicle.insuranceExpiry), 'dd.MM.yyyy') })}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600">
                  {t('documents.valid')}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium">{t('documents.technicalInspection')}</p>
                    <p className="text-sm text-gray-500">{t('documents.validUntil', { date: format(new Date(vehicle.inspectionExpiry), 'dd.MM.yyyy') })}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600">
                  {t('documents.valid')}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-medium">{t('documents.registration')}</p>
                    <p className="text-sm text-gray-500">{t('documents.validUntil', { date: format(new Date(vehicle.registrationExpiry), 'dd.MM.yyyy') })}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600">
                  {t('documents.validFemale')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="checklist" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checklist">{t('tabs.checklist')}</TabsTrigger>
          <TabsTrigger value="history">{t('tabs.history')}</TabsTrigger>
          <TabsTrigger value="statistics">{t('tabs.statistics')}</TabsTrigger>
          <TabsTrigger value="maintenance">{t('tabs.maintenance')}</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dailyChecklist.title')}</CardTitle>
              <CardDescription>{t('dailyChecklist.subtitle')}</CardDescription>
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
                        {t(`dailyChecklist.items.${key}`)}
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
                  {t('buttons.confirmCheck')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('history.mileageHistory')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mileageHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="daily" stroke="#3B82F6" name={t('history.dailyMileage')} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('history.recentIssues')}</CardTitle>
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
                          {t(`history.severity${issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}`)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{issue.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(issue.date), 'dd.MM.yyyy')}
                        {issue.status === 'resolved' && ` • ${t('history.resolvedOn', { date: format(new Date(issue.resolvedDate), 'dd.MM.yyyy') })}`}
                      </p>
                    </div>
                    <Badge variant={issue.status === 'resolved' ? 'default' : 'secondary'}>
                      {t(`history.${issue.status}`)}
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
                <CardTitle>{t('statistics.fuelConsumption')}</CardTitle>
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
                    <p className="text-sm text-gray-500">{t('statistics.averageConsumption')}</p>
                    <p className="text-lg font-bold">7.1 л/100км</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">{t('statistics.fuelCosts')}</p>
                    <p className="text-lg font-bold">2,510 грн{t('statistics.perMonth')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('statistics.vehicleUsage')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">{t('statistics.averageMileagePerDay')}</span>
                      <span className="font-semibold">85 {t('mileage.km')}</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">{t('statistics.workHoursPerDay')}</span>
                      <span className="font-semibold">6.5 {t('statistics.hours')}</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">{t('statistics.utilization')}</span>
                      <span className="font-semibold">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('statistics.thisMonth')}</span>
                      <span className="font-semibold">2,340 {t('mileage.km')}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">{t('statistics.thisYear')}</span>
                      <span className="font-semibold">25,467 {t('mileage.km')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('statistics.projectedMileage')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">{t('statistics.inMonth')}</p>
                  <p className="text-xl font-bold">2,550 {t('mileage.km')}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">{t('statistics.inQuarter')}</p>
                  <p className="text-xl font-bold">7,650 {t('mileage.km')}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">{t('statistics.inYear')}</p>
                  <p className="text-xl font-bold">30,600 {t('mileage.km')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('maintenanceHistory.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceHistory.map((maintenance) => (
                  <div key={maintenance.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{t(`maintenanceHistory.${maintenance.type}`)}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(maintenance.date), 'dd MMMM yyyy', { locale: uk })} • {maintenance.mileage.toLocaleString()} {t('mileage.km')}
                        </p>
                      </div>
                      <p className="text-lg font-bold">{t('maintenanceHistory.currency', { amount: maintenance.cost.toLocaleString() })}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {maintenance.items.map((item, index) => (
                        <Badge key={index} variant="secondary">
                          {t(`maintenanceHistory.items.${item}`)}
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
              <CardTitle>{t('recommendations.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {t('recommendations.based')}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="font-medium">{t('recommendations.checkBrakePads')}</p>
                      <p className="text-sm text-gray-600">{t('recommendations.brakeWear')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="font-medium">{t('recommendations.planTireChange')}</p>
                      <p className="text-sm text-gray-600">{t('recommendations.tireWear')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Info className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium">{t('recommendations.airFilterChange')}</p>
                      <p className="text-sm text-gray-600">{t('recommendations.recommendedIn', { km: '2,000' })}</p>
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