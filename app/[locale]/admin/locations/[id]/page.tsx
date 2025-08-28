// app/[locale]/admin/locations/[id]/page.tsx
// Сторінка деталей локації - відображає повну інформацію про вибрану локацію

'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Users, 
  Car, 
  Calendar,
  Clock,
  Phone,
  Mail,
  Globe,
  Building,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Settings,
  MoreVertical,
  Star,
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Типи
type LocationStatus = 'active' | 'inactive' | 'maintenance';

export default function LocationDetailsPage() {
  const t = useTranslations('admin.locations.details');
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data для локації
  const mockLocation = {
    id: 'loc-1',
    name: 'Варшава Центр',
    type: 'main',
    status: 'active' as LocationStatus,
    address: {
      street: 'вул. Маршалківська 123',
      city: 'Варшава',
      postalCode: '00-001',
      country: 'Польща'
    },
    coordinates: {
      lat: 52.2297,
      lng: 21.0122
    },
    contact: {
      phone: '+48 22 123 45 67',
      email: 'warszawa@szkola.pl',
      website: 'www.szkola.pl/warszawa'
    },
    manager: {
      id: 'mgr-1',
      name: 'Ян Ковальський',
      avatar: 'https://ui-avatars.com/api/?name=Jan+Kowalski',
      email: 'jan.kowalski@szkola.pl',
      phone: '+48 600 123 456'
    },
    stats: {
      totalStudents: 145,
      activeStudents: 87,
      instructors: 12,
      vehicles: 8,
      monthlyLessons: 420,
      revenue: 125450,
      rating: 4.6,
      reviews: 234
    },
    workingHours: [
      { day: 'monday', open: '08:00', close: '20:00' },
      { day: 'tuesday', open: '08:00', close: '20:00' },
      { day: 'wednesday', open: '08:00', close: '20:00' },
      { day: 'thursday', open: '08:00', close: '20:00' },
      { day: 'friday', open: '08:00', close: '20:00' },
      { day: 'saturday', open: '09:00', close: '16:00' },
      { day: 'sunday', open: 'closed', close: '-' }
    ],
    facilities: [
      'parking',
      'classroom',
      'simulator',
      'wifi',
      'cafe',
      'airConditioning'
    ],
    createdAt: '2023-01-15',
    updatedAt: '2024-12-20'
  };

  // Mock data для графіків
  const revenueData = [
    { month: t('charts.months.jan'), revenue: 95000, students: 65 },
    { month: t('charts.months.feb'), revenue: 102000, students: 72 },
    { month: t('charts.months.mar'), revenue: 98000, students: 68 },
    { month: t('charts.months.apr'), revenue: 115000, students: 85 },
    { month: t('charts.months.may'), revenue: 122000, students: 92 },
    { month: t('charts.months.jun'), revenue: 125450, students: 87 }
  ];

  const categoryData = [
    { name: t('charts.categoryB'), value: 65, color: '#3b82f6' },
    { name: t('charts.categoryA'), value: 20, color: '#10b981' },
    { name: t('charts.categoryC'), value: 10, color: '#f59e0b' },
    { name: t('charts.other'), value: 5, color: '#6b7280' }
  ];

  const instructorsList = [
    { id: '1', name: 'Адам Новак', students: 15, rating: 4.8, status: 'active' },
    { id: '2', name: 'Єва Вишневська', students: 12, rating: 4.9, status: 'active' },
    { id: '3', name: 'Петро Зелінський', students: 8, rating: 4.5, status: 'busy' },
    { id: '4', name: 'Анна Мазур', students: 10, rating: 4.7, status: 'active' }
  ];

  const vehiclesList = [
    { id: '1', brand: 'Toyota Corolla', registration: 'WA 12345', status: 'active', category: 'B' },
    { id: '2', brand: 'Volkswagen Golf', registration: 'WA 67890', status: 'maintenance', category: 'B' },
    { id: '3', brand: 'Yamaha MT-07', registration: 'WA 11111', status: 'active', category: 'A' },
    { id: '4', brand: 'Ford Focus', registration: 'WA 22222', status: 'active', category: 'B' }
  ];

  const handleEdit = () => {
    console.log('Edit location:', params.id);
    router.push(`/admin/locations/${params.id}/edit`);
  };

  const handleDelete = () => {
    console.log('Delete location:', params.id);
    setDeleteDialogOpen(false);
    router.push('/admin/locations');
  };

  const statusColors: Record<LocationStatus, string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-gray-100 text-gray-700 border-gray-200',
    maintenance: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Заголовок з breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/locations')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('breadcrumb.back')}
          </Button>
          <span>/</span>
          <span>{t('breadcrumb.locations')}</span>
          <span>/</span>
          <span className="text-gray-800 font-medium">{mockLocation.name}</span>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{mockLocation.name}</h1>
              <p className="text-gray-600">{mockLocation.address.street}, {mockLocation.address.city}</p>
            </div>
            <Badge className={`${statusColors[mockLocation.status]} ml-4`}>
              {t(`status.${mockLocation.status}`)}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              {t('buttons.edit')}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => console.log('Duplicate')}>
                  {t('buttons.duplicate')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log('Export')}>
                  {t('buttons.export')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('buttons.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Картки статистик */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-white border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-green-600 font-medium">+12%</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{mockLocation.stats.activeStudents}</p>
            <p className="text-sm text-gray-600">{t('stats.activeStudents')}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Car className="w-5 h-5 text-green-600" />
              <Badge variant="outline" className="text-xs">{mockLocation.stats.vehicles}</Badge>
            </div>
            <p className="text-2xl font-bold text-gray-800">{mockLocation.stats.instructors}</p>
            <p className="text-sm text-gray-600">{t('stats.instructors')}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-green-600 font-medium">+8%</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{mockLocation.stats.monthlyLessons}</p>
            <p className="text-sm text-gray-600">{t('stats.monthlyLessons')}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{mockLocation.stats.revenue.toLocaleString('uk-UA')} грн</p>
            <p className="text-sm text-gray-600">{t('stats.monthlyRevenue')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs з вмістом */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-gray-100">
          <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
          <TabsTrigger value="instructors">{t('tabs.instructors')}</TabsTrigger>
          <TabsTrigger value="vehicles">{t('tabs.vehicles')}</TabsTrigger>
          <TabsTrigger value="schedule">{t('tabs.schedule')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('tabs.analytics')}</TabsTrigger>
          <TabsTrigger value="settings">{t('tabs.settings')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Контактна інформація */}
            <Card className="bg-white border-gray-100">
              <CardHeader>
                <CardTitle className="text-lg">{t('sections.contactInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">{t('sections.phone')}</p>
                    <p className="font-medium">{mockLocation.contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">{t('sections.email')}</p>
                    <p className="font-medium">{mockLocation.contact.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">{t('sections.website')}</p>
                    <p className="font-medium">{mockLocation.contact.website}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Navigation className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">{t('sections.coordinates')}</p>
                    <p className="font-medium">{mockLocation.coordinates.lat}, {mockLocation.coordinates.lng}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Менеджер */}
            <Card className="bg-white border-gray-100">
              <CardHeader>
                <CardTitle className="text-lg">{t('sections.locationManager')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={mockLocation.manager.avatar}
                    alt={mockLocation.manager.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{mockLocation.manager.name}</p>
                    <p className="text-sm text-gray-600">{mockLocation.manager.email}</p>
                    <p className="text-sm text-gray-600">{mockLocation.manager.phone}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  {t('buttons.changeManager')}
                </Button>
              </CardContent>
            </Card>

            {/* Години роботи */}
            <Card className="bg-white border-gray-100">
              <CardHeader>
                <CardTitle className="text-lg">{t('sections.workingHours')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockLocation.workingHours.map((day, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{t(`days.${day.day}`)}</span>
                      <span className="font-medium">
                        {day.open === 'closed' ? t('days.closed') : `${day.open} - ${day.close}`}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Зручності */}
          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle className="text-lg">{t('sections.facilities')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockLocation.facilities.map((facility, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {t(`facilities.${facility}`)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Графік доходів */}
          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle className="text-lg">{t('sections.revenueAndStudents')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name={t('sections.revenue')}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="students"
                    stroke="#10b981"
                    strokeWidth={2}
                    name={t('sections.students')}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructors" className="space-y-6">
          <Card className="bg-white border-gray-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('tabs.instructors')} ({instructorsList.length})</CardTitle>
                <Button size="sm">
                  {t('buttons.assignInstructor')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {instructorsList.map((instructor) => (
                  <div key={instructor.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src={`https://ui-avatars.com/api/?name=${instructor.name}`}
                        alt={instructor.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{instructor.name}</p>
                        <p className="text-sm text-gray-600">{t('studentCount', { count: instructor.students })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{instructor.rating}</span>
                      </div>
                      <Badge
                        variant={instructor.status === 'active' ? 'default' : 'secondary'}
                        className={instructor.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                      >
                        {t(`instructorStatus.${instructor.status}`)}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-6">
          <Card className="bg-white border-gray-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('tabs.vehicles')} ({vehiclesList.length})</CardTitle>
                <Button size="sm">
                  {t('buttons.assignVehicle')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehiclesList.map((vehicle) => (
                  <div key={vehicle.id} className="p-4 border border-gray-100 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-800">{vehicle.brand}</p>
                        <p className="text-sm text-gray-600">{vehicle.registration}</p>
                      </div>
                      <Badge
                        variant={vehicle.status === 'active' ? 'default' : 'secondary'}
                        className={
                          vehicle.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }
                      >
                        {t(`vehicleStatus.${vehicle.status}`)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{t('vehicleCategory')}: <span className="font-medium">{vehicle.category}</span></span>
                      <Button variant="ghost" size="sm">
                        {t('buttons.viewDetails')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Графік категорій */}
          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle className="text-lg">{t('sections.categoryDistribution')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              {t('alerts.scheduleAvailable')}
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border-gray-100">
              <CardHeader>
                <CardTitle className="text-lg">{t('sections.ratingsAndReviews')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl font-bold text-gray-800">{mockLocation.stats.rating}</div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.floor(mockLocation.stats.rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{t('sections.reviews', { count: mockLocation.stats.reviews })}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  {t('buttons.viewAllReviews')}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-100">
              <CardHeader>
                <CardTitle className="text-lg">{t('sections.performanceIndicators')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{t('sections.vehicleUtilization')}</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{t('sections.instructorLoad')}</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{t('sections.passRate')}</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>{t('sections.locationSettings')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    {t('alerts.settingsWarning')}
                  </AlertDescription>
                </Alert>
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{t('status.active')}</p>
                    <p className="text-sm text-gray-600">{t('alerts.statusDescription')}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('buttons.changeStatus')}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{t('sections.workingHours')}</p>
                    <p className="text-sm text-gray-600">{t('alerts.workingHoursDescription')}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('buttons.editHours')}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Сповіщення</p>
                    <p className="text-sm text-gray-600">{t('alerts.notificationsDescription')}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('buttons.configure')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog видалення */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('deleteDialog.description', { name: mockLocation.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t('buttons.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t('buttons.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}