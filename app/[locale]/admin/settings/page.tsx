
// app/[locale]/admin/settings/page.tsx
'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Settings, Building, Bell, CreditCard, Shield, Link2,
  Globe, Mail, Phone, MapPin, Clock, Calendar, User,
  Database, Server, Wifi, Smartphone, Monitor, Key,
  Lock, Eye, EyeOff, Save, RefreshCw, AlertCircle,
  CheckCircle, Info, Upload, Download, Trash2, Plus,
  Edit2, Copy, ExternalLink, Zap, MessageSquare,
  DollarSign, Users, Car, FileText, ChevronRight,
  ToggleLeft, ToggleRight, Loader2
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminSettingsPage() {
  const t = useTranslations('admin.settings');
  
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    schoolName: 'Szkoła Jazdy Drive',
    email: 'info@drive-school.com',
    phone: '+48 22 123 45 67',
    website: 'https://drive-school.com',
    address: 'ul. Marszałkowska 1, Warszawa, 00-001',
    timezone: 'Europe/Warsaw',
    language: 'pl',
    currency: 'PLN',
    registrationNumber: '№123456',
    taxNumber: '1234567890',
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    workingHours: { start: '08:00', end: '20:00' },
    maintenanceMode: false
  });

  const [schoolSettings, setSchoolSettings] = useState({
    lessonDuration: 90,
    bufferTime: 15,
    maxAdvanceBooking: 30,
    minAdvanceBooking: 24,
    cancellationPeriod: 24,
    allowWeekendBookings: true,
    allowNightLessons: true,
    requireMedicalCertificate: true,
    requireTheoryPass: false,
    maxStudentsPerInstructor: 30,
    minAge: 17.5,
    examPassRate: 78,
    averageCompletionTime: 45
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: true,
    bookingConfirmation: true,
    bookingReminder: true,
    reminderTime: 24,
    cancellationAlert: true,
    paymentReminder: true,
    newsletterEnabled: false,
    marketingEnabled: false,
    adminAlerts: true,
    instructorNotifications: true,
    studentNotifications: true
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    stripePublicKey: 'pk_test_...',
    stripeSecretKey: 'sk_test_...',
    przelewy24Enabled: true,
    przelewy24MerchantId: '12345',
    przelewy24CRC: 'abc123',
    paypalEnabled: false,
    cashEnabled: true,
    bankTransferEnabled: true,
    taxRate: 23,
    invoicePrefix: 'FV',
    autoInvoice: true,
    paymentTerms: 7,
    lateFeePercentage: 5,
    refundPolicy: 'full_24h'
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumber: true,
    passwordRequireSpecial: true,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    ipWhitelist: [],
    allowApiAccess: true,
    apiRateLimit: 1000,
    backupEnabled: true,
    backupFrequency: 'daily',
    dataRetention: 365,
    gdprCompliant: true
  });

  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: 'Google Calendar',
      icon: Calendar,
      description: t('integrations.services.googleCalendar.description'),
      enabled: true,
      configured: true,
      lastSync: new Date('2024-01-15T10:30:00')
    },
    {
      id: 2,
      name: 'Zoom',
      icon: Monitor,
      description: t('integrations.services.zoom.description'),
      enabled: false,
      configured: false,
      lastSync: null
    },
    {
      id: 3,
      name: 'Mailchimp',
      icon: Mail,
      description: t('integrations.services.mailchimp.description'),
      enabled: true,
      configured: true,
      lastSync: new Date('2024-01-14T15:45:00')
    },
    {
      id: 4,
      name: 'Facebook Pixel',
      icon: Globe,
      description: t('integrations.services.facebookPixel.description'),
      enabled: true,
      configured: true,
      lastSync: null
    },
    {
      id: 5,
      name: 'Google Analytics',
      icon: FileText,
      description: t('integrations.services.googleAnalytics.description'),
      enabled: true,
      configured: true,
      lastSync: null
    },
    {
      id: 6,
      name: 'Telegram Bot',
      icon: MessageSquare,
      description: t('integrations.services.telegramBot.description'),
      enabled: false,
      configured: false,
      lastSync: null
    }
  ]);

  const branches = [
    {
      id: 1,
      name: 'Warszawa - Centrum',
      address: 'ul. Marszałkowska 1',
      phone: '+48 22 123 45 67',
      manager: 'Aleksander Petrak',
      active: true
    },
    {
      id: 2,
      name: 'Warszawa - Mokotów',
      address: 'al. Wilanowska 24',
      phone: '+48 22 234 56 78',
      manager: 'Maria Kowalczyk',
      active: true
    },
    {
      id: 3,
      name: 'Wrocław - Centrum',
      address: 'Rynek 1',
      phone: '+48 71 345 67 89',
      manager: 'Jan Kowalski',
      active: true
    }
  ];

  const emailTemplates = [
    {
      id: 1,
      name: 'Potwierdzenie rezerwacji',
      subject: 'Twoja lekcja została potwierdzona',
      type: 'booking_confirmation',
      lastModified: new Date('2024-01-10')
    },
    {
      id: 2,
      name: 'Przypomnienie o lekcji',
      subject: 'Przypomnienie: lekcja jutro',
      type: 'lesson_reminder',
      lastModified: new Date('2024-01-08')
    },
    {
      id: 3,
      name: 'Anulowanie lekcji',
      subject: 'Twoja lekcja została anulowana',
      type: 'lesson_cancelled',
      lastModified: new Date('2024-01-05')
    },
    {
      id: 4,
      name: 'Powitanie po rejestracji',
      subject: 'Witamy w Szkole Jazdy Drive',
      type: 'welcome',
      lastModified: new Date('2023-12-20')
    }
  ];

  const handleSaveSettings = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'general', name: t('tabs.general'), icon: Settings },
    { id: 'school', name: t('tabs.school'), icon: Building },
    { id: 'notifications', name: t('tabs.notifications'), icon: Bell },
    { id: 'payments', name: t('tabs.payments'), icon: CreditCard },
    { id: 'security', name: t('tabs.security'), icon: Shield },
    { id: 'integrations', name: t('tabs.integrations'), icon: Link2 },
    { id: 'branches', name: t('tabs.branches'), icon: MapPin },
    { id: 'templates', name: t('tabs.templates'), icon: Mail }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            {t('buttons.export')}
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {t('buttons.import')}
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('buttons.saving')}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {t('buttons.save')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-700">{t('messages.saveSuccess')}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('general.title')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('general.fields.schoolName')}
                  </label>
                  <input
                    type="text"
                    value={generalSettings.schoolName}
                    onChange={(e) => setGeneralSettings({...generalSettings, schoolName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('general.fields.email')}
                  </label>
                  <input
                    type="email"
                    value={generalSettings.email}
                    onChange={(e) => setGeneralSettings({...generalSettings, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('general.fields.phone')}
                  </label>
                  <input
                    type="tel"
                    value={generalSettings.phone}
                    onChange={(e) => setGeneralSettings({...generalSettings, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('general.fields.website')}
                  </label>
                  <input
                    type="url"
                    value={generalSettings.website}
                    onChange={(e) => setGeneralSettings({...generalSettings, website: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('general.fields.address')}
                  </label>
                  <textarea
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('general.fields.timezone')}
                  </label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Europe/Warsaw">{t('general.timezones.warsaw')}</option>
                    <option value="Europe/Kyiv">{t('general.timezones.kyiv')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('general.fields.language')}
                  </label>
                  <select
                    value={generalSettings.language}
                    onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pl">{t('general.languages.pl')}</option>
                    <option value="en">{t('general.languages.en')}</option>
                    <option value="uk">{t('general.languages.uk')}</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">{t('general.maintenanceMode.title')}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('general.maintenanceMode.description')}
                    </p>
                    <button
                      onClick={() => setGeneralSettings({...generalSettings, maintenanceMode: !generalSettings.maintenanceMode})}
                      className="mt-3 flex items-center gap-2"
                    >
                      {generalSettings.maintenanceMode ? (
                        <ToggleRight className="w-8 h-5 text-blue-600" />
                      ) : (
                        <ToggleLeft className="w-8 h-5 text-gray-400" />
                      )}
                      <span className="text-sm font-medium">
                        {generalSettings.maintenanceMode ? t('general.maintenanceMode.enabled') : t('general.maintenanceMode.disabled')}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* School Settings */}
          {activeTab === 'school' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('school.title')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('school.fields.lessonDuration')}
                  </label>
                  <input
                    type="number"
                    value={schoolSettings.lessonDuration}
                    onChange={(e) => setSchoolSettings({...schoolSettings, lessonDuration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('school.fields.bufferTime')}
                  </label>
                  <input
                    type="number"
                    value={schoolSettings.bufferTime}
                    onChange={(e) => setSchoolSettings({...schoolSettings, bufferTime: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('school.fields.maxAdvanceBooking')}
                  </label>
                  <input
                    type="number"
                    value={schoolSettings.maxAdvanceBooking}
                    onChange={(e) => setSchoolSettings({...schoolSettings, maxAdvanceBooking: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('school.fields.minAdvanceBooking')}
                  </label>
                  <input
                    type="number"
                    value={schoolSettings.minAdvanceBooking}
                    onChange={(e) => setSchoolSettings({...schoolSettings, minAdvanceBooking: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('school.fields.cancellationPeriod')}
                  </label>
                  <input
                    type="number"
                    value={schoolSettings.cancellationPeriod}
                    onChange={(e) => setSchoolSettings({...schoolSettings, cancellationPeriod: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('school.fields.minAge')}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={schoolSettings.minAge}
                    onChange={(e) => setSchoolSettings({...schoolSettings, minAge: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={schoolSettings.allowWeekendBookings}
                    onChange={(e) => setSchoolSettings({...schoolSettings, allowWeekendBookings: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {t('school.permissions.allowWeekendBookings')}
                  </span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={schoolSettings.allowNightLessons}
                    onChange={(e) => setSchoolSettings({...schoolSettings, allowNightLessons: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {t('school.permissions.allowNightLessons')}
                  </span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={schoolSettings.requireMedicalCertificate}
                    onChange={(e) => setSchoolSettings({...schoolSettings, requireMedicalCertificate: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {t('school.permissions.requireMedicalCertificate')}
                  </span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={schoolSettings.requireTheoryPass}
                    onChange={(e) => setSchoolSettings({...schoolSettings, requireTheoryPass: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {t('school.permissions.requireTheoryPass')}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('notifications.title')}</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">{t('notifications.channels.title')}</h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{t('notifications.channels.email')}</span>
                      <button
                        onClick={() => setNotificationSettings({...notificationSettings, emailEnabled: !notificationSettings.emailEnabled})}
                      >
                        {notificationSettings.emailEnabled ? (
                          <ToggleRight className="w-8 h-5 text-blue-600" />
                        ) : (
                          <ToggleLeft className="w-8 h-5 text-gray-400" />
                        )}
                      </button>
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{t('notifications.channels.sms')}</span>
                      <button
                        onClick={() => setNotificationSettings({...notificationSettings, smsEnabled: !notificationSettings.smsEnabled})}
                      >
                        {notificationSettings.smsEnabled ? (
                          <ToggleRight className="w-8 h-5 text-blue-600" />
                        ) : (
                          <ToggleLeft className="w-8 h-5 text-gray-400" />
                        )}
                      </button>
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{t('notifications.channels.push')}</span>
                      <button
                        onClick={() => setNotificationSettings({...notificationSettings, pushEnabled: !notificationSettings.pushEnabled})}
                      >
                        {notificationSettings.pushEnabled ? (
                          <ToggleRight className="w-8 h-5 text-blue-600" />
                        ) : (
                          <ToggleLeft className="w-8 h-5 text-gray-400" />
                        )}
                      </button>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">{t('notifications.types.title')}</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={notificationSettings.bookingConfirmation}
                        onChange={(e) => setNotificationSettings({...notificationSettings, bookingConfirmation: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{t('notifications.types.bookingConfirmation')}</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={notificationSettings.bookingReminder}
                        onChange={(e) => setNotificationSettings({...notificationSettings, bookingReminder: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{t('notifications.types.bookingReminder')}</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={notificationSettings.cancellationAlert}
                        onChange={(e) => setNotificationSettings({...notificationSettings, cancellationAlert: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{t('notifications.types.cancellationAlert')}</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={notificationSettings.paymentReminder}
                        onChange={(e) => setNotificationSettings({...notificationSettings, paymentReminder: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{t('notifications.types.paymentReminder')}</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('notifications.reminderTime')}
                  </label>
                  <input
                    type="number"
                    value={notificationSettings.reminderTime}
                    onChange={(e) => setNotificationSettings({...notificationSettings, reminderTime: parseInt(e.target.value)})}
                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('payments.title')}</h3>
              
              <div className="space-y-4">
                {/* Payment Providers */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">{t('payments.providers.title')}</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-800">{t('payments.providers.stripe.name')}</p>
                          <p className="text-sm text-gray-500">{t('payments.providers.stripe.description')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPaymentSettings({...paymentSettings, stripeEnabled: !paymentSettings.stripeEnabled})}
                      >
                        {paymentSettings.stripeEnabled ? (
                          <ToggleRight className="w-8 h-5 text-blue-600" />
                        ) : (
                          <ToggleLeft className="w-8 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between pb-3 border-b">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-800">{t('payments.providers.przelewy24.name')}</p>
                          <p className="text-sm text-gray-500">{t('payments.providers.przelewy24.description')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPaymentSettings({...paymentSettings, przelewy24Enabled: !paymentSettings.przelewy24Enabled})}
                      >
                        {paymentSettings.przelewy24Enabled ? (
                          <ToggleRight className="w-8 h-5 text-blue-600" />
                        ) : (
                          <ToggleLeft className="w-8 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between pb-3 border-b">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-800">{t('payments.providers.cash.name')}</p>
                          <p className="text-sm text-gray-500">{t('payments.providers.cash.description')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPaymentSettings({...paymentSettings, cashEnabled: !paymentSettings.cashEnabled})}
                      >
                        {paymentSettings.cashEnabled ? (
                          <ToggleRight className="w-8 h-5 text-blue-600" />
                        ) : (
                          <ToggleLeft className="w-8 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tax and Invoice Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('payments.fields.taxRate')}
                    </label>
                    <input
                      type="number"
                      value={paymentSettings.taxRate}
                      onChange={(e) => setPaymentSettings({...paymentSettings, taxRate: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('payments.fields.invoicePrefix')}
                    </label>
                    <input
                      type="text"
                      value={paymentSettings.invoicePrefix}
                      onChange={(e) => setPaymentSettings({...paymentSettings, invoicePrefix: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('payments.fields.paymentTerms')}
                    </label>
                    <input
                      type="number"
                      value={paymentSettings.paymentTerms}
                      onChange={(e) => setPaymentSettings({...paymentSettings, paymentTerms: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('payments.fields.lateFeePercentage')}
                    </label>
                    <input
                      type="number"
                      value={paymentSettings.lateFeePercentage}
                      onChange={(e) => setPaymentSettings({...paymentSettings, lateFeePercentage: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('security.title')}</h3>
              
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">{t('security.warning.title')}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('security.warning.description')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('security.fields.sessionTimeout')}
                    </label>
                    <input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('security.fields.maxLoginAttempts')}
                    </label>
                    <input
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">{t('security.passwordRequirements.title')}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{t('security.passwordRequirements.minLength', {length: securitySettings.passwordMinLength})}</span>
                      <input
                        type="range"
                        min="6"
                        max="20"
                        value={securitySettings.passwordMinLength}
                        onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                        className="w-32"
                      />
                    </div>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={securitySettings.passwordRequireUppercase}
                        onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireUppercase: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{t('security.passwordRequirements.requireUppercase')}</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={securitySettings.passwordRequireNumber}
                        onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireNumber: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{t('security.passwordRequirements.requireNumber')}</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={securitySettings.passwordRequireSpecial}
                        onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireSpecial: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{t('security.passwordRequirements.requireSpecial')}</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">{t('security.backup.title')}</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">{t('security.backup.autoBackup')}</p>
                      <p className="text-xs text-gray-500 mt-1">{t('security.backup.lastBackup')}</p>
                    </div>
                    <select
                      value={securitySettings.backupFrequency}
                      onChange={(e) => setSecuritySettings({...securitySettings, backupFrequency: e.target.value})}
                      className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="daily">{t('security.backup.frequency.daily')}</option>
                      <option value="weekly">{t('security.backup.frequency.weekly')}</option>
                      <option value="monthly">{t('security.backup.frequency.monthly')}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('integrations.title')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration) => {
                  const Icon = integration.icon;
                  return (
                    <div key={integration.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{integration.name}</h4>
                            <p className="text-sm text-gray-500">{integration.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const updated = integrations.map(i => 
                              i.id === integration.id ? {...i, enabled: !i.enabled} : i
                            );
                            setIntegrations(updated);
                          }}
                        >
                          {integration.enabled ? (
                            <ToggleRight className="w-8 h-5 text-blue-600" />
                          ) : (
                            <ToggleLeft className="w-8 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className={`inline-flex items-center gap-1 ${
                          integration.configured ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {integration.configured ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              {t('integrations.configured')}
                            </>
                          ) : (
                            <>
                              <Info className="w-3 h-3" />
                              {t('integrations.notConfigured')}
                            </>
                          )}
                        </span>
                        
                        {integration.lastSync && (
                          <span className="text-xs text-gray-500">
                            {t('integrations.lastSync')} {format(integration.lastSync, 'dd.MM HH:mm')}
                          </span>
                        )}
                      </div>
                      
                      <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        {t('integrations.configure')}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Branches */}
          {activeTab === 'branches' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">{t('branches.title')}</h3>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" />
                  {t('branches.addBranch')}
                </button>
              </div>
              
              <div className="space-y-3">
                {branches.map((branch) => (
                  <div key={branch.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{branch.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">{branch.address}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {branch.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {branch.manager}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          branch.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {branch.active ? t('branches.status.active') : t('branches.status.inactive')}
                        </span>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Templates */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">{t('templates.title')}</h3>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" />
                  {t('templates.newTemplate')}
                </button>
              </div>
              
              <div className="space-y-3">
                {emailTemplates.map((template) => (
                  <div key={template.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{template.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">{t('templates.subject')} {template.subject}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {t('templates.lastModified')} {format(template.lastModified, 'dd.MM.yyyy')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Copy className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}