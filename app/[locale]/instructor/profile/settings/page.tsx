// /app/[locale]/instructor/profile/settings/page.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Shield, Bell, Eye, Lock, Smartphone, Globe,
  Moon, Sun, Volume2, Mail, MessageSquare,
  Calendar, Users, Car, DollarSign, FileText,
  AlertTriangle, CheckCircle, Info, ChevronLeft,
  LogOut, Trash2, Download, Key, Monitor
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [show2FADialog, setShow2FADialog] = useState(false)

  // Settings state
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    notifyNewBooking: true,
    notifyCancellation: true,
    notifyReminder: true,
    notifyPayment: true,
    notifyMessages: true,
    notifyReviews: true,
    
    // Privacy
    profileVisibility: 'public',
    showPhone: false,
    showEmail: false,
    showRating: true,
    showStatistics: true,
    allowOnlineBooking: true,
    requireApproval: false,
    
    // Display
    theme: 'light',
    language: 'pl',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    currency: 'PLN',
    
    // Working preferences
    autoAcceptBookings: false,
    bufferTime: '15',
    maxLessonsPerDay: '8',
    minAdvanceBooking: '24',
    maxAdvanceBooking: '30',
    
    // Security
    twoFactorEnabled: false,
    lastPasswordChange: '2024-01-15',
    activeSessions: 3,
    loginHistory: true
  })

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }

  const handleSelectChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ustawienia</h1>
          <p className="text-gray-600">Zarządzaj preferencjami i bezpieczeństwem</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Powiadomienia</TabsTrigger>
          <TabsTrigger value="privacy">Prywatność</TabsTrigger>
          <TabsTrigger value="display">Wyświetlanie</TabsTrigger>
          <TabsTrigger value="security">Bezpieczeństwo</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          {/* Notification Channels */}
          <Card>
            <CardHeader>
              <CardTitle>Kanały powiadomień</CardTitle>
              <CardDescription>
                Wybierz, jak chcesz otrzymywać powiadomienia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-gray-500">Otrzymuj powiadomienia na email</p>
                  </div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleToggle('emailNotifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-500" />
                  <div>
                    <Label>SMS</Label>
                    <p className="text-sm text-gray-500">Otrzymuj powiadomienia SMS</p>
                  </div>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={() => handleToggle('smsNotifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-500" />
                  <div>
                    <Label>Push</Label>
                    <p className="text-sm text-gray-500">Powiadomienia w aplikacji</p>
                  </div>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={() => handleToggle('pushNotifications')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Types */}
          <Card>
            <CardHeader>
              <CardTitle>Rodzaje powiadomień</CardTitle>
              <CardDescription>
                Zdecyduj, o czym chcesz być informowany
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Nowe rezerwacje</Label>
                <Switch
                  checked={settings.notifyNewBooking}
                  onCheckedChange={() => handleToggle('notifyNewBooking')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Anulacje</Label>
                <Switch
                  checked={settings.notifyCancellation}
                  onCheckedChange={() => handleToggle('notifyCancellation')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Przypomnienia o lekcjach</Label>
                <Switch
                  checked={settings.notifyReminder}
                  onCheckedChange={() => handleToggle('notifyReminder')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Płatności</Label>
                <Switch
                  checked={settings.notifyPayment}
                  onCheckedChange={() => handleToggle('notifyPayment')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Wiadomości od kursantów</Label>
                <Switch
                  checked={settings.notifyMessages}
                  onCheckedChange={() => handleToggle('notifyMessages')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Nowe recenzje</Label>
                <Switch
                  checked={settings.notifyReviews}
                  onCheckedChange={() => handleToggle('notifyReviews')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          {/* Profile Visibility */}
          <Card>
            <CardHeader>
              <CardTitle>Widoczność profilu</CardTitle>
              <CardDescription>
                Kontroluj, kto może zobaczyć Twój profil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Dostępność profilu</Label>
                <RadioGroup 
                  value={settings.profileVisibility}
                  onValueChange={(value) => handleSelectChange('profileVisibility', value)}
                  className="mt-2"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="public" />
                    <span>Publiczny - wszyscy mogą zobaczyć</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="students" />
                    <span>Tylko kursanci</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="private" />
                    <span>Prywatny - nikt nie może zobaczyć</span>
                  </label>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Pokaż numer telefonu</Label>
                  <Switch
                    checked={settings.showPhone}
                    onCheckedChange={() => handleToggle('showPhone')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Pokaż adres email</Label>
                  <Switch
                    checked={settings.showEmail}
                    onCheckedChange={() => handleToggle('showEmail')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Pokaż oceny</Label>
                  <Switch
                    checked={settings.showRating}
                    onCheckedChange={() => handleToggle('showRating')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Pokaż statystyki</Label>
                  <Switch
                    checked={settings.showStatistics}
                    onCheckedChange={() => handleToggle('showStatistics')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Ustawienia rezerwacji</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Rezerwacje online</Label>
                  <p className="text-sm text-gray-500">Kursanci mogą rezerwować online</p>
                </div>
                <Switch
                  checked={settings.allowOnlineBooking}
                  onCheckedChange={() => handleToggle('allowOnlineBooking')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Wymagaj zatwierdzenia</Label>
                  <p className="text-sm text-gray-500">Ręcznie zatwierdzaj każdą rezerwację</p>
                </div>
                <Switch
                  checked={settings.requireApproval}
                  onCheckedChange={() => handleToggle('requireApproval')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Min. wyprzedzenie</Label>
                  <Select 
                    value={settings.minAdvanceBooking}
                    onValueChange={(value) => handleSelectChange('minAdvanceBooking', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 godzin</SelectItem>
                      <SelectItem value="24">24 godziny</SelectItem>
                      <SelectItem value="48">48 godzin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Maks. wyprzedzenie</Label>
                  <Select 
                    value={settings.maxAdvanceBooking}
                    onValueChange={(value) => handleSelectChange('maxAdvanceBooking', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 dni</SelectItem>
                      <SelectItem value="14">14 dni</SelectItem>
                      <SelectItem value="30">30 dni</SelectItem>
                      <SelectItem value="60">60 dni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display" className="space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle>Wygląd</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Motyw</Label>
                <RadioGroup 
                  value={settings.theme}
                  onValueChange={(value) => handleSelectChange('theme', value)}
                  className="mt-2 flex gap-4"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="light" />
                    <Sun className="w-4 h-4" />
                    <span>Jasny</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="dark" />
                    <Moon className="w-4 h-4" />
                    <span>Ciemny</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="system" />
                    <Monitor className="w-4 h-4" />
                    <span>Systemowy</span>
                  </label>
                </RadioGroup>
              </div>

              <div>
                <Label>Język</Label>
                <Select 
                  value={settings.language}
                  onValueChange={(value) => handleSelectChange('language', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pl">Polski</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Format daty</Label>
                  <Select 
                    value={settings.dateFormat}
                    onValueChange={(value) => handleSelectChange('dateFormat', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD.MM.YYYY">DD.MM.YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Format czasu</Label>
                  <Select 
                    value={settings.timeFormat}
                    onValueChange={(value) => handleSelectChange('timeFormat', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24-godzinny</SelectItem>
                      <SelectItem value="12h">12-godzinny</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security Status */}
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>Twoje konto jest bezpieczne</strong>
              <p className="text-sm mt-1">
                Ostatnia zmiana hasła: {settings.lastPasswordChange}
              </p>
            </AlertDescription>
          </Alert>

          {/* Password */}
          <Card>
            <CardHeader>
              <CardTitle>Hasło</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline"
                onClick={() => setShowPasswordDialog(true)}
              >
                <Key className="w-4 h-4 mr-2" />
                Zmień hasło
              </Button>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Uwierzytelnianie dwuskładnikowe</CardTitle>
              <CardDescription>
                Dodatkowa warstwa zabezpieczeń dla Twojego konta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>2FA {settings.twoFactorEnabled ? 'włączone' : 'wyłączone'}</Label>
                  <p className="text-sm text-gray-500">
                    {settings.twoFactorEnabled 
                      ? 'Twoje konto jest chronione przez 2FA'
                      : 'Włącz dla lepszego bezpieczeństwa'}
                  </p>
                </div>
                <Button 
                  variant={settings.twoFactorEnabled ? 'destructive' : 'default'}
                  onClick={() => setShow2FADialog(true)}
                >
                  {settings.twoFactorEnabled ? 'Wyłącz' : 'Włącz'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Aktywne sesje</CardTitle>
              <CardDescription>
                Obecnie zalogowane urządzenia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Chrome - Windows</p>
                      <p className="text-sm text-gray-500">Warszawa • Teraz</p>
                    </div>
                  </div>
                  <Badge variant="default">Obecna</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Safari - iPhone</p>
                      <p className="text-sm text-gray-500">Kraków • 2 godz. temu</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Zakończ
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Zakończ wszystkie inne sesje
              </Button>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Akcje konta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Pobierz dane konta
              </Button>
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Usuń konto
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zmień hasło</DialogTitle>
            <DialogDescription>
              Wprowadź obecne hasło i nowe hasło
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Obecne hasło</Label>
              <Input type="password" className="mt-2" />
            </div>
            <div>
              <Label>Nowe hasło</Label>
              <Input type="password" className="mt-2" />
            </div>
            <div>
              <Label>Potwierdź nowe hasło</Label>
              <Input type="password" className="mt-2" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Anuluj
            </Button>
            <Button onClick={() => setShowPasswordDialog(false)}>
              Zmień hasło
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2FA Dialog */}
      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {settings.twoFactorEnabled ? 'Wyłącz 2FA' : 'Włącz 2FA'}
            </DialogTitle>
            <DialogDescription>
              {settings.twoFactorEnabled 
                ? 'Czy na pewno chcesz wyłączyć uwierzytelnianie dwuskładnikowe?'
                : 'Skonfiguruj uwierzytelnianie dwuskładnikowe dla lepszego bezpieczeństwa'}
            </DialogDescription>
          </DialogHeader>
          {!settings.twoFactorEnabled && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-center text-2xl font-mono">QR CODE</p>
                <p className="text-center text-xs text-gray-500 mt-2">
                  Zeskanuj kod aplikacją authenticator
                </p>
              </div>
              <div>
                <Label>Kod weryfikacyjny</Label>
                <Input placeholder="000000" className="mt-2" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShow2FADialog(false)}>
              Anuluj
            </Button>
            <Button 
              variant={settings.twoFactorEnabled ? 'destructive' : 'default'}
              onClick={() => {
                handleToggle('twoFactorEnabled')
                setShow2FADialog(false)
              }}
            >
              {settings.twoFactorEnabled ? 'Wyłącz 2FA' : 'Włącz 2FA'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usuń konto</DialogTitle>
            <DialogDescription>
              Ta akcja jest nieodwracalna. Wszystkie dane zostaną trwale usunięte.
            </DialogDescription>
          </DialogHeader>
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <strong>Uwaga!</strong> Usunięcie konta spowoduje:
              <ul className="list-disc ml-5 mt-2 text-sm">
                <li>Utratę wszystkich danych</li>
                <li>Anulowanie wszystkich rezerwacji</li>
                <li>Usunięcie historii kursantów</li>
                <li>Brak możliwości odzyskania konta</li>
              </ul>
            </AlertDescription>
          </Alert>
          <div>
            <Label>Wpisz "USUŃ" aby potwierdzić</Label>
            <Input placeholder="USUŃ" className="mt-2" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Anuluj
            </Button>
            <Button variant="destructive" disabled>
              Usuń konto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}