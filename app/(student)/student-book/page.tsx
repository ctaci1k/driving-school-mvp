// app/(student)/student-book/page.tsx - ПОВНА ВЕРСІЯ З УСІМА ЗВ'ЯЗКАМИ

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/layouts/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Car, MapPin, CreditCard, Package } from 'lucide-react'
import { format, addDays, startOfWeek } from 'date-fns'
import { uk } from 'date-fns/locale'
import { trpc } from '@/lib/trpc/client'
import { useRouter } from 'next/navigation'
import { toast } from '@/lib/toast'

export default function BookLessonPage() {
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
      category: 'B', // Можна додати вибір категорії
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

  // Мутація для створення бронювання
  const bookingMutation = trpc.booking.create.useMutation({
    onSuccess: (data) => {
      toast.success('Урок успішно заброньовано!')
      
      // Якщо оплата онлайн - перенаправляємо на оплату
      if (paymentMethod === 'online' && data.id) {
        // Створюємо платіж
        fetch('/api/payments/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: data.id,
            amount: 200,
            description: `Урок водіння - ${format(new Date(data.startTime), 'dd.MM.yyyy HH:mm')}`
          })
        })
        .then(res => res.json())
        .then(payment => {
          if (payment.redirectUrl) {
            window.location.href = payment.redirectUrl
          } else {
            router.push('/student-bookings')
          }
        })
      } else {
        router.push('/student-bookings')
      }
    },
    onError: (error) => {
      toast.error(`Помилка: ${error.message}`)
    }
  })

  // Мутація для використання кредитів
  const useCredits = trpc.package.useCredits.useMutation({
    onSuccess: () => {
      toast.success('Кредити використано!')
      router.push('/student-bookings')
    },
    onError: (error) => {
      toast.error(`Помилка: ${error.message}`)
    }
  })

  // Функція бронювання
  const handleBook = async () => {
    if (!selectedSlot || !selectedInstructor || !selectedLocation) {
      toast.error('Будь ласка, заповніть всі обов\'язкові поля')
      return
    }

    // Створюємо бронювання
    const booking = await bookingMutation.mutateAsync({
      instructorId: selectedInstructor,
      startTime: selectedSlot.startTime,
      vehicleId: selectedVehicle || undefined,
      locationId: selectedLocation,
      notes: notes || undefined,
    })

    // Якщо оплата кредитами
    if (paymentMethod === 'package' && booking.id) {
      await useCredits.mutateAsync({
        bookingId: booking.id,
        creditsToUse: 1, // 1 кредит = 1 урок
      })
    }
  }

  // Генеруємо дати на 2 тижні
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekDates = Array.from({ length: 14 }, (_, i) => addDays(weekStart, i))

  // Перевіряємо чи достатньо кредитів
  const hasCredits = userCredits && userCredits.totalCredits > 0

  return (
    <div className="min-h-screen bg-gray-50">
      {session && <Navigation userRole={session.user.role} />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Забронювати урок</h1>
          <p className="text-gray-600">Оберіть локацію, інструктора, час та автомобіль</p>
          
          {/* Показуємо баланс кредитів якщо є */}
          {hasCredits && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span className="text-blue-900">
                У вас є <strong>{userCredits.totalCredits}</strong> кредитів для уроків
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          
          {/* Крок 1: Локація */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5" />
                1. Локація
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {locations?.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => {
                      setSelectedLocation(location.id)
                      setSelectedVehicle('') // Скидаємо вибір авто при зміні локації
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
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
                  <p className="text-gray-500 text-sm">Немає доступних локацій</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Крок 2: Інструктор */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5" />
                2. Інструктор
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedLocation ? (
                <p className="text-gray-500 text-sm">Спочатку оберіть локацію</p>
              ) : (
                <div className="space-y-2">
                  {instructors?.map((instructor) => (
                    <button
                      key={instructor.id}
                      onClick={() => setSelectedInstructor(instructor.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
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
                    <p className="text-gray-500 text-sm">Немає доступних інструкторів</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Крок 3: Дата і час */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5" />
                3. Дата і час
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedInstructor ? (
                <p className="text-gray-500 text-sm">Спочатку оберіть інструктора</p>
              ) : (
                <>
                  {/* Вибір дати */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {weekDates.map((date) => {
                      const isPast = date < new Date()
                      const isSelected = format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                      
                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => {
                            setSelectedDate(date)
                            setSelectedSlot(null) // Скидаємо вибір часу при зміні дати
                          }}
                          disabled={isPast}
                          className={`p-2 rounded-lg border text-sm transition-colors ${
                            isSelected
                              ? 'bg-blue-50 border-blue-500'
                              : isPast
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <p className="font-medium">{format(date, 'EEE', { locale: uk })}</p>
                          <p>{format(date, 'd MMM', { locale: uk })}</p>
                        </button>
                      )
                    })}
                  </div>
                  
                  {/* Вибір часу */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Доступний час:</p>
                    {slotsLoading ? (
                      <p className="text-gray-500 text-sm">Завантаження...</p>
                    ) : slots && slots.length > 0 ? (
                      <div className="space-y-2">
                        {slots.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedSlot(slot)}
                            className={`w-full p-2 rounded-lg border text-sm transition-colors ${
                              selectedSlot === slot
                                ? 'bg-blue-50 border-blue-500'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <p className="font-medium">
                              {format(new Date(slot.startTime), 'HH:mm')} - 
                              {format(new Date(slot.endTime), 'HH:mm')}
                            </p>
                            <p className="text-xs text-green-600">Доступно</p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Немає вільних слотів</p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Крок 4: Автомобіль (опціонально) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Car className="w-5 h-5" />
                4. Автомобіль
                <span className="text-xs text-gray-500 font-normal">(опціонально)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedSlot || !selectedLocation ? (
                <p className="text-gray-500 text-sm">Спочатку оберіть час</p>
              ) : vehiclesLoading ? (
                <p className="text-gray-500 text-sm">Завантаження...</p>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedVehicle('')}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      !selectedVehicle
                        ? 'bg-blue-50 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium">Будь-який доступний</p>
                    <p className="text-xs text-gray-600">Школа призначить автомобіль</p>
                  </button>
                  
                  {availableVehicles?.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
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
                        {vehicle.transmission === 'MANUAL' ? 'Механіка' : 'Автомат'} • {vehicle.fuelType}
                      </p>
                    </button>
                  ))}
                  
                  {availableVehicles?.length === 0 && (
                    <p className="text-gray-500 text-sm">Немає доступних автомобілів</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Підсумок бронювання */}
        {selectedInstructor && selectedSlot && selectedLocation && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Підсумок бронювання</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Локація:</p>
                  <p className="font-medium">{locations?.find(l => l.id === selectedLocation)?.name}</p>
                  
                  <p className="text-sm text-gray-600 mt-3">Інструктор:</p>
                  <p className="font-medium">
                    {instructors?.find(i => i.id === selectedInstructor)?.firstName}{' '}
                    {instructors?.find(i => i.id === selectedInstructor)?.lastName}
                  </p>
                  
                  <p className="text-sm text-gray-600 mt-3">Дата:</p>
                  <p className="font-medium">
                    {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: uk })}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Час:</p>
                  <p className="font-medium">
                    {format(new Date(selectedSlot.startTime), 'HH:mm')} - 
                    {format(new Date(selectedSlot.endTime), 'HH:mm')}
                  </p>
                  
                  <p className="text-sm text-gray-600 mt-3">Тривалість:</p>
                  <p className="font-medium">2 години</p>
                  
                  {selectedVehicle && availableVehicles && (
                    <>
                      <p className="text-sm text-gray-600 mt-3">Автомобіль:</p>
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
                  Додаткові побажання (опціонально)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Наприклад: хочу попрактикувати паркування..."
                />
              </div>

              {/* Спосіб оплати */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">Спосіб оплати:</p>
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
                        <p className="font-medium">Оплата онлайн (Przelewy24)</p>
                        <p className="text-xs text-gray-500">200 PLN - оплатити зараз</p>
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
                      <p className="font-medium">Готівкою інструктору</p>
                      <p className="text-xs text-gray-500">200 PLN - оплатити на уроці</p>
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
                          <p className="font-medium">Використати кредит з пакету</p>
                          <p className="text-xs text-gray-500">
                            Залишилось: {userCredits.totalCredits} кредитів
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
                  'Обробка...'
                ) : (
                  paymentMethod === 'online' ? 'Перейти до оплати' :
                  paymentMethod === 'package' ? 'Використати кредит і забронювати' :
                  'Підтвердити бронювання'
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}