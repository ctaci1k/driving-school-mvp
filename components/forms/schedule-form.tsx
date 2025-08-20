'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const scheduleSchema = z.object({
  monday: z.object({
    enabled: z.boolean(),
    startTime: z.string(),
    endTime: z.string(),
  }),
  tuesday: z.object({
    enabled: z.boolean(),
    startTime: z.string(),
    endTime: z.string(),
  }),
  wednesday: z.object({
    enabled: z.boolean(),
    startTime: z.string(),
    endTime: z.string(),
  }),
  thursday: z.object({
    enabled: z.boolean(),
    startTime: z.string(),
    endTime: z.string(),
  }),
  friday: z.object({
    enabled: z.boolean(),
    startTime: z.string(),
    endTime: z.string(),
  }),
})

type ScheduleFormData = z.infer<typeof scheduleSchema>

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const

export function ScheduleForm({ 
  defaultValues,
  onSubmit 
}: { 
  defaultValues?: Partial<ScheduleFormData>
  onSubmit: (data: ScheduleFormData) => void 
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: defaultValues || {
      monday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      tuesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      wednesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      thursday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      friday: { enabled: true, startTime: '09:00', endTime: '17:00' },
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Working Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {DAYS.map((day) => {
            const enabled = watch(`${day}.enabled`)
            return (
              <div key={day} className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-base capitalize">{day}</Label>
                  <input
                    type="checkbox"
                    {...register(`${day}.enabled`)}
                    className="w-4 h-4"
                  />
                </div>
                {enabled && (
                  <div className="flex gap-4 ml-4">
                    <div>
                      <Label htmlFor={`${day}-start`} className="text-sm">
                        Start
                      </Label>
                      <Input
                        id={`${day}-start`}
                        type="time"
                        {...register(`${day}.startTime`)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${day}-end`} className="text-sm">
                        End
                      </Label>
                      <Input
                        id={`${day}-end`}
                        type="time"
                        {...register(`${day}.endTime`)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          <Button type="submit" className="w-full">
            Save Schedule
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}