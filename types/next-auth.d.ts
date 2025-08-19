// types/next-auth.d.ts

import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      email: string
      name?: string
    }
  }

  interface User {
    id: string
    role: string
    email: string
    name?: string
  }

  interface JWT {
    id: string
    role: string
    email: string
  }
}
