import { DashboardLayout } from '@/components/layouts/dashboard-layout'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}