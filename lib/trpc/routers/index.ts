// lib\trpc\routers\index.ts
import { router } from '../server'
import { authRouter } from './auth'
import { bookingRouter } from './booking'
import { scheduleRouter } from './schedule'
import { userRouter } from './user'

export const appRouter = router({
  auth: authRouter,
  booking: bookingRouter,
  schedule: scheduleRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter