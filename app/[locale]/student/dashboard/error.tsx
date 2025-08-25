// app/[locale]/student/dashboard/error.tsx

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardError({
 error,
 reset,
}: {
 error: Error & { digest?: string };
 reset: () => void;
}) {
 const router = useRouter();

 useEffect(() => {
   // Log the error to an error reporting service
   console.error('Dashboard error:', error);
 }, [error]);

 return (
   <div className="flex min-h-[50vh] items-center justify-center p-4">
     <Card className="w-full max-w-md">
       <CardHeader className="text-center">
         <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
           <AlertTriangle className="h-6 w-6 text-red-600" />
         </div>
         <CardTitle>Something went wrong!</CardTitle>
         <CardDescription>
           {error.message || 'An unexpected error occurred while loading your dashboard.'}
         </CardDescription>
       </CardHeader>
       <CardContent className="flex flex-col gap-3">
         <Button
           onClick={reset}
           className="w-full"
           variant="default"
         >
           <RefreshCw className="mr-2 h-4 w-4" />
           Try Again
         </Button>
         <Button
           onClick={() => router.push('/student')}
           className="w-full"
           variant="outline"
         >
           <Home className="mr-2 h-4 w-4" />
           Go to Home
         </Button>
         {error.digest && (
           <p className="text-center text-xs text-muted-foreground">
             Error ID: {error.digest}
           </p>
         )}
       </CardContent>
     </Card>
   </div>
 );
}