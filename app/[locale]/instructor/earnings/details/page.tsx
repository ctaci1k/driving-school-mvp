// /app/[locale]/instructor/earnings/details/page.tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('instructor.earnings.details')
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedMonth, setSelectedMonth] = useState('february')

  // Поточний період
  const currentPeriod = {
    period: t('period.february'),
    gross: 24850,
    net: 22365,
    lessons: 65,
    hours: 97.5,
    students: 15,
    
    breakdown: {
      base: 19500,  // 65 уроків * 300
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

  // Заробітки за типом уроків
  const earningsByType = [
    { type: t('lessonTypes.practiceCity'), lessons: 30, amount: 9000, percentage: 36 },
    { type: t('lessonTypes.practiceRoute'), lessons: 15, amount: 5250, percentage: 21 },
    { type: t('lessonTypes.examPrep'), lessons: 10, amount: 4000, percentage: 16 },
    { type: t('lessonTypes.practiceArea'), lessons: 8, amount: 2400, percentage: 10 },
    { type: t('lessonTypes.nightDriving'), lessons: 2, amount: 800, percentage: 3 }
  ]

  // Заробітки за курсантами
  const earningsByStudent = [
    { name: 'Марія Коваленко', lessons: 12, amount: 3600, status: 'active' },
    { name: 'Іван Шевченко', lessons: 10, amount: 3000, status: 'active' },
    { name: 'Анна Бондаренко', lessons: 9, amount: 2700, status: 'active' },
    { name: 'Андрій Мельник', lessons: 8, amount: 2400, status: 'active' },
    { name: 'Наталія Коваль', lessons: 7, amount: 2100, status: 'active' }
  ]

  // Денні заробітки для графіку
  const dailyEarnings = [
    { day: '1', amount: 1200, lessons: 3 },
    { day: '2', amount: 1800, lessons: 4 },
    { day: '3', amount: 900, lessons: 2 },
    { day: '4', amount: 2100, lessons: 5 },
    { day: '5', amount: 1500, lessons: 4 },
    { day: '6', amount: 2400, lessons: 6 },
    { day: '7', amount: 0, lessons: 0 }
  ]

  // Історія бонусів
  const bonusesHistory = [
    {
      id: 1,
      type: 'quality',
      title: t('bonusDetails.quality'),
      description: t('bonusDetails.qualityDesc'),
      amount: 1000,
      status: 'received',
      date: '2024-02-28'
    },
    {
      id: 2,
      type: 'punctuality',
      title: t('bonusDetails.punctuality'),
      description: t('bonusDetails.punctualityDesc'),
      amount: 500,
      status: 'received',
      date: '2024-02-28'
    },
    {
      id: 3,
      type: 'newStudents',
      title: t('bonusDetails.newStudents'),
      description: t('bonusDetails.newStudentsDesc', {count: 3}),
      amount: 750,
      status: 'pending',
      date: '2024-02-28'
    },
    {
      id: 4,
      type: 'examSuccess',
      title: t('bonusDetails.examSuccess'),
      description: t('bonusDetails.examSuccessDesc', {count: 2}),
      amount: 600,
      status: 'pending',
      date: '2024-02-28'
    }
  ]

  // Податкова інформація
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
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">{t('period.week')}</SelectItem>
              <SelectItem value="month">{t('period.month')}</SelectItem>
              <SelectItem value="quarter">{t('period.quarter')}</SelectItem>
              <SelectItem value="year">{t('period.year')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {t('buttons.export')}
          </Button>
        </div>
      </div>

      {/* Картки підсумків */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('summary.grossIncome')}</p>
                <p className="text-2xl font-bold">{t('currency', {amount: currentPeriod.gross.toLocaleString()})}</p>
              </div>
              <DollarSign className="w-6 h-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('summary.netIncome')}</p>
                <p className="text-2xl font-bold">{t('currency', {amount: currentPeriod.net.toLocaleString()})}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('summary.deductions')}</p>
                <p className="text-2xl font-bold text-red-600">{t('currency', {amount: currentPeriod.breakdown.deductions.total})}</p>
              </div>
              <TrendingDown className="w-6 h-6 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('summary.bonuses')}</p>
                <p className="text-2xl font-bold text-green-600">{t('currency', {amount: currentPeriod.breakdown.bonuses.total})}</p>
              </div>
              <Award className="w-6 h-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="breakdown">{t('tabs.breakdown')}</TabsTrigger>
          <TabsTrigger value="bonuses">{t('tabs.bonuses')}</TabsTrigger>
          <TabsTrigger value="deductions">{t('tabs.deductions')}</TabsTrigger>
          <TabsTrigger value="students">{t('tabs.byStudents')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('tabs.analytics')}</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="mt-6 space-y-6">
          {/* Розподіл доходів */}
          <Card>
            <CardHeader>
              <CardTitle>{t('structure.title')}</CardTitle>
              <CardDescription>{currentPeriod.period}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('structure.baseIncome', {lessons: currentPeriod.lessons})}</span>
                    <span className="font-semibold">{t('currency', {amount: currentPeriod.breakdown.base})}</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('structure.overtime')}</span>
                    <span className="font-semibold">{t('currency', {amount: currentPeriod.breakdown.overtime})}</span>
                  </div>
                  <Progress value={8} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('structure.bonuses')}</span>
                    <span className="font-semibold text-green-600">{t('currency', {amount: currentPeriod.breakdown.bonuses.total})}</span>
                  </div>
                  <Progress value={11} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">{t('structure.additionalIncome')}</span>
                    <span className="font-semibold">{t('currency', {amount: currentPeriod.breakdown.additionalIncome})}</span>
                  </div>
                  <Progress value={2} className="h-2" />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('structure.totalGross')}</span>
                  <span>{t('currency', {amount: currentPeriod.gross.toLocaleString()})}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Графік заробітків за типом */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('lessonTypes.title')}</CardTitle>
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
                <CardTitle>{t('lessonTypes.list')}</CardTitle>
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
                        <p className="font-semibold">{t('currency', {amount: type.amount})}</p>
                        <p className="text-xs text-gray-500">{t('lessonTypes.lessons', {count: type.lessons})}</p>
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
              <CardTitle>{t('bonusDetails.title')}</CardTitle>
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
                      <p className="text-lg font-bold text-green-600">+{t('currency', {amount: bonus.amount})}</p>
                      <Badge variant={bonus.status === 'received' ? 'default' : 'secondary'}>
                        {bonus.status === 'received' ? t('bonusDetails.received') : t('bonusDetails.pending')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {t('bonusDetails.info')}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deductions" className="mt-6 space-y-6">
          {/* Розподіл утримань */}
          <Card>
            <CardHeader>
              <CardTitle>{t('deductionDetails.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{t('deductionDetails.platformFee')}</p>
                    <p className="text-sm text-gray-600">{t('deductionDetails.platformFeeDesc')}</p>
                  </div>
                  <p className="text-lg font-semibold text-red-600">-{t('currency', {amount: currentPeriod.breakdown.deductions.platformFee})}</p>
                </div>

                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{t('deductionDetails.taxes')}</p>
                    <p className="text-sm text-gray-600">{t('deductionDetails.taxesDesc')}</p>
                  </div>
                  <p className="text-lg font-semibold text-red-600">-{t('currency', {amount: currentPeriod.breakdown.deductions.taxes})}</p>
                </div>

                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{t('deductionDetails.insurance')}</p>
                    <p className="text-sm text-gray-600">{t('deductionDetails.insuranceDesc')}</p>
                  </div>
                  <p className="text-lg font-semibold text-red-600">-{t('currency', {amount: currentPeriod.breakdown.deductions.insurance})}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('deductionDetails.totalDeductions')}</span>
                  <span className="text-red-600">-{t('currency', {amount: currentPeriod.breakdown.deductions.total})}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Податкова інформація */}
          <Card>
            <CardHeader>
              <CardTitle>{t('taxInfo.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">{t('taxInfo.yearlyIncome')}</p>
                  <p className="text-xl font-bold">{t('currency', {amount: taxInfo.yearlyIncome.toLocaleString()})}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('taxInfo.yearlyTax')}</p>
                  <p className="text-xl font-bold">{t('currency', {amount: taxInfo.yearlyTax.toLocaleString()})}</p>
                </div>
              </div>

              <div className="space-y-2">
                {taxInfo.quarterlyPayments.map((payment) => (
                  <div key={payment.quarter} className="flex justify-between p-2 border rounded">
                    <span className="text-sm">{payment.quarter} - {t('taxInfo.due', {date: payment.due})}</span>
                    <Badge variant={payment.paid > 0 ? 'default' : 'secondary'}>
                      {payment.paid > 0 ? t('taxInfo.paid', {amount: payment.paid}) : t('taxInfo.pending')}
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
              <CardTitle>{t('studentEarnings.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('studentEarnings.headers.student')}</TableHead>
                    <TableHead>{t('studentEarnings.headers.lessons')}</TableHead>
                    <TableHead>{t('studentEarnings.headers.amount')}</TableHead>
                    <TableHead>{t('studentEarnings.headers.averagePrice')}</TableHead>
                    <TableHead>{t('studentEarnings.headers.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earningsByStudent.map((student) => (
                    <TableRow key={student.name}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.lessons}</TableCell>
                      <TableCell className="font-semibold">{t('currency', {amount: student.amount})}</TableCell>
                      <TableCell>{t('currency', {amount: Math.round(student.amount / student.lessons)})}</TableCell>
                      <TableCell>
                        <Badge variant="default">{t('studentEarnings.active')}</Badge>
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
              <CardTitle>{t('analytics.title')}</CardTitle>
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