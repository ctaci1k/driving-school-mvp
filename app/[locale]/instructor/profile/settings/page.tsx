// app/[locale]/instructor/profile/settings/page.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('instructor.profile.settings')
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
    language: 'uk',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    currency: 'UAH',
    
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
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">{t('tabs.notifications')}</TabsTrigger>
          <TabsTrigger value="privacy">{t('tabs.privacy')}</TabsTrigger>
          <TabsTrigger value="display">{t('tabs.display')}</TabsTrigger>
          <TabsTrigger value="security">{t('tabs.security')}</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          {/* Notification Channels */}
          <Card>
            <CardHeader>
              <CardTitle>{t('notifications.channels.title')}</CardTitle>
              <CardDescription>
                {t('notifications.channels.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <Label>{t('notifications.channels.email.label')}</Label>
                    <p className="text-sm text-gray-500">{t('notifications.channels.email.description')}</p>
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
                    <Label>{t('notifications.channels.sms.label')}</Label>
                    <p className="text-sm text-gray-500">{t('notifications.channels.sms.description')}</p>
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
                    <Label>{t('notifications.channels.push.label')}</Label>
                    <p className="text-sm text-gray-500">{t('notifications.channels.push.description')}</p>
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
              <CardTitle>{t('notifications.types.title')}</CardTitle>
              <CardDescription>
                {t('notifications.types.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{t('notifications.types.newBooking')}</Label>
                <Switch
                  checked={settings.notifyNewBooking}
                  onCheckedChange={() => handleToggle('notifyNewBooking')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>{t('notifications.types.cancellation')}</Label>
                <Switch
                  checked={settings.notifyCancellation}
                  onCheckedChange={() => handleToggle('notifyCancellation')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>{t('notifications.types.reminder')}</Label>
                <Switch
                  checked={settings.notifyReminder}
                  onCheckedChange={() => handleToggle('notifyReminder')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>{t('notifications.types.payment')}</Label>
                <Switch
                  checked={settings.notifyPayment}
                  onCheckedChange={() => handleToggle('notifyPayment')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>{t('notifications.types.messages')}</Label>
                <Switch
                  checked={settings.notifyMessages}
                  onCheckedChange={() => handleToggle('notifyMessages')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>{t('notifications.types.reviews')}</Label>
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
              <CardTitle>{t('privacy.profile.title')}</CardTitle>
              <CardDescription>
                {t('privacy.profile.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t('privacy.profile.title')}</Label>
                <RadioGroup 
                  value={settings.profileVisibility}
                  onValueChange={(value) => handleSelectChange('profileVisibility', value)}
                  className="mt-2"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="public" />
                    <span>{t('privacy.profile.public')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="students" />
                    <span>{t('privacy.profile.students')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="private" />
                    <span>{t('privacy.profile.private')}</span>
                  </label>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>{t('privacy.profile.showPhone')}</Label>
                  <Switch
                    checked={settings.showPhone}
                    onCheckedChange={() => handleToggle('showPhone')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>{t('privacy.profile.showEmail')}</Label>
                  <Switch
                    checked={settings.showEmail}
                    onCheckedChange={() => handleToggle('showEmail')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>{t('privacy.profile.showRating')}</Label>
                  <Switch
                    checked={settings.showRating}
                    onCheckedChange={() => handleToggle('showRating')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>{t('privacy.profile.showStatistics')}</Label>
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
              <CardTitle>{t('privacy.booking.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('privacy.booking.onlineBooking.label')}</Label>
                  <p className="text-sm text-gray-500">{t('privacy.booking.onlineBooking.description')}</p>
                </div>
                <Switch
                  checked={settings.allowOnlineBooking}
                  onCheckedChange={() => handleToggle('allowOnlineBooking')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('privacy.booking.requireApproval.label')}</Label>
                  <p className="text-sm text-gray-500">{t('privacy.booking.requireApproval.description')}</p>
                </div>
                <Switch
                  checked={settings.requireApproval}
                  onCheckedChange={() => handleToggle('requireApproval')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('privacy.booking.minAdvance')}</Label>
                  <Select 
                    value={settings.minAdvanceBooking}
                    onValueChange={(value) => handleSelectChange('minAdvanceBooking', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">{t('privacy.booking.hours', { count: 12 })}</SelectItem>
                      <SelectItem value="24">{t('privacy.booking.hours', { count: 24 })}</SelectItem>
                      <SelectItem value="48">{t('privacy.booking.hours', { count: 48 })}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t('privacy.booking.maxAdvance')}</Label>
                  <Select 
                    value={settings.maxAdvanceBooking}
                    onValueChange={(value) => handleSelectChange('maxAdvanceBooking', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">{t('privacy.booking.days', { count: 7 })}</SelectItem>
                      <SelectItem value="14">{t('privacy.booking.days', { count: 14 })}</SelectItem>
                      <SelectItem value="30">{t('privacy.booking.days', { count: 30 })}</SelectItem>
                      <SelectItem value="60">{t('privacy.booking.days', { count: 60 })}</SelectItem>
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
              <CardTitle>{t('display.appearance.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t('display.appearance.theme')}</Label>
                <RadioGroup 
                  value={settings.theme}
                  onValueChange={(value) => handleSelectChange('theme', value)}
                  className="mt-2 flex gap-4"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="light" />
                    <Sun className="w-4 h-4" />
                    <span>{t('display.appearance.light')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="dark" />
                    <Moon className="w-4 h-4" />
                    <span>{t('display.appearance.dark')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="system" />
                    <Monitor className="w-4 h-4" />
                    <span>{t('display.appearance.system')}</span>
                  </label>
                </RadioGroup>
              </div>

              <div>
                <Label>{t('display.appearance.language')}</Label>
                <Select 
                  value={settings.language}
                  onValueChange={(value) => handleSelectChange('language', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uk">Українська</SelectItem>
                    <SelectItem value="pl">Polski</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('display.appearance.dateFormat')}</Label>
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
                  <Label>{t('display.appearance.timeFormat')}</Label>
                  <Select 
                    value={settings.timeFormat}
                    onValueChange={(value) => handleSelectChange('timeFormat', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">{t('display.appearance.24h')}</SelectItem>
                      <SelectItem value="12h">{t('display.appearance.12h')}</SelectItem>
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
              <strong>{t('security.status.secure')}</strong>
              <p className="text-sm mt-1">
                {t('security.status.lastPasswordChange', { date: settings.lastPasswordChange })}
              </p>
            </AlertDescription>
          </Alert>

          {/* Password */}
          <Card>
            <CardHeader>
              <CardTitle>{t('security.password.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline"
                onClick={() => setShowPasswordDialog(true)}
              >
                <Key className="w-4 h-4 mr-2" />
                {t('security.password.changePassword')}
              </Button>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>{t('security.twoFactor.title')}</CardTitle>
              <CardDescription>
                {t('security.twoFactor.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>
                    {settings.twoFactorEnabled 
                      ? t('security.twoFactor.enabled')
                      : t('security.twoFactor.disabled')}
                  </Label>
                  <p className="text-sm text-gray-500">
                    {settings.twoFactorEnabled 
                      ? t('security.twoFactor.enabledDescription')
                      : t('security.twoFactor.disabledDescription')}
                  </p>
                </div>
                <Button 
                  variant={settings.twoFactorEnabled ? 'destructive' : 'default'}
                  onClick={() => setShow2FADialog(true)}
                >
                  {settings.twoFactorEnabled 
                    ? t('security.twoFactor.disable')
                    : t('security.twoFactor.enable')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('security.sessions.title')}</CardTitle>
              <CardDescription>
                {t('security.sessions.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Chrome - Windows</p>
                      <p className="text-sm text-gray-500">
                        {t('security.sessions.location', { city: 'Київ', time: 'Зараз' })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">{t('security.sessions.current')}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Safari - iPhone</p>
                      <p className="text-sm text-gray-500">
                        {t('security.sessions.location', { city: 'Львів', time: '2 год. тому' })}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('security.sessions.endSession')}
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                {t('security.sessions.endAllOther')}
              </Button>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('security.account.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                {t('security.account.downloadData')}
              </Button>
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t('security.account.deleteAccount')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('security.password.changePassword')}</DialogTitle>
            <DialogDescription>
              {t('security.password.currentPassword')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t('security.password.currentPassword')}</Label>
              <Input type="password" className="mt-2" />
            </div>
            <div>
              <Label>{t('security.password.newPassword')}</Label>
              <Input type="password" className="mt-2" />
            </div>
            <div>
              <Label>{t('security.password.confirmPassword')}</Label>
              <Input type="password" className="mt-2" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              {t('security.buttons.cancel')}
            </Button>
            <Button onClick={() => setShowPasswordDialog(false)}>
              {t('security.password.changePassword')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2FA Dialog */}
      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {settings.twoFactorEnabled 
                ? t('security.twoFactor.disable')
                : t('security.twoFactor.enable')} 2FA
            </DialogTitle>
            <DialogDescription>
              {settings.twoFactorEnabled 
                ? t('security.twoFactor.disabledDescription')
                : t('security.twoFactor.enabledDescription')}
            </DialogDescription>
          </DialogHeader>
          {!settings.twoFactorEnabled && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-center text-2xl font-mono">QR CODE</p>
                <p className="text-center text-xs text-gray-500 mt-2">
                  {t('security.twoFactor.scanQR')}
                </p>
              </div>
              <div>
                <Label>{t('security.twoFactor.verificationCode')}</Label>
                <Input placeholder="000000" className="mt-2" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShow2FADialog(false)}>
              {t('security.buttons.cancel')}
            </Button>
            <Button 
              variant={settings.twoFactorEnabled ? 'destructive' : 'default'}
              onClick={() => {
                handleToggle('twoFactorEnabled')
                setShow2FADialog(false)
              }}
            >
              {settings.twoFactorEnabled 
                ? t('security.twoFactor.disable')
                : t('security.twoFactor.enable')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('security.account.deleteWarning.title')}</DialogTitle>
            <DialogDescription>
              {t('security.account.deleteWarning.description')}
            </DialogDescription>
          </DialogHeader>
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <strong>{t('security.account.deleteWarning.warning')}</strong> 
              {t('security.account.deleteWarning.consequences')}
              <ul className="list-disc ml-5 mt-2 text-sm">
                <li>{t('security.account.deleteWarning.dataLoss')}</li>
                <li>{t('security.account.deleteWarning.bookingsCancelled')}</li>
                <li>{t('security.account.deleteWarning.historyDeleted')}</li>
                <li>{t('security.account.deleteWarning.noRecovery')}</li>
              </ul>
            </AlertDescription>
          </Alert>
          <div>
            <Label>{t('security.account.deleteWarning.confirmText')}</Label>
            <Input placeholder={t('security.account.deleteWarning.confirmPlaceholder')} className="mt-2" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              {t('security.buttons.cancel')}
            </Button>
            <Button variant="destructive" disabled>
              {t('security.account.deleteAccount')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}