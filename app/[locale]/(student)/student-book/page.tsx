// app/[locale]/(student)/student-book/page.tsx

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/layouts/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Car, MapPin, CreditCard, Package } from 'lucide-react'
import { format, addDays, startOfWeek, addMinutes, setHours, setMinutes  } from 'date-fns'
import { pl, uk } from 'date-fns/locale'
import { trpc } from '@/lib/trpc/client'
import { useRouter } from 'next/navigation'
import { toast } from '@/lib/toast'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { CalendarViewSwitcher } from '@/components/ui/calendar-view-switcher'
import { DayView } from '@/components/calendar/day-view'
import { WeekView } from '@/components/calendar/week-view'
import { MonthView } from '@/components/calendar/month-view'
import { CalendarNavigation } from '@/components/calendar/calendar-navigation'
import { RecurringBookingModal, type RecurringSettings } from '@/components/booking/recurring-booking-modal'
import { Repeat } from 'lucide-react'



export default function BookLessonPage() {
  const t = useTranslations()
  const params = useParams()
  const locale = params.locale as string
  const { data: session } = useSession()
  const router = useRouter()

  // Стейт для вибору
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [selectedInstructor, setSelectedInstructor] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<any>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | 'package'>('online')
  const [notes, setNotes] = useState('')
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week')
  const [isRecurring, setIsRecurring] = useState(false)
const [showRecurringModal, setShowRecurringModal] = useState(false)
const [recurringSettings, setRecurringSettings] = useState<RecurringSettings | null>(null)


  // Запити даних
  const { data: locations } = trpc.location.list.useQuery()
  const { data: instructors } = trpc.user.getInstructors.useQuery()
  const { data: userCredits } = trpc.package.getUserCredits.useQuery()

  // Отримуємо доступні автомобілі для вибраного часу
  const { data: availableVehicles, isLoading: vehiclesLoading } = trpc.vehicle.getAvailable.useQuery(
    {
      startTime: selectedSlot?.startTime || new Date().toISOString(),
      endTime: selectedSlot?.endTime || new Date().toISOString(),
      locationId: selectedLocation || undefined,
      category: 'B',
    },
    {
      enabled: !!selectedSlot && !!selectedLocation,
    }
  )

  // Отримуємо доступні слоти
  const { data: slots, isLoading: slotsLoading } = trpc.booking.getAvailableSlots.useQuery(
    {
      instructorId: selectedInstructor,
      date: selectedDate,
    },
    {
      enabled: !!selectedInstructor,
    }
  )

  // Визначаємо локаль для date-fns
  const dateLocale = locale === 'pl' ? pl : locale === 'uk' ? uk : undefined

  // Мутація для створення бронювання
const bookingMutation = trpc.booking.createRecurring.useMutation({
  onSuccess: (data) => {
    if (Array.isArray(data)) {
      toast.success(t('booking.recurringBooking.successMultiple', { count: data.length }))
    } else {
      toast.success(t('booking.bookingCreated'))
    }

    // Якщо оплата онлайн і це не серія
    if (paymentMethod === 'online' && !Array.isArray(data) && data.id) {
      fetch('/api/payments/p24/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: data.id,
          amount: 200,
          description: `${t('booking.title')} - ${format(new Date(data.startTime), 'dd.MM.yyyy HH:mm')}`
        })
      })
        .then(res => res.json())
        .then(payment => {
          if (payment.redirectUrl) {
            window.location.href = payment.redirectUrl
          } else {
            router.push(`/${locale}/student-bookings`)
          }
        })
    } else {
      router.push(`/${locale}/student-bookings`)
    }
  },
  onError: (error) => {
    toast.error(`${t('messages.error')}: ${error.message}`)
  }
})

  // Мутація для використання кредитів
  const useCredits = trpc.package.useCredits.useMutation({
    onSuccess: () => {
      toast.success(t('studentBook.creditsUsed'))
      router.push(`/${locale}/student-bookings`)
    },
    onError: (error) => {
      toast.error(`${t('messages.error')}: ${error.message}`)
    }
  })

  // Функція бронювання
