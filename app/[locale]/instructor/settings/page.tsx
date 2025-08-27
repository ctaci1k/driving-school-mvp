// /app/[locale]/instructor/settings/page.tsx
'use client'

import { useState } from 'react'
import { 
  Settings, Bell, Shield, Globe, Palette, User, Key,
  Smartphone, Mail, Calendar, Clock, Volume2, Eye,
  Moon, Sun, Monitor, Lock, LogOut, HelpCircle,
  ChevronRight,Save, AlertCircle, Check, Download,Trash2 
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function InstructorSettings() {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  // Settings state
  const [settings, setSettings] = useState({
    // Notifications
    notifications: {
      email: {
        newBooking: true,
        cancellation: true,
        reminder: true,
        payment: true,
        systemUpdates: false
      },
      push: {
        newBooking: true,
        cancellation: true,
        reminder: true,
        payment: false,
        systemUpdates: false
      },
      sms: {
        newBooking: false,
        cancellation: true,
        reminder: false,
        payment: false,
        systemUpdates: false
      }
    },
    
    // Privacy
    privacy: {
      profileVisibility: 'public',
      showRating: true,
      showStatistics: true,
      showSchedule: true,
      allowMessages: 'students',
      shareLocation: false,
      dataCollection: true
    },
    
    // Appearance
    appearance: {
      theme: 'system',
      language: 'pl',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      firstDayOfWeek: 'monday',
      compactMode: false
    },
    
    // Schedule
    schedule: {
      defaultDuration: 90,
      bufferTime: 15,
      autoConfirm: false,
      maxPerDay: 8,
      workingDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
      startTime: '08:00',
      endTime: '20:00',
      breakTime: '13:00-14:00'
    },
    
    // Security
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      loginNotifications: true,
      trustedDevices: 2
    }
  })

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings)
  }

  const handleChangePassword = () => {
    console.log('Changing password:', passwordData)
    setShowPasswordDialog(false)
    setPasswordData({ current: '', new: '', confirm: '' })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ustawienia</h1>
        <p className="text-gray-600 mt-1">
          Zarządzaj swoimi ustawieniami i preferencjami
        </p>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notifications">Powiadomienia</TabsTrigger>
          <TabsTrigger value="privacy">Prywatność</TabsTrigger>
          <TabsTrigger value="appearance">Wygląd</TabsTrigger>
          <TabsTrigger value="schedule">Harmonogram</TabsTrigger>
          <TabsTrigger value="security">Bezpieczeństwo</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Powiadomienia email</CardTitle>
              <CardDescription>Wybierz, które powiadomienia chcesz otrzymywać na email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.notifications.email).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={`email-${key}`} className="flex flex-col">
                    <span className="font-normal">
                      {key === 'newBooking' && 'Nowe rezerwacje'}
                      {key === 'cancellation' && 'Anulowanie lekcji'}
                      {key === 'reminder' && 'Przypomnienie o lekcji'}
                      {key === 'payment' && 'Płatności i wypłaty'}
                      {key === 'systemUpdates' && 'Aktualizacje systemu'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {key === 'newBooking' && 'Gdy uczeń rezerwuje lekcję'}
                      {key === 'cancellation' && 'Gdy lekcja zostanie anulowana'}
                      {key === 'reminder' && 'Godzinę przed lekcją'}
                      {key === 'payment' && 'Informacje o płatnościach'}
                      {key === 'systemUpdates' && 'Nowości i aktualizacje systemu'}
                    </span>
                  </Label>
                  <Switch
                    id={`email-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          email: { ...prev.notifications.email, [key]: checked }
                        }
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Powiadomienia push</CardTitle>
              <CardDescription>Ustawienia powiadomień w przeglądarce i aplikacji mobilnej</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.notifications.push).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={`push-${key}`}>
                    {key === 'newBooking' && 'Nowe rezerwacje'}
                    {key === 'cancellation' && 'Anulowanie lekcji'}
                    {key === 'reminder' && 'Przypomnienie o lekcji'}
                    {key === 'payment' && 'Płatności i wypłaty'}
                    {key === 'systemUpdates' && 'Aktualizacje systemu'}
                  </Label>
                  <Switch
                    id={`push-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          push: { ...prev.notifications.push, [key]: checked }
                        }
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Powiadomienia SMS</CardTitle>
              <CardDescription>Ważne powiadomienia przez SMS (usługa płatna)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Powiadomienia SMS są dodatkowo płatne: 0,50 zł za wiadomość
                </AlertDescription>
              </Alert>
              {Object.entries(settings.notifications.sms).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={`sms-${key}`}>
                    {key === 'newBooking' && 'Nowe rezerwacje'}
                    {key === 'cancellation' && 'Anulowanie lekcji'}
                    {key === 'reminder' && 'Przypomnienie o lekcji'}
                    {key === 'payment' && 'Płatności i wypłaty'}
                    {key === 'systemUpdates' && 'Aktualizacje systemu'}
                  </Label>
                  <Switch
                    id={`sms-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          sms: { ...prev.notifications.sms, [key]: checked }
                        }
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Widoczność profilu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Kto może widzieć mój profil</Label>
                <RadioGroup 
                  value={settings.privacy.profileVisibility}
                  onValueChange={(value) =>
                    setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, profileVisibility: value }
                    }))
                  }
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public">Wszyscy (publiczny)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="students" id="students" />
                    <Label htmlFor="students">Tylko moi uczniowie</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">Nikt (prywatny)</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-rating">
                    <span className="block">Pokazuj moją ocenę</span>
                    <span className="text-sm text-gray-500">Uczniowie mogą widzieć twoją ocenę</span>
                  </Label>
                  <Switch
                    id="show-rating"
                    checked={settings.privacy.showRating}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, showRating: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-stats">
                    <span className="block">Pokazuj statystyki</span>
                    <span className="text-sm text-gray-500">Liczba uczniów, skuteczność itp.</span>
                  </Label>
                  <Switch
                    id="show-stats"
                    checked={settings.privacy.showStatistics}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, showStatistics: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-schedule">
                    <span className="block">Pokazuj harmonogram</span>
                    <span className="text-sm text-gray-500">Wolne terminy do rezerwacji</span>
                  </Label>
                  <Switch
                    id="show-schedule"
                    checked={settings.privacy.showSchedule}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, showSchedule: checked }
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wiadomości</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Kto może wysyłać mi wiadomości</Label>
                <Select 
                  value={settings.privacy.allowMessages}
                  onValueChange={(value) =>
                    setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, allowMessages: value }
                    }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyone">Wszyscy</SelectItem>
                    <SelectItem value="students">Tylko uczniowie</SelectItem>
                    <SelectItem value="contacts">Tylko kontakty</SelectItem>
                    <SelectItem value="nobody">Nikt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dane i poufność</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="location">
                  <span className="block">Udostępnij lokalizację</span>
                  <span className="text-sm text-gray-500">Podczas lekcji dla bezpieczeństwa</span>
                </Label>
                <Switch
                  id="location"
                  checked={settings.privacy.shareLocation}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, shareLocation: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="data-collection">
                  <span className="block">Zbieranie danych do ulepszania</span>
                  <span className="text-sm text-gray-500">Anonimowe statystyki użytkowania</span>
                </Label>
                <Switch
                  id="data-collection"
                  checked={settings.privacy.dataCollection}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, dataCollection: checked }
                    }))
                  }
                />
              </div>

              <Separator />

              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Pobierz moje dane
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Motyw interfejsu</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={settings.appearance.theme}
                onValueChange={(value) =>
                  setSettings(prev => ({
                    ...prev,
                    appearance: { ...prev.appearance, theme: value }
                  }))
                }
              >
                <div className="grid grid-cols-3 gap-4">
                  <label className="cursor-pointer">
                    <RadioGroupItem value="light" id="light" className="sr-only" />
                    <div className={`p-4 rounded-lg border-2 transition-colors ${
                      settings.appearance.theme === 'light' ? 'border-blue-500' : 'border-gray-200'
                    }`}>
                      <Sun className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm text-center">Jasny</p>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <RadioGroupItem value="dark" id="dark" className="sr-only" />
                    <div className={`p-4 rounded-lg border-2 transition-colors ${
                      settings.appearance.theme === 'dark' ? 'border-blue-500' : 'border-gray-200'
                    }`}>
                      <Moon className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm text-center">Ciemny</p>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <RadioGroupItem value="system" id="system" className="sr-only" />
                    <div className={`p-4 rounded-lg border-2 transition-colors ${
                      settings.appearance.theme === 'system' ? 'border-blue-500' : 'border-gray-200'
                    }`}>
                      <Monitor className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm text-center">Systemowy</p>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Język i region</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Język interfejsu</Label>
                <Select 
                  value={settings.appearance.language}
                  onValueChange={(value) =>
                    setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, language: value }
                    }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pl">Polski</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="uk">Українська</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Format daty</Label>
                <Select 
                  value={settings.appearance.dateFormat}
                  onValueChange={(value) =>
                    setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, dateFormat: value }
                    }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/RRRR</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/RRRR</SelectItem>
                    <SelectItem value="YYYY-MM-DD">RRRR-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Format czasu</Label>
                <RadioGroup 
                  value={settings.appearance.timeFormat}
                  onValueChange={(value) =>
                    setSettings(prev => ({
                      ...prev,
                      appearance: { ...prev.appearance, timeFormat: value }
                    }))
                  }
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="24h" id="24h" />
                    <Label htmlFor="24h">24-godzinny (14:00)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="12h" id="12h" />
                    <Label htmlFor="12h">12-godzinny (2:00 PM)</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ustawienia harmonogramu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Domyślny czas lekcji</Label>
                  <Select 
                    value={String(settings.schedule.defaultDuration)}
                    onValueChange={(value) =>
                      setSettings(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, defaultDuration: Number(value) }
                      }))
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">60 minut</SelectItem>
                      <SelectItem value="90">90 minut</SelectItem>
                      <SelectItem value="120">120 minut</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Czas między lekcjami</Label>
                  <Select 
                    value={String(settings.schedule.bufferTime)}
                    onValueChange={(value) =>
                      setSettings(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, bufferTime: Number(value) }
                      }))
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Bez przerwy</SelectItem>
                      <SelectItem value="15">15 minut</SelectItem>
                      <SelectItem value="30">30 minut</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Początek dnia pracy</Label>
                  <Input 
                    type="time" 
                    value={settings.schedule.startTime}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, startTime: e.target.value }
                      }))
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Koniec dnia pracy</Label>
                  <Input 
                    type="time" 
                    value={settings.schedule.endTime}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, endTime: e.target.value }
                      }))
                    }
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Maksimum lekcji dziennie</Label>
                <Select 
                  value={String(settings.schedule.maxPerDay)}
                  onValueChange={(value) =>
                    setSettings(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, maxPerDay: Number(value) }
                    }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[4, 6, 8, 10, 12].map(num => (
                      <SelectItem key={num} value={String(num)}>{num} lekcji</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-confirm">
                  <span className="block">Automatyczne potwierdzanie</span>
                  <span className="text-sm text-gray-500">Rezerwacje potwierdzane automatycznie</span>
                </Label>
                <Switch
                  id="auto-confirm"
                  checked={settings.schedule.autoConfirm}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      schedule: { ...prev.schedule, autoConfirm: checked }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hasło</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Key className="w-4 h-4 mr-2" />
                    Zmień hasło
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Zmiana hasła</DialogTitle>
                    <DialogDescription>
                      Wprowadź obecne hasło i nowe hasło
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>Obecne hasło</Label>
                      <Input
                        type="password"
                        value={passwordData.current}
                        onChange={(e) =>
                          setPasswordData(prev => ({ ...prev, current: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Nowe hasło</Label>
                      <Input
                        type="password"
                        value={passwordData.new}
                        onChange={(e) =>
                          setPasswordData(prev => ({ ...prev, new: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Potwierdź nowe hasło</Label>
                      <Input
                        type="password"
                        value={passwordData.confirm}
                        onChange={(e) =>
                          setPasswordData(prev => ({ ...prev, confirm: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                      Anuluj
                    </Button>
                    <Button onClick={handleChangePassword}>
                      Zmień hasło
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Uwierzytelnianie dwuskładnikowe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-sm text-gray-500">
                    {settings.security.twoFactor ? 'Włączone' : 'Wyłączone'}
                  </p>
                </div>
                <Button variant={settings.security.twoFactor ? 'outline' : 'default'}>
                  {settings.security.twoFactor ? 'Wyłącz' : 'Włącz'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sesje i urządzenia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="session-timeout">
                  <span className="block">Czas automatycznego wylogowania</span>
                  <span className="text-sm text-gray-500">Przy braku aktywności (minuty)</span>
                </Label>
                <Select 
                  value={String(settings.security.sessionTimeout)}
                  onValueChange={(value) =>
                    setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, sessionTimeout: Number(value) }
                    }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="60">60</SelectItem>
                    <SelectItem value="120">120</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <p className="font-medium mb-2">Zaufane urządzenia</p>
                <p className="text-sm text-gray-500 mb-4">
                  {settings.security.trustedDevices} urządzeń połączonych
                </p>
                <Button variant="outline" className="w-full">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Zarządzaj urządzeniami
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Strefa zagrożenia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Te działania są nieodwracalne. Proszę zachować ostrożność.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4 mr-2" />
                      Wyloguj ze wszystkich urządzeń
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Wylogować ze wszystkich urządzeń?</DialogTitle>
                      <DialogDescription>
                        Zostaniesz wylogowany ze wszystkich urządzeń, oprócz obecnego.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Anuluj</Button>
                      <Button variant="destructive">Wyloguj</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Usuń konto
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Usunąć konto na zawsze?</DialogTitle>
                      <DialogDescription>
                        Ta akcja jest nieodwracalna. Wszystkie twoje dane zostaną usunięte.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Label>Wpisz "USUŃ" aby potwierdzić</Label>
                      <Input className="mt-2" placeholder="USUŃ" />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                        Anuluj
                      </Button>
                      <Button variant="destructive">
                        Usuń na zawsze
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save button */}
      <div className="sticky bottom-0 bg-white border-t p-4 -mx-4 flex justify-end gap-2">
        <Button variant="outline">Anuluj</Button>
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Zapisz zmiany
        </Button>
      </div>
    </div>
  )
}