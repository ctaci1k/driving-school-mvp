// app/[locale]/(instructor)/instructor-dashboard/page.tsx
'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Calendar, Clock, User, TrendingUp, Filter, Download } from 'lucide-react'
import { format, isToday, isTomorrow, startOfWeek, endOfWeek, addDays } from 'date-fns'
import { pl, uk } from 'date-fns/locale'
import { trpc } from '@/lib/trpc/client'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CalendarViewSwitcher } from '@/components/ui/calendar-view-switcher'
import { DayView } from '@/components/calendar/day-view'
import { WeekView } from '@/components/calendar/week-view'
import { MonthView } from '@/components/calendar/month-view'
import { CalendarNavigation } from '@/components/calendar/calendar-navigation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export default function InstructorDashboard() {
  const t = useTranslations()
  const params = useParams()
  const locale = params.locale as string
  const { data: session } = useSession()
  
  // Стейти
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState('overview')
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'completed'>('all')
  
  // Визначаємо локаль для date-fns
  const dateLocale = locale === 'pl' ? pl : locale === 'uk' ? uk : undefined
  
  // Запити даних
  const { data: bookings, isLoading } = trpc.booking.list.useQuery({})
  
  // Фільтрація бронювань
  const filteredBookings = bookings?.filter(b => {
    if (filterStatus === 'confirmed') return b.status === 'CONFIRMED'
    if (filterStatus === 'completed') return b.status === 'COMPLETED'
    return true
  }) || []
  
  // Статистика
  const todayBookings = filteredBookings.filter((booking) => 
    isToday(new Date(booking.startTime)) && booking.status === 'CONFIRMED'
  )
  
  const tomorrowBookings = filteredBookings.filter((booking) => 
    isTomorrow(new Date(booking.startTime)) && booking.status === 'CONFIRMED'
  )

  const weekBookings = filteredBookings.filter((booking) => {
    const bookingDate = new Date(booking.startTime)
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })
    return bookingDate >= weekStart && bookingDate <= weekEnd && booking.status === 'CONFIRMED'
  })

  const upcomingBookings = filteredBookings.filter((booking) => 
    new Date(booking.startTime) > new Date() && booking.status === 'CONFIRMED'
  )

  // Підготовка даних для календаря
  const prepareCalendarSlots = () => {
    return filteredBookings.map(booking => ({
      startTime: new Date(booking.startTime),
      endTime: new Date(booking.endTime),
      studentName: `${booking.student.firstName} ${booking.student.lastName}`,
      studentEmail: booking.student.email,
      studentPhone: booking.student.phone,
      vehicle: booking.vehicle,
      location: booking.location,
      status: booking.status,
      notes: booking.notes
    }))
  }

  // Експорт в CSV
  const handleExport = () => {
    const csv = [
      [t('common.date'), t('common.time'), t('booking.student'), t('common.status')],
      ...filteredBookings.map(b => [
        format(new Date(b.startTime), 'yyyy-MM-dd'),
        format(new Date(b.startTime), 'HH:mm'),
        `${b.student.firstName} ${b.student.lastName}`,
        b.status
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${t('instructorDashboard.myLessons')}-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <p>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('navigation.dashboard')}</h1>
          <p className="text-gray-600">{t('instructorDashboard.subtitle')}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              <TrendingUp className="w-4 h-4 mr-2" />
              {t('instructorDashboard.tabs.overview')}
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="w-4 h-4 mr-2" />
              {t('instructorDashboard.tabs.calendar')}
            </TabsTrigger>
            <TabsTrigger value="list">
              <User className="w-4 h-4 mr-2" />
              {t('instructorDashboard.tabs.list')}
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Przegląd */}
          <TabsContent value="overview" className="space-y-6">
            {/* Statystyki */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('instructorDashboard.todaysLessons')}</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayBookings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {todayBookings.length > 0 
                      ? t('instructorDashboard.nextAt', { time: format(new Date(todayBookings[0].startTime), 'HH:mm') })
                      : t('instructorDashboard.noLessonsToday')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('instructorDashboard.tomorrow')}</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tomorrowBookings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {tomorrowBookings.length > 0
                      ? t('instructorDashboard.firstAt', { time: format(new Date(tomorrowBookings[0].startTime), 'HH:mm') })
                      : t('instructorDashboard.noLessonsTomorrow')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('instructorDashboard.thisWeek')}</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weekBookings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {t('instructorDashboard.hoursTotal', { hours: weekBookings.length * 2 })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('instructorDashboard.upcoming')}</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{upcomingBookings.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {t('instructorDashboard.nextDays', { days: 30 })}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Dzisiejszy harmonogram */}
            <Card>
              <CardHeader>
                <CardTitle>{t('instructorDashboard.todaysSchedule')}</CardTitle>
              </CardHeader>
              <CardContent>
                {todayBookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">{t('instructorDashboard.noLessonsToday')}</p>
                ) : (
                  <div className="space-y-3">
                    {todayBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-lg font-semibold">
                            {format(new Date(booking.startTime), 'HH:mm')}
                          </div>
                          <div>
                            <p className="font-medium">
                              {booking.student.firstName} {booking.student.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {booking.location?.name || t('booking.noLocation')} • 
                              {booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model}` : t('booking.noVehicle')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {booking.student.phone && (
                            <a href={`tel:${booking.student.phone}`} className="text-blue-600 hover:underline text-sm">
                              📞 {booking.student.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Kalendarz */}
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t('instructorDashboard.calendarView')}</span>
                  <div className="flex items-center gap-2">
                    <CalendarViewSwitcher
                      currentView={calendarView}
                      onViewChange={setCalendarView}
                    />
                    <Button variant="outline" size="sm" onClick={handleExport}>
                      <Download className="w-4 h-4 mr-2" />
                      {t('common.export')}
                    </Button>
                  </div>
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
                      slots={filteredBookings
                        .filter(b => format(new Date(b.startTime), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
                        .map(booking => ({
                          time: format(new Date(booking.startTime), 'HH:mm'),
                          isBooked: true,
                          bookingInfo: {
                            studentName: `${booking.student.firstName} ${booking.student.lastName}`,
                            lessonType: `${format(new Date(booking.startTime), 'HH:mm')} - ${format(new Date(booking.endTime), 'HH:mm')}`,
                            additionalInfo: [
                              `📧 ${booking.student.email}`,
                              booking.student.phone ? `📞 ${booking.student.phone}` : '',
                              booking.location ? `📍 ${booking.location.name}` : '',
                              booking.vehicle ? `🚗 ${booking.vehicle.make} ${booking.vehicle.model}` : '',
                              booking.notes ? `💬 ${booking.notes}` : ''
                            ].filter(Boolean)
                          }
                        }))}
                    />
                  )}

                  {calendarView === 'week' && (
                    <WeekView
                      startDate={selectedDate}
                      slots={filteredBookings
                        .filter(b => {
                          const bookingDate = new Date(b.startTime)
                          const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
                          const weekEnd = addDays(weekStart, 7)
                          return bookingDate >= weekStart && bookingDate < weekEnd
                        })
                        .map(booking => {
                          const day = new Date(booking.startTime).getDay()
                          return {
                            day: day === 0 ? 6 : day - 1,
                            hour: format(new Date(booking.startTime), 'HH:mm'),
                            isBooked: true,
                            studentName: `${booking.student.firstName} ${booking.student.lastName}`,
                            vehicle: booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model}` : '',
                            location: booking.location?.name || '',
                            status: booking.status
                          }
                        })}
                    />
                  )}

                  {calendarView === 'month' && (
                    <MonthView
                      currentDate={selectedDate}
                      bookings={filteredBookings.reduce((acc, booking) => {
                        const date = format(new Date(booking.startTime), 'yyyy-MM-dd')
                        const existing = acc.find(b => format(b.date, 'yyyy-MM-dd') === date)
                        if (existing) {
                          existing.count++
                        } else {
                          acc.push({ date: new Date(booking.startTime), count: 1 })
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

          {/* Tab 3: Lista */}
          <TabsContent value="list" className="space-y-4">
            {/* Filtry */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('all')}
                  >
                    {t('common.all')} ({bookings?.length || 0})
                  </Button>
                  <Button
                    variant={filterStatus === 'confirmed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('confirmed')}
                  >
                    {t('booking.status.confirmed')} ({bookings?.filter(b => b.status === 'CONFIRMED').length || 0})
                  </Button>
                  <Button
                    variant={filterStatus === 'completed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('completed')}
                  >
                    {t('booking.status.completed')} ({bookings?.filter(b => b.status === 'COMPLETED').length || 0})
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista lekcji */}
            <div className="space-y-3">
              {filteredBookings.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">{t('messages.noData')}</p>
                  </CardContent>
                </Card>
              ) : (
                filteredBookings.map((booking) => (
                  <Card key={booking.id} className={cn(
                    booking.status === 'CANCELLED' && 'opacity-60',
                    new Date(booking.startTime) < new Date() && booking.status !== 'COMPLETED' && 'bg-gray-50'
                  )}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">
                              {format(new Date(booking.startTime), 'EEEE, d MMMM yyyy', { locale: dateLocale })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>
                              {format(new Date(booking.startTime), 'HH:mm')} - 
                              {format(new Date(booking.endTime), 'HH:mm')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span>
                              {booking.student.firstName} {booking.student.lastName}
                            </span>
                          </div>
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
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}