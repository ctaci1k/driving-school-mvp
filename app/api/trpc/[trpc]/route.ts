// app/api/trpc/[trpc]/route.ts

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/lib/trpc/routers';
import { createTRPCContext } from '@/lib/trpc/server';
import { getServerSession } from 'next-auth'; // or your auth solution
import { authOptions } from '@/lib/auth'; // adjust path as needed

const handler = async (req: Request) => {
  // Extract session from the request
  // Option 1: If using NextAuth
  const session = await getServerSession(authOptions);
  
  // Option 2: If you have a custom auth solution, extract from headers/cookies
  // const session = await getSessionFromRequest(req);
  
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: async () => {
      // Pass the session to your context creator
      return createTRPCContext({ 
        session,
        // Add any other required properties here
      });
    },
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
            );
          }
        : undefined,
  });
};

export { handler as GET, handler as POST };