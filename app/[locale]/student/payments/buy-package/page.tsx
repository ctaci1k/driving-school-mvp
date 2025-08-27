// app/[locale]/student/payments/buy-package/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Check,
  X,
  Star,
  Zap,
  Trophy,
  Gift,
  TrendingUp,
  Clock,
  Users,
  Shield,
  CreditCard,
  Wallet,
  Building,
  Info,
  ChevronRight,
  Sparkles,
  Percent,
  Calendar,
  Award,
  Heart,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';

// Mock packages data
const packages = [
  {
    id: 'starter',
    name: 'Pakiet Startowy',
    credits: 5,
    price: 850,
    originalPrice: 900,
    discount: 5,
    validityDays: 60,
    popular: false,
    recommended: false,
    features: [
      { text: '5 lekcji jazdy', included: true },
      { text: 'Ważność 60 dni', included: true },
      { text: 'Elastyczne terminy', included: true },
      { text: 'Darmowe materiały', included: false },
      { text: 'Priorytetowa rezerwacja', included: false },
      { text: 'Lekcje weekendowe', included: false }
    ],
    color: 'gray'
  },
  {
    id: 'standard',
    name: 'Pakiet Standard',
    credits: 10,
    price: 1700,
    originalPrice: 1800,
    discount: 10,
    validityDays: 90,
    popular: true,
    recommended: true,
    features: [
      { text: '10 lekcji jazdy', included: true },
      { text: 'Ważność 90 dni', included: true },
      { text: 'Elastyczne terminy', included: true },
      { text: 'Darmowe materiały', included: true },
      { text: 'Priorytetowa rezerwacja', included: true },
      { text: 'Lekcje weekendowe', included: false }
    ],
    color: 'blue'
  },
  {
    id: 'premium',
    name: 'Pakiet Premium',
    credits: 20,
    price: 3200,
    originalPrice: 3600,
    discount: 15,
    validityDays: 120,
    popular: false,
    recommended: false,
    features: [
      { text: '20 lekcji jazdy', included: true },
      { text: 'Ważność 120 dni', included: true },
      { text: 'Elastyczne terminy', included: true },
      { text: 'Darmowe materiały', included: true },
      { text: 'Priorytetowa rezerwacja', included: true },
      { text: 'Lekcje weekendowe', included: true },
      { text: 'Wybór instruktora', included: true },
      { text: 'Darmowy egzamin próbny', included: true }
    ],
    color: 'purple'
  },
  {
    id: 'intensive',
    name: 'Pakiet Intensywny',
    credits: 30,
    price: 4500,
    originalPrice: 5400,
    discount: 20,
    validityDays: 90,
    popular: false,
    recommended: false,
    features: [
      { text: '30 lekcji jazdy', included: true },
      { text: 'Ważność 90 dni', included: true },
      { text: 'Codzienne lekcje możliwe', included: true },
      { text: 'Darmowe materiały', included: true },
      { text: 'Priorytetowa rezerwacja', included: true },
      { text: 'Lekcje weekendowe', included: true },
      { text: 'Dedykowany instruktor', included: true },
      { text: '2 egzaminy próbne', included: true },
      { text: 'Gwarancja zdania', included: true }
    ],
    color: 'green'
  }
];

const additionalOptions = [
  { id: 'weekend', name: 'Lekcje weekendowe', price: 200, description: 'Możliwość jazdy w weekendy' },
  { id: 'night', name: 'Jazdy nocne', price: 150, description: 'Dodatkowe 2 lekcje nocne' },
  { id: 'highway', name: 'Jazda autostradą', price: 180, description: 'Dodatkowa lekcja na autostradzie' },
  { id: 'exam', name: 'Egzamin próbny', price: 120, description: 'Symulacja egzaminu państwowego' }
];

