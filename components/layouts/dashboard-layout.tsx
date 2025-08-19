import { auth } from '@/lib/auth'
import { Navigation } from './navigation'
import { redirect } from 'next/navigation'

export async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userRole={session.user.role} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
