// app/[locale]/student/layout.tsx

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import StudentSidebar from '@/components/navigation/StudentSidebar';
import StudentHeader from '@/components/navigation/StudentHeader';
import StudentMobileNav from '@/components/navigation/StudentMobileNav';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Panel Studenta | Szkoła Jazdy',
  description: 'Panel studenta - zarządzaj swoimi lekcjami jazdy',
};

interface StudentLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function StudentLayout({
  children,
  params: { locale },
}: StudentLayoutProps) {
  const session = await getServerSession(authOptions);

  // Check authentication and role
  if (!session) {
    redirect(`/${locale}/login`);
  }

  if (session.user.role !== 'STUDENT') {
    redirect(`/${locale}/unauthorized`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <StudentSidebar locale={locale} user={session.user} />
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <StudentMobileNav locale={locale} user={session.user} />
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Header */}
        <StudentHeader user={session.user} locale={locale} />

        {/* Page Content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}