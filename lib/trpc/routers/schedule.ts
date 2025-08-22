// lib\trpc\routers\schedule.ts


import { router, instructorProcedure, protectedProcedure } from '../server'
import { z } from 'zod'

export const scheduleRouter = router({
  setWorkingHours: instructorProcedure
    .input(z.object({
      schedule: z.array(z.object({
        dayOfWeek: z.number().min(0).max(6),
        startTime: z.string().regex(/^\d{2}:\d{2}$/),
        endTime: z.string().regex(/^\d{2}:\d{2}$/),
        isAvailable: z.boolean(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      const instructorId = ctx.session.user.id

      // Update or create schedule for each day
      const promises = input.schedule.map(day => 
        ctx.db.instructorSchedule.upsert({
          where: {
            instructorId_dayOfWeek: {
              instructorId,
              dayOfWeek: day.dayOfWeek,
            },
          },
          update: {
            startTime: day.startTime,
            endTime: day.endTime,
            isAvailable: day.isAvailable,
          },
          create: {
            instructorId,
            dayOfWeek: day.dayOfWeek,
            startTime: day.startTime,
            endTime: day.endTime,
            isAvailable: day.isAvailable,
          },
        })
      )

      await Promise.all(promises)

      return { success: true }
    }),

  getMySchedule: instructorProcedure
    .query(async ({ ctx }) => {
      const schedule = await ctx.db.instructorSchedule.findMany({
        where: {
          instructorId: ctx.session.user.id,
        },
        orderBy: {
          dayOfWeek: 'asc',
        },
      })

      return schedule
    }),

  getInstructorSchedule: protectedProcedure
    .input(z.object({
      instructorId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const schedule = await ctx.db.instructorSchedule.findMany({
        where: {
          instructorId: input.instructorId,
        },
        orderBy: {
          dayOfWeek: 'asc',
        },
      })

      return schedule
    }),
})