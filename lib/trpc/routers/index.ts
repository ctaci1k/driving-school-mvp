// lib/trpc/routers/index.ts

import { router } from '../server'
import { authRouter } from './auth'
import { bookingRouter } from './booking'
import { scheduleRouter } from './schedule'
import { userRouter } from './user'
import { vehicleRouter } from './vehicle'
import { paymentRouter } from './payment'
import { packageRouter } from './package'
import { locationRouter } from './location'

export const appRouter = router({
  auth: authRouter,
  booking: bookingRouter,
  schedule: scheduleRouter,
  user: userRouter,
  vehicle: vehicleRouter,
  payment: paymentRouter,
  package: packageRouter,
  location: locationRouter,
})

export type AppRouter = typeof appRouter