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
      language: 'uk',
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
        <h1 className="text-2xl font-bold text-gray-900">Налаштування</h1>
        <p className="text-gray-600 mt-1">
          Керуйте своїми налаштуваннями та преференціями
        </p>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notifications">Сповіщення</TabsTrigger>
          <TabsTrigger value="privacy">Приватність</TabsTrigger>
          <TabsTrigger value="appearance">Вигляд</TabsTrigger>
          <TabsTrigger value="schedule">Розклад</TabsTrigger>
          <TabsTrigger value="security">Безпека</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email сповіщення</CardTitle>
              <CardDescription>Оберіть, які сповіщення ви хочете отримувати на email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.notifications.email).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={`email-${key}`} className="flex flex-col">
                    <span className="font-normal">
                      {key === 'newBooking' && 'Нові бронювання'}
                      {key === 'cancellation' && 'Скасування занять'}
                      {key === 'reminder' && 'Нагадування про заняття'}
                      {key === 'payment' && 'Платежі та виплати'}
                      {key === 'systemUpdates' && 'Системні оновлення'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {key === 'newBooking' && 'Коли студент бронює заняття'}
                      {key === 'cancellation' && 'Коли заняття скасовується'}
                      {key === 'reminder' && 'За годину до заняття'}
                      {key === 'payment' && 'Інформація про платежі'}
                      {key === 'systemUpdates' && 'Новини та оновлення системи'}
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
              <CardTitle>Push-сповіщення</CardTitle>
              <CardDescription>Налаштування сповіщень в браузері та мобільному додатку</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.notifications.push).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={`push-${key}`}>
                    {key === 'newBooking' && 'Нові бронювання'}
                    {key === 'cancellation' && 'Скасування занять'}
                    {key === 'reminder' && 'Нагадування про заняття'}
                    {key === 'payment' && 'Платежі та виплати'}
                    {key === 'systemUpdates' && 'Системні оновлення'}
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
              <CardTitle>SMS-сповіщення</CardTitle>
              <CardDescription>Важливі сповіщення через SMS (платна послуга)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  SMS-сповіщення тарифікуються додатково: 0.50 грн за повідомлення
                </AlertDescription>
              </Alert>
              {Object.entries(settings.notifications.sms).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={`sms-${key}`}>
                    {key === 'newBooking' && 'Нові бронювання'}
                    {key === 'cancellation' && 'Скасування занять'}
                    {key === 'reminder' && 'Нагадування про заняття'}
                    {key === 'payment' && 'Платежі та виплати'}
                    {key === 'systemUpdates' && 'Системні оновлення'}
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
              <CardTitle>Видимість профілю</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Хто може бачити мій профіль</Label>
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
                    <Label htmlFor="public">Всі (публічний)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="students" id="students" />
                    <Label htmlFor="students">Тільки мої студенти</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">Ніхто (приватний)</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-rating">
                    <span className="block">Показувати мій рейтинг</span>
                    <span className="text-sm text-gray-500">Студенти можуть бачити ваш рейтинг</span>
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
                    <span className="block">Показувати статистику</span>
                    <span className="text-sm text-gray-500">Кількість студентів, успішність тощо</span>
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
                    <span className="block">Показувати розклад</span>
                    <span className="text-sm text-gray-500">Вільні слоти для бронювання</span>
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
              <CardTitle>Повідомлення</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Хто може надсилати мені повідомлення</Label>
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
                    <SelectItem value="everyone">Всі</SelectItem>
                    <SelectItem value="students">Тільки студенти</SelectItem>
                    <SelectItem value="contacts">Тільки контакти</SelectItem>
                    <SelectItem value="nobody">Ніхто</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Дані та конфіденційність</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="location">
                  <span className="block">Ділитися локацією</span>
                  <span className="text-sm text-gray-500">Під час занять для безпеки</span>
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
                  <span className="block">Збір даних для покращення</span>
                  <span className="text-sm text-gray-500">Анонімна статистика використання</span>
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
                Завантажити мої дані
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Тема інтерфейсу</CardTitle>
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
                      <p className="text-sm text-center">Світла</p>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <RadioGroupItem value="dark" id="dark" className="sr-only" />
                    <div className={`p-4 rounded-lg border-2 transition-colors ${
                      settings.appearance.theme === 'dark' ? 'border-blue-500' : 'border-gray-200'
                    }`}>
                      <Moon className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm text-center">Темна</p>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <RadioGroupItem value="system" id="system" className="sr-only" />
                    <div className={`p-4 rounded-lg border-2 transition-colors ${
                      settings.appearance.theme === 'system' ? 'border-blue-500' : 'border-gray-200'
                    }`}>
                      <Monitor className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm text-center">Системна</p>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Мова та регіон</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Мова інтерфейсу</Label>
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
                    <SelectItem value="uk">Українська</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Формат дати</Label>
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
                    <SelectItem value="DD/MM/YYYY">ДД/ММ/РРРР</SelectItem>
                    <SelectItem value="MM/DD/YYYY">ММ/ДД/РРРР</SelectItem>
                    <SelectItem value="YYYY-MM-DD">РРРР-ММ-ДД</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Формат часу</Label>
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
                    <Label htmlFor="24h">24-годинний (14:00)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="12h" id="12h" />
                    <Label htmlFor="12h">12-годинний (2:00 PM)</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Налаштування розкладу</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Тривалість заняття за замовчуванням</Label>
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
                      <SelectItem value="60">60 хвилин</SelectItem>
                      <SelectItem value="90">90 хвилин</SelectItem>
                      <SelectItem value="120">120 хвилин</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Час між заняттями</Label>
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
                      <SelectItem value="0">Без перерви</SelectItem>
                      <SelectItem value="15">15 хвилин</SelectItem>
                      <SelectItem value="30">30 хвилин</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Початок робочого дня</Label>
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
                  <Label>Кінець робочого дня</Label>
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
                <Label>Максимум занять на день</Label>
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
                      <SelectItem key={num} value={String(num)}>{num} занять</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-confirm">
                  <span className="block">Автоматичне підтвердження</span>
                  <span className="text-sm text-gray-500">Бронювання підтверджуються автоматично</span>
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
              <CardTitle>Пароль</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Key className="w-4 h-4 mr-2" />
                    Змінити пароль
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Зміна пароля</DialogTitle>
                    <DialogDescription>
                      Введіть поточний пароль та новий пароль
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>Поточний пароль</Label>
                      <Input
                        type="password"
                        value={passwordData.current}
                        onChange={(e) =>
                          setPasswordData(prev => ({ ...prev, current: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Новий пароль</Label>
                      <Input
                        type="password"
                        value={passwordData.new}
                        onChange={(e) =>
                          setPasswordData(prev => ({ ...prev, new: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Підтвердіть новий пароль</Label>
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
                      Скасувати
                    </Button>
                    <Button onClick={handleChangePassword}>
                      Змінити пароль
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Двофакторна аутентифікація</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Статус</p>
                  <p className="text-sm text-gray-500">
                    {settings.security.twoFactor ? 'Увімкнено' : 'Вимкнено'}
                  </p>
                </div>
                <Button variant={settings.security.twoFactor ? 'outline' : 'default'}>
                  {settings.security.twoFactor ? 'Вимкнути' : 'Увімкнути'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Сесії та пристрої</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="session-timeout">
                  <span className="block">Час автоматичного виходу</span>
                  <span className="text-sm text-gray-500">При неактивності (хвилин)</span>
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
                <p className="font-medium mb-2">Довірені пристрої</p>
                <p className="text-sm text-gray-500 mb-4">
                  {settings.security.trustedDevices} пристроїв підключено
                </p>
                <Button variant="outline" className="w-full">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Керувати пристроями
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Небезпечна зона</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Ці дії незворотні. Будь ласка, будьте обережні.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4 mr-2" />
                      Вийти з усіх пристроїв
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Вийти з усіх пристроїв?</DialogTitle>
                      <DialogDescription>
                        Ви будете вилогінені з усіх пристроїв, окрім поточного.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Скасувати</Button>
                      <Button variant="destructive">Вийти</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Видалити акаунт
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Видалити акаунт назавжди?</DialogTitle>
                      <DialogDescription>
                        Ця дія незворотна. Всі ваші дані будуть видалені.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Label>Введіть "ВИДАЛИТИ" для підтвердження</Label>
                      <Input className="mt-2" placeholder="ВИДАЛИТИ" />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                        Скасувати
                      </Button>
                      <Button variant="destructive">
                        Видалити назавжди
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
        <Button variant="outline">Скасувати</Button>
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Зберегти зміни
        </Button>
      </div>
    </div>
  )
}