export default function BuyPackagePage() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoRenew, setAutoRenew] = useState(false);
  const [giftMode, setGiftMode] = useState(false);

  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const addon = additionalOptions.find(a => a.id === addonId);
    return sum + (addon?.price || 0);
  }, 0);
  const totalPrice = (selectedPkg?.price || 0) + addonsTotal;
  const savings = (selectedPkg?.originalPrice || 0) - (selectedPkg?.price || 0) + (selectedPkg?.discount || 0);

  const handlePurchase = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    setShowPaymentDialog(false);
    router.push('/student/payments?purchased=true');
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      gray: 'border-gray-200 bg-gray-50',
      blue: 'border-blue-500 bg-blue-50 shadow-lg',
      purple: 'border-purple-500 bg-purple-50',
      green: 'border-green-500 bg-green-50'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wybierz pakiet lekcji</h1>
        <p className="text-gray-600">Oszczędź do 20% kupując pakiet zamiast pojedynczych lekcji</p>
      </div>

      {/* Special Offer Banner */}
      <Alert className="border-green-200 bg-green-50">
        <Sparkles className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Oferta limitowana!</strong> Kup dowolny pakiet do końca miesiąca i otrzymaj dodatkową lekcję GRATIS!
        </AlertDescription>
      </Alert>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative cursor-pointer transition-all ${
              selectedPackage === pkg.id ? getColorClasses(pkg.color) : 'hover:shadow-lg'
            } ${selectedPackage === pkg.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            {pkg.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white">
                <Star className="h-3 w-3 mr-1" />
                Najpopularniejszy
              </Badge>
            )}
            {pkg.recommended && (
              <Badge className="absolute -top-3 right-4 bg-green-500 text-white">
                <Trophy className="h-3 w-3 mr-1" />
                Polecany
              </Badge>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">{pkg.name}</CardTitle>
              <div className="mt-4">
                <div className="text-3xl font-bold text-gray-900">
                  {pkg.credits}
                  <span className="text-lg font-normal text-gray-600"> lekcji</span>
                </div>
                <Badge variant="secondary" className="mt-2">
                  Ważny {pkg.validityDays} dni
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Price */}
              <div className="text-center">
                {pkg.discount > 0 && (
                  <div className="text-sm text-gray-500 line-through">{pkg.originalPrice} PLN</div>
                )}
                <div className="text-2xl font-bold">
                  {pkg.price} PLN
                </div>
                {pkg.discount > 0 && (
                  <Badge className="bg-red-100 text-red-700 mt-1">
                    <Percent className="h-3 w-3 mr-1" />
                    Oszczędzasz {pkg.discount}%
                  </Badge>
                )}
                <div className="text-sm text-gray-600 mt-2">
                  {(pkg.price / pkg.credits).toFixed(0)} PLN za lekcję
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                {pkg.features.slice(0, 5).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-gray-300" />
                    )}
                    <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                      {feature.text}
                    </span>
                  </div>
                ))}
                {pkg.features.length > 5 && (
                  <button className="text-xs text-blue-600 hover:underline">
                    Zobacz więcej ({pkg.features.length - 5})
                  </button>
                )}
              </div>

              {/* Selection Indicator */}
              <div className="pt-2">
                <RadioGroup value={selectedPackage}>
                  <div className="flex items-center justify-center">
                    <RadioGroupItem value={pkg.id} id={pkg.id} />
                    <Label htmlFor={pkg.id} className="ml-2 text-sm">
                      {selectedPackage === pkg.id ? 'Wybrany' : 'Wybierz'}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Options */}
      <Card>
        <CardHeader>
          <CardTitle>Opcje dodatkowe</CardTitle>
          <CardDescription>Personalizuj swój pakiet dodatkowymi usługami</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalOptions.map((option) => (
              <div
                key={option.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedAddons.includes(option.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleAddon(option.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedAddons.includes(option.id)}
                        onChange={() => {}}
                        className="rounded border-gray-300"
                      />
                      <Label className="font-medium cursor-pointer">{option.name}</Label>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 ml-6">{option.description}</p>
                  </div>
                  <Badge variant="outline">+{option.price} PLN</Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Auto-renewal and Gift Options */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="auto-renew"
                  checked={autoRenew}
                  onCheckedChange={setAutoRenew}
                />
                <Label htmlFor="auto-renew" className="cursor-pointer">
                  <div>Automatyczne odnowienie</div>
                  <div className="text-xs text-gray-500">Otrzymaj 5% zniżki na kolejny pakiet</div>
                </Label>
              </div>
              {autoRenew && <Badge className="bg-green-100 text-green-700">-5%</Badge>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="gift-mode"
                  checked={giftMode}
                  onCheckedChange={setGiftMode}
                />
                <Label htmlFor="gift-mode" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-purple-500" />
                    Kupuję jako prezent
                  </div>
                  <div className="text-xs text-gray-500">Wyślij pakiet jako prezent dla kogoś</div>
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary and Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Metoda płatności</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="cursor-pointer flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Karta kredytowa/debetowa</p>
                        <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                      </div>
                    </Label>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="blik" id="blik" />
                    <Label htmlFor="blik" className="cursor-pointer flex items-center gap-3">
                      <Wallet className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">BLIK</p>
                        <p className="text-sm text-gray-500">Szybka płatność kodem BLIK</p>
                      </div>
                    </Label>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Popularne</Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer" className="cursor-pointer flex items-center gap-3">
                      <Building className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Przelew bankowy</p>
                        <p className="text-sm text-gray-500">Przelewy24</p>
                      </div>
                    </Label>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="installments" id="installments" />
                    <Label htmlFor="installments" className="cursor-pointer flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium">Raty 0%</p>
                        <p className="text-sm text-gray-500">Rozłóż płatność na 3 miesiące</p>
                      </div>
                    </Label>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700">0% prowizji</Badge>
                </div>
              </div>
            </RadioGroup>

            {/* Security Info */}
            <Alert className="mt-4">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Wszystkie płatności są bezpieczne i szyfrowane. Twoje dane są chronione zgodnie z najwyższymi standardami bezpieczeństwa.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Podsumowanie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{selectedPkg?.name}</span>
                <span>{selectedPkg?.price} PLN</span>
              </div>
              {selectedAddons.map(addonId => {
                const addon = additionalOptions.find(a => a.id === addonId);
                return addon ? (
                  <div key={addonId} className="flex justify-between text-sm">
                    <span className="text-gray-600">{addon.name}</span>
                    <span>{addon.price} PLN</span>
                  </div>
                ) : null;
              })}
              {autoRenew && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Zniżka za auto-odnowienie</span>
                  <span>-{(totalPrice * 0.05).toFixed(0)} PLN</span>
                </div>
              )}
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold text-lg">
                <span>Razem</span>
                <span>{autoRenew ? (totalPrice * 0.95).toFixed(0) : totalPrice} PLN</span>
              </div>
              {savings > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  Oszczędzasz {savings} PLN vs pojedyncze lekcje
                </p>
              )}
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => setShowPaymentDialog(true)}
            >
              Przejdź do płatności
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>

            {/* Trust Badges */}
            <div className="pt-3 space-y-2 text-center">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span>Bezpieczna płatność</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Natychmiastowa aktywacja</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                <Users className="h-3 w-3" />
                <span>Dołącz do 5000+ zadowolonych kursantów</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Why Choose Packages */}
      <Card>
        <CardHeader>
          <CardTitle>Dlaczego warto kupić pakiet?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <p className="font-medium">Oszczędność do 20%</p>
              <p className="text-sm text-gray-600">vs pojedyncze lekcje</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <p className="font-medium">Elastyczne terminy</p>
              <p className="text-sm text-gray-600">Rezerwuj kiedy chcesz</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <p className="font-medium">Priorytet rezerwacji</p>
              <p className="text-sm text-gray-600">Pierwsze wybór terminów</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="h-6 w-6 text-orange-600" />
              </div>
              <p className="font-medium">Gwarancja satysfakcji</p>
              <p className="text-sm text-gray-600">Lub zwrot pieniędzy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Processing Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizacja płatności</DialogTitle>
            <DialogDescription>
              Przekierujemy Cię do bezpiecznej bramki płatności
            </DialogDescription>
          </DialogHeader>
          
          {isProcessing ? (
            <div className="py-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Przetwarzanie płatności...</p>
              <p className="text-sm text-gray-500 mt-2">Nie zamykaj tego okna</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Kwota do zapłaty: <strong>{autoRenew ? (totalPrice * 0.95).toFixed(0) : totalPrice} PLN</strong>
                </AlertDescription>
              </Alert>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Wybrany pakiet:</p>
                <p className="font-semibold">{selectedPkg?.name}</p>
                <p className="text-sm text-gray-500">{selectedPkg?.credits} lekcji • Ważny {selectedPkg?.validityDays} dni</p>
              </div>

              {giftMode && (
                <div className="space-y-3">
                  <Label>Dane odbiorcy prezentu</Label>
                  <input
                    type="email"
                    placeholder="Email odbiorcy"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <textarea
                    placeholder="Wiadomość (opcjonalnie)"
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
              disabled={isProcessing}
            >
              Anuluj
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={isProcessing}
            >
              {isProcessing ? 'Przetwarzanie...' : 'Zapłać teraz'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}