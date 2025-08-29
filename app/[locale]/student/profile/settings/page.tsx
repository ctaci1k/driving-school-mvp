// Шлях: /app/[locale]/student/profile/settings/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  ArrowLeft,
  Save,
  Shield,
  Lock,
  Key,
  Smartphone,
  Globe,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Mail,
  User,
  CreditCard,
  LogOut,
  Trash2,
  AlertTriangle,
  Check,
  X,
  Download,
  Upload,
  Bell,
  Languages,
  Palette,
  Monitor,
  HelpCircle,
  ChevronRight,
  Copy,
  ExternalLink,
  Info,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Mock settings data
const mockSettings = {
  account: {
    email: 'jan.kowalski@example.com',
    emailVerified: true,
    phone: '+48 601 234 567',
    phoneVerified: true,
    username: 'jan.kowalski',
    accountCreated: '2024-06-01',
    lastLogin: '2024-08-27 14:30',
    loginMethod: 'email'
  },
  security: {
    twoFactorEnabled: false,
    twoFactorMethod: 'sms',
    lastPasswordChange: '2024-06-01',
    passwordStrength: 'strong',
    activeSessions: 2,
    trustedDevices: [
      { id: '1', name: 'iPhone 13', lastUsed: '2024-08-27', current: true },
      { id: '2', name: 'MacBook Pro', lastUsed: '2024-08-26', current: false }
    ]
  },
  privacy: {
    profileVisibility: 'instructors',
    showProgress: true,
    allowAnalytics: true,
    allowMarketing: false,
    dataRetention: 'default',
    shareWithPartners: false
  },
  appearance: {
    theme: 'light',
    language: 'uk',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    fontSize: 'medium',
    reduceAnimations: false
  },
  billing: {
    defaultPaymentMethod: 'card',
    autoRenew: false,
    invoiceEmail: 'jan.kowalski@example.com',
    vatNumber: '',
    billingAddress: {
      street: 'ul. Wilanowska 89/15',
      city: 'Warszawa',
      postalCode: '02-765',
      country: 'Polska'
    }
  }
};

