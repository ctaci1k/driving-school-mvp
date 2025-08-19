// app\(student)\dashboard\page.tsx

'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { trpc } from '@/lib/trpc/client'
import Link from 'next/link'

export default function StudentDashboard() {
  const { data: bookings, isLoading } = trpc.booking.list.useQuery({
    status: 'CONFIRMED',
  })

  const upcomingBookings = bookings?.filter(
    (booking) => new Date(booking.startTime) > new Date()
  ) || []

  const pastBookings = bookings?.filter(
    (booking) => new Date(booking.startTime) <= new Date()
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
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here are your upcoming lessons.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{bookings?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{upcomingBookings.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pastBookings.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Lessons</h2>
            <Link href="/student/book">
              <Button>Book New Lesson</Button>
            </Link>
          </div>

          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500 mb-4">No upcoming lessons</p>
                <Link href="/student/book">
                  <Button>Book Your First Lesson</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.slice(0, 3).map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
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
                            {booking.instructor.firstName} {booking.instructor.lastName}
                          </span>
                        </div>
                      </div>
                      <Link href="/student/bookings">
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/student/book" className="block">
              <Button className="w-full" size="lg">Book a Lesson</Button>
            </Link>
            <Link href="/student/bookings" className="block">
              <Button className="w-full" variant="outline" size="lg">View All Bookings</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}