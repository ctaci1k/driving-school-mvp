// app/[locale]/(admin)/admin-vehicles/page.tsx

'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, Plus, Edit, Trash2, Wrench } from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/layouts/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { pl, uk } from 'date-fns/locale'

export default function VehiclesPage() {
  const t = useTranslations()
  const params = useParams()
  const locale = params.locale as string
  const { data: session } = useSession()
  
  // Визначаємо локаль для date-fns
  const dateLocale = locale === 'pl' ? pl : locale === 'uk' ? uk : undefined
  
  const { data: vehicles, isLoading, refetch } = trpc.vehicle.list.useQuery()
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  const filteredVehicles = vehicles?.filter(v => 
    !selectedStatus || v.status === selectedStatus
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <>
      {session && <Navigation userRole={session.user.role} />}
      <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('vehicle.title')}</h1>
          <p className="text-gray-600">{t('adminVehicles.totalVehicles', { count: vehicles?.length || 0 })}</p>
        </div>
        <Link href={`/${locale}/vehicles/new`}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {t('vehicle.addVehicle')}
          </Button>
        </Link>
      </div>

      {/* Фільтри */}
      <div className="mb-6 flex gap-4">
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">{t('adminVehicles.allStatuses')}</option>
          <option value="ACTIVE">{t('vehicle.status.active')}</option>
          <option value="MAINTENANCE">{t('vehicle.status.maintenance')}</option>
          <option value="REPAIR">{t('vehicle.status.repair')}</option>
          <option value="INACTIVE">{t('vehicle.status.inactive')}</option>
        </select>
      </div>

      {/* Список автомобілів */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles?.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    {vehicle.registrationNumber}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {vehicle.make} {vehicle.model} ({vehicle.year})
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  vehicle.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  vehicle.status === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                  vehicle.status === 'REPAIR' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {t(`vehicle.status.${vehicle.status.toLowerCase()}`)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('vehicle.category')}:</span>
                  <span className="font-medium">{vehicle.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('vehicle.transmission')}:</span>
                  <span className="font-medium">
                    {vehicle.transmission === 'MANUAL' ? t('vehicle.manual') : t('vehicle.automatic')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('vehicle.fuelType')}:</span>
                  <span className="font-medium">
                    {vehicle.fuelType === 'PETROL' ? t('vehicle.petrol') :
                     vehicle.fuelType === 'DIESEL' ? t('vehicle.diesel') :
                     vehicle.fuelType === 'ELECTRIC' ? t('vehicle.electric') :
                     t('vehicle.hybrid')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('vehicle.mileage')}:</span>
                  <span className="font-medium">{vehicle.currentMileage} {t('adminVehicles.km')}</span>
                </div>
                
                {vehicle.assignedInstructor && (
                  <div className="pt-2 border-t">
                    <p className="text-gray-600">{t('booking.instructor')}:</p>
                    <p className="font-medium">
                      {vehicle.assignedInstructor.firstName} {vehicle.assignedInstructor.lastName}
                    </p>
                  </div>
                )}
                
                {vehicle.baseLocation && (
                  <div className="pt-2">
                    <p className="text-gray-600">{t('booking.location')}:</p>
                    <p className="font-medium">{vehicle.baseLocation.name}</p>
                  </div>
                )}

                <div className="pt-3 border-t space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">{t('adminVehicles.insuranceUntil')}:</span>
                    <span className={new Date(vehicle.insuranceExpiry) < new Date(Date.now() + 30*24*60*60*1000) ? 'text-orange-600' : ''}>
                      {format(new Date(vehicle.insuranceExpiry), 'dd.MM.yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">{t('adminVehicles.inspectionUntil')}:</span>
                    <span className={new Date(vehicle.inspectionExpiry) < new Date(Date.now() + 30*24*60*60*1000) ? 'text-orange-600' : ''}>
                      {format(new Date(vehicle.inspectionExpiry), 'dd.MM.yyyy')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Link href={`/${locale}/vehicles/${vehicle.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/${locale}/vehicles/${vehicle.id}/maintenance`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Wrench className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles?.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Car className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">{t('adminVehicles.noVehicles')}</p>
            <Link href={`/${locale}/vehicles/new`}>
              <Button className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                {t('adminVehicles.addFirstVehicle')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
      </div>
    </>
  )
}