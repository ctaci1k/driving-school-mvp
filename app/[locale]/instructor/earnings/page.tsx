// app/[locale]/instructor/earnings/page.tsx
// Strona statystyk finansowych instruktora z detalami zarobków

'use client'

import { useState } from 'react'
import { 
  DollarSign, TrendingUp, Calendar, Download, Filter,
  CreditCard, FileText, Award, Clock, Car, Users,
  ArrowUp, ArrowDown, ChevronRight, Info, PieChart,
  BarChart3, Receipt, Wallet, Target, Zap
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

export default function InstructorEarnings() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedMonth, setSelectedMonth] = useState('february')

  // Current month earnings
  const currentMonthData = {
    total: 24850,
    lessons: 65,
    hours: 97.5,
    bonus: 1500,
    commission: 2485,
    net: 22365,
    growth: 12.5,
    target: 25000,
    targetProgress: 99.4
  }

  // Previous months comparison
  const monthlyComparison = [
    { month: 'Listopad', earnings: 18500, lessons: 48 },
    { month: 'Grudzień', earnings: 21200, lessons: 56 },
    { month: 'Styczeń', earnings: 22100, lessons: 58 },
    { month: 'Luty', earnings: 24850, lessons: 65 }
  ]

  // Daily earnings for current month
  const dailyEarnings = [
    { date: '1', amount: 1200, lessons: 3 },
    { date: '2', amount: 1800, lessons: 4 },
    { date: '3', amount: 900, lessons: 2 },
    { date: '4', amount: 2100, lessons: 5 },
    { date: '5', amount: 1500, lessons: 4 },
    { date: '6', amount: 2400, lessons: 6 },
    { date: '7', amount: 0, lessons: 0 },
    { date: '8', amount: 1350, lessons: 3 },
    { date: '9', amount: 1800, lessons: 4 },
    { date: '10', amount: 1200, lessons: 3 },
    { date: '11', amount: 2250, lessons: 5 },
    { date: '12', amount: 1650, lessons: 4 },
    { date: '13', amount: 2100, lessons: 5 },
    { date: '14', amount: 0, lessons: 0 },
    { date: '15', amount: 1500, lessons: 4 },
    { date: '16', amount: 1800, lessons: 4 },
    { date: '17', amount: 1300, lessons: 3 }
  ]

  // Earnings by lesson type
  const earningsByType = [
    { type: 'Praktyka - miasto', amount: 12500, percentage: 50.3, color: '#3B82F6' },
    { type: 'Praktyka - trasa', amount: 6200, percentage: 24.9, color: '#10B981' },
    { type: 'Przygotowanie do egzaminu', amount: 3800, percentage: 15.3, color: '#F59E0B' },
    { type: 'Praktyka - plac', amount: 2350, percentage: 9.5, color: '#8B5CF6' }
  ]

  // Detailed transactions
  const transactions = [
    {
      id: 1,
      date: '2024-02-03',
      student: 'Maria Kowalczyk',
      type: 'Przygotowanie do egzaminu',
      duration: 90,
      rate: 400,
      amount: 600,
      commission: 60,
      net: 540,
      status: 'paid'
    },
    {
      id: 2,
      date: '2024-02-03',
      student: 'Jan Nowak',
      type: 'Praktyka - plac',
      duration: 90,
      rate: 350,
      amount: 525,
      commission: 52.5,
      net: 472.5,
      status: 'paid'
    },
    {
      id: 3,
      date: '2024-02-02',
      student: 'Anna Wiśniewska',
      type: 'Praktyka - miasto',
      duration: 90,
      rate: 400,
      amount: 600,
      commission: 60,
      net: 540,
      status: 'paid'
    },
    {
      id: 4,
      date: '2024-02-02',
      student: 'Andrzej Kowalski',
      type: 'Praktyka - trasa',
      duration: 120,
      rate: 400,
      amount: 800,
      commission: 80,
      net: 720,
      status: 'paid'
    },
    {
      id: 5,
      date: '2024-02-01',
      student: 'Natalia Kamińska',
      type: 'Praktyka - miasto',
      duration: 90,
      rate: 400,
      amount: 600,
      commission: 60,
      net: 540,
      status: 'pending'
    }
  ]

  // Bonuses and achievements
  const bonuses = [
    {
      id: 1,
      title: 'Bonus za nowych uczniów',
      description: '3 nowych uczniów w lutym',
      amount: 750,
      date: '2024-02-15',
      status: 'received'
    },
    {
      id: 2,
      title: 'Bonus za jakość',
      description: 'Ocena 4.9+ przez cały miesiąc',
      amount: 500,
      date: '2024-02-28',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Bonus za produktywność',
      description: 'Ponad 60 lekcji w miesiącu',
      amount: 250,
      date: '2024-02-28',
      status: 'pending'
    }
  ]

  // Payout info
  const nextPayout = {
    date: '2024-03-01',
    amount: 22365,
    method: 'Przelew bankowy',
    bank: 'PKO Bank Polski',
    account: '****4521',
    status: 'scheduled'
  }

  // Goals and targets
  const goals = {
    monthly: {
      target: 25000,
      current: 24850,
      percentage: 99.4
    },
    quarterly: {
      target: 75000,
      current: 68150,
      percentage: 90.9
    },
    yearly: {
      target: 300000,
      current: 45200,
      percentage: 15.1
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Moje zarobki</h1>
          <p className="text-gray-600 mt-1">
            Statystyki finansowe i wypłaty
          </p>
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
            Raport
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Ten miesiąc</p>
              <TrendingUp className={`w-4 h-4 ${currentMonthData.growth > 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <p className="text-3xl font-bold">{currentMonthData.total.toLocaleString()} zł</p>
            <p className={`text-sm mt-1 ${currentMonthData.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {currentMonthData.growth > 0 ? '+' : ''}{currentMonthData.growth}% od poprzedniego
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Na czysto</p>
              <Wallet className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">{currentMonthData.net.toLocaleString()} zł</p>
            <p className="text-sm text-gray-600 mt-1">
              Po prowizji {((currentMonthData.commission / currentMonthData.total) * 100).toFixed(0)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Lekcje</p>
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-3xl font-bold">{currentMonthData.lessons}</p>
            <p className="text-sm text-gray-600 mt-1">
              {currentMonthData.hours} godzin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Bonusy</p>
              <Award className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold">{currentMonthData.bonus.toLocaleString()} zł</p>
            <p className="text-sm text-green-600 mt-1">
              +3 osiągnięcia
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Target Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Cele i osiągnięcia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Cel miesięczny</span>
                <span className="text-sm text-gray-600">
                  {goals.monthly.current.toLocaleString()} zł / {goals.monthly.target.toLocaleString()} zł
                </span>
              </div>
              <Progress value={goals.monthly.percentage} className="h-3" />
              {goals.monthly.percentage >= 100 && (
                <Badge variant="default" className="mt-2">
                  <Award className="w-3 h-3 mr-1" />
                  Cel osiągnięty!
                </Badge>
              )}
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Cel kwartalny</span>
                <span className="text-sm text-gray-600">
                  {goals.quarterly.current.toLocaleString()} zł / {goals.quarterly.target.toLocaleString()} zł
                </span>
              </div>
              <Progress value={goals.quarterly.percentage} className="h-3" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Cel roczny</span>
                <span className="text-sm text-gray-600">
                  {goals.yearly.current.toLocaleString()} zł / {goals.yearly.target.toLocaleString()} zł
                </span>
              </div>
              <Progress value={goals.yearly.percentage} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Details */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Przegląd</TabsTrigger>
          <TabsTrigger value="details">Szczegóły</TabsTrigger>
          <TabsTrigger value="bonuses">Bonusy</TabsTrigger>
          <TabsTrigger value="payout">Wypłaty</TabsTrigger>
          <TabsTrigger value="analytics">Analityka</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Daily earnings chart */}
          <Card>
            <CardHeader>
              <CardTitle>Zarobki dzienne</CardTitle>
              <CardDescription>Luty 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyEarnings}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3B82F6" 
                    fillOpacity={1} 
                    fill="url(#colorEarnings)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Porównanie miesięczne</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="earnings" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Earnings by type */}
          <Card>
            <CardHeader>
              <CardTitle>Zarobki wg typu lekcji</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {earningsByType.map((type) => (
                  <div key={type.type}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{type.type}</span>
                      <span className="text-sm text-gray-600">
                        {type.amount.toLocaleString()} zł ({type.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${type.percentage}%`,
                          backgroundColor: type.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Szczegóły transakcji</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtr
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Uczeń</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Czas trwania</TableHead>
                    <TableHead>Stawka</TableHead>
                    <TableHead>Kwota</TableHead>
                    <TableHead>Prowizja</TableHead>
                    <TableHead>Na czysto</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{format(new Date(transaction.date), 'dd.MM', { locale: pl })}</TableCell>
                      <TableCell className="font-medium">{transaction.student}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.type}</Badge>
                      </TableCell>
                      <TableCell>{transaction.duration} min</TableCell>
                      <TableCell>{transaction.rate} zł</TableCell>
                      <TableCell className="font-medium">{transaction.amount} zł</TableCell>
                      <TableCell className="text-red-500">-{transaction.commission} zł</TableCell>
                      <TableCell className="font-semibold text-green-600">{transaction.net} zł</TableCell>
                      <TableCell>
                        <Badge variant={transaction.status === 'paid' ? 'default' : 'secondary'}>
                          {transaction.status === 'paid' ? 'Opłacone' : 'Oczekuje'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bonuses" className="mt-6 space-y-6">
          {/* Active bonuses */}
          <Card>
            <CardHeader>
              <CardTitle>Aktywne bonusy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bonuses.map((bonus) => (
                  <div key={bonus.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Award className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{bonus.title}</p>
                        <p className="text-sm text-gray-600">{bonus.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Do {bonus.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">+{bonus.amount} zł</p>
                      <Badge variant={bonus.status === 'received' ? 'default' : 'secondary'}>
                        {bonus.status === 'received' ? 'Otrzymano' : 'Oczekuje'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bonus opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>Możliwe bonusy</CardTitle>
              <CardDescription>Spełnij warunki aby otrzymać dodatkowe bonusy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Bonus za 80 lekcji</p>
                    <span className="text-lg font-bold text-gray-400">+1,000 zł</span>
                  </div>
                  <Progress value={81.25} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600">65 z 80 lekcji</p>
                </div>

                <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Bonus za 5 zdanych egzaminów</p>
                    <span className="text-lg font-bold text-gray-400">+1,500 zł</span>
                  </div>
                  <Progress value={60} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600">3 z 5 uczniów zdało</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payout" className="mt-6 space-y-6">
          {/* Next payout */}
          <Card>
            <CardHeader>
              <CardTitle>Następna wypłata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Planowana data</p>
                    <p className="text-lg font-semibold">{format(new Date(nextPayout.date), 'd MMMM yyyy', { locale: pl })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Kwota do wypłaty</p>
                    <p className="text-2xl font-bold text-green-600">{nextPayout.amount.toLocaleString()} zł</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-green-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Metoda wypłaty:</span>
                    <span className="font-medium">{nextPayout.method}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Bank:</span>
                    <span className="font-medium">{nextPayout.bank}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Konto:</span>
                    <span className="font-medium">{nextPayout.account}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payout history */}
          <Card>
            <CardHeader>
              <CardTitle>Historia wypłat</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Okres</TableHead>
                    <TableHead>Kwota</TableHead>
                    <TableHead>Metoda</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>01.02.2024</TableCell>
                    <TableCell>Styczeń 2024</TableCell>
                    <TableCell className="font-semibold">22,100 zł</TableCell>
                    <TableCell>Przelew bankowy</TableCell>
                    <TableCell>
                      <Badge variant="default">Wypłacone</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Receipt className="w-4 h-4 mr-2" />
                        Pokwitowanie
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>01.01.2024</TableCell>
                    <TableCell>Grudzień 2023</TableCell>
                    <TableCell className="font-semibold">21,200 zł</TableCell>
                    <TableCell>Przelew bankowy</TableCell>
                    <TableCell>
                      <Badge variant="default">Wypłacone</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Receipt className="w-4 h-4 mr-2" />
                        Pokwitowanie
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6 space-y-6">
          {/* Performance metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Średnie zarobki</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Za lekcję:</span>
                    <span className="font-semibold">{(currentMonthData.total / currentMonthData.lessons).toFixed(0)} zł</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Za godzinę:</span>
                    <span className="font-semibold">{(currentMonthData.total / currentMonthData.hours).toFixed(0)} zł</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Za dzień:</span>
                    <span className="font-semibold">{(currentMonthData.total / 17).toFixed(0)} zł</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Produktywność</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lekcji/dzień:</span>
                    <span className="font-semibold">{(currentMonthData.lessons / 17).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Godzin/dzień:</span>
                    <span className="font-semibold">{(currentMonthData.hours / 17).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Wykorzystanie:</span>
                    <span className="font-semibold">82%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Prognoza</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Do końca miesiąca:</span>
                    <span className="font-semibold">{((currentMonthData.total / 17) * 11).toFixed(0)} zł</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Kwartał:</span>
                    <span className="font-semibold">75,000 zł</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Rok (prognoza):</span>
                    <span className="font-semibold">285,000 zł</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Wgląd i rekomendacje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    Twoje zarobki wzrosły o 12.5% w porównaniu z poprzednim miesiącem. Kontynuuj w tym tempie!
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    Prawie osiągnąłeś miesięczny cel! Pozostało tylko 150 zł (1 lekcja).
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    Najbardziej dochodowe dni: sobota i piątek. Rozważ zwiększenie liczby lekcji w te dni.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}