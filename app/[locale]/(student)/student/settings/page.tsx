// File: /app/[locale]/(student)/student/settings/page.tsx
'use client';

import React, { useState } from 'react';
import { 
  Settings, Bell, Globe, Moon, Sun, Smartphone, Volume2, 
  Mail, MessageSquare, Calendar, Clock, Car, Users, Map,
  Shield, Eye, Lock, Palette, Monitor, Zap, Wifi, WifiOff,
  Download, Upload, Trash2, RefreshCw, CheckCircle, AlertCircle,
  ChevronRight, Sliders, Gauge, Battery, Database,
  Accessibility, Languages, CreditCard, Receipt, HelpCircle,
  Play, Image, BarChart3, PieChart, TrendingUp
} from 'lucide-react';

export default function StudentSettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // General
    language: 'pl',
    timezone: 'Europe/Warsaw',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'PLN',
    
    // Appearance
    theme: 'light',
    fontSize: 'medium',
    colorScheme: 'blue',
    reduceMotion: false,
    highContrast: false,
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    
    // Notification types
    lessonReminders: true,
    paymentReminders: true,
    promotionalEmails: false,
    weeklyReports: true,
    instructorMessages: true,
    systemUpdates: false,
    
    // Lesson preferences
    reminderTime: '24h',
    autoBooking: false,
    preferredDuration: '90',
    bufferTime: '15',
    
    // Privacy
    profileVisibility: 'instructors',
    showProgress: true,
    shareStatistics: false,
    allowAnalytics: true,
    
    // Accessibility
    screenReader: false,
    keyboardNavigation: false,
    focusIndicator: true,
    textToSpeech: false,
    
    // Performance
    dataSync: 'wifi',
    imageQuality: 'high',
    cacheSize: '100',
    autoPlay: true,
    backgroundRefresh: true
  });

  const sections = [
    { id: 'general', label: 'Ogólne', icon: Settings },
    { id: 'appearance', label: 'Wygląd', icon: Palette },
    { id: 'notifications', label: 'Powiadomienia', icon: Bell },
    { id: 'lessons', label: 'Lekcje', icon: Car },
    { id: 'privacy', label: 'Prywatność', icon: Shield },
    { id: 'accessibility', label: 'Dostępność', icon: Accessibility },
    { id: 'performance', label: 'Wydajność', icon: Gauge },
    { id: 'data', label: 'Dane', icon: Database }
  ];

