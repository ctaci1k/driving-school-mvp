'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/layouts/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User } from 'lucide-react'
import { format, addDays, startOfWeek } from 'date-fns'
import { trpc } from '@/lib/trpc/client'
import { useRouter } from 'next/navigation'

export default function BookLessonPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedInstructor, setSelectedInstructor] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<any>(null)

  const { data: instructors } = trpc.user.getInstructors.useQuery()
  
  const { data: slots, isLoading: slotsLoading } = trpc.booking.getAvailableSlots.useQuery(
    {
      instructorId: selectedInstructor,
      date: selectedDate,
    },
    {
      enabled: !!selectedInstructor,
    }
  )

  const bookingMutation = trpc.booking.create.useMutation({
    onSuccess: () => {
      // Правильний redirect
      router.push('/student-bookings')
    },
    onError: (error) => {
      alert(`Error: ${error.message}`)
    }
  })

  const handleBook = () => {
    if (selectedSlot && selectedInstructor) {
      bookingMutation.mutate({
        instructorId: selectedInstructor,
        startTime: selectedSlot.startTime,
      })
    }
  } 

  // Generate week dates
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekDates = Array.from({ length: 14 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="min-h-screen bg-gray-50">
      {session && <Navigation userRole={session.user.role} />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Book a Lesson</h1>
          <p className="text-gray-600">Choose your instructor and preferred time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Step 1: Select Instructor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Select Instructor
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Select Date */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {weekDates.map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    disabled={date < new Date()}
                    className={`p-2 rounded-lg border text-sm transition-colors ${
                      format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                        ? 'bg-blue-50 border-blue-500'
                        : date < new Date()
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium">{format(date, 'EEE')}</p>
                    <p>{format(date, 'MMM d')}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Select Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Select Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedInstructor ? (
                <p className="text-gray-500">Please select an instructor first</p>
              ) : slotsLoading ? (
                <p className="text-gray-500">Loading available slots...</p>
              ) : slots && slots.length > 0 ? (
                <div className="space-y-2">
                  {slots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full p-3 rounded-lg border transition-colors ${
                        selectedSlot === slot
                          ? 'bg-blue-50 border-blue-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-medium">
                        {format(new Date(slot.startTime), 'HH:mm')} - 
                        {format(new Date(slot.endTime), 'HH:mm')}
                      </p>
                      <p className="text-sm text-green-600">Available</p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No available slots for this date</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        {selectedInstructor && selectedSlot && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p><strong>Instructor:</strong> {instructors?.find(i => i.id === selectedInstructor)?.firstName} {instructors?.find(i => i.id === selectedInstructor)?.lastName}</p>
                <p><strong>Date:</strong> {format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                <p><strong>Time:</strong> {format(new Date(selectedSlot.startTime), 'HH:mm')} - {format(new Date(selectedSlot.endTime), 'HH:mm')}</p>
                <p><strong>Duration:</strong> 2 hours</p>
                <p><strong>Price:</strong> 200 PLN (Mock payment)</p>
              </div>
              <Button 
                onClick={handleBook} 
                className="w-full"
                disabled={bookingMutation.isLoading}
              >
                {bookingMutation.isLoading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}