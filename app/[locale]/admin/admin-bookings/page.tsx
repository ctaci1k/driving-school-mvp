// app/[locale]/(admin)/admin-bookings/page.tsx
'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc/client'
import { format, startOfWeek, addDays } from 'date-fns'
import { pl, uk } from 'date-fns/locale'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarViewSwitcher } from '@/components/ui/calendar-view-switcher'
import { DayView } from '@/components/calendar/day-view'
import { WeekView } from '@/components/calendar/week-view'
import { MonthView } from '@/components/calendar/month-view'
import { CalendarNavigation } from '@/components/calendar/calendar-navigation'
import { Calendar, List, Filter, Download, TrendingUp, Users, Car, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/layouts/navigation'

export default function AdminBookingsPage() {
  const t = useTranslations()
  const params = useParams()
  const locale = params.locale as string
  const { data: session } = useSession()
  
  // Стейти
  const [activeTab, setActiveTab] = useState('calendar')
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filterInstructor, setFilterInstructor] = useState('')
  const [filterStudent, setFilterStudent] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'cancelled' | 'completed'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // Визначаємо локаль для date-fns
  const dateLocale = locale === 'pl' ? pl : locale === 'uk' ? uk : undefined
  
  // Запити даних
  const { data: bookings, isLoading, refetch } = trpc.booking.list.useQuery({})
  const { data: instructors } = trpc.user.getInstructors.useQuery()
const { data: allUsers } = trpc.user.getAllUsers.useQuery()
const students = allUsers?.filter(u => u.role === 'STUDENT') || []
  const { data: locations } = trpc.location.list.useQuery()
  const { data: vehicles } = trpc.vehicle.list.useQuery()
  
  const cancelMutation = trpc.booking.cancel.useMutation({
    onSuccess: () => refetch(),
  })

  // Фільтрація бронювань
  const filteredBookings = bookings?.filter(b => {
    // Фільтр по статусу
    if (filterStatus !== 'all' && b.status !== filterStatus.toUpperCase()) return false
    
    // Фільтр по інструктору
    if (filterInstructor && b.instructorId !== filterInstructor) return false
    
    // Фільтр по студенту
    if (filterStudent && b.studentId !== filterStudent) return false
    
    // Фільтр по локації
    if (filterLocation && b.locationId !== filterLocation) return false
    
    // Пошук по імені
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const studentName = `${b.student.firstName} ${b.student.lastName}`.toLowerCase()
      const instructorName = `${b.instructor.firstName} ${b.instructor.lastName}`.toLowerCase()
      if (!studentName.includes(query) && !instructorName.includes(query)) return false
    }
    
    return true
  }) || []

  // Статистика
  const stats = {
    total: bookings?.length || 0,
    confirmed: bookings?.filter(b => b.status === 'CONFIRMED').length || 0,
    completed: bookings?.filter(b => b.status === 'COMPLETED').length || 0,
    cancelled: bookings?.filter(b => b.status === 'CANCELLED').length || 0,
    todayCount: bookings?.filter(b => 
      format(new Date(b.startTime), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    ).length || 0,
    activeInstructors: new Set(bookings?.map(b => b.instructorId)).size,
    activeStudents: new Set(bookings?.map(b => b.studentId)).size,
    activeVehicles: new Set(bookings?.filter(b => b.vehicleId).map(b => b.vehicleId)).size,
  }

  const handleCancel = (bookingId: string) => {
    if (confirm(t('adminBookings.confirmCancel'))) {
      cancelMutation.mutate({ id: bookingId })
    }
  }

  // Експорт в CSV
  const handleExport = () => {
    const csv = [
      [t('common.date'), t('common.time'), t('booking.student'), t('booking.instructor'), t('booking.location'), t('booking.vehicle'), t('common.status')],
      ...filteredBookings.map(b => [
        format(new Date(b.startTime), 'yyyy-MM-dd'),
        `${format(new Date(b.startTime), 'HH:mm')}-${format(new Date(b.endTime), 'HH:mm')}`,
        `${b.student.firstName} ${b.student.lastName}`,
        `${b.instructor.firstName} ${b.instructor.lastName}`,
        b.location?.name || '',
        b.vehicle ? `${b.vehicle.make} ${b.vehicle.model}` : '',
        b.status
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${t('adminBookings.allBookings')}-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
  }

if (isLoading) {
  return (
    <div className="min-h-screen bg-gray-50">
      {session && <Navigation userRole={session.user.role} />}
      <div className="flex items-center justify-center min-h-[400px]">
        <p>{t('adminBookings.loadingBookings')}</p>
      </div>
    </div>
  )
}

  return (  <div className="min-h-screen bg-gray-50">
    {session && <Navigation userRole={session.user.role} />}

    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('navigation.allBookings')}</h1>
        <p className="text-gray-600">{t('adminBookings.subtitle')}</p>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-600">{t('common.total')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <p className="text-xs text-gray-600">{t('booking.status.confirmed')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
            <p className="text-xs text-gray-600">{t('booking.status.completed')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <p className="text-xs text-gray-600">{t('booking.status.cancelled')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.todayCount}</div>
            <p className="text-xs text-gray-600">{t('calendar.today')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.activeInstructors}</div>
            <p className="text-xs text-gray-600">{t('navigation.instructors')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.activeStudents}</div>
            <p className="text-xs text-gray-600">{t('navigation.students')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.activeVehicles}</div>
            <p className="text-xs text-gray-600">{t('navigation.vehicles')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtry */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                {t('calendar.filters.title')}
                {(filterInstructor || filterStudent || filterLocation || filterStatus !== 'all' || searchQuery) && 
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {[filterInstructor, filterStudent, filterLocation, filterStatus !== 'all', searchQuery].filter(Boolean).length}
                  </span>
                }
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                {t('reports.export')}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder={t('calendar.filters.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <Label>{t('booking.instructor')}</Label>
                <Select value={filterInstructor} onValueChange={setFilterInstructor}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('calendar.filters.allInstructors')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('calendar.filters.allInstructors')}</SelectItem>
                    {instructors?.map(instructor => (
                      <SelectItem key={instructor.id} value={instructor.id}>
                        {instructor.firstName} {instructor.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t('booking.student')}</Label>
                <Select value={filterStudent} onValueChange={setFilterStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('calendar.filters.allStudents')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('calendar.filters.allStudents')}</SelectItem>
                    {students?.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t('booking.location')}</Label>
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('calendar.filters.allLocations')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('calendar.filters.allLocations')}</SelectItem>
                    {locations?.map(location => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t('common.status')}</Label>
                <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('calendar.filters.allStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('calendar.filters.allStatuses')}</SelectItem>
                    <SelectItem value="confirmed">{t('booking.status.confirmed')}</SelectItem>
                    <SelectItem value="completed">{t('booking.status.completed')}</SelectItem>
                    <SelectItem value="cancelled">{t('booking.status.cancelled')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar">
            <Calendar className="w-4 h-4 mr-2" />
            {t('adminBookings.tabs.calendar')}
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="w-4 h-4 mr-2" />
            {t('adminBookings.tabs.list')}
          </TabsTrigger>
        </TabsList>

        {/* Widok kalendarza */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('adminBookings.calendarView')}</span>
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
                    slots={filteredBookings
                      .filter(b => format(new Date(b.startTime), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
                      .map(booking => ({
                        time: format(new Date(booking.startTime), 'HH:mm'),
                        isBooked: true,
                        bookingInfo: {
                          studentName: `${t('booking.student')}: ${booking.student.firstName} ${booking.student.lastName}`,
                          lessonType: `${t('booking.instructor')}: ${booking.instructor.firstName} ${booking.instructor.lastName}`,
                          additionalInfo: [
                            booking.location ? `📍 ${booking.location.name}` : '',
                            booking.vehicle ? `🚗 ${booking.vehicle.make} ${booking.vehicle.model}` : '',
                            `${t('common.status')}: ${t(`booking.status.${booking.status.toLowerCase()}`)}`
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
                          vehicle: booking.vehicle ? `${booking.vehicle.make}` : '',
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

        {/* Widok listy */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>
                {t('adminBookings.bookingsCount', { count: filteredBookings.length })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">{t('common.date')}</th>
                      <th className="text-left p-2">{t('common.time')}</th>
                      <th className="text-left p-2">{t('booking.student')}</th>
                      <th className="text-left p-2">{t('booking.instructor')}</th>
                      <th className="text-left p-2">{t('booking.location')}</th>
                      <th className="text-left p-2">{t('booking.vehicle')}</th>
                      <th className="text-left p-2">{t('common.status')}</th>
                      <th className="text-left p-2">{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          {format(new Date(booking.startTime), 'd MMM yyyy', { locale: dateLocale })}
                        </td>
                        <td className="p-2">
                          {format(new Date(booking.startTime), 'HH:mm')} - 
                          {format(new Date(booking.endTime), 'HH:mm')}
                        </td>
                        <td className="p-2">
                          {booking.student.firstName} {booking.student.lastName}
                        </td>
                        <td className="p-2">
                          {booking.instructor.firstName} {booking.instructor.lastName}
                        </td>
                        <td className="p-2">
                          {booking.location?.name || '-'}
                        </td>
                        <td className="p-2">
                          {booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model}` : '-'}
                        </td>
                        <td className="p-2">
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            booking.status === 'CONFIRMED' && 'bg-green-100 text-green-800',
                            booking.status === 'CANCELLED' && 'bg-red-100 text-red-800',
                            booking.status === 'COMPLETED' && 'bg-blue-100 text-blue-800',
                            booking.status === 'NO_SHOW' && 'bg-gray-100 text-gray-800'
                          )}>
                            {t(`booking.status.${booking.status.toLowerCase()}`)}
                          </span>
                        </td>
                        <td className="p-2">
                          {booking.status === 'CONFIRMED' && (
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleCancel(booking.id)}
                            >
                              {t('common.cancel')}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
</div>
    
  )
}