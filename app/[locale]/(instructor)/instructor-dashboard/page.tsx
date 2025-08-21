// app\(instructor)\dashboard\page.tsx

'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Calendar, Clock, User } from 'lucide-react'
import { format, isToday, isTomorrow } from 'date-fns'
import { trpc } from '@/lib/trpc/client'

export default function InstructorDashboard() {
  const { data: bookings, isLoading } = trpc.booking.list.useQuery({})
  
  const todayBookings = bookings?.filter((booking) => 
    isToday(new Date(booking.startTime)) && booking.status === 'CONFIRMED'
  ) || []
  
  const tomorrowBookings = bookings?.filter((booking) => 
    isTomorrow(new Date(booking.startTime)) && booking.status === 'CONFIRMED'
  ) || []

  const upcomingBookings = bookings?.filter((booking) => 
    new Date(booking.startTime) > new Date() && booking.status === 'CONFIRMED'
  ) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
        <p className="text-gray-600">Manage your lessons and schedule</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{todayBookings.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tomorrow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{tomorrowBookings.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{upcomingBookings.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
        {todayBookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No lessons scheduled for today</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {todayBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">
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
                      <p className="text-sm text-gray-600">
                        Email: {booking.student.email}
                      </p>
                      {booking.notes && (
                        <p className="text-sm text-gray-600">Notes: {booking.notes}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Tomorrow's Schedule */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Tomorrow's Schedule</h2>
        {tomorrowBookings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No lessons scheduled for tomorrow</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tomorrowBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}