const handleToggle = (key: string) => {
  setSettings(prev => ({ ...prev, [key]: !(prev as any)[key] }));
};
  const handleSelect = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    // Reset to defaults
    console.log('Resetting settings to defaults');
    setShowResetModal(false);
  };

  const exportData = () => {
    console.log('Exporting user data');
    setShowDataExport(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Ustawienia</h1>
        <p className="text-gray-600">Dostosuj aplikację do swoich potrzeb</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <div className="bg-white rounded-xl shadow-sm p-2">
            {sections.map(section => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                  <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
                    activeSection === section.id ? 'rotate-90' : ''
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-4 bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Szybkie akcje</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowResetModal(true)}
                className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Przywróć domyślne
              </button>
              <button
                onClick={() => setShowDataExport(true)}
                className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Eksportuj dane
              </button>
              <button className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Pomoc
              </button>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* General Settings */}
            {activeSection === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Ustawienia ogólne</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Languages className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Język</p>
                        <p className="text-sm text-gray-500">Język interfejsu aplikacji</p>
                      </div>
                    </div>
                    <select 
                      value={settings.language}
                      onChange={(e) => handleSelect('language', e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pl">Polski</option>
                      <option value="en">English</option>
                      <option value="uk">Українська</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Strefa czasowa</p>
                        <p className="text-sm text-gray-500">Twoja lokalna strefa czasowa</p>
                      </div>
                    </div>
                    <select 
                      value={settings.timezone}
                      onChange={(e) => handleSelect('timezone', e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Europe/Warsaw">Warszawa (GMT+1)</option>
                      <option value="Europe/London">Londyn (GMT)</option>
                      <option value="Europe/Berlin">Berlin (GMT+1)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Format daty</p>
                        <p className="text-sm text-gray-500">Sposób wyświetlania dat</p>
                      </div>
                    </div>
                    <select 
                      value={settings.dateFormat}
                      onChange={(e) => handleSelect('dateFormat', e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Format czasu</p>
                        <p className="text-sm text-gray-500">12 lub 24-godzinny</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSelect('timeFormat', '12h')}
                        className={`px-3 py-1.5 rounded-lg transition-colors ${
                          settings.timeFormat === '12h'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        12h
                      </button>
                      <button
                        onClick={() => handleSelect('timeFormat', '24h')}
                        className={`px-3 py-1.5 rounded-lg transition-colors ${
                          settings.timeFormat === '24h'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        24h
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Waluta</p>
                        <p className="text-sm text-gray-500">Domyślna waluta płatności</p>
                      </div>
                    </div>
                    <select 
                      value={settings.currency}
                      onChange={(e) => handleSelect('currency', e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PLN">PLN (zł)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Wygląd aplikacji</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Moon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Motyw</p>
                        <p className="text-sm text-gray-500">Jasny, ciemny lub automatyczny</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {[
                        { value: 'light', icon: Sun, label: 'Jasny' },
                        { value: 'dark', icon: Moon, label: 'Ciemny' },
                        { value: 'auto', icon: Monitor, label: 'Auto' }
                      ].map(theme => {
                        const Icon = theme.icon;
                        return (
                          <button
                            key={theme.value}
                            onClick={() => handleSelect('theme', theme.value)}
                            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                              settings.theme === theme.value
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{theme.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Palette className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Schemat kolorów</p>
                        <p className="text-sm text-gray-500">Główny kolor aplikacji</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {[
                        { value: 'blue', color: 'bg-blue-500' },
                        { value: 'green', color: 'bg-green-500' },
                        { value: 'purple', color: 'bg-purple-500' },
                        { value: 'red', color: 'bg-red-500' },
                        { value: 'orange', color: 'bg-orange-500' }
                      ].map(color => (
                        <button
                          key={color.value}
                          onClick={() => handleSelect('colorScheme', color.value)}
                          className={`w-8 h-8 rounded-full ${color.color} ${
                            settings.colorScheme === color.value
                              ? 'ring-2 ring-offset-2 ring-blue-500'
                              : ''
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Rozmiar czcionki</p>
                        <p className="text-sm text-gray-500">Dostosuj wielkość tekstu</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {['small', 'medium', 'large'].map(size => (
                        <button
                          key={size}
                          onClick={() => handleSelect('fontSize', size)}
                          className={`px-3 py-1.5 rounded-lg transition-colors ${
                            settings.fontSize === size
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {size === 'small' ? 'Mały' : size === 'medium' ? 'Średni' : 'Duży'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Redukuj animacje</p>
                        <p className="text-sm text-gray-500">Wyłącz animacje dla lepszej wydajności</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle('reduceMotion')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.reduceMotion ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.reduceMotion ? 'translate-x-6' : ''
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Wysoki kontrast</p>
                        <p className="text-sm text-gray-500">Zwiększ kontrast dla lepszej czytelności</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle('highContrast')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.highContrast ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.highContrast ? 'translate-x-6' : ''
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Powiadomienia</h2>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Kanały powiadomień</h3>
                  
                  {[
                    { key: 'emailNotifications', icon: Mail, label: 'Email', desc: 'Otrzymuj powiadomienia na email' },
                    { key: 'smsNotifications', icon: MessageSquare, label: 'SMS', desc: 'Powiadomienia SMS' },
                    { key: 'pushNotifications', icon: Smartphone, label: 'Push', desc: 'Powiadomienia w aplikacji' },
                    { key: 'soundEnabled', icon: Volume2, label: 'Dźwięk', desc: 'Włącz dźwięki powiadomień' },
                    { key: 'vibrationEnabled', icon: Smartphone, label: 'Wibracje', desc: 'Wibracje przy powiadomieniach' }
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <div key={item.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-800">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                        </div>
<button
  onClick={() => handleToggle(item.key)}
  className={`relative w-12 h-6 rounded-full transition-colors ${
    (settings as any)[item.key] ? 'bg-blue-500' : 'bg-gray-300'
  }`}
>
  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
    (settings as any)[item.key] ? 'translate-x-6' : ''
  }`} />
</button>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-4">
                  <h3 className="font-medium text-gray-700">Typy powiadomień</h3>
                  
                  {[
                    { key: 'lessonReminders', label: 'Przypomnienia o lekcjach', desc: 'Przed każdą lekcją' },
                    { key: 'paymentReminders', label: 'Przypomnienia o płatnościach', desc: 'Gdy zbliża się termin' },
                    { key: 'instructorMessages', label: 'Wiadomości od instruktorów', desc: 'Natychmiastowe' },
                    { key: 'weeklyReports', label: 'Tygodniowe podsumowania', desc: 'Co tydzień w poniedziałek' },
                    { key: 'promotionalEmails', label: 'Oferty i promocje', desc: 'Maksymalnie raz w tygodniu' },
                    { key: 'systemUpdates', label: 'Aktualizacje systemu', desc: 'Ważne zmiany' }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
<button
  onClick={() => handleToggle(item.key)}
  className={`relative w-12 h-6 rounded-full transition-colors ${
    (settings as any)[item.key] ? 'bg-blue-500' : 'bg-gray-300'
  }`}
>
  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
    (settings as any)[item.key] ? 'translate-x-6' : ''
  }`} />
</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lesson Preferences */}
            {activeSection === 'lessons' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Preferencje lekcji</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Przypomnienie o lekcji</p>
                        <p className="text-sm text-gray-500">Jak wcześnie przypominać</p>
                      </div>
                    </div>
                    <select 
                      value={settings.reminderTime}
                      onChange={(e) => handleSelect('reminderTime', e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="15m">15 minut</option>
                      <option value="30m">30 minut</option>
                      <option value="1h">1 godzina</option>
                      <option value="2h">2 godziny</option>
                      <option value="24h">24 godziny</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Car className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Preferowana długość lekcji</p>
                        <p className="text-sm text-gray-500">Domyślny czas trwania</p>
                      </div>
                    </div>
                    <select 
                      value={settings.preferredDuration}
                      onChange={(e) => handleSelect('preferredDuration', e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="60">60 minut</option>
                      <option value="90">90 minut</option>
                      <option value="120">120 minut</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Czas buforowy</p>
                        <p className="text-sm text-gray-500">Przerwa między lekcjami</p>
                      </div>
                    </div>
                    <select 
                      value={settings.bufferTime}
                      onChange={(e) => handleSelect('bufferTime', e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="0">Bez przerwy</option>
                      <option value="15">15 minut</option>
                      <option value="30">30 minut</option>
                      <option value="60">1 godzina</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Automatyczne rezerwacje</p>
                        <p className="text-sm text-gray-500">Rezerwuj następne lekcje automatycznie</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle('autoBooking')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.autoBooking ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.autoBooking ? 'translate-x-6' : ''
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Prywatność</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Widoczność profilu</p>
                        <p className="text-sm text-gray-500">Kto może widzieć Twój profil</p>
                      </div>
                    </div>
                    <select 
                      value={settings.profileVisibility}
                      onChange={(e) => handleSelect('profileVisibility', e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="everyone">Wszyscy</option>
                      <option value="instructors">Tylko instruktorzy</option>
                      <option value="none">Nikt</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Pokaż postępy</p>
                        <p className="text-sm text-gray-500">Udostępniaj swoje postępy instruktorom</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle('showProgress')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.showProgress ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.showProgress ? 'translate-x-6' : ''
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Udostępniaj statystyki</p>
                        <p className="text-sm text-gray-500">Anonimowe statystyki dla ulepszeń</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle('shareStatistics')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.shareStatistics ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.shareStatistics ? 'translate-x-6' : ''
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <PieChart className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Analityka</p>
                        <p className="text-sm text-gray-500">Zbieraj dane o użytkowaniu aplikacji</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle('allowAnalytics')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.allowAnalytics ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.allowAnalytics ? 'translate-x-6' : ''
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Twoje dane są bezpieczne</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Stosujemy najwyższe standardy bezpieczeństwa i szyfrowania. 
                        Twoje dane nie są udostępniane osobom trzecim bez Twojej zgody.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Accessibility Settings */}
            {activeSection === 'accessibility' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Dostępność</h2>
                
                <div className="space-y-4">
                  {[
                    { key: 'screenReader', label: 'Czytnik ekranu', desc: 'Optymalizacja dla czytników ekranu' },
                    { key: 'keyboardNavigation', label: 'Nawigacja klawiaturą', desc: 'Pełna obsługa klawiatury' },
                    { key: 'focusIndicator', label: 'Wskaźnik fokusa', desc: 'Wyraźne zaznaczenie aktywnego elementu' },
                    { key: 'textToSpeech', label: 'Tekst na mowę', desc: 'Czytanie treści na głos' }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
<button
  onClick={() => handleToggle(item.key)}
  className={`relative w-12 h-6 rounded-full transition-colors ${
    (settings as any)[item.key] ? 'bg-blue-500' : 'bg-gray-300'
  }`}
>
  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
    (settings as any)[item.key] ? 'translate-x-6' : ''
  }`} />
</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Settings */}
            {activeSection === 'performance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Wydajność</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wifi className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Synchronizacja danych</p>
                        <p className="text-sm text-gray-500">Kiedy synchronizować dane</p>
                      </div>
                    </div>
                    <select 
                      value={settings.dataSync}
                      onChange={(e) => handleSelect('dataSync', e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="always">Zawsze</option>
                      <option value="wifi">Tylko Wi-Fi</option>
                      <option value="manual">Ręcznie</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Jakość obrazów</p>
                        <p className="text-sm text-gray-500">Jakość pobieranych obrazów</p>
                      </div>
                    </div>
                    <select 
                      value={settings.imageQuality}
                      onChange={(e) => handleSelect('imageQuality', e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Niska</option>
                      <option value="medium">Średnia</option>
                      <option value="high">Wysoka</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Pamięć podręczna</p>
                        <p className="text-sm text-gray-500">Maksymalny rozmiar: {settings.cacheSize} MB</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                      Wyczyść
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Play className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Automatyczne odtwarzanie</p>
                        <p className="text-sm text-gray-500">Automatycznie odtwarzaj filmy</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle('autoPlay')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.autoPlay ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.autoPlay ? 'translate-x-6' : ''
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Odświeżanie w tle</p>
                        <p className="text-sm text-gray-500">Aktualizuj dane w tle</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggle('backgroundRefresh')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.backgroundRefresh ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.backgroundRefresh ? 'translate-x-6' : ''
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Data Management */}
            {activeSection === 'data' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Zarządzanie danymi</h2>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-800">Eksportuj dane</p>
                          <p className="text-sm text-gray-500">Pobierz kopię swoich danych</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowDataExport(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Eksportuj
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Upload className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-800">Importuj dane</p>
                          <p className="text-sm text-gray-500">Przywróć dane z kopii</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        Importuj
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-800">Kopia zapasowa</p>
                          <p className="text-sm text-gray-500">Ostatnia: 2 dni temu</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                        Utwórz teraz
                      </button>
                    </div>
                  </div>

                  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Trash2 className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="font-medium text-red-900">Usuń wszystkie dane</p>
                          <p className="text-sm text-red-700">Ta operacja jest nieodwracalna</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                        Usuń
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Settings Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Przywróć ustawienia domyślne</h2>
            <p className="text-gray-600 mb-4">
              Czy na pewno chcesz przywrócić wszystkie ustawienia do wartości domyślnych? 
              Twoje dane i postępy nie zostaną utracone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={resetSettings}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Przywróć domyślne
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Data Modal */}
      {showDataExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Eksportuj dane</h2>
            <p className="text-gray-600 mb-4">
              Wybierz format eksportu swoich danych:
            </p>
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="format" value="json" defaultChecked />
                <span>JSON (pełne dane)</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="format" value="csv" />
                <span>CSV (tylko tabele)</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="format" value="pdf" />
                <span>PDF (raport)</span>
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDataExport(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={exportData}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Pobierz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}