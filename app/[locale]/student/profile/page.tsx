// File: /app/[locale]/(student)/student/profile/page.tsx
'use client';

import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, Calendar, MapPin, Camera, Save, Edit2,
  Shield, Bell, Globe, Moon, Sun, Smartphone, Lock, Key,
  AlertCircle, CheckCircle, Upload, FileText, Award, Car,
  Users, Heart, CreditCard, Settings, ChevronRight, X,
  Eye, EyeOff, Trash2, Download, Share2, QrCode
} from 'lucide-react';

export default function StudentProfilePage() {
  const [activeTab, setActiveTab] = useState('personal'); // personal, preferences, documents, security
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Mock user data
  const [userData, setUserData] = useState({
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@gmail.com',
    phone: '+48 123 456 789',
    dateOfBirth: '1995-05-15',
    address: 'ul. Warszawska 123',
    city: 'Warszawa',
    postalCode: '00-001',
    pesel: '95051512345',
    licenseNumber: 'PKK123456789',
    avatar: 'https://ui-avatars.com/api/?name=Jan+Kowalski&background=3B82F6&color=fff',
    joinDate: '2024-06-01',
    emergencyContact: 'Anna Kowalska',
    emergencyPhone: '+48 987 654 321'
  });

  const [preferences, setPreferences] = useState({
    language: 'pl',
    theme: 'light',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    lessonReminders: '24h',
    preferredInstructors: ['1', '2'],
    preferredVehicles: ['automatic'],
    preferredTimes: ['morning', 'afternoon']
  });

  const documents = [
    {
      id: 1,
      name: 'Prawo jazdy kat. B - teoria',
      type: 'certificate',
      uploadDate: '2024-07-15',
      status: 'verified',
      size: '245 KB',
      icon: Award
    },
    {
      id: 2,
      name: 'Zaświadczenie lekarskie',
      type: 'medical',
      uploadDate: '2024-06-01',
      status: 'verified',
      size: '1.2 MB',
      expiryDate: '2025-06-01',
      icon: Heart
    },
    {
      id: 3,
      name: 'Profil kandydata na kierowcę (PKK)',
      type: 'pkk',
      uploadDate: '2024-06-01',
      status: 'verified',
      size: '156 KB',
      icon: FileText
    },
    {
      id: 4,
      name: 'Dowód osobisty (skan)',
      type: 'id',
      uploadDate: '2024-06-01',
      status: 'verified',
      size: '2.3 MB',
      icon: CreditCard
    }
  ];

  const statistics = {
    totalLessons: 24,
    totalHours: 36,
    averageRating: 4.8,
    completionRate: 75,
    favoriteInstructor: 'Piotr Nowak',
    preferredTime: 'Popołudnia (14:00-18:00)',
    strongPoints: ['Parkowanie', 'Jazda w mieście'],
    weakPoints: ['Jazda nocna', 'Autostrady']
  };

  const achievements = [
    { id: 1, name: 'Pierwsza lekcja', icon: '🎯', unlocked: true, date: '2024-06-15' },
    { id: 2, name: '10 lekcji', icon: '🏆', unlocked: true, date: '2024-07-20' },
    { id: 3, name: 'Perfekcjonista', icon: '⭐', unlocked: true, date: '2024-08-10' },
    { id: 4, name: 'Nocny jeździec', icon: '🌙', unlocked: false, progress: 40 },
    { id: 5, name: 'Mistrz parkowania', icon: '🚗', unlocked: false, progress: 75 },
    { id: 6, name: 'Gotowy na egzamin', icon: '🎓', unlocked: false, progress: 75 }
  ];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Save profile logic here
    console.log('Saving profile...', userData);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'verified': 'bg-green-100 text-green-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'expired': 'bg-red-100 text-red-700'
    };
    
    const labels = {
      'verified': 'Zweryfikowany',
      'pending': 'W trakcie weryfikacji',
      'expired': 'Wygasły'
    };
    