export default function SettingsPage() {
  const router = useRouter();
  const t = useTranslations('student.profileSettings');
  const [settings, setSettings] = useState(mockSettings);
  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert(t('security.passwordMismatch'));
      return;
    }
    // Handle password change logic
    console.log('Changing password');
  };

  const handleEnable2FA = () => {
    setShow2FADialog(true);
  };

  const handleDeleteAccount = () => {
    console.log('Deleting account...');
    setShowDeleteDialog(false);
  };

  const handleExportData = () => {
    console.log('Exporting user data...');
  };

  const getPasswordStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPasswordStrengthWidth = (strength: string) => {
    switch (strength) {
      case 'weak': return 33;
      case 'medium': return 66;
      case 'strong': return 100;
      default: return 0;
    }
  };

  const languages = [
    { value: 'pl', label: t('languages.polish') },
    { value: 'en', label: t('languages.english') },
    { value: 'uk', label: t('languages.ukrainian') },
    { value: 'ru', label: t('languages.russian') }
  ];

  const themes = [
    { value: 'light', label: t('themes.light'), icon: Sun },
    { value: 'dark', label: t('themes.dark'), icon: Moon },
    { value: 'auto', label: t('themes.auto'), icon: Monitor }
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/student/profile')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-600">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="account">{t('tabs.account')}</TabsTrigger>
          <TabsTrigger value="security">{t('tabs.security')}</TabsTrigger>
          <TabsTrigger value="privacy">{t('tabs.privacy')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('tabs.appearance')}</TabsTrigger>
          <TabsTrigger value="billing">{t('tabs.billing')}</TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('account.title')}</CardTitle>
              <CardDescription>{t('account.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t('account.email')}</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input value={settings.account.email} disabled />
                  {settings.account.emailVerified ? (
                    <Badge className="bg-green-100 text-green-700">
                      <Check className="h-3 w-3 mr-1" />
                      {t('account.verified')}
                    </Badge>
                  ) : (
                    <Button size="sm">{t('account.verify')}</Button>
                  )}
                </div>
              </div>

              <div>
                <Label>{t('account.phone')}</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input value={settings.account.phone} />
                  {settings.account.phoneVerified ? (
                    <Badge className="bg-green-100 text-green-700">
                      <Check className="h-3 w-3 mr-1" />
                      {t('account.verified')}
                    </Badge>
                  ) : (
                    <Button size="sm">{t('account.verify')}</Button>
                  )}
                </div>
              </div>

              <div>
                <Label>{t('account.username')}</Label>
                <Input value={settings.account.username} className="mt-2" />
                <p className="text-xs text-gray-500 mt-1">{t('account.usernameHint')}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">{t('account.accountCreated')}</p>
                  <p className="font-medium">{settings.account.accountCreated}</p>
                </div>
                <div>
                  <p className="text-gray-600">{t('account.lastLogin')}</p>
                  <p className="font-medium">{settings.account.lastLogin}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  {t('account.exportData')}
                </Button>
                <Button variant="outline" className="flex-1">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('account.logout')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">{t('dangerZone.title')}</CardTitle>
              <CardDescription>{t('dangerZone.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('dangerZone.deleteAccount')}
              </Button>
              <p className="text-xs text-gray-500 text-center">{t('dangerZone.deleteWarning')}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('security.passwordTitle')}</CardTitle>
              <CardDescription>{t('security.lastChange', {date: settings.security.lastPasswordChange})}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t('security.currentPassword')}</Label>
                <div className="relative mt-2">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label>{t('security.newPassword')}</Label>
                <div className="relative mt-2">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{t('security.passwordStrength')}</span>
                    <span>{t(`security.strength.${settings.security.passwordStrength}`)}</span>
                  </div>
                  <Progress 
                    value={getPasswordStrengthWidth(settings.security.passwordStrength)} 
                    className="h-2"
                  />
                </div>
              </div>

              <div>
                <Label>{t('security.confirmPassword')}</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button onClick={handlePasswordChange} className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                {t('security.changePassword')}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('security.twoFactorTitle')}</CardTitle>
              <CardDescription>{t('security.twoFactorDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.security.twoFactorEnabled ? (
                <>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{t('security.twoFactorEnabled')}</p>
                        <p className="text-sm text-gray-600">{t('security.method')}: {t(`security.methods.${settings.security.twoFactorMethod}`)}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">{t('security.active')}</Badge>
                  </div>
                  <Button variant="outline" className="w-full">{t('security.changeMethod')}</Button>
                  <Button variant="outline" className="w-full">{t('security.disable2FA')}</Button>
                </>
              ) : (
                <>
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>{t('security.twoFactorInfo')}</AlertDescription>
                  </Alert>
                  <Button onClick={handleEnable2FA} className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    {t('security.enable2FA')}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('security.sessionsTitle')}</CardTitle>
              <CardDescription>{t('security.sessionsDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {settings.security.trustedDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <p className="text-sm text-gray-600">
                        {t('security.lastUsed')}: {device.lastUsed}
                      </p>
                    </div>
                  </div>
                  {device.current ? (
                    <Badge className="bg-blue-100 text-blue-700">{t('security.current')}</Badge>
                  ) : (
                    <Button variant="ghost" size="sm">{t('security.logout')}</Button>
                  )}
                </div>
              ))}
              <Button variant="outline" className="w-full">{t('security.logoutAll')}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('privacy.visibilityTitle')}</CardTitle>
              <CardDescription>{t('privacy.visibilityDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={settings.privacy.profileVisibility}
                onValueChange={(value) => updateSetting('privacy', 'profileVisibility', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="everyone" id="everyone" />
                  <Label htmlFor="everyone">{t('privacy.visibility.everyone')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="instructors" id="instructors" />
                  <Label htmlFor="instructors">{t('privacy.visibility.instructors')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private">{t('privacy.visibility.private')}</Label>
                </div>
              </RadioGroup>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('privacy.showProgress')}</Label>
                    <p className="text-sm text-gray-600">{t('privacy.showProgressDescription')}</p>
                  </div>
                  <Switch
                    checked={settings.privacy.showProgress}
                    onCheckedChange={(checked) => updateSetting('privacy', 'showProgress', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('privacy.dataTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t('privacy.analytics')}</Label>
                  <p className="text-sm text-gray-600">{t('privacy.analyticsDescription')}</p>
                </div>
                <Switch
                  checked={settings.privacy.allowAnalytics}
                  onCheckedChange={(checked) => updateSetting('privacy', 'allowAnalytics', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t('privacy.marketing')}</Label>
                  <p className="text-sm text-gray-600">{t('privacy.marketingDescription')}</p>
                </div>
                <Switch
                  checked={settings.privacy.allowMarketing}
                  onCheckedChange={(checked) => updateSetting('privacy', 'allowMarketing', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t('privacy.sharePartners')}</Label>
                  <p className="text-sm text-gray-600">{t('privacy.sharePartnersDescription')}</p>
                </div>
                <Switch
                  checked={settings.privacy.shareWithPartners}
                  onCheckedChange={(checked) => updateSetting('privacy', 'shareWithPartners', checked)}
                />
              </div>

              <Separator />

              <div>
                <Label>{t('privacy.dataRetention')}</Label>
                <Select
                  value={settings.privacy.dataRetention}
                  onValueChange={(value) => updateSetting('privacy', 'dataRetention', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimum">{t('privacy.retention.minimum')}</SelectItem>
                    <SelectItem value="default">{t('privacy.retention.default')}</SelectItem>
                    <SelectItem value="extended">{t('privacy.retention.extended')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="w-full" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                {t('privacy.downloadData')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('appearance.themeTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={settings.appearance.theme}
                onValueChange={(value) => updateSetting('appearance', 'theme', value)}
              >
                <div className="grid grid-cols-3 gap-3">
                  {themes.map((theme) => {
                    const Icon = theme.icon;
                    return (
                      <div key={theme.value}>
                        <RadioGroupItem
                          value={theme.value}
                          id={theme.value}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={theme.value}
                          className="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50"
                        >
                          <Icon className="h-6 w-6 mb-2" />
                          <span className="text-sm">{theme.label}</span>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('appearance.languageTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t('appearance.language')}</Label>
                <Select
                  value={settings.appearance.language}
                  onValueChange={(value) => updateSetting('appearance', 'language', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('appearance.dateFormat')}</Label>
                  <Select
                    value={settings.appearance.dateFormat}
                    onValueChange={(value) => updateSetting('appearance', 'dateFormat', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{t('appearance.timeFormat')}</Label>
                  <Select
                    value={settings.appearance.timeFormat}
                    onValueChange={(value) => updateSetting('appearance', 'timeFormat', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">{t('appearance.time24h')}</SelectItem>
                      <SelectItem value="12h">{t('appearance.time12h')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('appearance.accessibilityTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t('appearance.fontSize')}</Label>
                <RadioGroup
                  value={settings.appearance.fontSize}
                  onValueChange={(value) => updateSetting('appearance', 'fontSize', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="small" id="small" />
                      <Label htmlFor="small">{t('appearance.fontSizeSmall')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">{t('appearance.fontSizeMedium')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="large" id="large" />
                      <Label htmlFor="large">{t('appearance.fontSizeLarge')}</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t('appearance.reduceAnimations')}</Label>
                  <p className="text-sm text-gray-600">{t('appearance.reduceAnimationsDescription')}</p>
                </div>
                <Switch
                  checked={settings.appearance.reduceAnimations}
                  onCheckedChange={(checked) => updateSetting('appearance', 'reduceAnimations', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('billing.paymentTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={settings.billing.defaultPaymentMethod}
                onValueChange={(value) => updateSetting('billing', 'defaultPaymentMethod', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">{t('billing.creditCard')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="blik" id="blik" />
                  <Label htmlFor="blik">BLIK</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="transfer" id="transfer" />
                  <Label htmlFor="transfer">{t('billing.bankTransfer')}</Label>
                </div>
              </RadioGroup>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t('billing.autoRenew')}</Label>
                  <p className="text-sm text-gray-600">{t('billing.autoRenewDescription')}</p>
                </div>
                <Switch
                  checked={settings.billing.autoRenew}
                  onCheckedChange={(checked) => updateSetting('billing', 'autoRenew', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('billing.invoiceTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t('billing.invoiceEmail')}</Label>
                <Input
                  value={settings.billing.invoiceEmail}
                  onChange={(e) => updateSetting('billing', 'invoiceEmail', e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>{t('billing.vatNumber')}</Label>
                <Input
                  value={settings.billing.vatNumber}
                  onChange={(e) => updateSetting('billing', 'vatNumber', e.target.value)}
                  className="mt-2"
                  placeholder="PL1234567890"
                />
              </div>

              <Separator />

              <div>
                <Label className="mb-3 block">{t('billing.billingAddress')}</Label>
                <div className="space-y-3">
                  <Input
                    value={settings.billing.billingAddress.street}
                    onChange={(e) => updateSetting('billing', 'billingAddress', {...settings.billing.billingAddress, street: e.target.value})}
                    placeholder={t('billing.streetPlaceholder')}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={settings.billing.billingAddress.postalCode}
                      onChange={(e) => updateSetting('billing', 'billingAddress', {...settings.billing.billingAddress, postalCode: e.target.value})}
                      placeholder={t('billing.postalCodePlaceholder')}
                    />
                    <Input
                      value={settings.billing.billingAddress.city}
                      onChange={(e) => updateSetting('billing', 'billingAddress', {...settings.billing.billingAddress, city: e.target.value})}
                      placeholder={t('billing.cityPlaceholder')}
                    />
                  </div>
                  <Input
                    value={settings.billing.billingAddress.country}
                    onChange={(e) => updateSetting('billing', 'billingAddress', {...settings.billing.billingAddress, country: e.target.value})}
                    placeholder={t('billing.countryPlaceholder')}
                  />
                </div>
              </div>

              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {t('billing.saveBillingData')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteDialog.title')}</DialogTitle>
            <DialogDescription>{t('deleteDialog.description')}</DialogDescription>
          </DialogHeader>
          
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>{t('deleteDialog.warning')}</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{t('deleteDialog.consequence1')}</li>
                <li>{t('deleteDialog.consequence2')}</li>
                <li>{t('deleteDialog.consequence3')}</li>
                <li>{t('deleteDialog.consequence4')}</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Label>{t('deleteDialog.confirmationLabel')}</Label>
            <Input placeholder={t('deleteDialog.confirmationPlaceholder')} />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              {t('deleteDialog.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              {t('deleteDialog.confirmDelete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2FA Setup Dialog */}
      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('twoFactorDialog.title')}</DialogTitle>
            <DialogDescription>{t('twoFactorDialog.description')}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <RadioGroup defaultValue="sms">
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="sms" id="sms-2fa" />
                <Label htmlFor="sms-2fa" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">{t('twoFactorDialog.sms')}</p>
                    <p className="text-sm text-gray-600">{t('twoFactorDialog.smsDescription')}</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="app" id="app-2fa" />
                <Label htmlFor="app-2fa" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">{t('twoFactorDialog.app')}</p>
                    <p className="text-sm text-gray-600">{t('twoFactorDialog.appDescription')}</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>{t('twoFactorDialog.info')}</AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShow2FADialog(false)}>
              {t('twoFactorDialog.cancel')}
            </Button>
            <Button onClick={() => {
              updateSetting('security', 'twoFactorEnabled', true);
              setShow2FADialog(false);
            }}>
              {t('twoFactorDialog.enable')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
