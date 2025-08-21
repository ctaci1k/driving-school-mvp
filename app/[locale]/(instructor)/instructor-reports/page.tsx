// app/(instructor)/instructor-reports/page.tsx

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
import { uk } from 'date-fns/locale'
import { trpc } from '@/lib/trpc/client'

export default function InstructorReportsPage() {
  const { data: session } = useSession()
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  })
  const [rateType, setRateType] = useState<'fixed' | 'hourly'>('fixed')

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
          <h1 className="text-3xl font-bold mb-2">Мої звіти</h1>
          <p className="text-gray-600">Статистика роботи та заробіток</p>
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
            title="Проведено уроків"
            value={stats?.periodLessons || 0}
            subtitle={`Всього: ${stats?.totalLessons || 0}`}
            icon={Calendar}
          />
          <StatsCard
            title="Відпрацьовано годин"
            value={`${stats?.totalHours || 0} год`}
            subtitle="За вибраний період"
            icon={Clock}
          />
          <StatsCard
            title="Заробіток"
            value={`${stats?.earnings || 0} PLN`}
            subtitle={stats?.rateType === 'fixed' ? 'Фіксована ставка' : 'Погодинна оплата'}
            icon={DollarSign}
          />
          <StatsCard
            title="Студентів"
            value={stats?.totalStudents || 0}
            subtitle={`Майбутніх уроків: ${stats?.upcomingLessons || 0}`}
            icon={Users}
          />
        </div>

        {/* Перемикач типу оплати */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Тип розрахунку оплати</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                variant={rateType === 'fixed' ? 'default' : 'outline'}
                onClick={() => setRateType('fixed')}
                className="flex items-center gap-2"
              >
                {rateType === 'fixed' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                Фіксована ставка (100 PLN/урок)
              </Button>
              <Button
                variant={rateType === 'hourly' ? 'default' : 'outline'}
                onClick={() => setRateType('hourly')}
                className="flex items-center gap-2"
              >
                {rateType === 'hourly' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                Погодинна оплата (50 PLN/год)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Таби з детальною інформацією */}
        <Tabs defaultValue="hours" className="space-y-4">
          <TabsList>
            <TabsTrigger value="hours">Робочі години</TabsTrigger>
            <TabsTrigger value="lessons">Деталізація уроків</TabsTrigger>
            <TabsTrigger value="financial">Фінансовий звіт</TabsTrigger>
            <TabsTrigger value="students">Мої студенти</TabsTrigger>
            <TabsTrigger value="weekly">По тижнях</TabsTrigger>
          </TabsList>

          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle>Робочі години по днях</CardTitle>
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
                            {format(day.date, 'EEEE, d MMMM', { locale: uk })}
                          </p>
                          <p className="text-sm text-gray-500">
                            {day.lessons > 0 ? `${day.lessons} уроків` : 'Вихідний/Немає уроків'}
                          </p>
                        </div>
                      </div>
                      {day.hours > 0 && (
                        <div className="text-right">
                          <p className="font-semibold">{day.hours} год</p>
                          <p className="text-xs text-gray-500">відпрацьовано</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Підсумок */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Всього за період:</p>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {workingHours?.reduce((sum, day) => sum + day.hours, 0).toFixed(1)} год
                      </p>
                      <p className="text-sm text-gray-500">
                        {workingHours?.filter(day => day.hours > 0).length} робочих днів
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
                <CardTitle>Деталізація уроків</CardTitle>
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
                    <p className="text-center text-gray-500 py-8">Немає уроків за вибраний період</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Фінансовий звіт</CardTitle>
              </CardHeader>
              <CardContent>
                {financialReport && (
                  <>
                    {/* Підсумок */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Уроків</p>
                          <p className="text-xl font-bold">{financialReport.summary.totalLessons}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Годин</p>
                          <p className="text-xl font-bold">{financialReport.summary.totalHours}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Нараховано</p>
                          <p className="text-xl font-bold">{financialReport.summary.grossEarnings} PLN</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">До виплати</p>
                          <p className="text-xl font-bold text-green-600">
                            {financialReport.summary.netEarnings} PLN
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <p className="text-sm text-gray-600">
                          Розрахунок: {financialReport.summary.rateType === 'fixed' ? 'Фіксована ставка' : 'Погодинна оплата'} 
                          ({financialReport.summary.rate} PLN за {financialReport.summary.rateType === 'fixed' ? 'урок' : 'годину'})
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Комісія школи (20%): -{financialReport.summary.schoolCommission} PLN
                        </p>
                      </div>
                    </div>

                    {/* Деталізація */}
                    <div className="space-y-2">
                      <h3 className="font-medium mb-2">Деталізація по урокам:</h3>
                      {financialReport.lessons.map((lesson) => (
                        <div key={lesson.id} className="flex justify-between items-center py-2 border-b last:border-0">
                          <div>
                            <p className="text-sm">
                              {format(new Date(lesson.startTime), 'dd.MM.yyyy HH:mm')}
                            </p>
                            <p className="text-xs text-gray-500">
                              {lesson.student.firstName} {lesson.student.lastName} • {lesson.hours} год
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
                <CardTitle>Мої студенти</CardTitle>
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
                          Останній урок: {format(new Date(student.lastLesson), 'dd.MM.yyyy')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{student.totalLessons} уроків</p>
                        <p className="text-xs text-gray-500">{student.completedLessons} завершено</p>
                      </div>
                    </div>
                  ))}
                  
                  {!students?.length && (
                    <p className="text-center text-gray-500 py-8">У вас ще немає студентів</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly">
            <Card>
              <CardHeader>
                <CardTitle>Статистика по тижнях</CardTitle>
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
                          Тиждень {weeklyStats.length - idx}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{week.lessons} уроків</p>
                        <p className="text-sm text-gray-500">{week.hours.toFixed(1)} год</p>
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