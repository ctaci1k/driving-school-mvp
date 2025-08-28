// app/[locale]/admin/packages/[id]/page.tsx
// Сторінка редагування пакету - форма для модифікації існуючого навчального пакету

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  ArrowLeft,
  Save,
  X,
  Package,
  DollarSign,
  Clock,
  Car,
  Users,
  Calendar,
  FileText,
  AlertCircle,
  Plus,
  Trash2,
  Check,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';

// Типи
type PackageStatus = 'active' | 'inactive' | 'draft';
type PackageCategory = 'A' | 'A1' | 'A2' | 'B' | 'B1' | 'C' | 'C1' | 'D' | 'T';
type PaymentOption = 'full' | 'installments' | 'both';

interface PackageFeature {
  id: string;
  name: string;
  included: boolean;
  value?: string;
}

interface PriceModifier {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  condition: string;
}

interface PackageData {
  id: string;
  name: string;
  description: string;
  category: PackageCategory;
  status: PackageStatus;
  price: number;
  discountedPrice?: number;
  duration: number;
  durationUnit: 'days' | 'weeks' | 'months';
  theoryHours: number;
  practicalHours: number;
  additionalHours: number;
  examAttempts: number;
  features: PackageFeature[];
  paymentOptions: PaymentOption;
  installmentMonths?: number;
  maxStudents: number;
  currentStudents: number;
  validFrom: string;
  validTo?: string;
  locations: string[];
  instructors: string[];
  vehicles: string[];
  priceModifiers: PriceModifier[];
  termsAndConditions: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockPackageData: PackageData = {
  id: 'pkg-1',
  name: 'Пакет Стандарт B',
  description: 'Повний курс навчання водінню категорії B з гарантією складання іспиту',
  category: 'B',
  status: 'active',
  price: 3500,
  discountedPrice: 2999,
  duration: 3,
  durationUnit: 'months',
  theoryHours: 30,
  practicalHours: 30,
  additionalHours: 5,
  examAttempts: 2,
  features: [
    { id: '1', name: 'Навчальні матеріали', included: true },
    { id: '2', name: 'Доступ до платформи e-learning', included: true },
    { id: '3', name: 'Внутрішній іспит', included: true },
    { id: '4', name: 'Перша перездача безкоштовно', included: true },
    { id: '5', name: 'Водіння в міському русі', included: true },
    { id: '6', name: 'Нічне водіння', included: false, value: '2' },
    { id: '7', name: 'Водіння на автостраді', included: false, value: '1' }
  ],
  paymentOptions: 'both',
  installmentMonths: 3,
  maxStudents: 50,
  currentStudents: 32,
  validFrom: '2024-01-01',
  validTo: '2024-12-31',
  locations: ['loc-1', 'loc-2'],
  instructors: ['ins-1', 'ins-2', 'ins-3'],
  vehicles: ['veh-1', 'veh-2'],
  priceModifiers: [
    { id: '1', name: 'Студентська знижка', type: 'percentage', value: 10, condition: 'Дійсний студентський квиток' },
    { id: '2', name: 'Весняна акція', type: 'fixed', value: 200, condition: 'Запис до 31.03' }
  ],
  termsAndConditions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  createdAt: '2024-01-01',
  updatedAt: '2024-12-15'
};

const locationOptions = [
  { id: 'loc-1', name: 'Варшава Центр' },
  { id: 'loc-2', name: 'Варшава Мокотув' },
  { id: 'loc-3', name: 'Варшава Прага' }
];

const instructorOptions = [
  { id: 'ins-1', name: 'Ян Ковальський' },
  { id: 'ins-2', name: 'Анна Новак' },
  { id: 'ins-3', name: 'Петро Вишнєвський' },
  { id: 'ins-4', name: 'Марія Зєлінська' }
];

const vehicleOptions = [
  { id: 'veh-1', name: 'Toyota Corolla (WA 12345)' },
  { id: 'veh-2', name: 'Volkswagen Golf (WA 67890)' },
  { id: 'veh-3', name: 'Ford Focus (WA 11111)' }
];

export default function PackageEditPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('admin.packages.edit');
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<PackageData>(mockPackageData);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Обробка змін в формі
  const handleInputChange = (field: keyof PackageData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Обробка функцій features
  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map(f =>
        f.id === featureId ? { ...f, included: !f.included } : f
      )
    }));
    setHasChanges(true);
  };

  const addFeature = () => {
    const newFeature: PackageFeature = {
      id: Date.now().toString(),
      name: '',
      included: false
    };
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, newFeature]
    }));
    setHasChanges(true);
  };

  const removeFeature = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f.id !== featureId)
    }));
    setHasChanges(true);
  };

  // Обробка модифікаторів цін
  const addPriceModifier = () => {
    const newModifier: PriceModifier = {
      id: Date.now().toString(),
      name: '',
      type: 'percentage',
      value: 0,
      condition: ''
    };
    setFormData(prev => ({
      ...prev,
      priceModifiers: [...prev.priceModifiers, newModifier]
    }));
    setHasChanges(true);
  };

  const removePriceModifier = (modifierId: string) => {
    setFormData(prev => ({
      ...prev,
      priceModifiers: prev.priceModifiers.filter(m => m.id !== modifierId)
    }));
    setHasChanges(true);
  };

  // Збереження
  const handleSave = async () => {
    setSaving(true);
    // Симуляція збереження
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    setHasChanges(false);
    toast({
      title: t('toast.saveSuccess'),
      description: t('toast.saveSuccessDescription'),
    });
  };

  const handleDuplicate = () => {
    console.log('Duplicate package:', params.id);
    router.push('/admin/packages/new?duplicate=' + params.id);
  };

  const handleDelete = () => {
    console.log('Delete package:', params.id);
    router.push('/admin/packages');
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Навігація та заголовок */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/packages')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t('breadcrumb.back')}
          </Button>
          <span>/</span>
          <span>{t('breadcrumb.packages')}</span>
          <span>/</span>
          <span className="text-gray-800 font-medium">{t('breadcrumb.edit')}</span>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
              <p className="text-gray-600">{formData.name}</p>
            </div>
            <Badge className={
              formData.status === 'active' 
                ? 'bg-green-100 text-green-700 border-green-200'
                : formData.status === 'draft'
                ? 'bg-gray-100 text-gray-700 border-gray-200'
                : 'bg-red-100 text-red-700 border-red-200'
            }>
              {t(`status.${formData.status}`)}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPreview ? t('buttons.hidePreview') : t('buttons.preview')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDuplicateDialogOpen(true)}
            >
              <Copy className="w-4 h-4 mr-2" />
              {t('buttons.duplicate')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t('buttons.delete')}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges || saving}
            >
              {saving ? (
                <>{t('buttons.saving')}</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('buttons.save')}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Попередження про незбережені зміни */}
      {hasChanges && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {t('alerts.unsavedChanges')}
          </AlertDescription>
        </Alert>
      )}

      {/* Таби з формою */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-gray-100">
          <TabsTrigger value="general">{t('tabs.general')}</TabsTrigger>
          <TabsTrigger value="pricing">{t('tabs.pricing')}</TabsTrigger>
          <TabsTrigger value="content">{t('tabs.content')}</TabsTrigger>
          <TabsTrigger value="availability">{t('tabs.availability')}</TabsTrigger>
          <TabsTrigger value="terms">{t('tabs.terms')}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>{t('general.title')}</CardTitle>
              <CardDescription>{t('general.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t('general.fields.name')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={t('general.fields.namePlaceholder')}
                  />
                </div>
                <div>
                  <Label htmlFor="category">{t('general.fields.category')}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('general.fields.categoryPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">{t('general.categories.A')}</SelectItem>
                      <SelectItem value="A1">{t('general.categories.A1')}</SelectItem>
                      <SelectItem value="A2">{t('general.categories.A2')}</SelectItem>
                      <SelectItem value="B">{t('general.categories.B')}</SelectItem>
                      <SelectItem value="B1">{t('general.categories.B1')}</SelectItem>
                      <SelectItem value="C">{t('general.categories.C')}</SelectItem>
                      <SelectItem value="C1">{t('general.categories.C1')}</SelectItem>
                      <SelectItem value="D">{t('general.categories.D')}</SelectItem>
                      <SelectItem value="T">{t('general.categories.T')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">{t('general.fields.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={t('general.fields.descriptionPlaceholder')}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration">{t('general.fields.duration')}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                      className="w-24"
                    />
                    <Select
                      value={formData.durationUnit}
                      onValueChange={(value) => handleInputChange('durationUnit', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">{t('general.durationUnits.days')}</SelectItem>
                        <SelectItem value="weeks">{t('general.durationUnits.weeks')}</SelectItem>
                        <SelectItem value="months">{t('general.durationUnits.months')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">{t('general.fields.status')}</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('status.active')}</SelectItem>
                      <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                      <SelectItem value="draft">{t('status.draft')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maxStudents">{t('general.fields.maxStudents')}</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    value={formData.maxStudents}
                    onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {t('general.fields.currentStudentsInfo', {
                      current: formData.currentStudents,
                      max: formData.maxStudents
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>{t('pricing.title')}</CardTitle>
              <CardDescription>{t('pricing.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">{t('pricing.fields.basePrice')}</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    placeholder={t('pricing.fields.pricePlaceholder')}
                  />
                </div>
                <div>
                  <Label htmlFor="discountedPrice">{t('pricing.fields.discountedPrice')}</Label>
                  <Input
                    id="discountedPrice"
                    type="number"
                    value={formData.discountedPrice || ''}
                    onChange={(e) => handleInputChange('discountedPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder={t('pricing.fields.pricePlaceholder')}
                  />
                  {formData.discountedPrice && (
                    <p className="text-sm text-green-600 mt-1">
                      {t('pricing.fields.savings', {
                        amount: formData.price - formData.discountedPrice,
                        percent: Math.round(((formData.price - formData.discountedPrice) / formData.price) * 100)
                      })}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>{t('pricing.fields.paymentOptions')}</Label>
                <RadioGroup
                  value={formData.paymentOptions}
                  onValueChange={(value) => handleInputChange('paymentOptions', value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full" className="font-normal">{t('pricing.paymentTypes.full')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="installments" id="installments" />
                    <Label htmlFor="installments" className="font-normal">{t('pricing.paymentTypes.installments')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both" className="font-normal">{t('pricing.paymentTypes.both')}</Label>
                  </div>
                </RadioGroup>
              </div>

              {(formData.paymentOptions === 'installments' || formData.paymentOptions === 'both') && (
                <div>
                  <Label htmlFor="installmentMonths">{t('pricing.fields.installments')}</Label>
                  <Select
                    value={formData.installmentMonths?.toString()}
                    onValueChange={(value) => handleInputChange('installmentMonths', parseInt(value))}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder={t('pricing.fields.installmentsPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">{t('pricing.installmentOptions.2')}</SelectItem>
                      <SelectItem value="3">{t('pricing.installmentOptions.3')}</SelectItem>
                      <SelectItem value="4">{t('pricing.installmentOptions.4')}</SelectItem>
                      <SelectItem value="6">{t('pricing.installmentOptions.6')}</SelectItem>
                      <SelectItem value="12">{t('pricing.installmentOptions.12')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.installmentMonths && (
                    <p className="text-sm text-gray-500 mt-1">
                      {t('pricing.fields.monthlyPayment', {
                        amount: Math.round((formData.discountedPrice || formData.price) / formData.installmentMonths)
                      })}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>{t('pricing.modifiers.title')}</CardTitle>
              <CardDescription>{t('pricing.modifiers.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('pricing.modifiers.table.name')}</TableHead>
                    <TableHead>{t('pricing.modifiers.table.type')}</TableHead>
                    <TableHead>{t('pricing.modifiers.table.value')}</TableHead>
                    <TableHead>{t('pricing.modifiers.table.condition')}</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.priceModifiers.map((modifier) => (
                    <TableRow key={modifier.id}>
                      <TableCell>
                        <Input
                          value={modifier.name}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              priceModifiers: prev.priceModifiers.map(m =>
                                m.id === modifier.id ? { ...m, name: e.target.value } : m
                              )
                            }));
                            setHasChanges(true);
                          }}
                          placeholder={t('pricing.modifiers.table.namePlaceholder')}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={modifier.type}
                          onValueChange={(value: 'percentage' | 'fixed') => {
                            setFormData(prev => ({
                              ...prev,
                              priceModifiers: prev.priceModifiers.map(m =>
                                m.id === modifier.id ? { ...m, type: value } : m
                              )
                            }));
                            setHasChanges(true);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">{t('pricing.modifiers.types.percentage')}</SelectItem>
                            <SelectItem value="fixed">{t('pricing.modifiers.types.fixed')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={modifier.value}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              priceModifiers: prev.priceModifiers.map(m =>
                                m.id === modifier.id ? { ...m, value: parseFloat(e.target.value) } : m
                              )
                            }));
                            setHasChanges(true);
                          }}
                          placeholder="0"
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={modifier.condition}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              priceModifiers: prev.priceModifiers.map(m =>
                                m.id === modifier.id ? { ...m, condition: e.target.value } : m
                              )
                            }));
                            setHasChanges(true);
                          }}
                          placeholder={t('pricing.modifiers.table.conditionPlaceholder')}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePriceModifier(modifier.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button
                variant="outline"
                size="sm"
                onClick={addPriceModifier}
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('buttons.addModifier')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>{t('content.lessons.title')}</CardTitle>
              <CardDescription>{t('content.lessons.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="theoryHours">{t('content.lessons.theoryHours')}</Label>
                  <Input
                    id="theoryHours"
                    type="number"
                    value={formData.theoryHours}
                    onChange={(e) => handleInputChange('theoryHours', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="practicalHours">{t('content.lessons.practicalHours')}</Label>
                  <Input
                    id="practicalHours"
                    type="number"
                    value={formData.practicalHours}
                    onChange={(e) => handleInputChange('practicalHours', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="additionalHours">{t('content.lessons.additionalHours')}</Label>
                  <Input
                    id="additionalHours"
                    type="number"
                    value={formData.additionalHours}
                    onChange={(e) => handleInputChange('additionalHours', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="examAttempts">{t('content.lessons.examAttempts')}</Label>
                <Input
                  id="examAttempts"
                  type="number"
                  value={formData.examAttempts}
                  onChange={(e) => handleInputChange('examAttempts', parseInt(e.target.value))}
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>{t('content.features.title')}</CardTitle>
              <CardDescription>{t('content.features.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.features.map((feature) => (
                  <div key={feature.id} className="flex items-center gap-3">
                    <Checkbox
                      checked={feature.included}
                      onCheckedChange={() => handleFeatureToggle(feature.id)}
                    />
                    <Input
                      value={feature.name}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          features: prev.features.map(f =>
                            f.id === feature.id ? { ...f, name: e.target.value } : f
                          )
                        }));
                        setHasChanges(true);
                      }}
                      placeholder={t('content.features.namePlaceholder')}
                      className="flex-1"
                    />
                    {feature.value !== undefined && (
                      <Input
                        value={feature.value}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            features: prev.features.map(f =>
                              f.id === feature.id ? { ...f, value: e.target.value } : f
                            )
                          }));
                          setHasChanges(true);
                        }}
                        placeholder={t('content.features.valuePlaceholder')}
                        className="w-24"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(feature.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addFeature}
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('buttons.addFeature')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>{t('availability.validity.title')}</CardTitle>
              <CardDescription>{t('availability.validity.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validFrom">{t('availability.validity.startDate')}</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => handleInputChange('validFrom', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="validTo">{t('availability.validity.endDate')}</Label>
                  <Input
                    id="validTo"
                    type="date"
                    value={formData.validTo || ''}
                    onChange={(e) => handleInputChange('validTo', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>{t('availability.locations.title')}</CardTitle>
              <CardDescription>{t('availability.locations.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {locationOptions.map((location) => (
                  <div key={location.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={location.id}
                      checked={formData.locations.includes(location.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleInputChange('locations', [...formData.locations, location.id]);
                        } else {
                          handleInputChange('locations', formData.locations.filter(l => l !== location.id));
                        }
                      }}
                    />
                    <Label htmlFor={location.id} className="font-normal cursor-pointer">
                      {location.name}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>{t('availability.instructors.title')}</CardTitle>
              <CardDescription>{t('availability.instructors.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {instructorOptions.map((instructor) => (
                  <div key={instructor.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={instructor.id}
                      checked={formData.instructors.includes(instructor.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleInputChange('instructors', [...formData.instructors, instructor.id]);
                        } else {
                          handleInputChange('instructors', formData.instructors.filter(i => i !== instructor.id));
                        }
                      }}
                    />
                    <Label htmlFor={instructor.id} className="font-normal cursor-pointer">
                      {instructor.name}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>{t('availability.vehicles.title')}</CardTitle>
              <CardDescription>{t('availability.vehicles.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {vehicleOptions.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={vehicle.id}
                      checked={formData.vehicles.includes(vehicle.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleInputChange('vehicles', [...formData.vehicles, vehicle.id]);
                        } else {
                          handleInputChange('vehicles', formData.vehicles.filter(v => v !== vehicle.id));
                        }
                      }}
                    />
                    <Label htmlFor={vehicle.id} className="font-normal cursor-pointer">
                      {vehicle.name}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms" className="space-y-6">
          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>{t('terms.title')}</CardTitle>
              <CardDescription>{t('terms.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.termsAndConditions}
                onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
                placeholder={t('terms.placeholder')}
                rows={15}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Діалог дублювання */}
      <Dialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dialogs.duplicate.title')}</DialogTitle>
            <DialogDescription>
              {t('dialogs.duplicate.description', { name: formData.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDuplicateDialogOpen(false)}>
              {t('buttons.cancel')}
            </Button>
            <Button onClick={handleDuplicate}>
              <Copy className="w-4 h-4 mr-2" />
              {t('dialogs.duplicate.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Діалог видалення */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dialogs.delete.title')}</DialogTitle>
            <DialogDescription>
              {t('dialogs.delete.description', { name: formData.name })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t('buttons.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              {t('dialogs.delete.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}