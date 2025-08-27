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
import { pl } from 'date-fns/locale'

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
      period: 'Styczeń 2024',
      amount: 5500,
      lessons: 58,
      hours: 87,
      bonus: 375,
      deductions: 550,
      net: 4975,
      status: 'completed',
      method: 'Przelew bankowy',
      receipt: 'REC-2024-01'
    },
    {
      id: 'PAY002',
      date: '2024-01-01',
      period: 'Grudzień 2023',
      amount: 5300,
      lessons: 56,
      hours: 84,
      bonus: 250,
      deductions: 530,
      net: 4770,
      status: 'completed',
      method: 'Przelew bankowy',
      receipt: 'REC-2023-12'
    },
    {
      id: 'PAY003',
      date: '2023-12-01',
      period: 'Listopad 2023',
      amount: 4625,
      lessons: 48,
      hours: 72,
      bonus: 125,
      deductions: 462,
      net: 4163,
      status: 'completed',
      method: 'Przelew bankowy',
      receipt: 'REC-2023-11'
    },
    {
      id: 'PAY004',
      date: '2023-11-01',
      period: 'Październik 2023',
      amount: 4950,
      lessons: 52,
      hours: 78,
      bonus: 200,
      deductions: 495,
      net: 4455,
      status: 'completed',
      method: 'Przelew bankowy',
      receipt: 'REC-2023-10'
    }
  ]

  // Mock transaction history
  const transactions = [
    {
      id: 'TR001',
      date: '2024-02-03',
      type: 'lesson',
      description: 'Lekcja - Maria Kowalska',
      amount: 95,
      status: 'pending'
    },
    {
      id: 'TR002',
      date: '2024-02-03',
      type: 'lesson',
      description: 'Lekcja - Jan Nowak',
      amount: 95,
      status: 'pending'
    },
    {
      id: 'TR003',
      date: '2024-02-02',
      type: 'lesson',
      description: 'Lekcja - Elena Wiśniewska',
      amount: 95,
      status: 'completed'
    },
    {
      id: 'TR004',
      date: '2024-02-02',
      type: 'bonus',
      description: 'Premia za jakość',
      amount: 125,
      status: 'completed'
    },
    {
      id: 'TR005',
      date: '2024-02-01',
      type: 'deduction',
      description: 'Prowizja platformy',
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
      return <Badge variant="default">Wypłacone</Badge>
    } else if (status === 'pending') {
      return <Badge variant="secondary">Oczekuje</Badge>
    } else {
      return <Badge variant="destructive">Anulowane</Badge>
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
          <h1 className="text-2xl font-bold text-gray-900">Historia wypłat</h1>
          <p className="text-gray-600 mt-1">Przegląd wszystkich wypłat i transakcji</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtr
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Eksport
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Łącznie zarobione</p>
                <p className="text-2xl font-bold">{stats.totalEarned.toLocaleString()} zł</p>
              </div>
              <DollarSign className="w-6 h-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ten rok</p>
                <p className="text-2xl font-bold">{stats.thisYear.toLocaleString()} zł</p>
              </div>
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ostatni miesiąc</p>
                <p className="text-2xl font-bold">{stats.lastMonth.toLocaleString()} zł</p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Średnia/miesiąc</p>
                <p className="text-2xl font-bold">{stats.averagePerMonth.toLocaleString()} zł</p>
              </div>
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments">Wypłaty</TabsTrigger>
          <TabsTrigger value="transactions">Transakcje</TabsTrigger>
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
                      placeholder="Wyszukaj według okresu lub numeru..."
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
                    <SelectItem value="all">Cały czas</SelectItem>
                    <SelectItem value="year">Ten rok</SelectItem>
                    <SelectItem value="quarter">Kwartał</SelectItem>
                    <SelectItem value="month">Miesiąc</SelectItem>
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
                    <TableHead>Data</TableHead>
                    <TableHead>Okres</TableHead>
                    <TableHead>Kwota</TableHead>
                    <TableHead>Lekcje</TableHead>
                    <TableHead>Premie</TableHead>
                    <TableHead>Potrącenia</TableHead>
                    <TableHead>Do wypłaty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {format(new Date(payment.date), 'd MMM yyyy', { locale: pl })}
                      </TableCell>
                      <TableCell className="font-medium">{payment.period}</TableCell>
                      <TableCell>{payment.amount.toLocaleString()} zł</TableCell>
                      <TableCell>{payment.lessons}</TableCell>
                      <TableCell className="text-green-600">
                        +{payment.bonus.toLocaleString()} zł
                      </TableCell>
                      <TableCell className="text-red-600">
                        -{payment.deductions.toLocaleString()} zł
                      </TableCell>
                      <TableCell className="font-semibold">
                        {payment.net.toLocaleString()} zł
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Pokwitowanie
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-gray-500">
                  Pokazano 1-{payments.length} z {payments.length} wpisów
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
                    <TableHead>Data</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Opis</TableHead>
                    <TableHead>Kwota</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {format(new Date(transaction.date), 'd MMM yyyy', { locale: pl })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(transaction.type)}
                          <span className="capitalize">{
                            transaction.type === 'lesson' ? 'Lekcja' :
                            transaction.type === 'bonus' ? 'Premia' :
                            transaction.type === 'deduction' ? 'Potrącenie' :
                            'Inne'
                          }</span>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className={
                        transaction.amount > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'
                      }>
                        {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount)} zł
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