// app/[locale]/(admin)/admin-dashboard/page.tsx
'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Calendar, Car, TrendingUp, DollarSign, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isToday } from 'date-fns'
import { pl, uk } from 'date-fns/locale'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarViewSwitcher } from '@/components/ui/calendar-view-switcher'
import { WeekView } from '@/components/calendar/week-view'
import { MonthView } from '@/components/calendar/month-view'
import { DayView } from '@/components/calendar/day-view'
import { CalendarNavigation } from '@/components/calendar/calendar-navigation'
import { cn } from '@/lib/utils'

export default function AdminDashboard() {
  const t = useTranslations()
  const params = useParams()
  const locale = params.locale as string

  
  // Стейти
  const [activeTab, setActiveTab] = useState('overview')
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [periodFilter, setPeriodFilter] = useState<'today' | 'week' | 'month'>('today')
  
  // Визначаємо локаль для date-fns
  const dateLocale = locale === 'pl' ? pl : locale === 'uk' ? uk : undefined
  
  // Запити даних
  const { data: users } = trpc.user.getAllUsers.useQuery()
  const { data: bookings } = trpc.booking.list.useQuery({})
  const { data: vehicles } = trpc.vehicle.list.useQuery()
  const { data: locations } = trpc.location.list.useQuery()

  // Розрахунок статистики
  const stats = {
    totalUsers: users?.length || 0,
    totalStudents: users?.filter(u => u.role === 'STUDENT').length || 0,
    totalInstructors: users?.filter(u => u.role === 'INSTRUCTOR').length || 0,
    totalAdmins: users?.filter(u => u.role === 'ADMIN').length || 0,
    
    totalBookings: bookings?.length || 0,
    todayBookings: bookings?.filter(b => isToday(new Date(b.startTime))).length || 0,
    upcomingBookings: bookings?.filter(b => new Date(b.startTime) > new Date() && b.status === 'CONFIRMED').length || 0,
    completedBookings: bookings?.filter(b => b.status === 'COMPLETED').length || 0,
    cancelledBookings: bookings?.filter(b => b.status === 'CANCELLED').length || 0,
    
    totalVehicles: vehicles?.length || 0,
    activeVehicles: vehicles?.filter(v => v.status === 'ACTIVE').length || 0,
    
    totalLocations: locations?.length || 0,
    
    // Фінансова статистика (mock)
    todayRevenue: (bookings?.filter(b => isToday(new Date(b.startTime)) && b.status !== 'CANCELLED').length || 0) * 200,
    weekRevenue: (bookings?.filter(b => {
      const date = new Date(b.startTime)
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
      return date >= weekStart && date <= weekEnd && b.status !== 'CANCELLED'
    }).length || 0) * 200,
    monthRevenue: (bookings?.filter(b => {
      const date = new Date(b.startTime)
      const monthStart = startOfMonth(new Date())
      const monthEnd = endOfMonth(new Date())
      return date >= monthStart && date <= monthEnd && b.status !== 'CANCELLED'
    }).length || 0) * 200,
  }

  // Підготовка даних для календаря
  const calendarBookings = bookings?.map(booking => ({
    date: new Date(booking.startTime),
    time: format(new Date(booking.startTime), 'HH:mm'),
    endTime: format(new Date(booking.endTime), 'HH:mm'),
    student: `${booking.student.firstName} ${booking.student.lastName}`,
    instructor: `${booking.instructor.firstName} ${booking.instructor.lastName}`,
    location: booking.location?.name,
    vehicle: booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model}` : null,
    status: booking.status
  })) || []

  // Top performers (mock)
  const topInstructors = users?.filter(u => u.role === 'INSTRUCTOR')
    .slice(0, 5)
    .map(instructor => ({
      name: `${instructor.firstName} ${instructor.lastName}`,
      lessons: bookings?.filter(b => b.instructorId === instructor.id).length || 0,
      revenue: (bookings?.filter(b => b.instructorId === instructor.id && b.status !== 'CANCELLED').length || 0) * 200
    }))

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('navigation.dashboard')}</h1>
          <p className="text-gray-600">{t('adminDashboard.subtitle')}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              <TrendingUp className="w-4 h-4 mr-2" />
              {t('adminDashboard.tabs.overview')}
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="w-4 h-4 mr-2" />
              {t('adminDashboard.tabs.calendar')}
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <DollarSign className="w-4 h-4 mr-2" />
              {t('adminDashboard.tabs.analytics')}
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Przegląd */}
          <TabsContent value="overview" className="space-y-6">
            {/* Główne statystyki */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('adminDashboard.totalUsers')}</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {t('adminDashboard.userBreakdown', { 
                      students: stats.totalStudents, 
                      instructors: stats.totalInstructors 
                    })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('adminDashboard.todayBookings')}</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.todayBookings}</div>
                  <p className="text-xs text-muted-foreground">
                    {t('adminDashboard.upcomingCount', { count: stats.upcomingBookings })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('adminDashboard.vehicles')}</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalVehicles}</div>
                  <p className="text-xs text-muted-foreground">
                    {t('adminDashboard.activeVehicles', { count: stats.activeVehicles })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('adminDashboard.todayRevenue')}</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.todayRevenue} PLN</div>
                  <p className="text-xs text-muted-foreground">{t('adminDashboard.mock')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Statystyki rezerwacji */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('adminDashboard.bookingStats')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{t('booking.status.confirmed')}</span>
                      </div>
                      <span className="font-semibold">{stats.upcomingBookings}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">{t('booking.status.completed')}</span>
                      </div>
                      <span className="font-semibold">{stats.completedBookings}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-sm">{t('booking.status.cancelled')}</span>
                      </div>
                      <span className="font-semibold">{stats.cancelledBookings}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('adminDashboard.topInstructors')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topInstructors?.slice(0, 3).map((instructor, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{instructor.name}</p>
                          <p className="text-xs text-gray-600">
                            {t('adminDashboard.lessonsCount', { count: instructor.lessons })}
                          </p>
                        </div>
                        <span className="font-semibold text-sm">{instructor.revenue} PLN</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ostatnie rezerwacje */}
            <Card>
              <CardHeader>
                <CardTitle>{t('adminDashboard.recentBookings')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings?.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {booking.student.firstName} {booking.student.lastName} → 
                          {booking.instructor.firstName} {booking.instructor.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(booking.startTime), 'dd MMMM yyyy', { locale: dateLocale })} {t('common.at')} {format(new Date(booking.startTime), 'HH:mm')}
                        </p>
                      </div>
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        booking.status === 'CONFIRMED' && 'bg-green-100 text-green-800',
                        booking.status === 'CANCELLED' && 'bg-red-100 text-red-800',
                        booking.status === 'COMPLETED' && 'bg-blue-100 text-blue-800'
                      )}>
                        {t(`booking.status.${booking.status.toLowerCase()}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Kalendarz */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t('adminDashboard.schoolCalendar')}</span>
                  <CalendarViewSwitcher
                    currentView={calendarView}
                    onViewChange={setCalendarView}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarNavigation
                  currentDate={selectedDate}
                  view={calendarView}
                  onDateChange={setSelectedDate}
                  onGoToToday={() => setSelectedDate(new Date())}
                />
                
                <div className="mt-4">
                  {calendarView === 'day' && (
                    <DayView
                      date={selectedDate}
                      slots={calendarBookings
                        .filter(b => format(b.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
                        .map(booking => ({
                          time: booking.time,
                          isBooked: true,
                          bookingInfo: {
                            studentName: `${t('booking.student')}: ${booking.student}`,
                            lessonType: `${t('booking.instructor')}: ${booking.instructor}`,
                            additionalInfo: [
                              booking.location ? `📍 ${booking.location}` : '',
                              booking.vehicle ? `🚗 ${booking.vehicle}` : '',
                              `${booking.time} - ${booking.endTime}`,
                              `${t('common.status')}: ${t(`booking.status.${booking.status.toLowerCase()}`)}`
                            ].filter(Boolean)
                          }
                        }))}
                    />
                  )}

                  {calendarView === 'week' && (
                    <WeekView
                      startDate={selectedDate}
                      slots={calendarBookings
                        .filter(b => {
                          const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
                          const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })
                          return b.date >= weekStart && b.date <= weekEnd
                        })
                        .map(booking => {
                          const day = booking.date.getDay()
                          return {
                            day: day === 0 ? 6 : day - 1,
                            hour: booking.time,
                            isBooked: true,
                            studentName: booking.student,
                            vehicle: booking.vehicle || '',
                            location: booking.location || '',
                            status: booking.status
                          }
                        })}
                    />
                  )}

                  {calendarView === 'month' && (
                    <MonthView
                      currentDate={selectedDate}
                      bookings={calendarBookings.reduce((acc, booking) => {
                        const date = format(booking.date, 'yyyy-MM-dd')
                        const existing = acc.find(b => format(b.date, 'yyyy-MM-dd') === date)
                        if (existing) {
                          existing.count++
                        } else {
                          acc.push({ date: booking.date, count: 1 })
                        }
                        return acc
                      }, [] as { date: Date; count: number }[])}
                      onDayClick={(date) => {
                        setSelectedDate(date)
                        setCalendarView('day')
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Analityka */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('adminDashboard.revenueToday')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.todayRevenue} PLN</div>
                  <p className="text-sm text-gray-600">{t('adminDashboard.lessonsCount', { count: stats.todayBookings })}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('adminDashboard.revenueWeek')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.weekRevenue} PLN</div>
                  <p className="text-sm text-gray-600">{t('adminDashboard.mock')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('adminDashboard.revenueMonth')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.monthRevenue} PLN</div>
                  <p className="text-sm text-gray-600">{t('adminDashboard.mock')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Wykorzystanie zasobów */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('adminDashboard.resourceUtilization')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{t('navigation.instructors')}</span>
                        <span className="text-sm font-medium">
                          {Math.round((stats.todayBookings / (stats.totalInstructors * 4)) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((stats.todayBookings / (stats.totalInstructors * 4)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{t('navigation.vehicles')}</span>
                        <span className="text-sm font-medium">
                          {Math.round((stats.todayBookings / stats.totalVehicles) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((stats.todayBookings / stats.totalVehicles) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('adminDashboard.conversionRate')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">{t('adminDashboard.completionRate')}</span>
                      <span className="font-semibold">
                        {stats.totalBookings > 0 
                          ? Math.round((stats.completedBookings / stats.totalBookings) * 100) 
                          : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{t('adminDashboard.cancellationRate')}</span>
                      <span className="font-semibold text-red-600">
                        {stats.totalBookings > 0 
                          ? Math.round((stats.cancelledBookings / stats.totalBookings) * 100) 
                          : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}