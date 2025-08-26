// lib/trpc/routers/index.ts
import { router } from '../server'
import { userRouter } from './user'
import { dashboardRouter } from './dashboard'
import { bookingRouter } from './booking'
import { messagesRouter } from './messages'
import { notificationRouter } from './notification'

export const appRouter = router({
  user: userRouter,
  dashboard: dashboardRouter,
  booking: bookingRouter,
  messages: messagesRouter,
  notification: notificationRouter
})

export type AppRouter = typeof appRouter