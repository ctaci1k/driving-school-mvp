// app/(student)/student-reports/page.tsx

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/layouts/navigation'
import { StatsCard } from '@/components/reports/StatsCard'
import { DateRangePicker } from '@/components/reports/DateRangePicker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  CreditCard, 
  Package, 
  TrendingUp,
  Clock,
  Car,
  MapPin,
  User
} from 'lucide-react'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { 
  exportToCSV, 
  formatLessonsForExport, 
  formatPaymentsForExport 
} from '@/lib/utils/export'




export default function StudentReportsPage() {
  const { data: session } = useSession()
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  })
// Функції експорту
  const handleExportLessons = () => {
    if (lessonsData?.lessons) {
      const formatted = formatLessonsForExport(lessonsData.lessons)
      exportToCSV(formatted, 'moji_uroky')
    }
  }

  const handleExportPayments = () => {
    if (paymentsData?.payments) {
      const formatted = formatPaymentsForExport(paymentsData.payments)
      exportToCSV(formatted, 'moji_platezhi')
    }
  }
  // Запити даних
  const { data: stats } = trpc.studentReports.getStats.useQuery({
    startDate: dateRange.start,
    endDate: dateRange.end
  })

  const { data: lessonsData } = trpc.studentReports.getLessonsHistory.useQuery({
    startDate: dateRange.start,
    endDate: dateRange.end,
    status: 'ALL'
  })

  const { data: packages } = trpc.studentReports.getPackages.useQuery()
  
  const { data: paymentsData } = trpc.studentReports.getPayments.useQuery({
    startDate: dateRange.start,
    endDate: dateRange.end
  })

  const { data: monthlyStats } = trpc.studentReports.getMonthlyStats.useQuery({
    months: 6
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {session && <Navigation userRole={session.user.role} />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Мої звіти</h1>
          <p className="text-gray-600">Статистика навчання та фінанси</p>
        </div>

        {/* Вибір періоду */}
        <div className="mb-6">
          <DateRangePicker 
            onDateChange={(start, end) => setDateRange({ start, end })}
          />
        </div>

        {/* Основні метрики */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Всього уроків"
            value={stats?.totalLessons || 0}
            subtitle={`${stats?.periodLessons || 0} за період`}
            icon={Calendar}
          />
          <StatsCard
            title="Майбутні уроки"
            value={stats?.upcomingLessons || 0}
            subtitle="Заплановано"
            icon={Clock}
          />
          <StatsCard
            title="Доступні кредити"
            value={stats?.availableCredits || 0}
            subtitle={`Використано: ${stats?.usedCredits || 0}`}
            icon={Package}
          />
          <StatsCard
            title="Витрачено"
            value={`${stats?.periodSpent || 0} PLN`}
            subtitle={`Всього: ${stats?.totalSpent || 0} PLN`}
            icon={CreditCard}
          />
        </div>

        {/* Прогрес навчання */}
        {stats && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Прогрес навчання</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${Math.min(stats.progress, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                Пройдено {stats.totalLessons} уроків з приблизно 30 необхідних ({stats.progress}%)
              </p>
            </CardContent>
          </Card>
        )}

        {/* Таби з детальною інформацією */}
        <Tabs defaultValue="lessons" className="space-y-4">
          <TabsList>
            <TabsTrigger value="lessons">Історія уроків</TabsTrigger>
            <TabsTrigger value="packages">Пакети</TabsTrigger>
            <TabsTrigger value="payments">Платежі</TabsTrigger>
            <TabsTrigger value="monthly">По місяцях</TabsTrigger>
          </TabsList>

          <TabsContent value="lessons">
            <Card>
              <CardHeader>
                <CardTitle>Історія уроків</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lessonsData?.lessons.map((lesson) => (
                    <div key={lesson.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">
                              {format(new Date(lesson.startTime), 'dd MMMM yyyy, HH:mm', { locale: uk })}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              lesson.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              lesson.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {lesson.status === 'COMPLETED' ? 'Завершено' :
                               lesson.status === 'CANCELLED' ? 'Скасовано' :
                               'Заплановано'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {lesson.instructor.firstName} {lesson.instructor.lastName}
                            </span>
                            {lesson.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {lesson.location.name}
                              </span>
                            )}
                            {lesson.vehicle && (
                              <span className="flex items-center gap-1">
                                <Car className="w-3 h-3" />
                                {lesson.vehicle.make} {lesson.vehicle.model}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {lesson.payment ? (
                            <div>
                              <p className="font-medium">{Number(lesson.payment.amount)} PLN</p>
                              <p className="text-xs text-gray-500">{lesson.payment.method}</p>
                            </div>
                          ) : lesson.usedCredits > 0 ? (
                            <p className="text-sm text-gray-600">{lesson.usedCredits} кредит</p>
                          ) : (
                            <p className="text-sm text-gray-400">Не оплачено</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {!lessonsData?.lessons.length && (
                    <p className="text-center text-gray-500 py-8">Немає уроків за вибраний період</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages">
            <Card>
<CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Історія уроків</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExportLessons}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Експорт CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {packages?.map((pkg) => (
                    <div key={pkg.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">{pkg.package.name}</h3>
                          {pkg.package.description && (
                            <p className="text-sm text-gray-600 mt-1">{pkg.package.description}</p>
                          )}
                          <p className="text-sm text-gray-500 mt-2">
                            Куплено: {format(new Date(pkg.purchasedAt), 'dd.MM.yyyy')}
                          </p>
                          <p className="text-sm text-gray-500">
                            Діє до: {format(new Date(pkg.expiresAt), 'dd.MM.yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{pkg.creditsRemaining}/{pkg.creditsTotal}</p>
                          <p className="text-sm text-gray-500">кредитів</p>
                        </div>
                      </div>
                      
                      {pkg.usageHistory.length > 0 && (
                        <div className="border-t pt-3">
                          <p className="text-sm font-medium mb-2">Історія використання:</p>
                          <div className="space-y-1">
                            {pkg.usageHistory.slice(0, 3).map((usage, idx) => (
                              <div key={idx} className="flex justify-between text-sm text-gray-600">
                                <span>{format(new Date(usage.startTime), 'dd.MM.yyyy HH:mm')}</span>
                                <span>-{usage.usedCredits} кредит</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {!packages?.length && (
                    <p className="text-center text-gray-500 py-8">У вас немає пакетів</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Історія платежів</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExportPayments}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Експорт CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentsData?.payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">
                          {payment.booking ? 
                            `Урок ${format(new Date(payment.booking.startTime), 'dd.MM.yyyy')}` :
                            payment.userPackage ? 
                            `Пакет "${payment.userPackage.package.name}"` :
                            'Платіж'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(payment.createdAt), 'dd.MM.yyyy HH:mm')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{payment.amount} PLN</p>
                        <p className={`text-xs ${
                          payment.status === 'COMPLETED' ? 'text-green-600' :
                          payment.status === 'PENDING' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {payment.status === 'COMPLETED' ? 'Оплачено' :
                           payment.status === 'PENDING' ? 'Очікується' :
                           'Скасовано'}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {!paymentsData?.payments.length && (
                    <p className="text-center text-gray-500 py-8">Немає платежів за вибраний період</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <Card>
              <CardHeader>
                <CardTitle>Статистика по місяцях</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyStats?.map((stat) => (
                    <div key={stat.month.toString()} className="flex justify-between items-center border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">
                          {format(stat.month, 'LLLL yyyy', { locale: uk })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {stat.lessons} {stat.lessons === 1 ? 'урок' : 'уроків'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{stat.spent} PLN</p>
                        <p className="text-xs text-gray-500">витрачено</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}