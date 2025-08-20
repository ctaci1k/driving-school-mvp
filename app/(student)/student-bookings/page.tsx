'use client'

import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/layouts/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User } from 'lucide-react'
import { format } from 'date-fns'
import { trpc } from '@/lib/trpc/client'

export default function StudentBookingsPage() {
  const { data: session } = useSession()
  const { data: bookings, isLoading, refetch } = trpc.booking.list.useQuery({})
  
  const cancelMutation = trpc.booking.cancel.useMutation({
    onSuccess: () => {
      refetch()
    },
  })

  const handleCancel = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      cancelMutation.mutate({ id: bookingId })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {session && <Navigation userRole={session.user.role} />}
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Loading bookings...</p>
        </div>
      </div>
    )
  }

  const upcomingBookings = bookings?.filter(
    (b) => new Date(b.startTime) > new Date() && b.status === 'CONFIRMED'
  ) || []
  
  const pastBookings = bookings?.filter(
    (b) => new Date(b.startTime) <= new Date() || b.status !== 'CONFIRMED'
  ) || []

  return (
    <div className="min-h-screen bg-gray-50">
      {session && <Navigation userRole={session.user.role} />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-gray-600">Manage your driving lessons</p>
        </div>

        {/* Upcoming Bookings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Upcoming Lessons</h2>
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No upcoming bookings</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">
                            {format(new Date(booking.startTime), 'EEEE, MMMM d, yyyy')}
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
                            Instructor: {booking.instructor.firstName} {booking.instructor.lastName}
                          </span>
                        </div>
                        {booking.notes && (
                          <p className="text-sm text-gray-600">Notes: {booking.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancelMutation.isLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Past Bookings */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Past Lessons</h2>
          {pastBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No past bookings</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <Card key={booking.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>
                            {format(new Date(booking.startTime), 'EEEE, MMMM d, yyyy')}
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
                            {booking.instructor.firstName} {booking.instructor.lastName}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}