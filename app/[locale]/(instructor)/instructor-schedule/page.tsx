// app/[locale]/(instructor)/instructor-schedule/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/layouts/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc/client'
import { useTranslations } from 'next-intl'
import { toast } from '@/lib/toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScheduleTemplate } from '@/components/calendar/schedule-template'
import { ScheduleExceptions } from '@/components/calendar/schedule-exceptions'
import { CalendarViewSwitcher } from '@/components/ui/calendar-view-switcher'
import { WeekView } from '@/components/calendar/week-view'
import { MonthView } from '@/components/calendar/month-view'
import { CalendarNavigation } from '@/components/calendar/calendar-navigation'
import { Clock, Calendar, AlertTriangle } from 'lucide-react'
import { format, startOfWeek, addDays } from 'date-fns'
import { pl } from 'date-fns/locale'
import { DayView } from '@/components/calendar/day-view'

export default function InstructorSchedulePage() {
  const t = useTranslations()
  const { data: session } = useSession()
  const { data: currentSchedule, refetch } = trpc.schedule.getMySchedule.useQuery()
  const { data: myBookings } = trpc.booking.list.useQuery({})
  
  
  const updateScheduleMutation = trpc.schedule.setWorkingHours.useMutation({
    onSuccess: () => {
      refetch()
      toast.success(t('instructorSchedule.scheduleUpdated'))
    },
  })

  const [schedule, setSchedule] = useState<any[]>([])
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState('working-hours')

  // Dni tygodnia z tłumaczeniami
  const DAYS_OF_WEEK = [
    { value: 1, label: t('instructorSchedule.monday') },
    { value: 2, label: t('instructorSchedule.tuesday') },
    { value: 3, label: t('instructorSchedule.wednesday') },
    { value: 4, label: t('instructorSchedule.thursday') },
    { value: 5, label: t('instructorSchedule.friday') },
    { value: 6, label: t('instructorSchedule.saturday') },
    { value: 0, label: t('instructorSchedule.sunday') },
  ]

  useEffect(() => {
    if (currentSchedule) {
      const scheduleMap = new Map(currentSchedule.map(s => [s.dayOfWeek, s]))
      const fullSchedule = DAYS_OF_WEEK.map(day => ({
        dayOfWeek: day.value,
        startTime: scheduleMap.get(day.value)?.startTime || '09:00',
        endTime: scheduleMap.get(day.value)?.endTime || '17:00',
        isAvailable: scheduleMap.get(day.value)?.isAvailable ?? false,
      }))
      setSchedule(fullSchedule)
    }
  }, [currentSchedule])

  const handleScheduleChange = (dayOfWeek: number, field: string, value: any) => {
    setSchedule(prev => prev.map(day => 
      day.dayOfWeek === dayOfWeek ? { ...day, [field]: value } : day
    ))
  }

  const handleSave = () => {
    updateScheduleMutation.mutate({ schedule })
  }

  // Przygotowanie danych dla widoku tygodniowego
  const weekSlots = myBookings?.map(booking => {
    const bookingDate = new Date(booking.startTime)
    const day = bookingDate.getDay()
    return {
      day: day === 0 ? 6 : day - 1,
      hour: format(bookingDate, 'HH:mm'),
      isBooked: true,
      studentName: `${booking.student.firstName} ${booking.student.lastName}`,
vehicle: booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model}` : t('common.none'),
location: booking.location?.name || t('common.none'),
      status: booking.status
    }
  }) || []

  // Przygotowanie danych dla widoku miesięcznego
  const monthBookings = myBookings?.reduce((acc, booking) => {
    const date = format(new Date(booking.startTime), 'yyyy-MM-dd')
    const existing = acc.find(b => format(b.date, 'yyyy-MM-dd') === date)
    if (existing) {
      existing.count++
    } else {
      acc.push({ date: new Date(booking.startTime), count: 1 })
    }
    return acc
  }, [] as { date: Date; count: number }[]) || []

  return (
    <div className="min-h-screen bg-gray-50">
      {session && <Navigation userRole={session.user.role} />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('navigation.schedule')}</h1>
          <p className="text-gray-600">{t('instructorSchedule.subtitle')}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">

<TabsTrigger value="working-hours">
    <Clock className="w-4 h-4 mr-2" />
    {t('instructorSchedule.tabs.workingHours')}
  </TabsTrigger>
  <TabsTrigger value="calendar-view">
    <Calendar className="w-4 h-4 mr-2" />
    {t('instructorSchedule.tabs.calendar')}
  </TabsTrigger>
  <TabsTrigger value="templates">
    <Clock className="w-4 h-4 mr-2" />
    {t('instructorSchedule.tabs.templates')}
  </TabsTrigger>
  <TabsTrigger value="exceptions">
    <AlertTriangle className="w-4 h-4 mr-2" />
    {t('instructorSchedule.tabs.exceptions')}
  </TabsTrigger>
          </TabsList>

          {/* Tab 1: Godziny pracy (istniejący kod) */}
          <TabsContent value="working-hours">
            <Card>
              <CardHeader>
                <CardTitle>{t('instructorSchedule.weeklySchedule')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DAYS_OF_WEEK.map((day) => {
                    const daySchedule = schedule.find(s => s.dayOfWeek === day.value)
                    return (
                      <div key={day.value} className="border-b pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-lg font-medium">{day.label}</Label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={daySchedule?.isAvailable || false}
                              onChange={(e) => handleScheduleChange(day.value, 'isAvailable', e.target.checked)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">{t('instructorSchedule.available')}</span>
                          </label>
                        </div>
                        
                        {daySchedule?.isAvailable && (
                          <div className="flex gap-4 ml-4">
                            <div>
                              <Label htmlFor={`start-${day.value}`} className="text-sm">
                                {t('instructorSchedule.startTime')}
                              </Label>
                              <Input
                                id={`start-${day.value}`}
                                type="time"
                                value={daySchedule?.startTime || '09:00'}
                                onChange={(e) => handleScheduleChange(day.value, 'startTime', e.target.value)}
                                className="w-32"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`end-${day.value}`} className="text-sm">
                                {t('instructorSchedule.endTime')}
                              </Label>
                              <Input
                                id={`end-${day.value}`}
                                type="time"
                                value={daySchedule?.endTime || '17:00'}
                                onChange={(e) => handleScheduleChange(day.value, 'endTime', e.target.value)}
                                className="w-32"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6">
                  <Button 
                    onClick={handleSave}
                    disabled={updateScheduleMutation.isLoading}
                    className="w-full"
                  >
                    {updateScheduleMutation.isLoading ? t('common.loading') : t('instructorSchedule.saveSchedule')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

{/* Tab 2: Widok kalendarza */}
<TabsContent value="calendar-view">
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>{t('instructorSchedule.myCalendar')}</span>
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
            slots={(() => {
              const dayBookings = myBookings?.filter(b => 
                format(new Date(b.startTime), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
              ) || []
              
              return dayBookings.map(booking => ({
                time: format(new Date(booking.startTime), 'HH:mm'),
                isBooked: true,
                bookingInfo: {
                  studentName: `${booking.student.firstName} ${booking.student.lastName}`,
                  lessonType: `${format(new Date(booking.startTime), 'HH:mm')} - ${format(new Date(booking.endTime), 'HH:mm')} (2 godziny)`,
additionalInfo: [
`📧 ${t('auth.email')}: ${booking.student.email}`,
`📞 ${t('auth.phone')}: ${booking.student.phone || t('common.none')}`,
booking.location ? `📍 ${t('booking.location')}: ${booking.location.name}` : `📍 ${t('messages.noData')}`,
booking.vehicle ? `🚗 ${t('booking.vehicle')}: ${booking.vehicle.make} ${booking.vehicle.model} (${booking.vehicle.registrationNumber})` : `🚗 ${t('studentBook.schoolWillAssign')}`,
booking.notes ? `💬 ${t('booking.notes')}: ${booking.notes}` : `💬 ${t('booking.notes')}: ${t('common.none')}`,
`✅ ${t('common.status')}: ${t(`booking.status.${booking.status.toLowerCase()}`)}`,
booking.payment ? `💰 ${t('payment.title')}: ${t(`payment.status.${booking.payment.status.toLowerCase()}`)}` : `💰 ${t('payment.title')}: ${t('payment.cash')}`
]
                }
              }))
            })()}
          />
        )}
        
        {calendarView === 'week' && (
          <WeekView
            startDate={selectedDate}
            slots={weekSlots.filter(slot => {
              const slotDate = new Date()
              slotDate.setDate(slotDate.getDate() - slotDate.getDay() + slot.day + 1)
              const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
              const weekEnd = addDays(weekStart, 7)
              return slotDate >= weekStart && slotDate < weekEnd
            })}
          />
        )}
        
        {calendarView === 'month' && (
          <MonthView
            currentDate={selectedDate}
            bookings={monthBookings}
            onDayClick={(date) => {
              setSelectedDate(date)
              setCalendarView('day') // ← ZMIANA: przechodzi na dzień zamiast tygodnia
            }}
          />
        )}
      </div>
    </CardContent>
  </Card>
</TabsContent>
          {/* Tab 3: Szablony harmonogramu */}
          <TabsContent value="templates">
            <ScheduleTemplate />
          </TabsContent>

          {/* Tab 4: Wyjątki w harmonogramie */}
          <TabsContent value="exceptions">
            <ScheduleExceptions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}