// Замініть handleBook на:
const handleBook = async () => {
  if (!selectedSlot || !selectedInstructor || !selectedLocation) {
    toast.error(t('studentBook.fillAllFields'))
    return
  }

  // Якщо це повторювані уроки і ще не налаштовано - показуємо модалку
  if (isRecurring && !recurringSettings) {
    setShowRecurringModal(true)
    return
  }

  // Створюємо бронювання
  const bookingData = {
    instructorId: selectedInstructor,
    startTime: selectedSlot.startTime,
    vehicleId: selectedVehicle || undefined,
    locationId: selectedLocation,
    notes: notes || undefined,
    isRecurring: isRecurring,
    recurringSettings: recurringSettings || undefined
  }

  const result = await bookingMutation.mutateAsync(bookingData)

  // Якщо оплата кредитами і це серія
  if (paymentMethod === 'package' && Array.isArray(result)) {
    for (const booking of result) {
      await useCredits.mutateAsync({
        bookingId: booking.id,
        creditsToUse: 1,
      })
    }
  } else if (paymentMethod === 'package' && !Array.isArray(result) && result.id) {
    await useCredits.mutateAsync({
      bookingId: result.id,
      creditsToUse: 1,
    })
  }
}

// Додайте нову функцію для обробки налаштувань повторення
const handleRecurringConfirm = (settings: RecurringSettings) => {
  setRecurringSettings(settings)
  setShowRecurringModal(false)
  // Автоматично починаємо бронювання після налаштування
  setTimeout(() => handleBook(), 100)
}

  // Перевіряємо чи достатньо кредитів
  const hasCredits = userCredits && userCredits.totalCredits > 0

