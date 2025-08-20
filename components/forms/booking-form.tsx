'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const bookingSchema = z.object({
  instructorId: z.string().min(1, 'Please select an instructor'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  notes: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

export function BookingForm({ onSubmit }: { onSubmit: (data: BookingFormData) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book a Lesson</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.date && (
              <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="time" {...register('time')} />
            {errors.time && (
              <p className="text-sm text-red-500 mt-1">{errors.time.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              placeholder="Any special requirements?"
              {...register('notes')}
            />
          </div>

          <Button type="submit" className="w-full">
            Book Lesson
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}