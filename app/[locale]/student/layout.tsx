// app/[locale]/student/layout.tsx
import StudentNavigation from '@/components/student/navigation'

interface StudentLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default function StudentLayout({ 
  children, 
  params: { locale } 
}: StudentLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNavigation locale={locale} />
      
      {/* Main content with padding for both top bar and sidebar */}
      <div className="lg:pl-64 lg:pt-16 pt-16">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}