// /app/[locale]/instructor/earnings/history/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { 
  DollarSign, Calendar, Download, Filter, Search,
  ChevronLeft, ChevronRight, FileText, TrendingUp,
  TrendingDown, Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

export default function EarningsHistoryPage() {
  const t = useTranslations('instructor.earnings.history')
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPeriod, setFilterPeriod] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Mock payments history
  const payments = [
    {
      id: 'PAY001',
      date: '2024-02-01',
      period: t('periods.january', {year: 2024}),
      amount: 5500,
      lessons: 58,
      hours: 87,
      bonus: 375,
      deductions: 550,
      net: 4975,
      status: 'completed',
      method: t('payments.method'),
      receipt: 'REC-2024-01'
    },
    {
      id: 'PAY002',
      date: '2024-01-01',
      period: t('periods.december', {year: 2023}),
      amount: 5300,
      lessons: 56,
      hours: 84,
      bonus: 250,
      deductions: 530,
      net: 4770,
      status: 'completed',
      method: t('payments.method'),
      receipt: 'REC-2023-12'
    },
    {
      id: 'PAY003',
      date: '2023-12-01',
      period: t('periods.november', {year: 2023}),
      amount: 4625,
      lessons: 48,
      hours: 72,
      bonus: 125,
      deductions: 462,
      net: 4163,
      status: 'completed',
      method: t('payments.method'),
      receipt: 'REC-2023-11'
    },
    {
      id: 'PAY004',
      date: '2023-11-01',
      period: t('periods.october', {year: 2023}),
      amount: 4950,
      lessons: 52,
      hours: 78,
      bonus: 200,
      deductions: 495,
      net: 4455,
      status: 'completed',
      method: t('payments.method'),
      receipt: 'REC-2023-10'
    }
  ]

  // Mock transaction history
  const transactions = [
    {
      id: 'TR001',
      date: '2024-02-03',
      type: 'lesson',
      description: t('transactions.descriptions.lesson', {student: 'Марія Коваленко'}),
      amount: 95,
      status: 'pending'
    },
    {
      id: 'TR002',
      date: '2024-02-03',
      type: 'lesson',
      description: t('transactions.descriptions.lesson', {student: 'Іван Шевченко'}),
      amount: 95,
      status: 'pending'
    },
    {
      id: 'TR003',
      date: '2024-02-02',
      type: 'lesson',
      description: t('transactions.descriptions.lesson', {student: 'Олена Бондаренко'}),
      amount: 95,
      status: 'completed'
    },
    {
      id: 'TR004',
      date: '2024-02-02',
      type: 'bonus',
      description: t('transactions.descriptions.qualityBonus'),
      amount: 125,
      status: 'completed'
    },
    {
      id: 'TR005',
      date: '2024-02-01',
      type: 'deduction',
      description: t('transactions.descriptions.platformFee'),
      amount: -56,
      status: 'completed'
    }
  ]

  // Statistics
  const stats = {
    totalEarned: 20650,
    thisYear: 10800,
    lastMonth: 5500,
    thisMonth: 713,
    averagePerMonth: 5163,
    totalLessons: 214,
    totalHours: 321,
    totalBonus: 950
  }

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return <Badge variant="default">{t('payments.status.completed')}</Badge>
    } else if (status === 'pending') {
      return <Badge variant="secondary">{t('payments.status.pending')}</Badge>
    } else {
      return <Badge variant="destructive">{t('payments.status.cancelled')}</Badge>
    }
  }

  const getTransactionIcon = (type: string) => {
    if (type === 'lesson') return <CheckCircle className="w-4 h-4 text-green-500" />
    if (type === 'bonus') return <TrendingUp className="w-4 h-4 text-blue-500" />
    if (type === 'deduction') return <TrendingDown className="w-4 h-4 text-red-500" />
    return <AlertCircle className="w-4 h-4 text-gray-500" />
  }

  const getTransactionTypeName = (type: string) => {
    switch(type) {
      case 'lesson': return t('transactions.types.lesson')
      case 'bonus': return t('transactions.types.bonus')
      case 'deduction': return t('transactions.types.deduction')
      default: return t('transactions.types.other')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            {t('buttons.filter')}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {t('buttons.export')}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('stats.totalEarned')}</p>
                <p className="text-2xl font-bold">{t('currency', {amount: stats.totalEarned.toLocaleString()})}</p>
              </div>
              <DollarSign className="w-6 h-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('stats.thisYear')}</p>
                <p className="text-2xl font-bold">{t('currency', {amount: stats.thisYear.toLocaleString()})}</p>
              </div>
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('stats.lastMonth')}</p>
                <p className="text-2xl font-bold">{t('currency', {amount: stats.lastMonth.toLocaleString()})}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('stats.averageMonth')}</p>
                <p className="text-2xl font-bold">{t('currency', {amount: stats.averagePerMonth.toLocaleString()})}</p>
              </div>
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments">{t('tabs.payments')}</TabsTrigger>
          <TabsTrigger value="transactions">{t('tabs.transactions')}</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="mt-6">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={t('search.placeholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('periods.all')}</SelectItem>
                    <SelectItem value="year">{t('periods.year')}</SelectItem>
                    <SelectItem value="quarter">{t('periods.quarter')}</SelectItem>
                    <SelectItem value="month">{t('periods.month')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Payments Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('payments.headers.date')}</TableHead>
                    <TableHead>{t('payments.headers.period')}</TableHead>
                    <TableHead>{t('payments.headers.amount')}</TableHead>
                    <TableHead>{t('payments.headers.lessons')}</TableHead>
                    <TableHead>{t('payments.headers.bonuses')}</TableHead>
                    <TableHead>{t('payments.headers.deductions')}</TableHead>
                    <TableHead>{t('payments.headers.toPay')}</TableHead>
                    <TableHead>{t('payments.headers.status')}</TableHead>
                    <TableHead>{t('payments.headers.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {format(new Date(payment.date), 'd MMM yyyy', { locale: uk })}
                      </TableCell>
                      <TableCell className="font-medium">{payment.period}</TableCell>
                      <TableCell>{t('currency', {amount: payment.amount.toLocaleString()})}</TableCell>
                      <TableCell>{payment.lessons}</TableCell>
                      <TableCell className="text-green-600">
                        +{t('currency', {amount: payment.bonus.toLocaleString()})}
                      </TableCell>
                      <TableCell className="text-red-600">
                        -{t('currency', {amount: payment.deductions.toLocaleString()})}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {t('currency', {amount: payment.net.toLocaleString()})}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          {t('buttons.receipt')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-gray-500">
                  {t('payments.pagination', {from: 1, to: payments.length, total: payments.length})}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          {/* Transactions Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('transactions.headers.date')}</TableHead>
                    <TableHead>{t('transactions.headers.type')}</TableHead>
                    <TableHead>{t('transactions.headers.description')}</TableHead>
                    <TableHead>{t('transactions.headers.amount')}</TableHead>
                    <TableHead>{t('transactions.headers.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {format(new Date(transaction.date), 'd MMM yyyy', { locale: uk })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(transaction.type)}
                          <span className="capitalize">{getTransactionTypeName(transaction.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className={
                        transaction.amount > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'
                      }>
                        {transaction.amount > 0 ? '+' : ''}{t('currency', {amount: Math.abs(transaction.amount)})}
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}