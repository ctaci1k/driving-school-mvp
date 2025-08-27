// app/[locale]/admin/packages/[id]/page.tsx
// Strona edycji pakietu - formularz do modyfikacji istniejącego pakietu szkoleniowego

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

// Typy
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
  name: 'Pakiet Standard B',
  description: 'Kompletny kurs prawa jazdy kategorii B z gwarancją zdania egzaminu',
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
    { id: '1', name: 'Materiały szkoleniowe', included: true },
    { id: '2', name: 'Dostęp do platformy e-learning', included: true },
    { id: '3', name: 'Egzamin wewnętrzny', included: true },
    { id: '4', name: 'Pierwsza poprawka gratis', included: true },
    { id: '5', name: 'Jazdy w ruchu miejskim', included: true },
    { id: '6', name: 'Jazdy nocne', included: false, value: '2' },
    { id: '7', name: 'Jazdy autostradą', included: false, value: '1' }
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
    { id: '1', name: 'Zniżka studencka', type: 'percentage', value: 10, condition: 'Ważna legitymacja studencka' },
    { id: '2', name: 'Promocja wiosenna', type: 'fixed', value: 200, condition: 'Zapisy do 31.03' }
  ],
  termsAndConditions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  createdAt: '2024-01-01',
  updatedAt: '2024-12-15'
};

const locationOptions = [
  { id: 'loc-1', name: 'Warszawa Centrum' },
  { id: 'loc-2', name: 'Warszawa Mokotów' },
  { id: 'loc-3', name: 'Warszawa Praga' }
];

const instructorOptions = [
  { id: 'ins-1', name: 'Jan Kowalski' },
  { id: 'ins-2', name: 'Anna Nowak' },
  { id: 'ins-3', name: 'Piotr Wiśniewski' },
  { id: 'ins-4', name: 'Maria Zielińska' }
];

const vehicleOptions = [
  { id: 'veh-1', name: 'Toyota Corolla (WA 12345)' },
  { id: 'veh-2', name: 'Volkswagen Golf (WA 67890)' },
  { id: 'veh-3', name: 'Ford Focus (WA 11111)' }
];

