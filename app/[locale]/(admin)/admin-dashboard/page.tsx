// app\(admin)\admin-dashboard\page.tsx
'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Users, Calendar, Car, TrendingUp } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'

export default function AdminDashboard() {
  const { data: users } = trpc.user.getAllUsers.useQuery()
  const { data: bookings } = trpc.booking.list.useQuery({})

  const stats = {
    totalUsers: users?.length || 0,
    totalStudents: users?.filter(u => u.role === 'STUDENT').length || 0,
    totalInstructors: users?.filter(u => u.role === 'INSTRUCTOR').length || 0,
    totalBookings: bookings?.length || 0,
    upcomingBookings: bookings?.filter(b => new Date(b.startTime) > new Date() && b.status === 'CONFIRMED').length || 0,
    completedBookings: bookings?.filter(b => b.status === 'COMPLETED').length || 0,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalStudents} students, {stats.totalInstructors} instructors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.upcomingBookings} upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedBookings}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (Mock)</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedBookings * 200} PLN</div>
            <p className="text-xs text-muted-foreground">200 PLN per lesson</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings?.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {booking.student.firstName} {booking.student.lastName} → 
                    {booking.instructor.firstName} {booking.instructor.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.startTime).toLocaleDateString()} at {new Date(booking.startTime).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                  booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}