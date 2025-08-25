// app/(admin)/vehicles/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Car } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function NewVehiclePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Отримуємо списки для select
  const { data: locations } = trpc.location.list.useQuery()
  const { data: instructors } = trpc.user.getInstructors.useQuery()

  const createMutation = trpc.vehicle.create.useMutation({
    onSuccess: () => {
      toast.success('Автомобіль успішно додано!')
      router.push('/vehicles')
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
      registrationNumber: formData.get('registrationNumber') as string,
      vin: formData.get('vin') as string || undefined,
      make: formData.get('make') as string,
      model: formData.get('model') as string,
      year: parseInt(formData.get('year') as string),
      color: formData.get('color') as string || undefined,
      category: formData.get('category') as string,
      transmission: formData.get('transmission') as string,
      fuelType: formData.get('fuelType') as string,
      assignedInstructorId: formData.get('assignedInstructorId') as string || undefined,
      baseLocationId: formData.get('baseLocationId') as string,
      insuranceExpiry: formData.get('insuranceExpiry') as string,
      inspectionExpiry: formData.get('inspectionExpiry') as string,
    }

    try {
      await createMutation.mutateAsync(data)
    } catch (error) {
      console.error('Create vehicle error:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/vehicles" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад до списку
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Car className="w-8 h-8" />
          Додати новий автомобіль
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Інформація про автомобіль</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Основна інформація */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Реєстраційний номер *
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  required
                  placeholder="WX 12345"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  VIN код
                </label>
                <input
                  type="text"
                  name="vin"
                  placeholder="Необов'язково"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Марка *
                </label>
                <input
                  type="text"
                  name="make"
                  required
                  placeholder="Toyota"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Модель *
                </label>
                <input
                  type="text"
                  name="model"
                  required
                  placeholder="Corolla"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Рік випуску *
                </label>
                <input
                  type="number"
                  name="year"
                  required
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  placeholder="2022"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Колір
                </label>
                <input
                  type="text"
                  name="color"
                  placeholder="Сірий"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Технічні характеристики */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Категорія *
                </label>
                <select
                  name="category"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Оберіть категорію</option>
                  <option value="B">B - Легковий</option>
                  <option value="B_AUTOMATIC">B - Автомат</option>
                  <option value="C">C - Вантажний</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Трансмісія *
                </label>
                <select
                  name="transmission"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Оберіть тип</option>
                  <option value="MANUAL">Механіка</option>
                  <option value="AUTOMATIC">Автомат</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Тип палива *
                </label>
                <select
                  name="fuelType"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Оберіть тип</option>
                  <option value="PETROL">Бензин</option>
                  <option value="DIESEL">Дизель</option>
                  <option value="HYBRID">Гібрид</option>
                  <option value="ELECTRIC">Електро</option>
                  <option value="LPG">Газ</option>
                </select>
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
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Додавання...' : 'Додати автомобіль'}
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