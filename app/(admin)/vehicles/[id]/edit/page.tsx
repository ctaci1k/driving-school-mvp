// app/(admin)/vehicles/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Car, Trash2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function EditVehiclePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  // Отримуємо дані автомобіля
  const { data: vehicle, isLoading: vehicleLoading } = trpc.vehicle.getById.useQuery(params.id)
  const { data: locations } = trpc.location.list.useQuery()
  const { data: instructors } = trpc.user.getInstructors.useQuery()

  const updateMutation = trpc.vehicle.update.useMutation({
    onSuccess: () => {
      toast.success('Автомобіль успішно оновлено!')
      router.push('/vehicles')
    },
    onError: (error) => {
      toast.error(`Помилка: ${error.message}`)
      setLoading(false)
    }
  })

  const deleteMutation = trpc.vehicle.delete.useMutation({
    onSuccess: () => {
      toast.success('Автомобіль видалено!')
      router.push('/vehicles')
    },
    onError: (error) => {
      toast.error(`Помилка: ${error.message}`)
      setDeleting(false)
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      assignedInstructorId: formData.get('assignedInstructorId') as string || null,
      baseLocationId: formData.get('baseLocationId') as string,
      status: formData.get('status') as string,
      currentMileage: parseInt(formData.get('currentMileage') as string) || 0,
      insuranceExpiry: formData.get('insuranceExpiry') as string,
      inspectionExpiry: formData.get('inspectionExpiry') as string,
    }

    try {
      await updateMutation.mutateAsync({
        id: params.id,
        data
      })
    } catch (error) {
      console.error('Update vehicle error:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Ви впевнені що хочете видалити цей автомобіль?')) {
      return
    }
    
    setDeleting(true)
    try {
      await deleteMutation.mutateAsync(params.id)
    } catch (error) {
      console.error('Delete vehicle error:', error)
    }
  }

  if (vehicleLoading) {
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/vehicles" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад до списку
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Car className="w-8 h-8" />
              Редагувати автомобіль
            </h1>
            <p className="text-gray-600 mt-2">
              {vehicle.make} {vehicle.model} - {vehicle.registrationNumber}
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Видалення...' : 'Видалити'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Інформація про автомобіль</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Незмінювана інформація */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Реєстраційний номер</p>
              <p className="font-medium">{vehicle.registrationNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">VIN</p>
              <p className="font-medium">{vehicle.vin || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Марка і модель</p>
              <p className="font-medium">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Технічні характеристики</p>
              <p className="font-medium">
                {vehicle.category} / {vehicle.transmission} / {vehicle.fuelType}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Статус і пробіг */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Статус
                </label>
                <select
                  name="status"
                  defaultValue={vehicle.status}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ACTIVE">Активний</option>
                  <option value="MAINTENANCE">На обслуговуванні</option>
                  <option value="REPAIR">В ремонті</option>
                  <option value="INACTIVE">Неактивний</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Поточний пробіг (км)
                </label>
                <input
                  type="number"
                  name="currentMileage"
                  defaultValue={vehicle.currentMileage}
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Призначення */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Базова локація *
                </label>
                <select
                  name="baseLocationId"
                  defaultValue={vehicle.baseLocationId}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Оберіть локацію</option>
                  {locations?.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name} ({location.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Призначений інструктор
                </label>
                <select
                  name="assignedInstructorId"
                  defaultValue={vehicle.assignedInstructorId || ''}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Не призначено</option>
                  {instructors?.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.firstName} {instructor.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Документи */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Страховка дійсна до *
                </label>
                <input
                  type="date"
                  name="insuranceExpiry"
                  defaultValue={vehicle.insuranceExpiry.split('T')[0]}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Техогляд дійсний до *
                </label>
                <input
                  type="date"
                  name="inspectionExpiry"
                  defaultValue={vehicle.inspectionExpiry.split('T')[0]}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Останнє обслуговування */}
            {vehicle.lastServiceDate && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Останнє обслуговування</p>
                <p className="font-medium">
                  {new Date(vehicle.lastServiceDate).toLocaleDateString('uk-UA')}
                </p>
                {vehicle.nextServiceDate && (
                  <>
                    <p className="text-sm text-gray-600 mb-1 mt-2">Наступне обслуговування</p>
                    <p className="font-medium">
                      {new Date(vehicle.nextServiceDate).toLocaleDateString('uk-UA')}
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Кнопки */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Збереження...' : 'Зберегти зміни'}
              </Button>
              <Link href="/vehicles" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Скасувати
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}