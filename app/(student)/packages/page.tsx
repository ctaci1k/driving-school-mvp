// app/(student)/packages/page.tsx
'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, CreditCard, Clock, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function PackagesPage() {
  const router = useRouter()
  const { data: packages, isLoading } = trpc.package.getActive.useQuery()
  const { data: userPackages } = trpc.package.getUserPackages.useQuery()
  const { data: credits } = trpc.package.getUserCredits.useQuery()
  
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [purchasing, setPurchasing] = useState(false)

  const purchaseMutation = trpc.payment.createPackagePayment.useMutation({
    onSuccess: (data) => {
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      } else if (data.mockPayment) {
        toast.success('Пакет успішно придбаний!')
        router.refresh()
      }
    },
    onError: (error) => {
      toast.error(`Помилка: ${error.message}`)
      setPurchasing(false)
    }
  })

  const handlePurchase = async (packageId: string) => {
    setPurchasing(true)
    setSelectedPackage(packageId)
    
    try {
      await purchaseMutation.mutateAsync({ packageId })
    } catch (error) {
      console.error('Purchase error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Завантаження...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Пакети уроків</h1>
        <p className="text-gray-600">Купуйте пакети та економте на уроках водіння</p>
      </div>

      {/* Поточний баланс */}
      {credits && credits.totalCredits > 0 && (
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Ваш поточний баланс
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-4">
              {credits.totalCredits} кредитів
            </div>
            <div className="space-y-2">
              {credits.packages.map((pkg) => (
                <div key={pkg.id} className="flex justify-between text-sm">
                  <span>{pkg.package.name}</span>
                  <div className="flex gap-4">
                    <span className="font-medium">{pkg.creditsRemaining} кредитів</span>
                    <span className="text-gray-500">
                      до {new Date(pkg.expiresAt).toLocaleDateString('uk-UA')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Доступні пакети */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {packages?.map((pkg) => (
          <Card 
            key={pkg.id} 
            className={`relative hover:shadow-lg transition-shadow ${
              pkg.isPopular ? 'border-blue-500 border-2' : ''
            }`}
          >
            {pkg.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                  Найпопулярніший
                </span>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                {pkg.name}
              </CardTitle>
              {pkg.description && (
                <p className="text-sm text-gray-600 mt-2">{pkg.description}</p>
              )}
            </CardHeader>
            
            <CardContent>
              <div className="mb-4">
                <div className="text-3xl font-bold">{pkg.price.toString()} PLN</div>
                <div className="text-gray-600">{pkg.credits} уроків</div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Дійсний {pkg.validityDays} днів</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-green-600 font-medium">
                    {(Number(pkg.price) / pkg.credits).toFixed(0)} PLN за урок
                  </span>
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={() => handlePurchase(pkg.id)}
                disabled={purchasing}
              >
                {purchasing && selectedPackage === pkg.id ? (
                  'Обробка...'
                ) : (
                  'Придбати пакет'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Історія придбаних пакетів */}
      {userPackages && userPackages.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Історія придбаних пакетів</h2>
          <div className="space-y-4">
            {userPackages.map((userPkg) => (
              <Card key={userPkg.id}>
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <p className="font-medium">{userPkg.package.name}</p>
                    <p className="text-sm text-gray-600">
                      Придбано: {new Date(userPkg.purchasedAt).toLocaleDateString('uk-UA')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {userPkg.creditsRemaining} / {userPkg.creditsTotal} кредитів
                    </p>
                    <p className="text-sm text-gray-600">
                      {userPkg.status === 'ACTIVE' ? (
                        <span className="text-green-600">Активний</span>
                      ) : userPkg.status === 'EXPIRED' ? (
                        <span className="text-red-600">Прострочений</span>
                      ) : (
                        <span className="text-gray-600">Використаний</span>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}