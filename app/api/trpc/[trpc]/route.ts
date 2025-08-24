// app/api/trpc/[trpc]/route.ts

import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/lib/trpc/routers'
import { createTRPCContext } from '@/lib/trpc/server'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async () => createTRPCContext({ req }),
    onError: ({ error, type, path, input, ctx, req }) => {
      console.error(`❌ tRPC Error on ${path}:`, {
        type,
        message: error.message,
        code: error.code,
        input: typeof input === 'object' ? JSON.stringify(input).slice(0, 100) : input,
      })
    },
  })

export { handler as GET, handler as POST }