// app/[locale]/(admin)/admin-users/page.tsx

'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc/client'
import { format } from 'date-fns'
import { pl, uk } from 'date-fns/locale'
import { Navigation } from '@/components/layouts/navigation' // ← змінено
import { useSession } from 'next-auth/react' // ← додано
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

export default function AdminUsersPage() {
  const t = useTranslations()
  const params = useParams()
  const locale = params.locale as string
  const { data: session } = useSession() // ← додано
  
  // Визначаємо локаль для date-fns
  const dateLocale = locale === 'pl' ? pl : locale === 'uk' ? uk : undefined
  
  const { data: users, isLoading, refetch } = trpc.user.getAllUsers.useQuery()
  const updateRoleMutation = trpc.user.updateRole.useMutation({
    onSuccess: () => {
      refetch()
    },
  })

  const handleRoleChange = (userId: string, newRole: any) => {
    updateRoleMutation.mutate({ userId, role: newRole })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {session && <Navigation userRole={session.user.role} />} {/* ← змінено */}
        <div className="flex items-center justify-center min-h-[400px]">
          <p>{t('adminUsers.loadingUsers')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {session && <Navigation userRole={session.user.role} />} {/* ← змінено */}
      <div className="container mx-auto px-4 py-8">
        {/* решта коду залишається без змін */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('adminUsers.title')}</h1>
          <p className="text-gray-600">{t('adminUsers.subtitle')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('adminUsers.allUsers', { count: users?.length || 0 })}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">{t('adminUsers.name')}</th>
                    <th className="text-left p-2">{t('auth.email')}</th>
                    <th className="text-left p-2">{t('adminUsers.role')}</th>
                    <th className="text-left p-2">{t('adminUsers.joined')}</th>
                    <th className="text-left p-2">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-2">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="STUDENT">{t('user.role.student')}</option>
                          <option value="INSTRUCTOR">{t('user.role.instructor')}</option>
                          <option value="ADMIN">{t('user.role.admin')}</option>
                        </select>
                      </td>
                      <td className="p-2">
                        {format(new Date(user.createdAt), 'd MMM yyyy', { locale: dateLocale })}
                      </td>
                      <td className="p-2">
                        <Button size="sm" variant="outline">{t('adminUsers.view')}</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}