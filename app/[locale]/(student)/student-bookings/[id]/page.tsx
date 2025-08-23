// app/[locale]/(student)/bookings/[id]/page.tsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { ArrowLeft, Calendar, Clock, User, Car, MapPin, CreditCard, CheckCircle } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'

export default function BookingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  
  const { data: booking, isLoading, refetch } = trpc.booking.getById.useQuery(bookingId)
  
  const handlePayment = async () => {
    if (!booking || booking.isPaid) return
    
    setIsProcessingPayment(true)
    
    try {
      const response = await fetch('/api/payments/p24/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: booking.price,
          description: `Lekcja jazdy - ${format(new Date(booking.startTime), 'dd.MM.yyyy HH:mm', { locale: pl })}`
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Błąd płatności')
      }
      
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert(error instanceof Error ? error.message : 'Wystąpił błąd podczas płatności')
      setIsProcessingPayment(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie...</p>
        </div>
      </div>
    )
  }
  
  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Nie znaleziono rezerwacji</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-blue-600 hover:underline"
          >
            Wróć
          </button>
        </div>
      </div>
    )
  }
  
  const isPastBooking = new Date(booking.startTime) < new Date()
  const canPay = !booking.isPaid && booking.price && booking.price > 0 && !isPastBooking && booking.status === 'CONFIRMED'
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Powrót do listy
          </button>
          
          <h1 className="text-3xl font-bold">Szczegóły rezerwacji</h1>
        </div>
        
        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Booking Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Status rezerwacji</h2>
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                  booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status === 'CONFIRMED' ? 'Potwierdzona' :
                   booking.status === 'CANCELLED' ? 'Anulowana' :
                   booking.status === 'COMPLETED' ? 'Zakończona' :
                   booking.status}
                </span>
                
                {booking.isPaid && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Opłacona
                  </span>
                )}
              </div>
            </div>
            
            {/* Date & Time */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Data i czas</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">
                    {format(new Date(booking.startTime), 'EEEE, d MMMM yyyy', { locale: pl })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span>
                    {format(new Date(booking.startTime), 'HH:mm')} - 
                    {format(new Date(booking.endTime), 'HH:mm')}
                    <span className="text-gray-500 ml-2">(2 godziny)</span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Instructor */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Instruktor</h2>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">
                    {booking.instructor.firstName} {booking.instructor.lastName}
                  </p>
                  {booking.instructor.phone && (
                    <p className="text-sm text-gray-600">Tel: {booking.instructor.phone}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Vehicle */}
            {booking.vehicle && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Pojazd</h2>
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">
                      {booking.vehicle.make} {booking.vehicle.model}
                    </p>
                    <p className="text-sm text-gray-600">
                      Nr rej: {booking.vehicle.registrationNumber}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Location */}
            {booking.location && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Lokalizacja</h2>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{booking.location.name}</p>
                    <p className="text-sm text-gray-600">{booking.location.address}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Payment Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Płatność</h2>
              
              {booking.isPaid ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-green-600 font-medium">Opłacone</p>
                  {booking.price && (
                    <p className="text-gray-600 mt-2">Kwota: {booking.price} PLN</p>
                  )}
                </div>
              ) : booking.price && booking.price > 0 ? (
                <div>
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm mb-1">Do zapłaty</p>
                    <p className="text-3xl font-bold">{booking.price} PLN</p>
                  </div>
                  
                  {canPay ? (
                    <>
                      <button
                        onClick={handlePayment}
                        disabled={isProcessingPayment}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                          isProcessingPayment 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {isProcessingPayment ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Przetwarzanie...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" />
                            Zapłać przez Przelewy24
                          </>
                        )}
                      </button>
                      
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        Bezpieczna płatność obsługiwana przez Przelewy24
                      </p>
                    </>
                  ) : isPastBooking ? (
                    <p className="text-gray-500 text-center">
                      Lekcja już się odbyła
                    </p>
                  ) : booking.status !== 'CONFIRMED' ? (
                    <p className="text-gray-500 text-center">
                      Płatność niedostępna dla anulowanych rezerwacji
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-gray-500 text-center">
                  Brak informacji o płatności
                </p>
              )}
            </div>
            
            {/* Notes */}
            {booking.notes && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Notatki</h2>
                <p className="text-gray-600">{booking.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}