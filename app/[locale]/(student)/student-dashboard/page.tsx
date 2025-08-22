// app/[locale]/(student)/student-dashboard/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { trpc } from '@/lib/trpc/client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

export default function StudentDashboard() {
  const t = useTranslations()
  const params = useParams()
  const locale = params.locale as string
  
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
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  // Визначаємо локаль для date-fns
  const dateLocale = locale === 'pl' ? pl : undefined

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('navigation.dashboard')}</h1>
        <p className="text-gray-600">
          {t('studentDashboard.welcomeMessage', { 
            count: upcomingBookings.length 
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('reports.totalLessons')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{bookings?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('reports.upcomingLessons')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{upcomingBookings.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('reports.completedLessons')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pastBookings.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{t('reports.upcomingLessons')}</h2>
            <Link href={`/${locale}/student-book`}>
              <Button>{t('studentDashboard.bookNewLesson')}</Button>
            </Link>
          </div>

          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500 mb-4">{t('studentDashboard.noUpcomingLessons')}</p>
                <Link href={`/${locale}/student-book`}>
                  <Button>{t('studentDashboard.bookFirstLesson')}</Button>
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
                            {format(new Date(booking.startTime), 'EEEE, d MMMM yyyy', { locale: dateLocale })}
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
                      <Link href={`/${locale}/student-bookings`}>
                        <Button variant="outline" size="sm">{t('common.details')}</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">{t('studentDashboard.quickActions')}</h2>
          <div className="space-y-3">
            <Link href={`/${locale}/student-book`} className="block">
              <Button className="w-full" size="lg">{t('navigation.bookLesson')}</Button>
            </Link>
            <Link href={`/${locale}/student-bookings`} className="block">
              <Button className="w-full" variant="outline" size="lg">
                {t('studentDashboard.viewAllBookings')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}