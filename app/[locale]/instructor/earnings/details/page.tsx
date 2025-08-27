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
import { uk } from 'date-fns/locale'

export default function EarningsDetailsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedMonth, setSelectedMonth] = useState('february')

  // Current period breakdown
  const currentPeriod = {
    period: 'Лютий 2024',
    gross: 24850,
    net: 22365,
    lessons: 65,
    hours: 97.5,
    students: 15,
    
    breakdown: {
      base: 19500,  // 65 lessons * 300
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

  // Earnings by lesson type
  const earningsByType = [
    { type: 'Практика - місто', lessons: 30, amount: 9000, percentage: 36 },
    { type: 'Практика - траса', lessons: 15, amount: 5250, percentage: 21 },
    { type: 'Підготовка до іспиту', lessons: 10, amount: 4000, percentage: 16 },
    { type: 'Практика - майданчик', lessons: 8, amount: 2400, percentage: 10 },
    { type: 'Нічна їзда', lessons: 2, amount: 800, percentage: 3 }
  ]

  // Earnings by student
  const earningsByStudent = [
    { name: 'Марія Шевчук', lessons: 12, amount: 3600, status: 'active' },
    { name: 'Іван Петренко', lessons: 10, amount: 3000, status: 'active' },
    { name: 'Олена Коваленко', lessons: 9, amount: 2700, status: 'active' },
    { name: 'Андрій Бондаренко', lessons: 8, amount: 2400, status: 'active' },
    { name: 'Наталія Гриценко', lessons: 7, amount: 2100, status: 'active' }
  ]

  // Daily earnings for chart
  const dailyEarnings = [
    { day: '1', amount: 1200, lessons: 3 },
    { day: '2', amount: 1800, lessons: 4 },
    { day: '3', amount: 900, lessons: 2 },
    { day: '4', amount: 2100, lessons: 5 },
    { day: '5', amount: 1500, lessons: 4 },
    { day: '6', amount: 2400, lessons: 6 },
    { day: '7', amount: 0, lessons: 0 }
  ]

  // Bonuses breakdown
  const bonusesHistory = [
    {
      id: 1,
      type: 'quality',
      title: 'Бонус за якість',
      description: 'Рейтинг 4.9+ протягом місяця',
      amount: 1000,
      status: 'received',
      date: '2024-02-28'
    },
    {
      id: 2,
      type: 'punctuality',
      title: 'Бонус за пунктуальність',
      description: '100% вчасних занять',
      amount: 500,
      status: 'received',
      date: '2024-02-28'
    },
    {
      id: 3,
      type: 'newStudents',
      title: 'Бонус за нових студентів',
      description: '3 нових студента',
      amount: 750,
      status: 'pending',
      date: '2024-02-28'
    },
    {
      id: 4,
      type: 'examSuccess',
      title: 'Бонус за успішні іспити',
      description: '2 студенти склали іспит',
      amount: 600,
      status: 'pending',
      date: '2024-02-28'
    }
  ]

  // Tax information
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Деталізація заробітку</h1>
          <p className="text-gray-600 mt-1">Детальна інформація про доходи та витрати</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Тиждень</SelectItem>
              <SelectItem value="month">Місяць</SelectItem>
              <SelectItem value="quarter">Квартал</SelectItem>
              <SelectItem value="year">Рік</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Експорт
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Валовий дохід</p>
                <p className="text-2xl font-bold">₴{currentPeriod.gross.toLocaleString()}</p>
              </div>
              <DollarSign className="w-6 h-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Чистий дохід</p>
                <p className="text-2xl font-bold">₴{currentPeriod.net.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Утримання</p>
                <p className="text-2xl font-bold text-red-600">₴{currentPeriod.breakdown.deductions.total}</p>
              </div>
              <TrendingDown className="w-6 h-6 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Бонуси</p>
                <p className="text-2xl font-bold text-green-600">₴{currentPeriod.breakdown.bonuses.total}</p>
              </div>
              <Award className="w-6 h-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="breakdown">Розподіл</TabsTrigger>
          <TabsTrigger value="bonuses">Бонуси</TabsTrigger>
          <TabsTrigger value="deductions">Утримання</TabsTrigger>
          <TabsTrigger value="students">По студентах</TabsTrigger>
          <TabsTrigger value="analytics">Аналітика</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="mt-6 space-y-6">
          {/* Income Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Структура доходу</CardTitle>
              <CardDescription>{currentPeriod.period}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Базовий дохід ({currentPeriod.lessons} занять)</span>
                    <span className="font-semibold">₴{currentPeriod.breakdown.base}</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Понаднормові</span>
                    <span className="font-semibold">₴{currentPeriod.breakdown.overtime}</span>
                  </div>
                  <Progress value={8} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Бонуси</span>
                    <span className="font-semibold text-green-600">₴{currentPeriod.breakdown.bonuses.total}</span>
                  </div>
                  <Progress value={11} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Додатковий дохід</span>
                    <span className="font-semibold">₴{currentPeriod.breakdown.additionalIncome}</span>
                  </div>
                  <Progress value={2} className="h-2" />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Всього (валовий):</span>
                  <span>₴{currentPeriod.gross.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Earnings by Type Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>За типами занять</CardTitle>
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
                <CardTitle>Список за типами</CardTitle>
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
                        <p className="font-semibold">₴{type.amount}</p>
                        <p className="text-xs text-gray-500">{type.lessons} занять</p>
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
              <CardTitle>Деталізація бонусів</CardTitle>
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
                      <p className="text-lg font-bold text-green-600">+₴{bonus.amount}</p>
                      <Badge variant={bonus.status === 'received' ? 'default' : 'secondary'}>
                        {bonus.status === 'received' ? 'Отримано' : 'Очікується'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Бонуси нараховуються автоматично в кінці місяця при виконанні умов
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deductions" className="mt-6 space-y-6">
          {/* Deductions Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Утримання та податки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Комісія платформи</p>
                    <p className="text-sm text-gray-600">6% від валового доходу</p>
                  </div>
                  <p className="text-lg font-semibold text-red-600">-₴{currentPeriod.breakdown.deductions.platformFee}</p>
                </div>

                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Податки</p>
                    <p className="text-sm text-gray-600">ЄП 5% + ЄСВ 1.5%</p>
                  </div>
                  <p className="text-lg font-semibold text-red-600">-₴{currentPeriod.breakdown.deductions.taxes}</p>
                </div>

                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Страхування</p>
                    <p className="text-sm text-gray-600">Додаткове страхування</p>
                  </div>
                  <p className="text-lg font-semibold text-red-600">-₴{currentPeriod.breakdown.deductions.insurance}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Всього утримань:</span>
                  <span className="text-red-600">-₴{currentPeriod.breakdown.deductions.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tax Information */}
          <Card>
            <CardHeader>
              <CardTitle>Податкова інформація</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Річний дохід (прогноз)</p>
                  <p className="text-xl font-bold">₴{taxInfo.yearlyIncome.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Податки за рік</p>
                  <p className="text-xl font-bold">₴{taxInfo.yearlyTax.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                {taxInfo.quarterlyPayments.map((payment) => (
                  <div key={payment.quarter} className="flex justify-between p-2 border rounded">
                    <span className="text-sm">{payment.quarter} - до {payment.due}</span>
                    <Badge variant={payment.paid > 0 ? 'default' : 'secondary'}>
                      {payment.paid > 0 ? `Сплачено ₴${payment.paid}` : 'Очікує'}
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
              <CardTitle>Заробіток по студентах</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Студент</TableHead>
                    <TableHead>Занять</TableHead>
                    <TableHead>Сума</TableHead>
                    <TableHead>Середня вартість</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earningsByStudent.map((student) => (
                    <TableRow key={student.name}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.lessons}</TableCell>
                      <TableCell className="font-semibold">₴{student.amount}</TableCell>
                      <TableCell>₴{Math.round(student.amount / student.lessons)}</TableCell>
                      <TableCell>
                        <Badge variant="default">Активний</Badge>
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
              <CardTitle>Динаміка заробітку</CardTitle>
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