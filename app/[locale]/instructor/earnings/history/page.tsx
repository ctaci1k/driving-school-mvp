// /app/[locale]/instructor/earnings/history/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
      period: 'Січень 2024',
      amount: 22100,
      lessons: 58,
      hours: 87,
      bonus: 1500,
      deductions: 2210,
      net: 19890,
      status: 'completed',
      method: 'Банківський переказ',
      receipt: 'REC-2024-01'
    },
    {
      id: 'PAY002',
      date: '2024-01-01',
      period: 'Грудень 2023',
      amount: 21200,
      lessons: 56,
      hours: 84,
      bonus: 1000,
      deductions: 2120,
      net: 19080,
      status: 'completed',
      method: 'Банківський переказ',
      receipt: 'REC-2023-12'
    },
    {
      id: 'PAY003',
      date: '2023-12-01',
      period: 'Листопад 2023',
      amount: 18500,
      lessons: 48,
      hours: 72,
      bonus: 500,
      deductions: 1850,
      net: 16650,
      status: 'completed',
      method: 'Банківський переказ',
      receipt: 'REC-2023-11'
    },
    {
      id: 'PAY004',
      date: '2023-11-01',
      period: 'Жовтень 2023',
      amount: 19800,
      lessons: 52,
      hours: 78,
      bonus: 800,
      deductions: 1980,
      net: 17820,
      status: 'completed',
      method: 'Банківський переказ',
      receipt: 'REC-2023-10'
    }
  ]

  // Mock transaction history
  const transactions = [
    {
      id: 'TR001',
      date: '2024-02-03',
      type: 'lesson',
      description: 'Заняття - Марія Шевчук',
      amount: 450,
      status: 'pending'
    },
    {
      id: 'TR002',
      date: '2024-02-03',
      type: 'lesson',
      description: 'Заняття - Іван Петренко',
      amount: 450,
      status: 'pending'
    },
    {
      id: 'TR003',
      date: '2024-02-02',
      type: 'lesson',
      description: 'Заняття - Олена Коваленко',
      amount: 450,
      status: 'completed'
    },
    {
      id: 'TR004',
      date: '2024-02-02',
      type: 'bonus',
      description: 'Бонус за якість',
      amount: 500,
      status: 'completed'
    },
    {
      id: 'TR005',
      date: '2024-02-01',
      type: 'deduction',
      description: 'Комісія платформи',
      amount: -225,
      status: 'completed'
    }
  ]

  // Statistics
  const stats = {
    totalEarned: 82600,
    thisYear: 43200,
    lastMonth: 22100,
    thisMonth: 2850,
    averagePerMonth: 20650,
    totalLessons: 214,
    totalHours: 321,
    totalBonus: 3800
  }

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return <Badge variant="default">Виплачено</Badge>
    } else if (status === 'pending') {
      return <Badge variant="secondary">Очікує</Badge>
    } else {
      return <Badge variant="destructive">Скасовано</Badge>
    }
  }

  const getTransactionIcon = (type: string) => {
    if (type === 'lesson') return <CheckCircle className="w-4 h-4 text-green-500" />
    if (type === 'bonus') return <TrendingUp className="w-4 h-4 text-blue-500" />
    if (type === 'deduction') return <TrendingDown className="w-4 h-4 text-red-500" />
    return <AlertCircle className="w-4 h-4 text-gray-500" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Історія виплат</h1>
          <p className="text-gray-600 mt-1">Перегляд всіх виплат та транзакцій</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Фільтр
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Експорт
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Всього заробив</p>
                <p className="text-2xl font-bold">₴{stats.totalEarned.toLocaleString()}</p>
              </div>
              <DollarSign className="w-6 h-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Цей рік</p>
                <p className="text-2xl font-bold">₴{stats.thisYear.toLocaleString()}</p>
              </div>
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Минулий місяць</p>
                <p className="text-2xl font-bold">₴{stats.lastMonth.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Середнє/місяць</p>
                <p className="text-2xl font-bold">₴{stats.averagePerMonth.toLocaleString()}</p>
              </div>
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments">Виплати</TabsTrigger>
          <TabsTrigger value="transactions">Транзакції</TabsTrigger>
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
                      placeholder="Пошук за періодом або номером..."
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
                    <SelectItem value="all">Весь час</SelectItem>
                    <SelectItem value="year">Цей рік</SelectItem>
                    <SelectItem value="quarter">Квартал</SelectItem>
                    <SelectItem value="month">Місяць</SelectItem>
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
                    <TableHead>Дата</TableHead>
                    <TableHead>Період</TableHead>
                    <TableHead>Сума</TableHead>
                    <TableHead>Занять</TableHead>
                    <TableHead>Бонуси</TableHead>
                    <TableHead>Утримання</TableHead>
                    <TableHead>До виплати</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {format(new Date(payment.date), 'd MMM yyyy', { locale: uk })}
                      </TableCell>
                      <TableCell className="font-medium">{payment.period}</TableCell>
                      <TableCell>₴{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>{payment.lessons}</TableCell>
                      <TableCell className="text-green-600">
                        +₴{payment.bonus.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-red-600">
                        -₴{payment.deductions.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₴{payment.net.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Квитанція
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-gray-500">
                  Показано 1-{payments.length} з {payments.length} записів
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
                    <TableHead>Дата</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Опис</TableHead>
                    <TableHead>Сума</TableHead>
                    <TableHead>Статус</TableHead>
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
                          <span className="capitalize">{
                            transaction.type === 'lesson' ? 'Заняття' :
                            transaction.type === 'bonus' ? 'Бонус' :
                            transaction.type === 'deduction' ? 'Утримання' :
                            'Інше'
                          }</span>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className={
                        transaction.amount > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'
                      }>
                        {transaction.amount > 0 ? '+' : ''}₴{Math.abs(transaction.amount)}
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