// /app/[locale]/instructor/earnings/details/page.tsx
'use client'

import { useState } from 'react'
import { 
  DollarSign, Calendar, TrendingUp, TrendingDown, Info,
  FileText, Download, Filter, ChevronRight, Clock,
  Users, Car, Award, PieChart, BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, Legend
} from 'recharts'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

export default function EarningsDetailsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedMonth, setSelectedMonth] = useState('february')

  // Podział bieżącego okresu
  const currentPeriod = {
    period: 'Luty 2024',
    gross: 24850,
    net: 22365,
    lessons: 65,
    hours: 97.5,
    students: 15,
    
    breakdown: {
      base: 19500,  // 65 lekcji * 300
      overtime: 2000,
      bonuses: {
        quality: 1000,
        punctuality: 500,
        newStudents: 750,
        examSuccess: 600,
        total: 2850
      },
      deductions: {
        platformFee: 1485,  // 6%
        taxes: 990,  // 4%
        insurance: 10,
        total: 2485
      },
      additionalIncome: 500
    }
  }

  // Zarobki według typu lekcji
  const earningsByType = [
    { type: 'Praktyka - miasto', lessons: 30, amount: 9000, percentage: 36 },
    { type: 'Praktyka - trasa', lessons: 15, amount: 5250, percentage: 21 },
    { type: 'Przygotowanie do egzaminu', lessons: 10, amount: 4000, percentage: 16 },
    { type: 'Praktyka - plac manewrowy', lessons: 8, amount: 2400, percentage: 10 },
    { type: 'Jazda nocna', lessons: 2, amount: 800, percentage: 3 }
  ]

  // Zarobki według kursantów
  const earningsByStudent = [
    { name: 'Maria Kowalska', lessons: 12, amount: 3600, status: 'active' },
    { name: 'Jan Nowak', lessons: 10, amount: 3000, status: 'active' },
    { name: 'Anna Wiśniewska', lessons: 9, amount: 2700, status: 'active' },
    { name: 'Andrzej Kowalczyk', lessons: 8, amount: 2400, status: 'active' },
    { name: 'Natalia Lewandowska', lessons: 7, amount: 2100, status: 'active' }
  ]

  // Dzienne zarobki dla wykresu
  const dailyEarnings = [
    { day: '1', amount: 1200, lessons: 3 },
    { day: '2', amount: 1800, lessons: 4 },
    { day: '3', amount: 900, lessons: 2 },
    { day: '4', amount: 2100, lessons: 5 },
    { day: '5', amount: 1500, lessons: 4 },
    { day: '6', amount: 2400, lessons: 6 },
    { day: '7', amount: 0, lessons: 0 }
  ]

  // Historia bonusów
  const bonusesHistory = [
    {
      id: 1,
      type: 'quality',
      title: 'Bonus za jakość',
      description: 'Ocena 4.9+ przez cały miesiąc',
      amount: 1000,
      status: 'received',
      date: '2024-02-28'
    },
    {
      id: 2,
      type: 'punctuality',
      title: 'Bonus za punktualność',
      description: '100% terminowych zajęć',
      amount: 500,
      status: 'received',
      date: '2024-02-28'
    },
    {
      id: 3,
      type: 'newStudents',
      title: 'Bonus za nowych kursantów',
      description: '3 nowych kursantów',
      amount: 750,
      status: 'pending',
      date: '2024-02-28'
    },
    {
      id: 4,
      type: 'examSuccess',
      title: 'Bonus za zdane egzaminy',
      description: '2 kursantów zdało egzamin',
      amount: 600,
      status: 'pending',
      date: '2024-02-28'
    }
  ]

  // Informacje podatkowe
  const taxInfo = {
    taxRate: 5,
    socialSecurity: 1.5,
    totalTaxRate: 6.5,
    yearlyIncome: 298200,
    yearlyTax: 19383,
    quarterlyPayments: [
      { quarter: 'Q1', paid: 4845, due: '2024-04-15' },
      { quarter: 'Q2', paid: 0, due: '2024-07-15' },
      { quarter: 'Q3', paid: 0, due: '2024-10-15' },
      { quarter: 'Q4', paid: 0, due: '2025-01-15' }
    ]
  }

  const pieData = earningsByType.map(item => ({
    name: item.type,
    value: item.amount
  }))

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444']

  return (
    <div className="space-y-6">
      {/* Nagłówek */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Szczegóły zarobków</h1>
          <p className="text-gray-600 mt-1">Szczegółowe informacje o dochodach i wydatkach</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Tydzień</SelectItem>
              <SelectItem value="month">Miesiąc</SelectItem>
              <SelectItem value="quarter">Kwartał</SelectItem>
              <SelectItem value="year">Rok</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Eksport
          </Button>
        </div>
      </div>

      {/* Karty podsumowujące */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Dochód brutto</p>
                <p className="text-2xl font-bold">zł{currentPeriod.gross.toLocaleString()}</p>
              </div>
              <DollarSign className="w-6 h-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Dochód netto</p>
                <p className="text-2xl font-bold">zł{currentPeriod.net.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Potrącenia</p>
                <p className="text-2xl font-bold text-red-600">zł{currentPeriod.breakdown.deductions.total}</p>
              </div>
              <TrendingDown className="w-6 h-6 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Bonusy</p>
                <p className="text-2xl font-bold text-green-600">zł{currentPeriod.breakdown.bonuses.total}</p>
              </div>
              <Award className="w-6 h-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="breakdown">Podział</TabsTrigger>
          <TabsTrigger value="bonuses">Bonusy</TabsTrigger>
          <TabsTrigger value="deductions">Potrącenia</TabsTrigger>
          <TabsTrigger value="students">Według kursantów</TabsTrigger>
          <TabsTrigger value="analytics">Analityka</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="mt-6 space-y-6">
          {/* Podział dochodów */}
          <Card>
            <CardHeader>
              <CardTitle>Struktura dochodu</CardTitle>
              <CardDescription>{currentPeriod.period}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Dochód podstawowy ({currentPeriod.lessons} lekcji)</span>
                    <span className="font-semibold">zł{currentPeriod.breakdown.base}</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Godziny nadliczbowe</span>
                    <span className="font-semibold">zł{currentPeriod.breakdown.overtime}</span>
                  </div>
                  <Progress value={8} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Bonusy</span>
                    <span className="font-semibold text-green-600">zł{currentPeriod.breakdown.bonuses.total}</span>
                  </div>
                  <Progress value={11} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Dodatkowy dochód</span>
                    <span className="font-semibold">zł{currentPeriod.breakdown.additionalIncome}</span>
                  </div>
                  <Progress value={2} className="h-2" />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Łącznie (brutto):</span>
                  <span>zł{currentPeriod.gross.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wykres zarobków według typu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Według typu lekcji</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RePieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lista według typów</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {earningsByType.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm">{type.type}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">zł{type.amount}</p>
                        <p className="text-xs text-gray-500">{type.lessons} lekcji</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bonuses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Szczegóły bonusów</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bonusesHistory.map((bonus) => (
                  <div key={bonus.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Award className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{bonus.title}</p>
                        <p className="text-sm text-gray-600">{bonus.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">+zł{bonus.amount}</p>
                      <Badge variant={bonus.status === 'received' ? 'default' : 'secondary'}>
                        {bonus.status === 'received' ? 'Otrzymano' : 'Oczekuje'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Bonusy naliczane są automatycznie na koniec miesiąca przy spełnieniu warunków
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deductions" className="mt-6 space-y-6">
          {/* Podział potrąceń */}
          <Card>
            <CardHeader>
              <CardTitle>Potrącenia i podatki</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">prowizja platformy</p>
                    <p className="text-sm text-gray-600">6% od dochodu brutto</p>
                  </div>
                  <p className="text-lg font-semibold text-red-600">-zł{currentPeriod.breakdown.deductions.platformFee}</p>
                </div>

                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Podatki</p>
                    <p className="text-sm text-gray-600">PIT 5% + ZUS 1.5%</p>
                  </div>
                  <p className="text-lg font-semibold text-red-600">-zł{currentPeriod.breakdown.deductions.taxes}</p>
                </div>

                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Ubezpieczenie</p>
                    <p className="text-sm text-gray-600">Dodatkowe ubezpieczenie</p>
                  </div>
                  <p className="text-lg font-semibold text-red-600">-zł{currentPeriod.breakdown.deductions.insurance}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Łączne potrącenia:</span>
                  <span className="text-red-600">-zł{currentPeriod.breakdown.deductions.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informacje podatkowe */}
          <Card>
            <CardHeader>
              <CardTitle>Informacje podatkowe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Roczny dochód (prognoza)</p>
                  <p className="text-xl font-bold">zł{taxInfo.yearlyIncome.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Podatki za rok</p>
                  <p className="text-xl font-bold">zł{taxInfo.yearlyTax.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                {taxInfo.quarterlyPayments.map((payment) => (
                  <div key={payment.quarter} className="flex justify-between p-2 border rounded">
                    <span className="text-sm">{payment.quarter} - do {payment.due}</span>
                    <Badge variant={payment.paid > 0 ? 'default' : 'secondary'}>
                      {payment.paid > 0 ? `Opłacono zł${payment.paid}` : 'Oczekuje'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Zarobek według kursantów</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kursant</TableHead>
                    <TableHead>Lekcji</TableHead>
                    <TableHead>Kwota</TableHead>
                    <TableHead>Średnia cena</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earningsByStudent.map((student) => (
                    <TableRow key={student.name}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.lessons}</TableCell>
                      <TableCell className="font-semibold">zł{student.amount}</TableCell>
                      <TableCell>zł{Math.round(student.amount / student.lessons)}</TableCell>
                      <TableCell>
                        <Badge variant="default">Aktywny</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Dynamika zarobków</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyEarnings}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3B82F6" 
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}