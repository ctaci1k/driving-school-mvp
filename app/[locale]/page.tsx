// app/[locale]/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface PageProps {
  params: {
    locale: string
  }
}

export default async function HomePage({ params: { locale } }: PageProps) {
  const session = await getServerSession(authOptions)
  
  // ВАЖЛИВО: Якщо немає сесії - на логін
  if (!session || !session.user) {
    redirect(`/${locale}/auth/login`)
    return null // Додайте return для впевненості
  }
  
  // Редиректи з правильними шляхами
  const role = session.user.role
  
  if (role === 'ADMIN') {
    redirect(`/${locale}/admin/dashboard`)
  } else if (role === 'INSTRUCTOR') {
    redirect(`/${locale}/instructor/dashboard`)
  } else if (role === 'STUDENT') {
    redirect(`/${locale}/student/dashboard`)
  } else {
    // Якщо роль невідома - на логін
    redirect(`/${locale}/auth/login`)
  }
}