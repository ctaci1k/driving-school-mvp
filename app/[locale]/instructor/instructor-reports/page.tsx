// app/[locale]/(instructor)/instructor-reports/page.tsx

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/layouts/navigation'
import { StatsCard } from '@/components/reports/StatsCard'
import { DateRangePicker } from '@/components/reports/DateRangePicker'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Clock,
  Users,
  TrendingUp,
  DollarSign,
  Car,
  MapPin,
  Phone,
  Mail,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { pl, uk } from 'date-fns/locale'
import { trpc } from '@/lib/trpc/client'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

export default function InstructorReportsPage() {
  const t = useTranslations()
  const params = useParams()
  const locale = params.locale as string
  const { data: session } = useSession()
  
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  })
  const [rateType, setRateType] = useState<'fixed' | 'hourly'>('fixed')

  // Визначаємо локаль для date-fns
  const dateLocale = locale === 'pl' ? pl : locale === 'uk' ? uk : undefined

  // Запити даних
  const { data: stats } = trpc.instructorReports.getStats.useQuery({
    startDate: dateRange.start,
    endDate: dateRange.end
  })

  const { data: workingHours } = trpc.instructorReports.getWorkingHours.useQuery({
    startDate: dateRange.start,
    endDate: dateRange.end
  })

  const { data: lessonsData } = trpc.instructorReports.getLessonsHistory.useQuery({
    startDate: dateRange.start,
    endDate: dateRange.end,
    status: 'ALL'
  })

  const { data: financialReport } = trpc.instructorReports.getFinancialReport.useQuery({
    startDate: dateRange.start,
    endDate: dateRange.end,
    rateType
  })

  const { data: students } = trpc.instructorReports.getStudents.useQuery()

  const { data: weeklyStats } = trpc.instructorReports.getWeeklyStats.useQuery({
    weeks: 8
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {session && <Navigation userRole={session.user.role} />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('navigation.myReports')}</h1>
          <p className="text-gray-600">{t('instructorReports.subtitle')}</p>
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
            title={t('instructorReports.conductedLessons')}
            value={stats?.periodLessons || 0}
            subtitle={t('common.total') + `: ${stats?.totalLessons || 0}`}
            icon={Calendar}
          />
          <StatsCard
            title={t('instructorReports.workedHours')}
            value={`${stats?.totalHours || 0} ${t('instructorReports.hours')}`}
            subtitle={t('instructorReports.forSelectedPeriod')}
            icon={Clock}
          />
          <StatsCard
            title={t('reports.earnings')}
            value={`${stats?.earnings || 0} PLN`}
            subtitle={stats?.rateType === 'fixed' ? t('instructorReports.fixedRate') : t('instructorReports.hourlyRate')}
            icon={DollarSign}
          />
          <StatsCard
            title={t('reports.students')}
            value={stats?.totalStudents || 0}
            subtitle={t('instructorReports.upcomingLessons', { count: stats?.upcomingLessons || 0 })}
            icon={Users}
          />
        </div>

        {/* Перемикач типу оплати */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('instructorReports.paymentCalculationType')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                variant={rateType === 'fixed' ? 'default' : 'outline'}
                onClick={() => setRateType('fixed')}
                className="flex items-center gap-2"
              >
                {rateType === 'fixed' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                {t('instructorReports.fixedRateOption')}
              </Button>
              <Button
                variant={rateType === 'hourly' ? 'default' : 'outline'}
                onClick={() => setRateType('hourly')}
                className="flex items-center gap-2"
              >
                {rateType === 'hourly' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                {t('instructorReports.hourlyRateOption')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Таби з детальною інформацією */}
        <Tabs defaultValue="hours" className="space-y-4">
          <TabsList>
            <TabsTrigger value="hours">{t('reports.workingHours')}</TabsTrigger>
            <TabsTrigger value="lessons">{t('instructorReports.lessonsDetails')}</TabsTrigger>
            <TabsTrigger value="financial">{t('instructorReports.financialReport')}</TabsTrigger>
            <TabsTrigger value="students">{t('instructorReports.myStudents')}</TabsTrigger>
            <TabsTrigger value="weekly">{t('instructorReports.byWeek')}</TabsTrigger>
          </TabsList>

          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle>{t('instructorReports.workingHoursByDay')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {workingHours?.map((day) => (
                    <div 
                      key={day.date.toString()} 
                      className={`flex justify-between items-center p-3 rounded ${
                        day.isWeekend ? 'bg-gray-50' : 
                        day.hours > 0 ? 'bg-green-50' : 'bg-white'
                      } border`}
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">
                            {format(day.date, 'EEEE, d MMMM', { locale: dateLocale })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {day.lessons > 0 ? 
                              t('instructorReports.lessonsCount', { count: day.lessons }) : 
                              t('instructorReports.dayOff')}
                          </p>
                        </div>
                      </div>
                      {day.hours > 0 && (
                        <div className="text-right">
                          <p className="font-semibold">{day.hours} {t('instructorReports.hours')}</p>
                          <p className="text-xs text-gray-500">{t('instructorReports.worked')}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Підсумок */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{t('instructorReports.totalForPeriod')}:</p>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {workingHours?.reduce((sum, day) => sum + day.hours, 0).toFixed(1)} {t('instructorReports.hours')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {workingHours?.filter(day => day.hours > 0).length} {t('instructorReports.workingDays')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons">
            <Card>
              <CardHeader>
                <CardTitle>{t('instructorReports.lessonsDetails')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lessonsData?.lessons.map((lesson) => (
                    <div key={lesson.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">
                              {format(new Date(lesson.startTime), 'dd MMMM yyyy, HH:mm', { locale: dateLocale })}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              lesson.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              lesson.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {t(`booking.status.${lesson.status.toLowerCase()}`)}
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-3 h-3 text-gray-500" />
                              <span className="font-medium">
                                {lesson.student.firstName} {lesson.student.lastName}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              {lesson.student.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {lesson.student.email}
                                </span>
                              )}
                              {lesson.student.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {lesson.student.phone}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
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
                        </div>
                        
                        {lesson.notes && (
                          <div className="text-sm text-gray-600 max-w-xs">
                            <p className="italic">"{lesson.notes}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {!lessonsData?.lessons.length && (
                    <p className="text-center text-gray-500 py-8">{t('instructorReports.noLessonsInPeriod')}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>{t('instructorReports.financialReport')}</CardTitle>
              </CardHeader>
              <CardContent>
                {financialReport && (
                  <>
                    {/* Підсумок */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">{t('instructorReports.lessons')}</p>
                          <p className="text-xl font-bold">{financialReport.summary.totalLessons}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{t('instructorReports.hours')}</p>
                          <p className="text-xl font-bold">{financialReport.summary.totalHours}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{t('instructorReports.grossEarnings')}</p>
                          <p className="text-xl font-bold">{financialReport.summary.grossEarnings} PLN</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{t('instructorReports.netEarnings')}</p>
                          <p className="text-xl font-bold text-green-600">
                            {financialReport.summary.netEarnings} PLN
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <p className="text-sm text-gray-600">
                          {t('instructorReports.calculation')}: {financialReport.summary.rateType === 'fixed' ? 
                            t('instructorReports.fixedRate') : t('instructorReports.hourlyRate')} 
                          ({financialReport.summary.rate} PLN {t('instructorReports.per')} {financialReport.summary.rateType === 'fixed' ? 
                            t('instructorReports.lesson') : t('instructorReports.hour')})
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {t('reports.commission')} (20%): -{financialReport.summary.schoolCommission} PLN
                        </p>
                      </div>
                    </div>

                    {/* Деталізація */}
                    <div className="space-y-2">
                      <h3 className="font-medium mb-2">{t('instructorReports.lessonBreakdown')}:</h3>
                      {financialReport.lessons.map((lesson) => (
                        <div key={lesson.id} className="flex justify-between items-center py-2 border-b last:border-0">
                          <div>
                            <p className="text-sm">
                              {format(new Date(lesson.startTime), 'dd.MM.yyyy HH:mm')}
                            </p>
                            <p className="text-xs text-gray-500">
                              {lesson.student.firstName} {lesson.student.lastName} • {lesson.hours} {t('instructorReports.hours')}
                            </p>
                          </div>
                          <p className="font-medium">{lesson.earnings} PLN</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>{t('instructorReports.myStudents')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students?.map((student) => (
                    <div key={student.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">
                          {student.firstName} {student.lastName}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          {student.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {student.email}
                            </span>
                          )}
                          {student.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {student.phone}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {t('instructorStudents.lastLesson')}: {format(new Date(student.lastLesson), 'dd.MM.yyyy')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{student.totalLessons} {t('instructorReports.lessonsCount2')}</p>
                        <p className="text-xs text-gray-500">{student.completedLessons} {t('booking.status.completed')}</p>
                      </div>
                    </div>
                  ))}
                  
                  {!students?.length && (
                    <p className="text-center text-gray-500 py-8">{t('instructorStudents.noStudents')}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly">
            <Card>
              <CardHeader>
                <CardTitle>{t('instructorReports.weeklyStats')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyStats?.map((week, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b pb-3 last:border-0">
                      <div>
                        <p className="font-medium">
                          {format(week.weekStart, 'dd.MM')} - {format(week.weekEnd, 'dd.MM.yyyy')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t('instructorReports.week')} {weeklyStats.length - idx}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{week.lessons} {t('instructorReports.lessonsCount2')}</p>
                        <p className="text-sm text-gray-500">{week.hours.toFixed(1)} {t('instructorReports.hours')}</p>
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