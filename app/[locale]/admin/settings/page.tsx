// app/[locale]/admin/settings/page.tsx
"use client";

import React, { useState } from 'react';
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
      description: 'Synchronizacja harmonogramu z Google Calendar',
      enabled: true,
      configured: true,
      lastSync: new Date('2024-01-15T10:30:00')
    },
    {
      id: 2,
      name: 'Zoom',
      icon: Monitor,
      description: 'Zajęcia online przez Zoom',
      enabled: false,
      configured: false,
      lastSync: null
    },
    {
      id: 3,
      name: 'Mailchimp',
      icon: Mail,
      description: 'Email marketing i kampanie',
      enabled: true,
      configured: true,
      lastSync: new Date('2024-01-14T15:45:00')
    },
    {
      id: 4,
      name: 'Facebook Pixel',
      icon: Globe,
      description: 'Śledzenie konwersji',
      enabled: true,
      configured: true,
      lastSync: null
    },
    {
      id: 5,
      name: 'Google Analytics',
      icon: FileText,
      description: 'Analityka ruchu na stronie',
      enabled: true,
      configured: true,
      lastSync: null
    },
    {
      id: 6,
      name: 'Telegram Bot',
      icon: MessageSquare,
      description: 'Powiadomienia przez Telegram',
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
    { id: 'general', name: 'Ogólne', icon: Settings },
    { id: 'school', name: 'Szkoła', icon: Building },
    { id: 'notifications', name: 'Powiadomienia', icon: Bell },
    { id: 'payments', name: 'Płatności', icon: CreditCard },
    { id: 'security', name: 'Bezpieczeństwo', icon: Shield },
    { id: 'integrations', name: 'Integracje', icon: Link2 },
    { id: 'branches', name: 'Filie', icon: MapPin },
    { id: 'templates', name: 'Szablony', icon: Mail }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Ustawienia</h1>
          <p className="text-gray-600 mt-1">Ustawienia systemowe i konfiguracja</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Eksport
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Zapisz
          </button>
        </div>
      </div>

      {/* Success message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-700">Ustawienia zostały pomyślnie zapisane!</p>
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ustawienia ogólne</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nazwa szkoły
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
                    Email
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
                    Telefon
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
                    Strona internetowa
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
                    Adres
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
                    Strefa czasowa
                  </label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Europe/Warsaw">Warszawa (UTC+1)</option>
                    <option value="Europe/Kyiv">Kijów (UTC+2)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Język
                  </label>
                  <select
                    value={generalSettings.language}
                    onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pl">Polski</option>
                    <option value="en">English</option>
                    <option value="uk">Українська</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">Tryb konserwacji</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Tymczasowo wyłącz dostęp użytkowników podczas prac technicznych
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
                        {generalSettings.maintenanceMode ? 'Włączony' : 'Wyłączony'}
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ustawienia szkoły</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Czas trwania lekcji (minuty)
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
                    Czas bufora między lekcjami (minuty)
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
                    Maks. rezerwacja z wyprzedzeniem (dni)
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
                    Min. czas do rezerwacji (godziny)
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
                    Okres anulowania (godziny)
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
                    Minimalny wiek
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
                    Zezwalaj na rezerwacje weekendowe
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
                    Zezwalaj na lekcje nocne
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
                    Wymagaj zaświadczenia lekarskiego
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
                    Wymagaj zdania teorii przed praktyką
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ustawienia powiadomień</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Kanały powiadomień</h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Powiadomienia email</span>
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
                      <span className="text-sm font-medium text-gray-700">Powiadomienia SMS</span>
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
                      <span className="text-sm font-medium text-gray-700">Powiadomienia push</span>
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
                  <h4 className="font-medium text-gray-800 mb-3">Typy powiadomień</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={notificationSettings.bookingConfirmation}
                        onChange={(e) => setNotificationSettings({...notificationSettings, bookingConfirmation: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Potwierdzenie rezerwacji</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={notificationSettings.bookingReminder}
                        onChange={(e) => setNotificationSettings({...notificationSettings, bookingReminder: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Przypomnienie o lekcji</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={notificationSettings.cancellationAlert}
                        onChange={(e) => setNotificationSettings({...notificationSettings, cancellationAlert: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Powiadomienie o anulowaniu</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={notificationSettings.paymentReminder}
                        onChange={(e) => setNotificationSettings({...notificationSettings, paymentReminder: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Przypomnienie o płatności</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Czas przypomnienia przed lekcją (godziny)
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ustawienia płatności</h3>
              
              <div className="space-y-4">
                {/* Payment Providers */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Systemy płatności</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-800">Stripe</p>
                          <p className="text-sm text-gray-500">Karty Visa, Mastercard</p>
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
                          <p className="font-medium text-gray-800">Przelewy24</p>
                          <p className="text-sm text-gray-500">Polskie przelewy bankowe</p>
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
                          <p className="font-medium text-gray-800">Gotówka</p>
                          <p className="text-sm text-gray-500">Płatność gotówką w biurze</p>
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
                      Stawka podatku (%)
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
                      Prefiks faktur
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
                      Termin płatności (dni)
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
                      Kara za opóźnienie (%)
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ustawienia bezpieczeństwa</h3>
              
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">Ważne</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Zmiana ustawień bezpieczeństwa może wpłynąć na dostęp użytkowników do systemu
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timeout sesji (minuty)
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
                      Maks. prób logowania
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
                  <h4 className="font-medium text-gray-800 mb-3">Wymagania dla hasła</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Minimalna długość: {securitySettings.passwordMinLength} znaków</span>
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
                      <span className="text-sm text-gray-700">Wymagaj wielkich liter</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={securitySettings.passwordRequireNumber}
                        onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireNumber: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Wymagaj cyfr</span>
                    </label>
                    
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={securitySettings.passwordRequireSpecial}
                        onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireSpecial: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Wymagaj znaków specjalnych</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Kopia zapasowa</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">Automatyczna kopia zapasowa</p>
                      <p className="text-xs text-gray-500 mt-1">Ostatnia: wczoraj, 02:00</p>
                    </div>
                    <select
                      value={securitySettings.backupFrequency}
                      onChange={(e) => setSecuritySettings({...securitySettings, backupFrequency: e.target.value})}
                      className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="daily">Codziennie</option>
                      <option value="weekly">Co tydzień</option>
                      <option value="monthly">Co miesiąc</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Integracje</h3>
              
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
                              Skonfigurowane
                            </>
                          ) : (
                            <>
                              <Info className="w-3 h-3" />
                              Nie skonfigurowane
                            </>
                          )}
                        </span>
                        
                        {integration.lastSync && (
                          <span className="text-xs text-gray-500">
                            Ostatnia synchronizacja: {format(integration.lastSync, 'dd.MM HH:mm')}
                          </span>
                        )}
                      </div>
                      
                      <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Skonfiguruj →
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
                <h3 className="text-lg font-semibold text-gray-800">Filie</h3>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" />
                  Dodaj filię
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
                          {branch.active ? 'Aktywna' : 'Nieaktywna'}
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
                <h3 className="text-lg font-semibold text-gray-800">Szablony wiadomości</h3>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" />
                  Nowy szablon
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
                          <p className="text-sm text-gray-500 mt-1">Temat: {template.subject}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Ostatnie zmiany: {format(template.lastModified, 'dd.MM.yyyy')}
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