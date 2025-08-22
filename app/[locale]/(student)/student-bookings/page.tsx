'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/layouts/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Filter, Download, X } from 'lucide-react'
import { pl, uk } from 'date-fns/locale'
import { trpc } from '@/lib/trpc/client'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { CalendarViewSwitcher } from '@/components/ui/calendar-view-switcher'
import { DayView } from '@/components/calendar/day-view'
import { WeekView } from '@/components/calendar/week-view'
import { MonthView } from '@/components/calendar/month-view'
import { CalendarNavigation } from '@/components/calendar/calendar-navigation'
import { cn } from '@/lib/utils'
import { format, startOfWeek, addDays } from 'date-fns'

export default function StudentBookingsPage() {
  const t = useTranslations()
  const params = useParams()
  const locale = params.locale as string
  const { data: session } = useSession()
  const { data: bookings, isLoading, refetch } = trpc.booking.list.useQuery({})
  
  // Стейти для календаря
  const [calendarView, setCalendarView] = useState<'list' | 'day' | 'week' | 'month'>('list')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all')
  const [showFilters, setShowFilters] = useState(false)
  
  // Визначаємо локаль для date-fns
  const dateLocale = locale === 'pl' ? pl : locale === 'uk' ? uk : undefined
  
  const cancelMutation = trpc.booking.cancel.useMutation({
    onSuccess: () => {
      refetch()
    },
  })

  const handleCancel = (bookingId: string) => {
    if (confirm(t('messages.confirmDelete'))) {
      cancelMutation.mutate({ id: bookingId })
    }
  }

  // Фільтрація бронювань
  const filteredBookings = bookings?.filter(b => {
    if (filterStatus === 'upcoming') {
      return new Date(b.startTime) > new Date() && b.status === 'CONFIRMED'
    }
    if (filterStatus === 'past') {
      return new Date(b.startTime) <= new Date() || b.status === 'COMPLETED'
    }
    if (filterStatus === 'cancelled') {
      return b.status === 'CANCELLED'
    }
    return true // all
  }) || []

  // Підготовка даних для календарних видів
  const calendarSlots = filteredBookings.map(booking => ({
    startTime: new Date(booking.startTime),
    endTime: new Date(booking.endTime),
    instructor: `${booking.instructor.firstName} ${booking.instructor.lastName}`,
    status: booking.status,
    id: booking.id
  }))

  // Експорт в CSV
  const handleExport = () => {
    const csv = [
      ['Data', 'Czas', 'Instruktor', 'Status'],
      ...filteredBookings.map(b => [
        format(new Date(b.startTime), 'yyyy-MM-dd'),
        format(new Date(b.startTime), 'HH:mm'),
        `${b.instructor.firstName} ${b.instructor.lastName}`,
        b.status
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `moje-lekcje-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {session && <Navigation userRole={session.user.role} />}
        <div className="flex items-center justify-center min-h-[400px]">
          <p>{t('studentBookings.loadingBookings')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {session && <Navigation userRole={session.user.role} />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('navigation.myBookings')}</h1>
          <p className="text-gray-600">{t('studentBookings.subtitle')}</p>
        </div>

        {/* Toolbar z filtrami i widokami */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              {/* Przełącznik widoków */}
              <div className="flex items-center gap-2">
                <Button
                  variant={calendarView === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCalendarView('list')}
                >
                  Lista
                </Button>
                <CalendarViewSwitcher
                  currentView={calendarView === 'list' ? 'day' : calendarView as any}
                  onViewChange={(view) => setCalendarView(view)}
                />
              </div>

              {/* Filtry i akcje */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtry
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Eksport CSV
                </Button>
              </div>
            </div>

            {/* Panel filtrów */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('all')}
                  >
                    Wszystkie ({bookings?.length || 0})
                  </Button>
                  <Button
                    variant={filterStatus === 'upcoming' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('upcoming')}
                  >
                    Nadchodzące ({bookings?.filter(b => new Date(b.startTime) > new Date() && b.status === 'CONFIRMED').length || 0})
                  </Button>
                  <Button
                    variant={filterStatus === 'past' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('past')}
                  >
                    Przeszłe ({bookings?.filter(b => new Date(b.startTime) <= new Date()).length || 0})
                  </Button>
                  <Button
                    variant={filterStatus === 'cancelled' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('cancelled')}
                  >
                    Anulowane ({bookings?.filter(b => b.status === 'CANCELLED').length || 0})
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Widok listy (domyślny) */}
        {calendarView === 'list' && (
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">{t('studentBookings.noUpcomingBookings')}</p>
                </CardContent>
              </Card>
            ) : (
              filteredBookings.map((booking) => (
                <Card key={booking.id} className={cn(
                  booking.status === 'CANCELLED' && 'opacity-60',
                  new Date(booking.startTime) < new Date() && 'bg-gray-50'
                )}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
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
                            {t('booking.instructor')}: {booking.instructor.firstName} {booking.instructor.lastName}
                          </span>
                        </div>
                        {booking.notes && (
                          <p className="text-sm text-gray-600">{t('booking.notes')}: {booking.notes}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-medium",
                          booking.status === 'CONFIRMED' && 'bg-green-100 text-green-800',
                          booking.status === 'CANCELLED' && 'bg-red-100 text-red-800',
                          booking.status === 'COMPLETED' && 'bg-blue-100 text-blue-800',
                          booking.status === 'NO_SHOW' && 'bg-gray-100 text-gray-800'
                        )}>
                          {t(`booking.status.${booking.status.toLowerCase()}`)}
                        </span>
                        {booking.status === 'CONFIRMED' && new Date(booking.startTime) > new Date() && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancelMutation.isLoading}
                          >
                            {t('common.cancel')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Widoki kalendarzowe */}
        {calendarView !== 'list' && (
          <Card>
            <CardContent className="p-4">
              <CalendarNavigation
                currentDate={selectedDate}
                view={calendarView as any}
                onDateChange={setSelectedDate}
                onGoToToday={() => setSelectedDate(new Date())}
              />
              
              <div className="mt-4">
{calendarView === 'day' && (
  <DayView
    date={selectedDate}
    slots={(() => {
      const dayBookings = filteredBookings.filter(b => 
        format(new Date(b.startTime), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      )
      
      return dayBookings.map(booking => ({
        time: format(new Date(booking.startTime), 'HH:mm'),
        isBooked: true,
        bookingInfo: {
          studentName: `Instruktor: ${booking.instructor.firstName} ${booking.instructor.lastName}`,
          lessonType: `${format(new Date(booking.startTime), 'HH:mm')} - ${format(new Date(booking.endTime), 'HH:mm')} (2 godziny)`,
          additionalInfo: [
            booking.location ? `📍 ${booking.location.name}` : null,
            booking.vehicle ? `🚗 ${booking.vehicle.make} ${booking.vehicle.model} (${booking.vehicle.registrationNumber})` : '🚗 Pojazd zostanie przydzielony',
            `📞 ${booking.instructor.phone || 'Brak telefonu'}`,
            booking.notes ? `💬 ${booking.notes}` : null,
            `Status: ${t(`booking.status.${booking.status.toLowerCase()}`)}`
          ].filter(Boolean) as string[] // ← ДОДАТИ as string[]
        }
      }))
    })()}
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
          studentName: `${booking.instructor.firstName} ${booking.instructor.lastName}`,
          vehicle: booking.vehicle 
            ? `${booking.vehicle.make} ${booking.vehicle.model}` 
            : 'Do przydzielenia',
          location: booking.location?.name || 'Brak lokalizacji',
          status: booking.status
        }
      })}
  />
)}

                {calendarView === 'month' && (
                  <MonthView
                    currentDate={selectedDate}
                    bookings={calendarSlots.reduce((acc, slot) => {
                      const date = format(slot.startTime, 'yyyy-MM-dd')
                      const existing = acc.find(b => format(b.date, 'yyyy-MM-dd') === date)
                      if (existing) {
                        existing.count++
                      } else {
                        acc.push({ date: slot.startTime, count: 1 })
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
        )}
      </div>
    </div>
  )
}