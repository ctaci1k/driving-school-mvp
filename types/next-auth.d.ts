// types/next-auth.d.ts

import { UserRole } from '@prisma/client'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole | string
      email: string
      name?: string | null
      image?: string | null
      locationId?: string | null
      locationName?: string | null
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role: UserRole | string
    email: string
    name?: string | null
    locationId?: string | null
    locationName?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole | string
    email: string
    locationId?: string | null
    locationName?: string | null
  }
}