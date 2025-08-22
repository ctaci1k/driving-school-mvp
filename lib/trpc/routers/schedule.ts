// lib/trpc/routers/schedule.ts

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

  // ========== ОНОВЛЕНІ МЕТОДИ ДЛЯ ШАБЛОНІВ З БД ==========
  
  // Отримати збережені шаблони
  getTemplates: instructorProcedure
    .query(async ({ ctx }) => {
      const templates = await ctx.db.scheduleTemplate.findMany({
        where: {
          instructorId: ctx.session.user.id
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      // Парсимо JSON weekPattern і повертаємо
      return templates.map(t => ({
        id: t.id,
        name: t.name,
        weekPattern: t.weekPattern as any,
        validFrom: t.createdAt,
        validTo: null
      }))
    }),

  // Створити новий шаблон
  createTemplate: instructorProcedure
    .input(z.object({
      name: z.string(),
      weekPattern: z.array(z.object({
        dayOfWeek: z.number(),
        startTime: z.string(),
        endTime: z.string(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.db.scheduleTemplate.create({
        data: {
          instructorId: ctx.session.user.id,
          name: input.name,
          weekPattern: input.weekPattern as any,
        }
      })
      
      return {
        success: true,
        id: template.id,
        message: `Szablon "${input.name}" został utworzony`
      }
    }),

  // Оновити шаблон
  updateTemplate: instructorProcedure
    .input(z.object({
      templateId: z.string(),
      name: z.string().optional(),
      weekPattern: z.array(z.object({
        dayOfWeek: z.number(),
        startTime: z.string(),
        endTime: z.string(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.db.scheduleTemplate.update({
        where: {
          id: input.templateId,
          instructorId: ctx.session.user.id
        },
        data: {
          name: input.name,
          weekPattern: input.weekPattern as any
        }
      })
      
      return {
        success: true,
        message: `Szablon "${template.name}" został zaktualizowany`
      }
    }),

  // Застосувати шаблон
  applyTemplate: instructorProcedure
    .input(z.object({
      templateId: z.string(),
      overwriteExisting: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      const instructorId = ctx.session.user.id
      
      // Отримуємо шаблон з БД
      const template = await ctx.db.scheduleTemplate.findFirst({
        where: {
          id: input.templateId,
          instructorId: instructorId
        }
      })
      
      if (!template) {
        throw new Error('Template not found')
      }

      const weekPattern = template.weekPattern as any[]

      // Видаляємо старий розклад якщо потрібно
      if (input.overwriteExisting) {
        await ctx.db.instructorSchedule.deleteMany({
          where: { 
            instructorId,
            specificDate: null
          }
        })
      }

      // Застосовуємо новий розклад
      const scheduleData = weekPattern.map(pattern => ({
        instructorId,
        dayOfWeek: pattern.dayOfWeek,
        startTime: pattern.startTime,
        endTime: pattern.endTime,
        isAvailable: true,
      }))

      await ctx.db.instructorSchedule.createMany({
        data: scheduleData,
        skipDuplicates: true,
      })

      return { 
        success: true, 
        message: `Zastosowano szablon "${template.name}". Zaktualizowano ${scheduleData.length} dni.`
      }
    }),

  // Зберегти поточний розклад як шаблон
  saveAsTemplate: instructorProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const currentSchedule = await ctx.db.instructorSchedule.findMany({
        where: {
          instructorId: ctx.session.user.id,
          specificDate: null
        },
        orderBy: { dayOfWeek: 'asc' }
      })

      if (currentSchedule.length === 0) {
        throw new Error('No schedule to save')
      }

      // Перетворюємо розклад в weekPattern
      const weekPattern = currentSchedule.map(s => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime
      }))

      // Зберігаємо в БД
      const template = await ctx.db.scheduleTemplate.create({
        data: {
          instructorId: ctx.session.user.id,
          name: input.name,
          description: input.description,
          weekPattern: weekPattern as any
        }
      })

      return {
        success: true,
        message: `Szablon "${input.name}" został zapisany`,
        templateId: template.id
      }
    }),

  // Видалити шаблон
  deleteTemplate: instructorProcedure
    .input(z.object({
      templateId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.scheduleTemplate.delete({
        where: {
          id: input.templateId,
          instructorId: ctx.session.user.id
        }
      })
      
      return {
        success: true,
        message: 'Szablon został usunięty'
      }
    }),

  // ========== SCHEDULE EXCEPTIONS ==========

  // Отримати винятки
  getExceptions: instructorProcedure
    .query(async ({ ctx }) => {
      const exceptions = await ctx.db.scheduleException.findMany({
        where: {
          instructorId: ctx.session.user.id
        },
        orderBy: {
          startDate: 'desc'
        }
      })
      
      return exceptions
    }),

  // Створити виняток
  createException: instructorProcedure
    .input(z.object({
      type: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      allDay: z.boolean(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      reason: z.string(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const exception = await ctx.db.scheduleException.create({
        data: {
          instructorId: ctx.session.user.id,
          type: input.type,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
          allDay: input.allDay,
          startTime: input.startTime || null,
          endTime: input.endTime || null,
          reason: input.reason,
          description: input.description || null,
        }
      })
      
      return {
        success: true,
        message: `Wyjątek dodany: ${input.reason}`,
        id: exception.id
      }
    }),

  // Видалити виняток
  deleteException: instructorProcedure
    .input(z.object({
      id: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.scheduleException.delete({
        where: {
          id: input.id,
          instructorId: ctx.session.user.id
        }
      })
      
      return {
        success: true,
        message: 'Wyjątek usunięty'
      }
    }),

  // Перевірити чи є виняток на дату
  checkException: protectedProcedure
    .input(z.object({
      instructorId: z.string(),
      date: z.date().or(z.string()).transform(val => new Date(val)),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const date = new Date(input.date)
      
      const exceptions = await ctx.db.scheduleException.findMany({
        where: {
          instructorId: input.instructorId,
          startDate: { lte: date },
          endDate: { gte: date }
        }
      })
      
      if (exceptions.length === 0) return { hasException: false }
      
      for (const exception of exceptions) {
        if (exception.allDay) {
          return { 
            hasException: true, 
            exception: exception 
          }
        }
        
        if (input.startTime && input.endTime && exception.startTime && exception.endTime) {
          const reqStart = input.startTime
          const reqEnd = input.endTime
          const excStart = exception.startTime
          const excEnd = exception.endTime
          
          if (
            (reqStart >= excStart && reqStart < excEnd) ||
            (reqEnd > excStart && reqEnd <= excEnd) ||
            (reqStart <= excStart && reqEnd >= excEnd)
          ) {
            return { 
              hasException: true, 
              exception: exception 
            }
          }
        }
      }
      
      return { hasException: false }
    }),

  // ========== BUFFER TIME SETTINGS ==========

  // Aktualizuj czas bufora
  updateBufferTime: instructorProcedure
    .input(z.object({
      bufferBefore: z.number().min(0).max(60),
      bufferAfter: z.number().min(0).max(60),
    }))
    .mutation(async ({ ctx, input }) => {
      const instructorId = ctx.session.user.id
      
      // Aktualizujemy bufor dla wszystkich dni tygodnia
      await ctx.db.instructorSchedule.updateMany({
        where: {
          instructorId,
          specificDate: null, // tylko regularny harmonogram
        },
        data: {
          bufferBefore: input.bufferBefore,
          bufferAfter: input.bufferAfter,
        }
      })
      
      return {
        success: true,
        message: `Bufor czasowy zaktualizowany: ${input.bufferBefore} min przed, ${input.bufferAfter} min po`
      }
    }),

  // Pobierz ustawienia bufora
// Pobierz ustawienia bufora - WERSJA BEZ select
getBufferSettings: instructorProcedure
  .query(async ({ ctx }) => {
    const schedule = await ctx.db.instructorSchedule.findFirst({
      where: {
        instructorId: ctx.session.user.id,
        specificDate: null,
      }
    })
    
    return {
      bufferBefore: (schedule as any)?.bufferBefore || 15,
      bufferAfter: (schedule as any)?.bufferAfter || 15,
    }
  }),
})