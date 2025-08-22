// app/[locale]/(instructor)/instructor-students/page.tsx

'use client'

import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/layouts/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { trpc } from '@/lib/trpc/client'
import { format } from 'date-fns'
import { pl, uk } from 'date-fns/locale'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

export default function InstructorStudentsPage() {
  const t = useTranslations()
  const params = useParams()
  const locale = params.locale as string
  const { data: session } = useSession()
  const { data: bookings, isLoading } = trpc.booking.list.useQuery({})

  // Визначаємо локаль для date-fns
  const dateLocale = locale === 'pl' ? pl : locale === 'uk' ? uk : undefined

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
          <p>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {session && <Navigation userRole={session.user.role} />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('navigation.students')}</h1>
          <p className="text-gray-600">{t('instructorStudents.subtitle')}</p>
        </div>

        {students.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">{t('instructorStudents.noStudents')}</p>
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
                    <p className="text-gray-600">{t('auth.email')}: {student.email}</p>
                    <p className="text-gray-600">{t('instructorStudents.totalLessons')}: {student.lessonsCount}</p>
                    <p className="text-gray-600">
                      {t('instructorStudents.lastLesson')}: {format(new Date(student.lastLesson), 'd MMM yyyy', { locale: dateLocale })}
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