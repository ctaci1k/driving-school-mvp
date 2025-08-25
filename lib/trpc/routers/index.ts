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
import { studentReportsRouter } from './studentReports'
import { instructorReportsRouter } from './instructorReports'
import { adminReportsRouter } from './adminReports'
import { notificationRouter } from './notification'
import { dashboardRouter } from './dashboard'

export const appRouter = router({
  auth: authRouter,
  booking: bookingRouter,
  schedule: scheduleRouter,
  user: userRouter,
  vehicle: vehicleRouter,
  payment: paymentRouter,
  package: packageRouter,
  location: locationRouter,
  studentReports: studentReportsRouter,
  instructorReports: instructorReportsRouter,
  adminReports: adminReportsRouter,
  notification: notificationRouter,
  dashboard: dashboardRouter, 
})

export type AppRouter = typeof appRouter