return (
  <div className="min-h-screen bg-gray-50">
    {session && <Navigation userRole={session.user.role} />}

    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">{t('navigation.bookLesson')}</h1>
        <p className="text-gray-600">{t('studentBook.subtitle')}</p>

        {/* Показуємо баланс кредитів якщо є */}
        {hasCredits && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <span className="text-blue-900">
              {t('studentBook.creditsAvailable', { count: userCredits.totalCredits })}
            </span>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Крок 1: Локація */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5" />
              1. {t('booking.location')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {locations?.map((location) => (
                <button
                  key={location.id}
                  onClick={() => {
                    setSelectedLocation(location.id)
                    setSelectedVehicle('')
                  }}
                  className={`text-left p-3 rounded-lg border transition-colors ${
                    selectedLocation === location.id
                      ? 'bg-blue-50 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium">{location.name}</p>
                  <p className="text-sm text-gray-600">{location.address}</p>
                  <p className="text-xs text-gray-500">{location.city}, {location.postalCode}</p>
                </button>
              ))}
              {!locations?.length && (
                <p className="text-gray-500 text-sm col-span-full">{t('studentBook.noLocations')}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Крок 2: Інструктор */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5" />
              2. {t('booking.instructor')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedLocation ? (
              <p className="text-gray-500 text-sm">{t('studentBook.selectLocationFirst')}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {instructors?.map((instructor) => (
                  <button
                    key={instructor.id}
                    onClick={() => setSelectedInstructor(instructor.id)}
                    className={`text-left p-3 rounded-lg border transition-colors ${
                      selectedInstructor === instructor.id
                        ? 'bg-blue-50 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium">
                      {instructor.firstName} {instructor.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{instructor.email}</p>
                    {instructor.phone && (
                      <p className="text-xs text-gray-500">{instructor.phone}</p>
                    )}
                  </button>
                ))}
                {!instructors?.length && (
                  <p className="text-gray-500 text-sm col-span-full">{t('studentBook.noInstructors')}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Крок 3: Data i czas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5" />
              3. {t('studentBook.dateAndTime')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedInstructor ? (
              <p className="text-gray-500 text-sm">{t('studentBook.selectInstructorFirst')}</p>
            ) : (
              <>
                {/* Перемикач видів */}
                <div className="mb-4">
                  <CalendarViewSwitcher 
                    currentView={calendarView}
                    onViewChange={setCalendarView}
                  />
                </div>
                
                {/* Навігація по датах */}
                <CalendarNavigation
                  currentDate={selectedDate}
                  view={calendarView}
                  onDateChange={setSelectedDate}
                  onGoToToday={() => setSelectedDate(new Date())}
                />
                
                {/* Календарні види */}
                <div className="mt-4">
                  {slotsLoading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">{t('common.loading')}</p>
                    </div>
                  ) : (
                    <>
                      {calendarView === 'day' && (
                        <DayView 
                          date={selectedDate}
                          slots={slots?.map(slot => ({
                            time: format(new Date(slot.startTime), 'HH:mm'),
                            isBooked: !slot.available,
                            bookingInfo: !slot.available ? {
                              studentName: 'Zajęte',
                              lessonType: ''
                            } : undefined
                          })) || []}
                        />
                      )}
{calendarView === 'week' && (
  <>
    <WeekView
      startDate={selectedDate}
      slots={(() => {
        if (!slots || slots.length === 0) return []
        
        // Визначаємо межі поточного тижня
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
        const weekEnd = addDays(weekStart, 7)
        
        // Фільтруємо слоти тільки для поточного тижня
        const weekSlots = slots.filter(slot => {
          const slotDate = new Date(slot.startTime)
          return slotDate >= weekStart && slotDate < weekEnd
        })
        
        console.log(`Відфільтровано ${weekSlots.length} слотів для поточного тижня`)
        
        // Мапимо слоти для WeekView
        return weekSlots.map((slot) => {
          const slotDate = new Date(slot.startTime)
          const dayOfWeek = slotDate.getDay()
          
          // Конвертуємо день тижня: Нд(0)->6, Пн(1)->0, Вт(2)->1, і т.д.
          let adjustedDay
          if (dayOfWeek === 0) {
            adjustedDay = 6 // Неділя
          } else {
            adjustedDay = dayOfWeek - 1 // Пн-Сб
          }
          
          return {
            day: adjustedDay,
            hour: format(slotDate, 'HH:mm'),
            isBooked: !slot.available,
            studentName: slot.available ? '' : 'Zajęte'
          }
        })
      })()}
      onSlotClick={(day, hour) => {
        console.log(`Клікнуто: день ${day}, час ${hour}`)
        
        // Визначаємо дату кліку
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
        const clickedDate = addDays(weekStart, day)
        
        // Знаходимо відповідний слот
        const clickedSlot = slots?.find(s => {
          const slotDate = new Date(s.startTime)
          const slotDay = slotDate.getDay() === 0 ? 6 : slotDate.getDay() - 1
          const slotHour = format(slotDate, 'HH:mm')
          
          // Перевіряємо чи це той самий день і час
          return slotDay === day && 
                 slotHour === hour && 
                 format(slotDate, 'yyyy-MM-dd') === format(clickedDate, 'yyyy-MM-dd')
        })
        
        if (clickedSlot && clickedSlot.available) {
          setSelectedSlot(clickedSlot)
          toast.success(`Вибрано: ${format(new Date(clickedSlot.startTime), 'dd.MM.yyyy HH:mm')}`)
        }
      }}
    />
  </>
)}

                      {calendarView === 'month' && (
                        <MonthView
                          currentDate={selectedDate}
                          bookings={slots?.reduce((acc, slot) => {
                            const date = format(new Date(slot.startTime), 'yyyy-MM-dd')
                            const existing = acc.find(b => format(b.date, 'yyyy-MM-dd') === date)
                            if (existing) {
                              existing.count++
                            } else {
                              acc.push({ date: new Date(slot.startTime), count: 1 })
                            }
                            return acc
                          }, [] as { date: Date; count: number }[]) || []}
                          onDayClick={(date) => {
                            setSelectedDate(date)
                            setCalendarView('day')
                            setSelectedSlot(null)
                          }}
                        />
                      )}
                    </>
                  )}
                  
                  {/* Кнопки вибору слоту для Day view */}
                  {!slotsLoading && calendarView === 'day' && slots && slots.filter(s => s.available).length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-3">{t('booking.selectTime')}:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {slots.filter(s => s.available).map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-3 rounded-lg border transition-colors ${
                              selectedSlot === slot
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white hover:bg-gray-100 border-gray-300'
                            }`}
                          >
                            <div className="font-medium">
                              {format(new Date(slot.startTime), 'HH:mm')} - {format(new Date(slot.endTime), 'HH:mm')}
                            </div>
                            <div className="text-xs mt-1">
                              {t('studentBook.twoHours')}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Вибрані слоти */}
                {selectedSlot && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium">
                      {t('booking.selectTime')}: {format(new Date(selectedSlot.startTime), 'HH:mm')} - {format(new Date(selectedSlot.endTime), 'HH:mm')}
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Крок 4: Автомобіль (опціонально) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Car className="w-5 h-5" />
              4. {t('booking.vehicle')}
              <span className="text-xs text-gray-500 font-normal">({t('booking.optional')})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedSlot || !selectedLocation ? (
              <p className="text-gray-500 text-sm">{t('studentBook.selectTimeFirst')}</p>
            ) : vehiclesLoading ? (
              <p className="text-gray-500 text-sm">{t('common.loading')}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <button
                  onClick={() => setSelectedVehicle('')}
                  className={`text-left p-3 rounded-lg border transition-colors ${
                    !selectedVehicle
                      ? 'bg-blue-50 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium">{t('studentBook.anyAvailable')}</p>
                  <p className="text-xs text-gray-600">{t('studentBook.schoolWillAssign')}</p>
                </button>

                {availableVehicles?.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                    className={`text-left p-3 rounded-lg border transition-colors ${
                      selectedVehicle === vehicle.id
                        ? 'bg-blue-50 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium">
                      {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-sm text-gray-600">
                      {vehicle.registrationNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                      {vehicle.transmission === 'MANUAL' ? t('vehicle.manual') : t('vehicle.automatic')} • {vehicle.fuelType}
                    </p>
                  </button>
                ))}

                {availableVehicles?.length === 0 && (
                  <p className="text-gray-500 text-sm col-span-full">{t('studentBook.noVehicles')}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

{/* Підсумок бронювання */}
{selectedInstructor && selectedSlot && selectedLocation && (
  <Card className="mt-6 max-w-4xl mx-auto">
    <CardHeader>
      <CardTitle>{t('booking.bookingConfirmation')}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">{t('booking.location')}:</p>
          <p className="font-medium">{locations?.find(l => l.id === selectedLocation)?.name}</p>

          <p className="text-sm text-gray-600 mt-3">{t('booking.instructor')}:</p>
          <p className="font-medium">
            {instructors?.find(i => i.id === selectedInstructor)?.firstName}{' '}
            {instructors?.find(i => i.id === selectedInstructor)?.lastName}
          </p>

          <p className="text-sm text-gray-600 mt-3">{t('common.date')}:</p>
          <p className="font-medium">
            {format(new Date(selectedSlot.startTime), 'EEEE, d MMMM yyyy', { locale: dateLocale })}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">{t('common.time')}:</p>
          <p className="font-medium">
            {format(new Date(selectedSlot.startTime), 'HH:mm')} -
            {format(new Date(selectedSlot.endTime), 'HH:mm')}
          </p>

          <p className="text-sm text-gray-600 mt-3">{t('booking.duration')}:</p>
          <p className="font-medium">{t('studentBook.twoHours')}</p>

          {selectedVehicle && availableVehicles && (
            <>
              <p className="text-sm text-gray-600 mt-3">{t('booking.vehicle')}:</p>
              <p className="font-medium">
                {availableVehicles.find(v => v.id === selectedVehicle)?.make}{' '}
                {availableVehicles.find(v => v.id === selectedVehicle)?.model}{' '}
                ({availableVehicles.find(v => v.id === selectedVehicle)?.registrationNumber})
              </p>
            </>
          )}
        </div>
      </div>

      {/* Нотатки */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          {t('booking.additionalNotes')} ({t('booking.optional')})
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder={t('studentBook.notesPlaceholder')}
        />
      </div>
{/* Додайте після блоку з нотатками (приблизно рядок 440) */}
{/* Повторювані уроки */}
<div className="mb-6 p-4 border rounded-lg">
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="checkbox"
      checked={isRecurring}
      onChange={(e) => {
        setIsRecurring(e.target.checked)
        if (!e.target.checked) {
          setRecurringSettings(null)
        }
      }}
      className="w-4 h-4"
    />
    <div className="flex items-center gap-2">
      <Repeat className="w-5 h-5 text-gray-600" />
      <div>
        <p className="font-medium">{t('booking.recurringBooking.makeRecurring')}</p>
        <p className="text-xs text-gray-500">{t('booking.recurringBooking.description')}</p>
      </div>
    </div>
  </label>
  
  {isRecurring && recurringSettings && (
    <div className="mt-3 p-3 bg-blue-50 rounded">
      <p className="text-sm">
        {t('booking.recurringBooking.configured')}: {' '}
        {recurringSettings.pattern === 'daily' && t('booking.recurringBooking.daily')}
        {recurringSettings.pattern === 'weekly' && t('booking.recurringBooking.weekly')}
        {recurringSettings.pattern === 'biweekly' && t('booking.recurringBooking.biweekly')}
        {recurringSettings.endType === 'count' 
          ? ` - ${recurringSettings.count} ${t('booking.recurringBooking.lessons')}`
          : ` - ${t('booking.recurringBooking.until')} ${format(recurringSettings.endDate!, 'dd.MM.yyyy')}`
        }
      </p>
      <Button 
        size="sm" 
        variant="link" 
        onClick={() => setShowRecurringModal(true)}
        className="p-0 h-auto"
      >
        {t('common.edit')}
      </Button>
    </div>
  )}
</div>
      {/* Спосіб оплати */}
      <div className="mb-6">
        <p className="text-sm font-medium mb-3">{t('booking.paymentMethod')}:</p>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="payment"
              value="online"
              checked={paymentMethod === 'online'}
              onChange={(e) => setPaymentMethod('online')}
              className="w-4 h-4 text-blue-600"
            />
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium">{t('studentBook.payOnline')}</p>
                <p className="text-xs text-gray-500">200 PLN - {t('studentBook.payNow')}</p>
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={(e) => setPaymentMethod('cash')}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <p className="font-medium">{t('studentBook.payCash')}</p>
              <p className="text-xs text-gray-500">200 PLN - {t('studentBook.payAtLesson')}</p>
            </div>
          </label>

          {hasCredits && (
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="package"
                checked={paymentMethod === 'package'}
                onChange={(e) => setPaymentMethod('package')}
                className="w-4 h-4 text-blue-600"
              />
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">{t('studentBook.usePackageCredit')}</p>
                  <p className="text-xs text-gray-500">
                    {t('package.creditsRemaining')}: {userCredits.totalCredits}
                  </p>
                </div>
              </div>
            </label>
          )}
        </div>
      </div>

      {/* Кнопка підтвердження */}
      <Button
        onClick={handleBook}
        className="w-full"
        disabled={bookingMutation.isLoading || useCredits.isLoading}
      >
        {bookingMutation.isLoading || useCredits.isLoading ? (
          t('common.loading')
        ) : (
          paymentMethod === 'online' ? t('studentBook.goToPayment') :
          paymentMethod === 'package' ? t('studentBook.useCreditsAndBook') :
          t('booking.confirmBooking')
        )}
      </Button>
    </CardContent>
  </Card>
)}
    </div>
    {/* Додайте перед останнім закриваючим </div> */}
{/* Модалка для налаштування повторюваних уроків */}
{selectedSlot && (
  <RecurringBookingModal
    open={showRecurringModal}
    onOpenChange={setShowRecurringModal}
    startDate={new Date(selectedSlot.startTime)}
    startTime={format(new Date(selectedSlot.startTime), 'HH:mm')}
    onConfirm={handleRecurringConfirm}
  />
)}
  </div>
)
}