return (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
    {labels[status as keyof typeof labels]}
  </span>
);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="relative">
              <img 
                src={userData.avatar} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover"
              />
              {isEditing && (
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {userData.firstName} {userData.lastName}
              </h1>
              <p className="text-gray-600">{userData.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  Student
                </span>
                <span className="text-sm text-gray-500">
                  Dołączył: {new Date(userData.joinDate).toLocaleDateString('pl-PL')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edytuj profil
                </button>
                <button
                  onClick={() => setShowQRCode(true)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Zapisz
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Anuluj
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Car className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold">{statistics.totalLessons}</span>
          </div>
          <p className="text-sm text-gray-600">Ukończone lekcje</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold">{statistics.totalHours}h</span>
          </div>
          <p className="text-sm text-gray-600">Godzin jazdy</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold">{statistics.averageRating}</span>
          </div>
          <p className="text-sm text-gray-600">Średnia ocena</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold">{statistics.completionRate}%</span>
          </div>
          <p className="text-sm text-gray-600">Postęp nauki</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'personal', label: 'Dane osobowe', icon: User },
              { id: 'preferences', label: 'Preferencje', icon: Settings },
              { id: 'documents', label: 'Dokumenty', icon: FileText },
              { id: 'security', label: 'Bezpieczeństwo', icon: Shield }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imię</label>
                  <input
                    type="text"
                    value={userData.firstName}
                    onChange={(e) => setUserData(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nazwisko</label>
                  <input
                    type="text"
                    value={userData.lastName}
                    onChange={(e) => setUserData(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data urodzenia</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={userData.dateOfBirth}
                      onChange={(e) => setUserData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PESEL</label>
                  <input
                    type="text"
                    value={userData.pesel}
                    onChange={(e) => setUserData(prev => ({ ...prev, pesel: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Adres</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ulica i numer</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={userData.address}
                        onChange={(e) => setUserData(prev => ({ ...prev, address: e.target.value }))}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Miasto</label>
                    <input
                      type="text"
                      value={userData.city}
                      onChange={(e) => setUserData(prev => ({ ...prev, city: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kod pocztowy</label>
                    <input
                      type="text"
                      value={userData.postalCode}
                      onChange={(e) => setUserData(prev => ({ ...prev, postalCode: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Kontakt awaryjny</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Imię i nazwisko</label>
                    <input
                      type="text"
                      value={userData.emergencyContact}
                      onChange={(e) => setUserData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                    <input
                      type="tel"
                      value={userData.emergencyPhone}
                      onChange={(e) => setUserData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Ustawienia aplikacji</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Język</p>
                        <p className="text-sm text-gray-500">Wybierz język interfejsu</p>
                      </div>
                    </div>
                    <select 
                      value={preferences.language}
                      onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pl">Polski</option>
                      <option value="en">English</option>
                      <option value="uk">Українська</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Moon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Motyw</p>
                        <p className="text-sm text-gray-500">Jasny lub ciemny motyw</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {['light', 'dark', 'auto'].map(theme => (
                        <button
                          key={theme}
                          onClick={() => setPreferences(prev => ({ ...prev, theme }))}
                          className={`px-3 py-1.5 rounded-lg transition-colors ${
                            preferences.theme === theme
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {theme === 'light' ? 'Jasny' : theme === 'dark' ? 'Ciemny' : 'Auto'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Powiadomienia</h3>
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', icon: Mail, label: 'Powiadomienia email', desc: 'Otrzymuj powiadomienia na email' },
                    { key: 'smsNotifications', icon: Smartphone, label: 'Powiadomienia SMS', desc: 'Otrzymuj SMS-y z przypomnieniami' },
                    { key: 'pushNotifications', icon: Bell, label: 'Powiadomienia push', desc: 'Powiadomienia w aplikacji' },
                    { key: 'marketingEmails', icon: Heart, label: 'Wiadomości marketingowe', desc: 'Oferty i promocje' }
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
  onClick={() => setPreferences(prev => ({ 
    ...prev, 
    [item.key]: !(prev as any)[item.key] 
  }))}
  className={`relative w-12 h-6 rounded-full transition-colors ${
    (preferences as any)[item.key] ? 'bg-blue-500' : 'bg-gray-300'
  }`}
>
  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
    (preferences as any)[item.key] ? 'translate-x-6' : ''
  }`} />
</button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Preferencje lekcji</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Przypomnienie o lekcji</label>
                    <select 
                      value={preferences.lessonReminders}
                      onChange={(e) => setPreferences(prev => ({ ...prev, lessonReminders: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="1h">1 godzina przed</option>
                      <option value="2h">2 godziny przed</option>
                      <option value="24h">24 godziny przed</option>
                      <option value="48h">48 godzin przed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferowane godziny</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'morning', label: 'Rano (6:00-12:00)' },
                        { value: 'afternoon', label: 'Popołudnie (12:00-18:00)' },
                        { value: 'evening', label: 'Wieczór (18:00-22:00)' },
                        { value: 'weekend', label: 'Weekendy' }
                      ].map(time => (
                        <button
                          key={time.value}
                          onClick={() => {
                            setPreferences(prev => ({
                              ...prev,
                              preferredTimes: prev.preferredTimes.includes(time.value)
                                ? prev.preferredTimes.filter(t => t !== time.value)
                                : [...prev.preferredTimes, time.value]
                            }));
                          }}
                          className={`px-3 py-1.5 rounded-lg transition-colors ${
                            preferences.preferredTimes.includes(time.value)
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {time.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Moje dokumenty</h3>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Dodaj dokument
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => console.log('File selected:', e.target.files)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map(doc => {
                  const Icon = doc.icon;
                  return (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{doc.name}</h4>
                            <p className="text-sm text-gray-500">{doc.size} • {doc.uploadDate}</p>
                          </div>
                        </div>
                        {getStatusBadge(doc.status)}
                      </div>

                      {doc.expiryDate && (
                        <div className="mb-3 p-2 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-yellow-700">
                            Ważny do: {new Date(doc.expiryDate).toLocaleDateString('pl-PL')}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                          <Eye className="w-4 h-4" />
                          Podgląd
                        </button>
                        <button className="flex-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-1">
                          <Download className="w-4 h-4" />
                          Pobierz
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Ważne informacje</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Wszystkie dokumenty są bezpiecznie przechowywane i szyfrowane. 
                      Tylko Ty i upoważniony personel szkoły jazdy mają do nich dostęp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Zmiana hasła</h3>
                {!showPasswordChange ? (
                  <button
                    onClick={() => setShowPasswordChange(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    Zmień hasło
                  </button>
                ) : (
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Obecne hasło</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nowe hasło</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Potwierdź nowe hasło</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        Zapisz hasło
                      </button>
                      <button
                        onClick={() => setShowPasswordChange(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Anuluj
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Uwierzytelnianie dwuskładnikowe</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">2FA włączone</p>
                      <p className="text-sm text-gray-500">Twoje konto jest dodatkowo zabezpieczone</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors">
                    Zarządzaj
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Sesje i urządzenia</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">iPhone 13 Pro</p>
                        <p className="text-sm text-gray-500">Warszawa, Polska • Aktywny teraz</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Obecne</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">Chrome na Windows</p>
                        <p className="text-sm text-gray-500">Kraków, Polska • 2 dni temu</p>
                      </div>
                    </div>
                    <button className="text-red-600 hover:underline text-sm">Wyloguj</button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-red-600">Strefa niebezpieczna</h3>
                <button
                  onClick={() => setShowDeleteAccount(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Usuń konto
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Usuń konto</h2>
            <p className="text-gray-600 mb-4">
              Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna i wszystkie Twoje dane zostaną trwale usunięte.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteAccount(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Usuń konto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}