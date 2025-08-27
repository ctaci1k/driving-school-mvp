// app/[locale]/student/payments/packages/page.tsx

'use client';

import { useState } from 'react';
import {
  Package,
  Clock,
  Calendar,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Gift,
  Zap,
  Star,
  Info,
  ArrowRight,
  RefreshCw,
  Plus,
  Coins,
  Trophy,
  Target,
  BarChart3,
  History,
  ShoppingCart,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';

// Mock data
const mockActivePackages = [
  {
    id: 'PKG001',
    name: 'Pakiet Standard',
    purchaseDate: '2024-08-01',
    expiryDate: '2024-11-01',
    totalCredits: 10,
    usedCredits: 6,
    remainingCredits: 4,
    status: 'active',
    price: 1800,
    lessons: [
      { date: '2024-08-05', type: 'Jazda miejska', instructor: 'Piotr Nowak' },
      { date: '2024-08-08', type: 'Parkowanie', instructor: 'Anna Kowalczyk' },
      { date: '2024-08-12', type: 'Jazda nocna', instructor: 'Piotr Nowak' },
      { date: '2024-08-15', type: 'Jazda miejska', instructor: 'Piotr Nowak' },
      { date: '2024-08-20', type: 'Autostrada', instructor: 'Tomasz Wiśniewski' },
      { date: '2024-08-23', type: 'Manewry', instructor: 'Anna Kowalczyk' }
    ],
    benefits: ['Elastyczne terminy', 'Darmowe materiały', 'Priorytetowa rezerwacja']
  },
  {
    id: 'PKG002',
    name: 'Pakiet Weekendowy',
    purchaseDate: '2024-08-15',
    expiryDate: '2024-10-15',
    totalCredits: 5,
    usedCredits: 1,
    remainingCredits: 4,
    status: 'active',
    price: 950,
    lessons: [
      { date: '2024-08-17', type: 'Jazda miejska', instructor: 'Katarzyna Nowak' }
    ],
    benefits: ['Weekendy', 'Elastyczne godziny']
  }
];

const mockExpiredPackages = [
  {
    id: 'PKG003',
    name: 'Pakiet Startowy',
    purchaseDate: '2024-05-01',
    expiryDate: '2024-07-01',
    totalCredits: 5,
    usedCredits: 5,
    remainingCredits: 0,
    status: 'completed',
    price: 900
  },
  {
    id: 'PKG004',
    name: 'Pakiet Intensywny',
    purchaseDate: '2024-06-01',
    expiryDate: '2024-07-15',
    totalCredits: 15,
    usedCredits: 12,
    remainingCredits: 3,
    status: 'expired',
    price: 2700
  }
];

const packageStats = {
  totalPurchased: 35,
  totalUsed: 24,
  totalRemaining: 8,
  totalExpired: 3,
  totalValue: 6350,
  avgUsageRate: 68,
  mostPopularTime: '14:00-16:00',
  favoriteInstructor: 'Piotr Nowak'
};

export default function PackagesPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const getDaysRemaining = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUsagePercentage = (used: number, total: number) => {
    return (used / total) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'expiring': return 'bg-yellow-100 text-yellow-700';
      case 'expired': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Moje pakiety</h1>
          <p className="text-gray-600">Zarządzaj swoimi pakietami lekcji</p>
        </div>
        <Link href="/student/payments/buy-package">
          <Button>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Kup nowy pakiet
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktywne kredyty</p>
                <p className="text-2xl font-bold text-green-600">{packageStats.totalRemaining}</p>
                <p className="text-xs text-gray-500">z {packageStats.totalPurchased} kupionych</p>
              </div>
              <Coins className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={getUsagePercentage(packageStats.totalUsed, packageStats.totalPurchased)} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Wykorzystane</p>
                <p className="text-2xl font-bold">{packageStats.totalUsed}</p>
                <p className="text-xs text-gray-500">{packageStats.avgUsageRate}% średnio</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Wygasłe</p>
                <p className="text-2xl font-bold text-red-600">{packageStats.totalExpired}</p>
                <p className="text-xs text-gray-500">kredyty stracone</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Łączna wartość</p>
                <p className="text-2xl font-bold">{packageStats.totalValue} PLN</p>
                <p className="text-xs text-gray-500">oszczędność 15%</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiry Warning */}
      {mockActivePackages.some(pkg => getDaysRemaining(pkg.expiryDate) <= 14) && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Pakiet wkrótce wygasa!</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Masz pakiet, który wygasa w ciągu najbliższych 2 tygodni. Wykorzystaj pozostałe kredyty lub rozważ przedłużenie.
          </AlertDescription>
        </Alert>
      )}

      {/* Packages Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="active">
            Aktywne ({mockActivePackages.length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Wygasłe ({mockExpiredPackages.length})
          </TabsTrigger>
          <TabsTrigger value="stats">
            Statystyki
          </TabsTrigger>
        </TabsList>

        {/* Active Packages */}
        <TabsContent value="active" className="space-y-4">
          {mockActivePackages.map((pkg) => {
            const daysRemaining = getDaysRemaining(pkg.expiryDate);
            const usagePercentage = getUsagePercentage(pkg.usedCredits, pkg.totalCredits);
            const isExpiring = daysRemaining <= 14;

            return (
              <Card key={pkg.id} className={isExpiring ? 'border-yellow-300' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{pkg.name}</CardTitle>
                      <CardDescription>
                        Zakupiono {pkg.purchaseDate} • Ważny do {pkg.expiryDate}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(isExpiring ? 'expiring' : pkg.status)}>
                      {isExpiring ? `Wygasa za ${daysRemaining} dni` : 'Aktywny'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Credits Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Wykorzystane kredyty</span>
                      <span className="font-medium">{pkg.usedCredits} z {pkg.totalCredits}</span>
                    </div>
                    <Progress value={usagePercentage} className="h-3" />
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">Pozostało {pkg.remainingCredits} kredytów</span>
                      <span className="text-xs text-gray-500">{usagePercentage.toFixed(0)}% wykorzystane</span>
                    </div>
                  </div>

                  {/* Benefits */}
                  {pkg.benefits && (
                    <div className="flex flex-wrap gap-2">
                      {pkg.benefits.map((benefit, index) => (
                        <Badge key={index} variant="secondary">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Recent Lessons */}
                  {pkg.lessons && pkg.lessons.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Ostatnie lekcje z tego pakietu:</p>
                      <div className="space-y-2">
                        {pkg.lessons.slice(0, 3).map((lesson, index) => (
                          <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span>{lesson.date}</span>
                              <span className="text-gray-600">• {lesson.type}</span>
                            </div>
                            <span className="text-gray-500">{lesson.instructor}</span>
                          </div>
                        ))}
                        {pkg.lessons.length > 3 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              setSelectedPackage(pkg);
                              setShowDetailsDialog(true);
                            }}
                          >
                            Zobacz wszystkie ({pkg.lessons.length})
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href="/student/bookings/book" className="flex-1">
                      <Button className="w-full" variant={isExpiring ? 'default' : 'outline'}>
                        <Zap className="h-4 w-4 mr-2" />
                        Wykorzystaj kredyty
                      </Button>
                    </Link>
                    {pkg.remainingCredits > 0 && (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setShowTransferDialog(true);
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Przedłuż
                      </Button>
                    )}
                    <Button variant="ghost" size="icon">
                      <History className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {mockActivePackages.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">Nie masz aktywnych pakietów</p>
                <Link href="/student/payments/buy-package">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Kup pierwszy pakiet
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Expired Packages */}
        <TabsContent value="expired" className="space-y-4">
          {mockExpiredPackages.map((pkg) => (
            <Card key={pkg.id} className="opacity-75">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                    <CardDescription>
                      {pkg.purchaseDate} - {pkg.expiryDate}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(pkg.status)}>
                    {pkg.status === 'completed' ? 'Wykorzystany' : 'Wygasły'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      Wykorzystano {pkg.usedCredits} z {pkg.totalCredits} kredytów
                    </p>
                    {pkg.remainingCredits > 0 && (
                      <p className="text-sm text-red-600">
                        Stracono {pkg.remainingCredits} niewykorzystanych kredytów
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{pkg.price} PLN</p>
                    <Link href="/student/payments/buy-package">
                      <Button size="sm" variant="outline" className="mt-2">
                        Kup ponownie
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Statistics */}
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Wykorzystanie pakietów</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Średnie wykorzystanie</span>
                      <span className="text-sm font-medium">{packageStats.avgUsageRate}%</span>
                    </div>
                    <Progress value={packageStats.avgUsageRate} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Najpopularniejsza pora</span>
                      <span className="font-medium">{packageStats.mostPopularTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ulubiony instruktor</span>
                      <span className="font-medium">{packageStats.favoriteInstructor}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Średni czas do wykorzystania</span>
                      <span className="font-medium">45 dni</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Oszczędności</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-3xl font-bold text-green-600">952 PLN</p>
                    <p className="text-sm text-gray-600 mt-1">zaoszczędzone dzięki pakietom</p>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cena standardowa</span>
                      <span>7,302 PLN</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Zapłacono</span>
                      <span>6,350 PLN</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-green-600">
                      <span>Oszczędność</span>
                      <span>952 PLN (13%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rekomendacje</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    Na podstawie Twojego tempa nauki, polecamy pakiet <strong>Premium 20</strong> - 
                    pozwoli Ci zaoszczędzić 420 PLN i zapewni kredyty na kolejne 2 miesiące.
                  </AlertDescription>
                </Alert>
                <Link href="/student/payments/buy-package">
                  <Button className="w-full mt-4">
                    Zobacz rekomendowane pakiety
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Program lojalnościowy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="font-medium">Status: Srebrny</span>
                    </div>
                    <Badge>320 pkt</Badge>
                  </div>
                  <Progress value={64} className="h-2" />
                  <p className="text-xs text-gray-600">
                    Jeszcze 180 punktów do statusu Złoty i 10% zniżki na wszystkie pakiety
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <Gift className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Masz 1 darmową lekcję do wykorzystania</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Transfer/Extend Dialog */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Przedłuż pakiet</DialogTitle>
            <DialogDescription>
              Przedłuż ważność pakietu "{selectedPackage?.name}" o kolejne 30 dni za jedyne 99 PLN.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Masz {selectedPackage?.remainingCredits} niewykorzystanych kredytów. 
                Przedłużenie pozwoli Ci zachować wszystkie kredyty.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransferDialog(false)}>
              Anuluj
            </Button>
            <Button>
              Przedłuż za 99 PLN
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Package Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Historia wykorzystania pakietu</DialogTitle>
            <DialogDescription>
              {selectedPackage?.name} - wszystkie lekcje
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto py-4">
            <div className="space-y-2">
              {selectedPackage?.lessons?.map((lesson: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm">
                      <p className="font-medium">{lesson.type}</p>
                      <p className="text-gray-500">{lesson.date}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-medium">{lesson.instructor}</p>
                    <Badge variant="outline">1 kredyt</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Zamknij
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}