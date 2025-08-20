'use client'

import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/layouts/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { trpc } from '@/lib/trpc/client'
import { format } from 'date-fns'

export default function InstructorStudentsPage() {
  const { data: session } = useSession()
  const { data: bookings, isLoading } = trpc.booking.list.useQuery({})

  // Get unique students from bookings
  const students = bookings?.reduce((acc: any[], booking) => {
    const existingStudent = acc.find(s => s.id === booking.student.id)
    if (!existingStudent) {
      acc.push({
        ...booking.student,
        lessonsCount: 1,
        lastLesson: booking.startTime,
      })
    } else {
      existingStudent.lessonsCount++
      if (new Date(booking.startTime) > new Date(existingStudent.lastLesson)) {
        existingStudent.lastLesson = booking.startTime
      }
    }
    return acc
  }, []) || []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {session && <Navigation userRole={session.user.role} />}
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {session && <Navigation userRole={session.user.role} />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Students</h1>
          <p className="text-gray-600">Students you have taught or will teach</p>
        </div>

        {students.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No students yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <Card key={student.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {student.firstName} {student.lastName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">Email: {student.email}</p>
                    <p className="text-gray-600">Total Lessons: {student.lessonsCount}</p>
                    <p className="text-gray-600">
                      Last Lesson: {format(new Date(student.lastLesson), 'MMM d, yyyy')}
                    </p>
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