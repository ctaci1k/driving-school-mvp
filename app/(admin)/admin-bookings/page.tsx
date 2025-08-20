'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc/client'
import { format } from 'date-fns'
import { SimpleNavigation } from '@/components/layouts/simple-navigation'

export default function AdminBookingsPage() {
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
        <SimpleNavigation />
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">All Bookings</h1>
          <p className="text-gray-600">Manage all bookings in the system</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bookings ({bookings?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Time</th>
                    <th className="text-left p-2">Student</th>
                    <th className="text-left p-2">Instructor</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings?.map((booking) => (
                    <tr key={booking.id} className="border-b">
                      <td className="p-2">
                        {format(new Date(booking.startTime), 'MMM d, yyyy')}
                      </td>
                      <td className="p-2">
                        {format(new Date(booking.startTime), 'HH:mm')} - 
                        {format(new Date(booking.endTime), 'HH:mm')}
                      </td>
                      <td className="p-2">
                        {booking.student.firstName} {booking.student.lastName}
                      </td>
                      <td className="p-2">
                        {booking.instructor.firstName} {booking.instructor.lastName}
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-2">
                        {booking.status === 'CONFIRMED' && (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleCancel(booking.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}