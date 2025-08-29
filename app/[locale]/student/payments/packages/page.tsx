// app/[locale]/student/payments/packages/page.tsx

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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

export default function PackagesPage() {
  const t = useTranslations('student.packages');
  const [activeTab, setActiveTab] = useState('active');
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Mock data
  const mockActivePackages = [
    {
      id: 'PKG001',
      name: t('packageNames.standard'),
      purchaseDate: '2024-08-01',
      expiryDate: '2024-11-01',
      totalCredits: 10,
      usedCredits: 6,
      remainingCredits: 4,
      status: 'active',
      price: 1800,
      lessons: [
        { date: '2024-08-05', type: t('lessonTypes.cityDriving'), instructor: 'Piotr Nowak' },
        { date: '2024-08-08', type: t('lessonTypes.parking'), instructor: 'Anna Kowalczyk' },
        { date: '2024-08-12', type: t('lessonTypes.nightDriving'), instructor: 'Piotr Nowak' },
        { date: '2024-08-15', type: t('lessonTypes.cityDriving'), instructor: 'Piotr Nowak' },
        { date: '2024-08-20', type: t('lessonTypes.highway'), instructor: 'Tomasz Wiśniewski' },
        { date: '2024-08-23', type: t('lessonTypes.maneuvers'), instructor: 'Anna Kowalczyk' }
      ],
      benefits: [
        t('benefits.flexibleSchedule'),
        t('benefits.freeMaterials'),
        t('benefits.priorityBooking')
      ]
    },
    {
      id: 'PKG002',
      name: t('packageNames.weekend'),
      purchaseDate: '2024-08-15',
      expiryDate: '2024-10-15',
      totalCredits: 5,
      usedCredits: 1,
      remainingCredits: 4,
      status: 'active',
      price: 950,
      lessons: [
        { date: '2024-08-17', type: t('lessonTypes.cityDriving'), instructor: 'Katarzyna Nowak' }
      ],
      benefits: [
        t('benefits.weekends'),
        t('benefits.flexibleHours')
      ]
    }
  ];

  const mockExpiredPackages = [
    {
      id: 'PKG003',
      name: t('packageNames.starter'),
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
      name: t('packageNames.intensive'),
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
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
        <Link href="/student/payments/buy-package">
          <Button>
            <ShoppingCart className="h-4 w-4 mr-2" />
            {t('buyNewPackage')}
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('stats.activeCredits')}</p>
                <p className="text-2xl font-bold text-green-600">{packageStats.totalRemaining}</p>
                <p className="text-xs text-gray-500">{t('stats.from')} {packageStats.totalPurchased} {t('stats.purchased')}</p>
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
                <p className="text-sm text-gray-600">{t('stats.used')}</p>
                <p className="text-2xl font-bold">{packageStats.totalUsed}</p>
                <p className="text-xs text-gray-500">{t('stats.averageUsage', { percent: packageStats.avgUsageRate })}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('stats.expired')}</p>
                <p className="text-2xl font-bold text-red-600">{packageStats.totalExpired}</p>
                <p className="text-xs text-gray-500">{t('stats.creditsLost')}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('stats.totalValue')}</p>
                <p className="text-2xl font-bold">{t('stats.currency', { amount: packageStats.totalValue })}</p>
                <p className="text-xs text-gray-500">{t('stats.saving', { percent: 15 })}</p>
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
          <AlertTitle className="text-yellow-800">{t('warning.title')}</AlertTitle>
          <AlertDescription className="text-yellow-700">
            {t('warning.description')}
          </AlertDescription>
        </Alert>
      )}

      {/* Packages Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="active">
            {t('tabs.active')} ({mockActivePackages.length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            {t('tabs.expired')} ({mockExpiredPackages.length})
          </TabsTrigger>
          <TabsTrigger value="stats">
            {t('tabs.statistics')}
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
                        {t('packageCard.purchasedOn')} {pkg.purchaseDate} • {t('packageCard.validUntil')} {pkg.expiryDate}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(isExpiring ? 'expiring' : pkg.status)}>
                      {isExpiring ? t('packageCard.expiringIn', { days: daysRemaining }) : t('packageCard.active')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Credits Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">{t('packageCard.usedCredits')}</span>
                      <span className="font-medium">{pkg.usedCredits} {t('packageCard.of')} {pkg.totalCredits}</span>
                    </div>
                    <Progress value={usagePercentage} className="h-3" />
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-gray-500">{t('packageCard.remainingCredits', { count: pkg.remainingCredits })}</span>
                      <span className="text-xs text-gray-500">{t('packageCard.percentUsed', { percent: usagePercentage.toFixed(0) })}</span>
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
                      <p className="text-sm font-medium mb-2">{t('packageCard.recentLessons')}:</p>
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
                            {t('packageCard.viewAll', { count: pkg.lessons.length })}
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
                        {t('packageCard.useCredits')}
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
                        {t('packageCard.extend')}
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
                <p className="text-gray-500 mb-4">{t('empty.noActivePackages')}</p>
                <Link href="/student/payments/buy-package">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('empty.buyFirstPackage')}
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
                    {pkg.status === 'completed' ? t('packageCard.completed') : t('packageCard.expired')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      {t('packageCard.creditsUsed', { used: pkg.usedCredits, total: pkg.totalCredits })}
                    </p>
                    {pkg.remainingCredits > 0 && (
                      <p className="text-sm text-red-600">
                        {t('packageCard.creditsLost', { count: pkg.remainingCredits })}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{t('stats.currency', { amount: pkg.price })}</p>
                    <Link href="/student/payments/buy-package">
                      <Button size="sm" variant="outline" className="mt-2">
                        {t('packageCard.buyAgain')}
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
                <CardTitle className="text-lg">{t('statistics.packageUsage')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">{t('statistics.averageUsage')}</span>
                      <span className="text-sm font-medium">{packageStats.avgUsageRate}%</span>
                    </div>
                    <Progress value={packageStats.avgUsageRate} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('statistics.popularTime')}</span>
                      <span className="font-medium">{packageStats.mostPopularTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('statistics.favoriteInstructor')}</span>
                      <span className="font-medium">{packageStats.favoriteInstructor}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('statistics.avgTimeToUse')}</span>
                      <span className="font-medium">45 {t('statistics.days')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('statistics.savings')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-3xl font-bold text-green-600">{t('stats.currency', { amount: 952 })}</p>
                    <p className="text-sm text-gray-600 mt-1">{t('statistics.savedAmount')}</p>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('statistics.standardPrice')}</span>
                      <span>{t('stats.currency', { amount: 7302 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('statistics.paid')}</span>
                      <span>{t('stats.currency', { amount: 6350 })}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-green-600">
                      <span>{t('statistics.savingAmount')}</span>
                      <span>{t('stats.currency', { amount: 952 })} (13%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('statistics.recommendations')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    {t('statistics.recommendationText')}
                  </AlertDescription>
                </Alert>
                <Link href="/student/payments/buy-package">
                  <Button className="w-full mt-4">
                    {t('statistics.viewRecommended')}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('statistics.loyaltyProgram')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="font-medium">{t('statistics.status')}: {t('statistics.silver')}</span>
                    </div>
                    <Badge>320 {t('statistics.points')}</Badge>
                  </div>
                  <Progress value={64} className="h-2" />
                  <p className="text-xs text-gray-600">
                    {t('statistics.pointsToNext', { count: 180, status: t('statistics.gold'), discount: 10 })}
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <Gift className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">{t('statistics.freeLesson')}</span>
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
            <DialogTitle>{t('dialogs.extend.title')}</DialogTitle>
            <DialogDescription>
              {t('dialogs.extend.description', { name: selectedPackage?.name })}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {t('dialogs.extend.info', { count: selectedPackage?.remainingCredits })}
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransferDialog(false)}>
              {t('dialogs.extend.cancel')}
            </Button>
            <Button>
              {t('dialogs.extend.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Package Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('dialogs.history.title')}</DialogTitle>
            <DialogDescription>
              {t('dialogs.history.description', { name: selectedPackage?.name })}
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
                    <Badge variant="outline">1 {t('dialogs.history.credit')}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              {t('dialogs.history.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}