export default function PackageEditPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<PackageData>(mockPackageData);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Obsługa zmian w formularzu
  const handleInputChange = (field: keyof PackageData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Obsługa funkcji features
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

  // Obsługa modyfikatorów cen
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

  // Zapisywanie
  const handleSave = async () => {
    setSaving(true);
    // Symulacja zapisu
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    setHasChanges(false);
    toast({
      title: 'Pakiet zaktualizowany',
      description: 'Zmiany zostały zapisane pomyślnie',
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
      {/* Nagłówek */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/packages')}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Powrót
          </Button>
          <span>/</span>
          <span>Pakiety</span>
          <span>/</span>
          <span className="text-gray-800 font-medium">Edycja</span>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Edytuj pakiet</h1>
              <p className="text-gray-600">{formData.name}</p>
            </div>
            <Badge className={
              formData.status === 'active' 
                ? 'bg-green-100 text-green-700 border-green-200'
                : formData.status === 'draft'
                ? 'bg-gray-100 text-gray-700 border-gray-200'
                : 'bg-red-100 text-red-700 border-red-200'
            }>
              {formData.status === 'active' ? 'Aktywny' : formData.status === 'draft' ? 'Szkic' : 'Nieaktywny'}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPreview ? 'Ukryj podgląd' : 'Podgląd'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDuplicateDialogOpen(true)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Duplikuj
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Usuń
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges || saving}
            >
              {saving ? (
                <>Zapisywanie...</>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Zapisz zmiany
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Alert o niezapisanych zmianach */}
      {hasChanges && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Masz niezapisane zmiany. Pamiętaj o zapisaniu przed opuszczeniem strony.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs z formularzem */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-gray-100">
          <TabsTrigger value="general">Informacje ogólne</TabsTrigger>
          <TabsTrigger value="pricing">Ceny i płatności</TabsTrigger>
          <TabsTrigger value="content">Zawartość pakietu</TabsTrigger>
          <TabsTrigger value="availability">Dostępność</TabsTrigger>
          <TabsTrigger value="terms">Regulamin</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>Podstawowe informacje</CardTitle>
              <CardDescription>Nazwa i opis pakietu widoczne dla kursantów</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nazwa pakietu *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="np. Pakiet Standard B"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Kategoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz kategorię" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Kategoria A - Motocykle</SelectItem>
                      <SelectItem value="A1">Kategoria A1</SelectItem>
                      <SelectItem value="A2">Kategoria A2</SelectItem>
                      <SelectItem value="B">Kategoria B - Samochody</SelectItem>
                      <SelectItem value="B1">Kategoria B1</SelectItem>
                      <SelectItem value="C">Kategoria C - Ciężarowe</SelectItem>
                      <SelectItem value="C1">Kategoria C1</SelectItem>
                      <SelectItem value="D">Kategoria D - Autobusy</SelectItem>
                      <SelectItem value="T">Kategoria T - Ciągniki</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Opis</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Szczegółowy opis pakietu..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration">Czas trwania *</Label>
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
                        <SelectItem value="days">Dni</SelectItem>
                        <SelectItem value="weeks">Tygodnie</SelectItem>
                        <SelectItem value="months">Miesiące</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktywny</SelectItem>
                      <SelectItem value="inactive">Nieaktywny</SelectItem>
                      <SelectItem value="draft">Szkic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maxStudents">Max. liczba kursantów</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    value={formData.maxStudents}
                    onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Obecnie: {formData.currentStudents}/{formData.maxStudents}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>Cennik</CardTitle>
              <CardDescription>Ustaw cenę i opcje płatności</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Cena podstawowa (zł) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="discountedPrice">Cena promocyjna (zł)</Label>
                  <Input
                    id="discountedPrice"
                    type="number"
                    value={formData.discountedPrice || ''}
                    onChange={(e) => handleInputChange('discountedPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="0.00"
                  />
                  {formData.discountedPrice && (
                    <p className="text-sm text-green-600 mt-1">
                      Oszczędność: {formData.price - formData.discountedPrice} zł ({Math.round(((formData.price - formData.discountedPrice) / formData.price) * 100)}%)
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Opcje płatności</Label>
                <RadioGroup
                  value={formData.paymentOptions}
                  onValueChange={(value) => handleInputChange('paymentOptions', value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full" className="font-normal">Tylko płatność jednorazowa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="installments" id="installments" />
                    <Label htmlFor="installments" className="font-normal">Tylko raty</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both" className="font-normal">Jednorazowa i raty</Label>
                  </div>
                </RadioGroup>
              </div>

              {(formData.paymentOptions === 'installments' || formData.paymentOptions === 'both') && (
                <div>
                  <Label htmlFor="installmentMonths">Liczba rat</Label>
                  <Select
                    value={formData.installmentMonths?.toString()}
                    onValueChange={(value) => handleInputChange('installmentMonths', parseInt(value))}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Wybierz liczbę rat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 raty</SelectItem>
                      <SelectItem value="3">3 raty</SelectItem>
                      <SelectItem value="4">4 raty</SelectItem>
                      <SelectItem value="6">6 rat</SelectItem>
                      <SelectItem value="12">12 rat</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.installmentMonths && (
                    <p className="text-sm text-gray-500 mt-1">
                      Miesięczna rata: {Math.round((formData.discountedPrice || formData.price) / formData.installmentMonths)} zł
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>Modyfikatory cen</CardTitle>
              <CardDescription>Dodatkowe zniżki i dopłaty</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nazwa</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Wartość</TableHead>
                    <TableHead>Warunek</TableHead>
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
                          placeholder="Nazwa zniżki/dopłaty"
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
                            <SelectItem value="percentage">Procent</SelectItem>
                            <SelectItem value="fixed">Kwota</SelectItem>
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
                          placeholder="Warunek zastosowania"
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
                Dodaj modyfikator
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>Zajęcia</CardTitle>
              <CardDescription>Liczba godzin teorii i praktyki</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="theoryHours">Godziny teorii *</Label>
                  <Input
                    id="theoryHours"
                    type="number"
                    value={formData.theoryHours}
                    onChange={(e) => handleInputChange('theoryHours', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="practicalHours">Godziny praktyki *</Label>
                  <Input
                    id="practicalHours"
                    type="number"
                    value={formData.practicalHours}
                    onChange={(e) => handleInputChange('practicalHours', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="additionalHours">Dodatkowe godziny</Label>
                  <Input
                    id="additionalHours"
                    type="number"
                    value={formData.additionalHours}
                    onChange={(e) => handleInputChange('additionalHours', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="examAttempts">Liczba podejść do egzaminu</Label>
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
              <CardTitle>Funkcje pakietu</CardTitle>
              <CardDescription>Co zawiera pakiet</CardDescription>
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
                      placeholder="Nazwa funkcji"
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
                        placeholder="Wartość"
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
                Dodaj funkcję
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>Okres ważności</CardTitle>
              <CardDescription>Kiedy pakiet jest dostępny do zakupu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validFrom">Data rozpoczęcia *</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => handleInputChange('validFrom', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="validTo">Data zakończenia</Label>
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
              <CardTitle>Lokalizacje</CardTitle>
              <CardDescription>Gdzie dostępny jest pakiet</CardDescription>
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
              <CardTitle>Instruktorzy</CardTitle>
              <CardDescription>Którzy instruktorzy mogą prowadzić zajęcia</CardDescription>
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
              <CardTitle>Pojazdy</CardTitle>
              <CardDescription>Dostępne pojazdy dla tego pakietu</CardDescription>
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
              <CardTitle>Regulamin i warunki</CardTitle>
              <CardDescription>Zasady korzystania z pakietu</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.termsAndConditions}
                onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
                placeholder="Wprowadź regulamin pakietu..."
                rows={15}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog duplikowania */}
      <Dialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplikuj pakiet</DialogTitle>
            <DialogDescription>
              Utworzysz kopię pakietu "{formData.name}". Nowy pakiet będzie miał status "Szkic".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDuplicateDialogOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleDuplicate}>
              <Copy className="w-4 h-4 mr-2" />
              Duplikuj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog usuwania */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usuń pakiet</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć pakiet "{formData.name}"? 
              Ta operacja jest nieodwracalna. Pakiet zostanie oznaczony jako usunięty, ale dane historyczne zostaną zachowane.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Anuluj
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Usuń pakiet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}