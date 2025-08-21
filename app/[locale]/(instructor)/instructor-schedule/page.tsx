'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/layouts/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc/client'

const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 0, label: 'Sunday' },
]

export default function InstructorSchedulePage() {
  const { data: session } = useSession()
  const { data: currentSchedule, refetch } = trpc.schedule.getMySchedule.useQuery()
  const updateScheduleMutation = trpc.schedule.setWorkingHours.useMutation({
    onSuccess: () => {
      refetch()
      alert('Schedule updated successfully!')
    },
  })

  const [schedule, setSchedule] = useState<any[]>([])

  useEffect(() => {
    if (currentSchedule) {
      const scheduleMap = new Map(currentSchedule.map(s => [s.dayOfWeek, s]))
      const fullSchedule = DAYS_OF_WEEK.map(day => ({
        dayOfWeek: day.value,
        startTime: scheduleMap.get(day.value)?.startTime || '09:00',
        endTime: scheduleMap.get(day.value)?.endTime || '17:00',
        isAvailable: scheduleMap.get(day.value)?.isAvailable ?? false,
      }))
      setSchedule(fullSchedule)
    }
  }, [currentSchedule])

  const handleScheduleChange = (dayOfWeek: number, field: string, value: any) => {
    setSchedule(prev => prev.map(day => 
      day.dayOfWeek === dayOfWeek ? { ...day, [field]: value } : day
    ))
  }

  const handleSave = () => {
    updateScheduleMutation.mutate({ schedule })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {session && <Navigation userRole={session.user.role} />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Schedule</h1>
          <p className="text-gray-600">Set your working hours for each day of the week</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DAYS_OF_WEEK.map((day) => {
                const daySchedule = schedule.find(s => s.dayOfWeek === day.value)
                return (
                  <div key={day.value} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-lg font-medium">{day.label}</Label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={daySchedule?.isAvailable || false}
                          onChange={(e) => handleScheduleChange(day.value, 'isAvailable', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Available</span>
                      </label>
                    </div>
                    
                    {daySchedule?.isAvailable && (
                      <div className="flex gap-4 ml-4">
                        <div>
                          <Label htmlFor={`start-${day.value}`} className="text-sm">Start Time</Label>
                          <Input
                            id={`start-${day.value}`}
                            type="time"
                            value={daySchedule?.startTime || '09:00'}
                            onChange={(e) => handleScheduleChange(day.value, 'startTime', e.target.value)}
                            className="w-32"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`end-${day.value}`} className="text-sm">End Time</Label>
                          <Input
                            id={`end-${day.value}`}
                            type="time"
                            value={daySchedule?.endTime || '17:00'}
                            onChange={(e) => handleScheduleChange(day.value, 'endTime', e.target.value)}
                            className="w-32"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-6">
              <Button 
                onClick={handleSave}
                disabled={updateScheduleMutation.isLoading}
                className="w-full"
              >
                {updateScheduleMutation.isLoading ? 'Saving...' : 'Save Schedule'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}