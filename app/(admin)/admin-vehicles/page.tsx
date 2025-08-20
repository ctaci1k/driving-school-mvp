// app/(admin)/vehicles/page.tsx
'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, Plus, Edit, Trash2, Wrench } from 'lucide-react'
import Link from 'next/link'

import { Navigation } from '@/components/layouts/navigation'
import { useSession } from 'next-auth/react'

export default function VehiclesPage() {
  const { data: session } = useSession()
  const { data: vehicles, isLoading, refetch } = trpc.vehicle.list.useQuery()
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  const filteredVehicles = vehicles?.filter(v => 
    !selectedStatus || v.status === selectedStatus
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Завантаження...</p>
      </div>
    )
  }

  return (
    <>
      {session && <Navigation userRole={session.user.role} />}
      <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Управління автомобілями</h1>
          <p className="text-gray-600">Всього автомобілів: {vehicles?.length || 0}</p>
        </div>
        <Link href="/vehicles/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Додати автомобіль
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
          <option value="">Всі статуси</option>
          <option value="ACTIVE">Активні</option>
          <option value="MAINTENANCE">На обслуговуванні</option>
          <option value="REPAIR">В ремонті</option>
          <option value="INACTIVE">Неактивні</option>
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
                  {vehicle.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Категорія:</span>
                  <span className="font-medium">{vehicle.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Трансмісія:</span>
                  <span className="font-medium">
                    {vehicle.transmission === 'MANUAL' ? 'Механіка' : 'Автомат'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Паливо:</span>
                  <span className="font-medium">{vehicle.fuelType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Пробіг:</span>
                  <span className="font-medium">{vehicle.currentMileage} км</span>
                </div>
                
                {vehicle.assignedInstructor && (
                  <div className="pt-2 border-t">
                    <p className="text-gray-600">Інструктор:</p>
                    <p className="font-medium">
                      {vehicle.assignedInstructor.firstName} {vehicle.assignedInstructor.lastName}
                    </p>
                  </div>
                )}
                
                {vehicle.baseLocation && (
                  <div className="pt-2">
                    <p className="text-gray-600">Локація:</p>
                    <p className="font-medium">{vehicle.baseLocation.name}</p>
                  </div>
                )}

                <div className="pt-3 border-t space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Страховка до:</span>
                    <span className={new Date(vehicle.insuranceExpiry) < new Date(Date.now() + 30*24*60*60*1000) ? 'text-orange-600' : ''}>
                      {new Date(vehicle.insuranceExpiry).toLocaleDateString('uk-UA')}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Техогляд до:</span>
                    <span className={new Date(vehicle.inspectionExpiry) < new Date(Date.now() + 30*24*60*60*1000) ? 'text-orange-600' : ''}>
                      {new Date(vehicle.inspectionExpiry).toLocaleDateString('uk-UA')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Link href={`/vehicles/${vehicle.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/vehicles/${vehicle.id}/maintenance`} className="flex-1">
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
            <p className="text-gray-500">Немає автомобілів</p>
            <Link href="/vehicles/new">
              <Button className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Додати перший автомобіль
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
      </div>
    </>
  )
}