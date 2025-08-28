// app/[locale]/instructor/earnings/page.tsx
// Сторінка фінансової статистики інструктора з деталями заробітків

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
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
import { uk } from 'date-fns/locale'

export default function InstructorEarnings() {
  const t = useTranslations('instructor.earnings.main')
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
    { month: t('charts.months.november'), earnings: 18500, lessons: 48 },
    { month: t('charts.months.december'), earnings: 21200, lessons: 56 },
    { month: t('charts.months.january'), earnings: 22100, lessons: 58 },
    { month: t('charts.months.february'), earnings: 24850, lessons: 65 }
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
    { type: t('lessonTypes.practiceCity'), amount: 12500, percentage: 50.3, color: '#3B82F6' },
    { type: t('lessonTypes.practiceRoute'), amount: 6200, percentage: 24.9, color: '#10B981' },
    { type: t('lessonTypes.examPrep'), amount: 3800, percentage: 15.3, color: '#F59E0B' },
    { type: t('lessonTypes.practiceArea'), amount: 2350, percentage: 9.5, color: '#8B5CF6' }
  ]

  // Detailed transactions
  const transactions = [
    {
      id: 1,
      date: '2024-02-03',
      student: 'Марія Коваленко',
      type: t('lessonTypes.examPrep'),
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
      student: 'Іван Шевченко',
      type: t('lessonTypes.practiceArea'),
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
      student: 'Анна Бондаренко',
      type: t('lessonTypes.practiceCity'),
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
      student: 'Андрій Мельник',
      type: t('lessonTypes.practiceRoute'),
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
      student: 'Наталія Коваль',
      type: t('lessonTypes.practiceCity'),
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
      title: t('bonusSection.newStudents'),
      description: t('bonusSection.newStudentsDesc', {count: 3}),
      amount: 750,
      date: '2024-02-15',
      status: 'received'
    },
    {
      id: 2,
      title: t('bonusSection.quality'),
      description: t('bonusSection.qualityDesc'),
      amount: 500,
      date: '2024-02-28',
      status: 'pending'
    },
    {
      id: 3,
      title: t('bonusSection.productivity'),
      description: t('bonusSection.productivityDesc'),
      amount: 250,
      date: '2024-02-28',
      status: 'pending'
    }
  ]

  // Payout info
  const nextPayout = {
    date: '2024-03-01',
    amount: 22365,
    method: t('payouts.bankTransfer'),
    bank: 'ПриватБанк',
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
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">{t('periods.week')}</SelectItem>
              <SelectItem value="month">{t('periods.month')}</SelectItem>
              <SelectItem value="quarter">{t('periods.quarter')}</SelectItem>
              <SelectItem value="year">{t('periods.year')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {t('buttons.report')}
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">{t('cards.thisMonth')}</p>
              <TrendingUp className={`w-4 h-4 ${currentMonthData.growth > 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <p className="text-3xl font-bold">{t('currency', {amount: currentMonthData.total.toLocaleString()})}</p>
            <p className={`text-sm mt-1 ${currentMonthData.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {currentMonthData.growth > 0 ? '+' : ''}{t('cards.fromPrevious', {value: currentMonthData.growth})}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">{t('cards.netIncome')}</p>
              <Wallet className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">{t('currency', {amount: currentMonthData.net.toLocaleString()})}</p>
            <p className="text-sm text-gray-600 mt-1">
              {t('cards.afterCommission', {percent: ((currentMonthData.commission / currentMonthData.total) * 100).toFixed(0)})}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">{t('cards.lessons')}</p>
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-3xl font-bold">{currentMonthData.lessons}</p>
            <p className="text-sm text-gray-600 mt-1">
              {t('cards.hours', {hours: currentMonthData.hours})}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">{t('cards.bonuses')}</p>
              <Award className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold">{t('currency', {amount: currentMonthData.bonus.toLocaleString()})}</p>
            <p className="text-sm text-green-600 mt-1">
              {t('cards.achievements', {count: 3})}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Target Progress */}
      <Card>
        <CardHeader>
          <CardTitle>{t('goals.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">{t('goals.monthly')}</span>
                <span className="text-sm text-gray-600">
                  {t('goals.amount', {
                    current: goals.monthly.current.toLocaleString(),
                    target: goals.monthly.target.toLocaleString()
                  })}
                </span>
              </div>
              <Progress value={goals.monthly.percentage} className="h-3" />
              {goals.monthly.percentage >= 100 && (
                <Badge variant="default" className="mt-2">
                  <Award className="w-3 h-3 mr-1" />
                  {t('goals.achieved')}
                </Badge>
              )}
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">{t('goals.quarterly')}</span>
                <span className="text-sm text-gray-600">
                  {t('goals.amount', {
                    current: goals.quarterly.current.toLocaleString(),
                    target: goals.quarterly.target.toLocaleString()
                  })}
                </span>
              </div>
              <Progress value={goals.quarterly.percentage} className="h-3" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">{t('goals.yearly')}</span>
                <span className="text-sm text-gray-600">
                  {t('goals.amount', {
                    current: goals.yearly.current.toLocaleString(),
                    target: goals.yearly.target.toLocaleString()
                  })}
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
          <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
          <TabsTrigger value="details">{t('tabs.details')}</TabsTrigger>
          <TabsTrigger value="bonuses">{t('tabs.bonuses')}</TabsTrigger>
          <TabsTrigger value="payout">{t('tabs.payouts')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('tabs.analytics')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Daily earnings chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('charts.dailyEarnings')}</CardTitle>
              <CardDescription>{t('charts.february', {year: 2024})}</CardDescription>
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
              <CardTitle>{t('charts.monthlyComparison')}</CardTitle>
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
              <CardTitle>{t('charts.byLessonType')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {earningsByType.map((type) => (
                  <div key={type.type}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{type.type}</span>
                      <span className="text-sm text-gray-600">
                        {t('currency', {amount: type.amount.toLocaleString()})} ({type.percentage}%)
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
                <CardTitle>{t('transactions.title')}</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  {t('buttons.filter')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('transactions.headers.date')}</TableHead>
                    <TableHead>{t('transactions.headers.student')}</TableHead>
                    <TableHead>{t('transactions.headers.type')}</TableHead>
                    <TableHead>{t('transactions.headers.duration')}</TableHead>
                    <TableHead>{t('transactions.headers.rate')}</TableHead>
                    <TableHead>{t('transactions.headers.amount')}</TableHead>
                    <TableHead>{t('transactions.headers.commission')}</TableHead>
                    <TableHead>{t('transactions.headers.net')}</TableHead>
                    <TableHead>{t('transactions.headers.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{format(new Date(transaction.date), 'dd.MM', { locale: uk })}</TableCell>
                      <TableCell className="font-medium">{transaction.student}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.type}</Badge>
                      </TableCell>
                      <TableCell>{t('transactions.minutes', {min: transaction.duration})}</TableCell>
                      <TableCell>{t('currency', {amount: transaction.rate})}</TableCell>
                      <TableCell className="font-medium">{t('currency', {amount: transaction.amount})}</TableCell>
                      <TableCell className="text-red-500">-{t('currency', {amount: transaction.commission})}</TableCell>
                      <TableCell className="font-semibold text-green-600">{t('currency', {amount: transaction.net})}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.status === 'paid' ? 'default' : 'secondary'}>
                          {transaction.status === 'paid' ? t('transactions.status.paid') : t('transactions.status.pending')}
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
              <CardTitle>{t('bonusSection.active')}</CardTitle>
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
                        <p className="text-xs text-gray-500 mt-1">{t('bonusSection.until', {date: bonus.date})}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">+{t('currency', {amount: bonus.amount})}</p>
                      <Badge variant={bonus.status === 'received' ? 'default' : 'secondary'}>
                        {bonus.status === 'received' ? t('bonusSection.received') : t('bonusSection.pending')}
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
              <CardTitle>{t('bonusSection.opportunities')}</CardTitle>
              <CardDescription>{t('bonusSection.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{t('bonusSection.lessons80')}</p>
                    <span className="text-lg font-bold text-gray-400">+{t('currency', {amount: 1000})}</span>
                  </div>
                  <Progress value={81.25} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600">{t('bonusSection.lessons80Progress', {current: 65, target: 80})}</p>
                </div>

                <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{t('bonusSection.exams5')}</p>
                    <span className="text-lg font-bold text-gray-400">+{t('currency', {amount: 1500})}</span>
                  </div>
                  <Progress value={60} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600">{t('bonusSection.exams5Progress', {current: 3, target: 5})}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payout" className="mt-6 space-y-6">
          {/* Next payout */}
          <Card>
            <CardHeader>
              <CardTitle>{t('payouts.next')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('payouts.plannedDate')}</p>
                    <p className="text-lg font-semibold">{format(new Date(nextPayout.date), 'd MMMM yyyy', { locale: uk })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{t('payouts.amountToPay')}</p>
                    <p className="text-2xl font-bold text-green-600">{t('currency', {amount: nextPayout.amount.toLocaleString()})}</p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-green-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('payouts.method')}:</span>
                    <span className="font-medium">{nextPayout.method}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('payouts.bank')}:</span>
                    <span className="font-medium">{nextPayout.bank}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('payouts.account')}:</span>
                    <span className="font-medium">{nextPayout.account}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payout history */}
          <Card>
            <CardHeader>
              <CardTitle>{t('payouts.history')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('transactions.headers.date')}</TableHead>
                    <TableHead>{t('payouts.period')}</TableHead>
                    <TableHead>{t('transactions.headers.amount')}</TableHead>
                    <TableHead>{t('payouts.method')}</TableHead>
                    <TableHead>{t('transactions.headers.status')}</TableHead>
                    <TableHead>Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>01.02.2024</TableCell>
                    <TableCell>{t('payouts.january2024')}</TableCell>
                    <TableCell className="font-semibold">{t('currency', {amount: '22,100'})}</TableCell>
                    <TableCell>{t('payouts.bankTransfer')}</TableCell>
                    <TableCell>
                      <Badge variant="default">{t('payouts.status.paid')}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Receipt className="w-4 h-4 mr-2" />
                        {t('buttons.receipt')}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>01.01.2024</TableCell>
                    <TableCell>{t('payouts.december2023')}</TableCell>
                    <TableCell className="font-semibold">{t('currency', {amount: '21,200'})}</TableCell>
                    <TableCell>{t('payouts.bankTransfer')}</TableCell>
                    <TableCell>
                      <Badge variant="default">{t('payouts.status.paid')}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Receipt className="w-4 h-4 mr-2" />
                        {t('buttons.receipt')}
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
                <CardTitle className="text-base">{t('analytics.averageEarnings')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('analytics.perLesson')}</span>
                    <span className="font-semibold">{t('currency', {amount: (currentMonthData.total / currentMonthData.lessons).toFixed(0)})}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('analytics.perHour')}</span>
                    <span className="font-semibold">{t('currency', {amount: (currentMonthData.total / currentMonthData.hours).toFixed(0)})}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('analytics.perDay')}</span>
                    <span className="font-semibold">{t('currency', {amount: (currentMonthData.total / 17).toFixed(0)})}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('analytics.productivity')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('analytics.lessonsPerDay')}</span>
                    <span className="font-semibold">{(currentMonthData.lessons / 17).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('analytics.hoursPerDay')}</span>
                    <span className="font-semibold">{(currentMonthData.hours / 17).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('analytics.utilization')}</span>
                    <span className="font-semibold">82%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('analytics.forecast')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('analytics.endOfMonth')}</span>
                    <span className="font-semibold">{t('currency', {amount: ((currentMonthData.total / 17) * 11).toFixed(0)})}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('analytics.quarter')}</span>
                    <span className="font-semibold">{t('currency', {amount: '75,000'})}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{t('analytics.yearForecast')}</span>
                    <span className="font-semibold">{t('currency', {amount: '285,000'})}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle>{t('analytics.insights')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    {t('analytics.growthMessage', {percent: 12.5})}
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    {t('analytics.goalMessage', {amount: 150, lessons: 1})}
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    {t('analytics.bestDaysMessage')}
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