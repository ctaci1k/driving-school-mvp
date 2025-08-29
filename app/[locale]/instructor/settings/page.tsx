// app/[locale]/instructor/settings/page.tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { 
  Settings, Bell, Shield, Globe, Palette, User, Key,
  Smartphone, Mail, Calendar, Clock, Volume2, Eye,
  Moon, Sun, Monitor, Lock, LogOut, HelpCircle,
  ChevronRight, Save, AlertCircle, Check, Download, Trash2 
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
  const t = useTranslations('instructor.settings')
  
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

  const notificationTypes = ['newBooking', 'cancellation', 'reminder', 'payment', 'systemUpdates'] as const

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600 mt-1">{t('subtitle')}</p>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="notifications">{t('tabs.notifications')}</TabsTrigger>
          <TabsTrigger value="privacy">{t('tabs.privacy')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('tabs.appearance')}</TabsTrigger>
          <TabsTrigger value="schedule">{t('tabs.schedule')}</TabsTrigger>
          <TabsTrigger value="security">{t('tabs.security')}</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('notifications.email.title')}</CardTitle>
              <CardDescription>{t('notifications.email.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationTypes.map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={`email-${key}`} className="flex flex-col">
                    <span className="font-normal">
                      {t(`notifications.email.${key}`)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {t(`notifications.email.${key}Desc`)}
                    </span>
                  </Label>
                  <Switch
                    id={`email-${key}`}
                    checked={settings.notifications.email[key]}
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
              <CardTitle>{t('notifications.push.title')}</CardTitle>
              <CardDescription>{t('notifications.push.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationTypes.map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={`push-${key}`}>
                    {t(`notifications.email.${key}`)}
                  </Label>
                  <Switch
                    id={`push-${key}`}
                    checked={settings.notifications.push[key]}
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
              <CardTitle>{t('notifications.sms.title')}</CardTitle>
              <CardDescription>{t('notifications.sms.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{t('notifications.sms.warning')}</AlertDescription>
              </Alert>
              {notificationTypes.map((key) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={`sms-${key}`}>
                    {t(`notifications.email.${key}`)}
                  </Label>
                  <Switch
                    id={`sms-${key}`}
                    checked={settings.notifications.sms[key]}
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
              <CardTitle>{t('privacy.profile.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t('privacy.profile.whoCanSee')}</Label>
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
                    <Label htmlFor="public">{t('privacy.profile.public')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="students" id="students" />
                    <Label htmlFor="students">{t('privacy.profile.students')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">{t('privacy.profile.private')}</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-rating">
                    <span className="block">{t('privacy.profile.showRating')}</span>
                    <span className="text-sm text-gray-500">{t('privacy.profile.showRatingDesc')}</span>
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
                    <span className="block">{t('privacy.profile.showStatistics')}</span>
                    <span className="text-sm text-gray-500">{t('privacy.profile.showStatisticsDesc')}</span>
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
                    <span className="block">{t('privacy.profile.showSchedule')}</span>
                    <span className="text-sm text-gray-500">{t('privacy.profile.showScheduleDesc')}</span>
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
              <CardTitle>{t('privacy.messages.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t('privacy.messages.whoCanMessage')}</Label>
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
                    <SelectItem value="everyone">{t('privacy.messages.everyone')}</SelectItem>
                    <SelectItem value="students">{t('privacy.messages.studentsOnly')}</SelectItem>
                    <SelectItem value="contacts">{t('privacy.messages.contacts')}</SelectItem>
                    <SelectItem value="nobody">{t('privacy.messages.nobody')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacy.data.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="location">
                  <span className="block">{t('privacy.data.shareLocation')}</span>
                  <span className="text-sm text-gray-500">{t('privacy.data.shareLocationDesc')}</span>
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
                  <span className="block">{t('privacy.data.dataCollection')}</span>
                  <span className="text-sm text-gray-500">{t('privacy.data.dataCollectionDesc')}</span>
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
                {t('privacy.data.downloadData')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('appearance.theme.title')}</CardTitle>
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
                      <p className="text-sm text-center">{t('appearance.theme.light')}</p>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <RadioGroupItem value="dark" id="dark" className="sr-only" />
                    <div className={`p-4 rounded-lg border-2 transition-colors ${
                      settings.appearance.theme === 'dark' ? 'border-blue-500' : 'border-gray-200'
                    }`}>
                      <Moon className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm text-center">{t('appearance.theme.dark')}</p>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <RadioGroupItem value="system" id="system" className="sr-only" />
                    <div className={`p-4 rounded-lg border-2 transition-colors ${
                      settings.appearance.theme === 'system' ? 'border-blue-500' : 'border-gray-200'
                    }`}>
                      <Monitor className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm text-center">{t('appearance.theme.system')}</p>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('appearance.language.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t('appearance.language.interface')}</Label>
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
                    <SelectItem value="pl">{t('appearance.language.polish')}</SelectItem>
                    <SelectItem value="en">{t('appearance.language.english')}</SelectItem>
                    <SelectItem value="uk">{t('appearance.language.ukrainian')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t('appearance.formats.dateFormat')}</Label>
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
                    <SelectItem value="DD/MM/YYYY">DD/MM/РРРР</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/РРРР</SelectItem>
                    <SelectItem value="YYYY-MM-DD">РРРР-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t('appearance.formats.timeFormat')}</Label>
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
                    <Label htmlFor="24h">{t('appearance.formats.24hour')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="12h" id="12h" />
                    <Label htmlFor="12h">{t('appearance.formats.12hour')}</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('schedule.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('schedule.defaultDuration')}</Label>
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
                      <SelectItem value="60">{t('schedule.minutes', { count: 60 })}</SelectItem>
                      <SelectItem value="90">{t('schedule.minutes', { count: 90 })}</SelectItem>
                      <SelectItem value="120">{t('schedule.minutes', { count: 120 })}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t('schedule.bufferTime')}</Label>
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
                      <SelectItem value="0">{t('schedule.noBreak')}</SelectItem>
                      <SelectItem value="15">{t('schedule.minutes', { count: 15 })}</SelectItem>
                      <SelectItem value="30">{t('schedule.minutes', { count: 30 })}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t('schedule.startTime')}</Label>
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
                  <Label>{t('schedule.endTime')}</Label>
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
                <Label>{t('schedule.maxPerDay')}</Label>
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
                      <SelectItem key={num} value={String(num)}>
                        {t('schedule.lessons', { count: num })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-confirm">
                  <span className="block">{t('schedule.autoConfirm')}</span>
                  <span className="text-sm text-gray-500">{t('schedule.autoConfirmDesc')}</span>
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
              <CardTitle>{t('security.password.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Key className="w-4 h-4 mr-2" />
                    {t('security.password.change')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('security.password.modalTitle')}</DialogTitle>
                    <DialogDescription>{t('security.password.modalDescription')}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label>{t('security.password.current')}</Label>
                      <Input
                        type="password"
                        value={passwordData.current}
                        onChange={(e) =>
                          setPasswordData(prev => ({ ...prev, current: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label>{t('security.password.new')}</Label>
                      <Input
                        type="password"
                        value={passwordData.new}
                        onChange={(e) =>
                          setPasswordData(prev => ({ ...prev, new: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <Label>{t('security.password.confirm')}</Label>
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
                      {t('buttons.cancel')}
                    </Button>
                    <Button onClick={handleChangePassword}>
                      {t('security.password.change')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('security.twoFactor.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('security.twoFactor.status')}</p>
                  <p className="text-sm text-gray-500">
                    {settings.security.twoFactor ? t('security.twoFactor.enabled') : t('security.twoFactor.disabled')}
                  </p>
                </div>
                <Button variant={settings.security.twoFactor ? 'outline' : 'default'}>
                  {settings.security.twoFactor ? t('security.twoFactor.disable') : t('security.twoFactor.enable')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('security.sessions.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="session-timeout">
                  <span className="block">{t('security.sessions.sessionTimeout')}</span>
                  <span className="text-sm text-gray-500">{t('security.sessions.sessionTimeoutDesc')}</span>
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
                <p className="font-medium mb-2">{t('security.sessions.trustedDevices')}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {t('security.sessions.devicesConnected', { count: settings.security.trustedDevices })}
                </p>
                <Button variant="outline" className="w-full">
                  <Smartphone className="w-4 h-4 mr-2" />
                  {t('security.sessions.manageDevices')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">{t('security.dangerZone.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{t('security.dangerZone.warning')}</AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('security.dangerZone.logoutAll')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('security.dangerZone.logoutAllConfirm')}</DialogTitle>
                      <DialogDescription>{t('security.dangerZone.logoutAllDesc')}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">{t('buttons.cancel')}</Button>
                      <Button variant="destructive">{t('buttons.logout')}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('security.dangerZone.deleteAccount')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('security.dangerZone.deleteAccountConfirm')}</DialogTitle>
                      <DialogDescription>{t('security.dangerZone.deleteAccountDesc')}</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Label>{t('security.dangerZone.deleteAccountPlaceholder')}</Label>
                      <Input className="mt-2" placeholder="ВИДАЛИТИ" />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                        {t('buttons.cancel')}
                      </Button>
                      <Button variant="destructive">
                        {t('security.dangerZone.deleteForever')}
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
        <Button variant="outline">{t('buttons.cancel')}</Button>
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          {t('buttons.save')}
        </Button>
      </div>
    </div>
  )
}