// app/(admin)/vehicles/[id]/maintenance/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Wrench, Plus, Calendar, DollarSign, Gauge } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function VehicleMaintenancePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Отримуємо дані автомобіля з історією обслуговування
  const { data: vehicle, isLoading, refetch } = trpc.vehicle.getById.useQuery(params.id)
  const { data: maintenanceLogs } = trpc.vehicle.getMaintenanceHistory.useQuery(params.id)

  const maintenanceMutation = trpc.vehicle.logMaintenance.useMutation({
    onSuccess: () => {
      toast.success('Обслуговування записано!')
      setShowForm(false)
      refetch()
    },
    onError: (error) => {
      toast.error(`Помилка: ${error.message}`)
      setLoading(false)
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      vehicleId: params.id,
      type: formData.get('type') as string,
      description: formData.get('description') as string,
      cost: parseFloat(formData.get('cost') as string) || undefined,
      mileage: parseInt(formData.get('mileage') as string),
      performedAt: formData.get('performedAt') as string,
      performedBy: formData.get('performedBy') as string || undefined,
      nextDueDate: formData.get('nextDueDate') as string || undefined,
      nextDueMileage: parseInt(formData.get('nextDueMileage') as string) || undefined,
    }

    try {
      await maintenanceMutation.mutateAsync(data)
    } catch (error) {
      console.error('Maintenance error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Завантаження...</p>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Автомобіль не знайдено</p>
        <Link href="/vehicles">
          <Button className="mt-4">Повернутись до списку</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Link href="/vehicles" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад до списку
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Wrench className="w-8 h-8" />
              Обслуговування автомобіля
            </h1>
            <p className="text-gray-600 mt-2">
              {vehicle.make} {vehicle.model} - {vehicle.registrationNumber}
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Додати запис
          </Button>
        </div>
      </div>

      {/* Поточний стан автомобіля */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Gauge className="w-4 h-4" />
              <span className="text-sm">Поточний пробіг</span>
            </div>
            <p className="text-2xl font-bold">{vehicle.currentMileage} км</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Останнє ТО</span>
            </div>
            <p className="text-lg font-medium">
              {vehicle.lastServiceDate 
                ? new Date(vehicle.lastServiceDate).toLocaleDateString('uk-UA')
                : 'Немає даних'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Наступне ТО</span>
            </div>
            <p className="text-lg font-medium">
              {vehicle.nextServiceDate 
                ? new Date(vehicle.nextServiceDate).toLocaleDateString('uk-UA')
                : 'Не заплановано'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <span className="text-sm">Статус</span>
            </div>
            <p className={`text-lg font-medium ${
              vehicle.status === 'ACTIVE' ? 'text-green-600' :
              vehicle.status === 'MAINTENANCE' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {vehicle.status}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Форма додавання обслуговування */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Новий запис про обслуговування</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Тип обслуговування *
                  </label>
                  <select
                    name="type"
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Оберіть тип</option>
                    <option value="SERVICE">Планове ТО</option>
                    <option value="REPAIR">Ремонт</option>
                    <option value="INSPECTION">Техогляд</option>
                    <option value="TIRE_CHANGE">Заміна шин</option>
                    <option value="OIL_CHANGE">Заміна масла</option>
                    <option value="OTHER">Інше</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Дата виконання *
                  </label>
                  <input
                    type="date"
                    name="performedAt"
                    required
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Пробіг на момент обслуговування (км) *
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    required
                    min={vehicle.currentMileage}
                    defaultValue={vehicle.currentMileage}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Вартість (PLN)
                  </label>
                  <input
                    type="number"
                    name="cost"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Виконав
                  </label>
                  <input
                    type="text"
                    name="performedBy"
                    placeholder="Назва СТО або майстер"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Наступне ТО (дата)
                  </label>
                  <input
                    type="date"
                    name="nextDueDate"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Наступне ТО (пробіг, км)
                  </label>
                  <input
                    type="number"
                    name="nextDueMileage"
                    min={vehicle.currentMileage}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Опис робіт *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Опишіть виконані роботи..."
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Збереження...' : 'Зберегти'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Скасувати
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Історія обслуговування */}
      <Card>
        <CardHeader>
          <CardTitle>Історія обслуговування</CardTitle>
        </CardHeader>
        <CardContent>
          {maintenanceLogs && maintenanceLogs.length > 0 ? (
            <div className="space-y-4">
              {maintenanceLogs.map((log) => (
                <div key={log.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{log.type}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(log.performedAt).toLocaleDateString('uk-UA')}
                        </span>
                      </div>
                      <p className="text-gray-700">{log.description}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Gauge className="w-3 h-3" />
                          {log.mileage} км
                        </span>
                        {log.cost && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {log.cost.toString()} PLN
                          </span>
                        )}
                        {log.performedBy && (
                          <span>{log.performedBy}</span>
                        )}
                      </div>
                      {log.nextDueDate && (
                        <p className="text-sm text-orange-600 mt-1">
                          Наступне ТО: {new Date(log.nextDueDate).toLocaleDateString('uk-UA')}
                          {log.nextDueMileage && ` або ${log.nextDueMileage} км`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Історія обслуговування відсутня
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}