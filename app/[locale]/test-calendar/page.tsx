// app/[locale]/test-calendar/page.tsx

'use client'

import { useState } from 'react'
import { CalendarViewSwitcher } from '@/components/ui/calendar-view-switcher'
import { DayView } from '@/components/calendar/day-view'
import { WeekView } from '@/components/calendar/week-view'
import { MonthView } from '@/components/calendar/month-view'
import { CalendarNavigation } from '@/components/calendar/calendar-navigation'
import { ScheduleTemplate } from '@/components/calendar/schedule-template'
import { ScheduleExceptions } from '@/components/calendar/schedule-exceptions'
import { ConflictDetection } from '@/components/calendar/conflict-detection'
import { RecurringBookings } from '@/components/calendar/recurring-bookings'
import { CalendarFilters } from '@/components/calendar/calendar-filters'

export default function TestCalendarPage() {
  const [view, setView] = useState<'day' | 'week' | 'month'>('day')
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  // ... всі тестові дані ...
  const testWeekSlots = [
    { day: 0, hour: '09:00', isBooked: true, studentName: 'Jan Kowalski' },
    { day: 0, hour: '11:00', isBooked: true, studentName: 'Anna Nowak' },
    { day: 1, hour: '10:00', isBooked: true, studentName: 'Piotr Wiśniewski' },
    { day: 2, hour: '14:00', isBooked: true, studentName: 'Maria Zielińska' },
    { day: 3, hour: '16:00', isBooked: true, studentName: 'Tomasz Lewandowski' },
    { day: 4, hour: '09:00', isBooked: true, studentName: 'Katarzyna Wójcik' },
  ]
  
  const testMonthBookings = [
    { date: new Date(2024, 0, 15), count: 3 },
    { date: new Date(2024, 0, 16), count: 2 },
    { date: new Date(2024, 0, 18), count: 4 },
    { date: new Date(2024, 0, 22), count: 1 },
    { date: new Date(2024, 0, 25), count: 5 },
  ]
  
  const testSlots = [
    {
      time: '09:00',
      isBooked: true,
      bookingInfo: {
        studentName: 'Jan Kowalski',
        lessonType: 'cityDriving'
      }
    },
    {
      time: '11:00',
      isBooked: true,
      bookingInfo: {
        studentName: 'Anna Nowak',
        lessonType: 'parallelParking'
      }
    },
    {
      time: '14:00',
      isBooked: false
    },
    {
      time: '16:00',
      isBooked: true,
      bookingInfo: {
        studentName: 'Piotr Wiśniewski',
        lessonType: 'examPreparation'
      }
    }
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Advanced Calendar Features - Phase 2 MVP ✅</h1>

      {/* NOWE: Filtry i wyszukiwanie */}
      <div className="mb-6">
        <CalendarFilters onFiltersChange={(filters) => console.log('Filters:', filters)} />
      </div>

      <div className="mb-6">
        <CalendarViewSwitcher
          currentView={view}
          onViewChange={setView}
        />
      </div>
      
      <CalendarNavigation
        currentDate={selectedDate}
        view={view}
        onDateChange={setSelectedDate}
        onGoToToday={() => setSelectedDate(new Date())}
      />

      {view === 'day' && (
        <DayView
          date={selectedDate}
          slots={testSlots}
        />
      )}

      {view === 'week' && (
        <WeekView
          startDate={selectedDate}
          slots={testWeekSlots}
        />
      )}

      {view === 'month' && (
        <MonthView
          currentDate={selectedDate}
          bookings={testMonthBookings}
          onDayClick={(date) => {
            console.log('Clicked date:', date)
            setView('day')
            setSelectedDate(date)
          }}
        />
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Schedule Templates (Szablony harmonogramu)</h2>
        <ScheduleTemplate />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Schedule Exceptions (Wyjątki - urlopy, święta)</h2>
        <ScheduleExceptions />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Conflict Detection (Wykrywanie konfliktów)</h2>
        <ConflictDetection />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recurring Bookings (Lekcje cykliczne)</h2>
        <RecurringBookings />
      </div>
    </div>
  )
}