// app/[locale]/admin/users/new/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, User, Mail, Phone, MapPin, Calendar, Shield,
  Lock, Eye, EyeOff, Save, Upload, Camera, UserPlus,
  GraduationCap, Car, Users, AlertCircle, CheckCircle,
  X, Loader2, Info
} from 'lucide-react';
import { format } from 'date-fns';

interface FormData {
  // Personal info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  
  // Address
  street: string;
  city: string;
  postalCode: string;
  
  // Account
  role: string;
  password: string;
  confirmPassword: string;
  sendWelcomeEmail: boolean;
  
  // Additional for specific roles
  // Student
  package?: string;
  category?: string;
  instructor?: string;
  startDate?: string;
  
  // Instructor
  licenseNumber?: string;
  experience?: string;
  specializations?: string[];
  workingDays?: string[];
  hourlyRate?: number;
  
  // Emergency contact
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
}

export default function AdminNewUserPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '+380',
    birthDate: '',
    gender: 'male',
    street: '',
    city: 'Київ',
    postalCode: '',
    role: 'STUDENT',
    password: '',
    confirmPassword: '',
    sendWelcomeEmail: true,
    emergencyName: '',
    emergencyPhone: '+380',
    emergencyRelation: '',
    specializations: [],
    workingDays: []
  });

  const packages = ['Базовий', 'Стандарт', 'Преміум', 'VIP', 'Інтенсив'];
  const categories = ['B', 'B+E', 'C', 'C+E', 'D'];
  const instructors = [
    'Петро Сидоренко',
    'Анна Коваленко',
    'Іван Мельник',
    'Оксана Шевченко'
  ];
  const specializations = [
    'Міська їзда',
    'Автострада',
    'Паркування',
    'Нічна їзда',
    'Екстремальне водіння',
    'Теорія'
  ];
  const weekDays = [
    'Понеділок',
    'Вівторок',
    'Середа',
    'Четвер',
    'П\'ятниця',
    'Субота',
    'Неділя'
  ];

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Partial<FormData> = {};

    if (stepNumber === 1) {
      if (!formData.firstName) newErrors.firstName = 'Ім\'я обов\'язкове';
      if (!formData.lastName) newErrors.lastName = 'Прізвище обов\'язкове';
      if (!formData.email) newErrors.email = 'Email обов\'язковий';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Невірний формат email';
      }
      if (!formData.phone || formData.phone.length < 13) {
        newErrors.phone = 'Телефон обов\'язковий';
      }
      if (!formData.birthDate) newErrors.birthDate = 'Дата народження обов\'язкова';
    }

    if (stepNumber === 2) {
      if (!formData.street) newErrors.street = 'Вулиця обов\'язкова';
      if (!formData.city) newErrors.city = 'Місто обов\'язкове';
      if (!formData.postalCode) newErrors.postalCode = 'Поштовий індекс обов\'язковий';
    }

    if (stepNumber === 3) {
      if (!formData.password) newErrors.password = 'Пароль обов\'язковий';
      if (formData.password.length < 8) {
        newErrors.password = 'Пароль має містити мінімум 8 символів';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Паролі не співпадають';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(step)) {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Creating user:', formData);
      router.push('/uk/admin/users');
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handleInputChange('password', password);
    handleInputChange('confirmPassword', password);
  };

  const getTotalSteps = () => {
    if (formData.role === 'STUDENT') return 5;
    if (formData.role === 'INSTRUCTOR') return 5;
    return 4;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/uk/admin/users')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Створення нового користувача</h1>
          <p className="text-gray-600 mt-1">Заповніть всю необхідну інформацію</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-8">
          {[...Array(getTotalSteps())].map((_, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index + 1 < step
                  ? 'bg-green-600 text-white'
                  : index + 1 === step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {index + 1 < step ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              {index < getTotalSteps() - 1 && (
                <div className={`w-full h-1 mx-2 ${
                  index + 1 < step ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Особиста інформація</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ім'я *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Олександр"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Прізвище *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Петренко"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+380501234567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата народження *
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.birthDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.birthDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Стать
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Чоловік</option>
                  <option value="female">Жінка</option>
                  <option value="other">Інше</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Address */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Адреса</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Вулиця та номер будинку *
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.street ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="вул. Хрещатик, 1"
                />
                {errors.street && (
                  <p className="mt-1 text-sm text-red-600">{errors.street}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Місто *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="Київ">Київ</option>
                  <option value="Львів">Львів</option>
                  <option value="Одеса">Одеса</option>
                  <option value="Харків">Харків</option>
                  <option value="Дніпро">Дніпро</option>
                </select>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Поштовий індекс *
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.postalCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="01001"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Екстрений контакт</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ім'я
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyName}
                    onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Марія Петренко"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="+380509876543"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Відношення
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyRelation}
                    onChange={(e) => handleInputChange('emergencyRelation', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Мати"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Account Settings */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Налаштування акаунту</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Роль користувача *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'STUDENT', label: 'Студент', icon: User },
                  { value: 'INSTRUCTOR', label: 'Інструктор', icon: GraduationCap },
                  { value: 'MANAGER', label: 'Менеджер', icon: Users },
                  { value: 'ADMIN', label: 'Адміністратор', icon: Shield }
                ].map(role => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => handleInputChange('role', role.value)}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 ${
                      formData.role === role.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <role.icon className={`w-6 h-6 ${
                      formData.role === role.value ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      formData.role === role.value ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {role.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Пароль *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-20 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Мінімум 8 символів"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
                    title="Згенерувати пароль"
                  >
                    <Lock className="w-5 h-5" />
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Підтвердження паролю *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-10 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Повторіть пароль"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="sendWelcomeEmail"
                checked={formData.sendWelcomeEmail}
                onChange={(e) => handleInputChange('sendWelcomeEmail', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="sendWelcomeEmail" className="text-sm text-gray-700">
                Надіслати вітальний email з даними для входу
              </label>
            </div>
          </div>
        )}

        {/* Step 4: Role-specific Information (Student) */}
        {step === 4 && formData.role === 'STUDENT' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Інформація студента</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Навчальний пакет
                </label>
                <select
                  value={formData.package || ''}
                  onChange={(e) => handleInputChange('package', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Оберіть пакет</option>
                  {packages.map(pkg => (
                    <option key={pkg} value={pkg}>{pkg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категорія
                </label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Оберіть категорію</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Інструктор
                </label>
                <select
                  value={formData.instructor || ''}
                  onChange={(e) => handleInputChange('instructor', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Призначити пізніше</option>
                  {instructors.map(inst => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата початку навчання
                </label>
                <input
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Role-specific Information (Instructor) */}
        {step === 4 && formData.role === 'INSTRUCTOR' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Інформація інструктора</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Номер посвідчення
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber || ''}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="AA123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Досвід роботи (років)
                </label>
                <input
                  type="number"
                  value={formData.experience || ''}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Погодинна ставка (грн)
                </label>
                <input
                  type="number"
                  value={formData.hourlyRate || ''}
                  onChange={(e) => handleInputChange('hourlyRate', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Спеціалізації
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {specializations.map(spec => (
                  <label key={spec} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.specializations?.includes(spec) || false}
                      onChange={(e) => {
                        const specs = formData.specializations || [];
                        if (e.target.checked) {
                          handleInputChange('specializations', [...specs, spec]);
                        } else {
                          handleInputChange('specializations', specs.filter(s => s !== spec));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Робочі дні
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weekDays.map(day => (
                  <label key={day} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.workingDays?.includes(day) || false}
                      onChange={(e) => {
                        const days = formData.workingDays || [];
                        if (e.target.checked) {
                          handleInputChange('workingDays', [...days, day]);
                        } else {
                          handleInputChange('workingDays', days.filter(d => d !== day));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === getTotalSteps() && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Перевірка даних</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Особиста інформація</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-gray-500">Ім'я:</dt>
                  <dd className="font-medium">{formData.firstName} {formData.lastName}</dd>
                  <dt className="text-gray-500">Email:</dt>
                  <dd className="font-medium">{formData.email}</dd>
                  <dt className="text-gray-500">Телефон:</dt>
                  <dd className="font-medium">{formData.phone}</dd>
                  <dt className="text-gray-500">Роль:</dt>
                  <dd className="font-medium">
                    {formData.role === 'STUDENT' && 'Студент'}
                    {formData.role === 'INSTRUCTOR' && 'Інструктор'}
                    {formData.role === 'MANAGER' && 'Менеджер'}
                    {formData.role === 'ADMIN' && 'Адміністратор'}
                  </dd>
                </dl>
              </div>

              {formData.role === 'STUDENT' && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Навчальна інформація</h3>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <dt className="text-gray-500">Пакет:</dt>
                    <dd className="font-medium">{formData.package || 'Не обрано'}</dd>
                    <dt className="text-gray-500">Категорія:</dt>
                    <dd className="font-medium">{formData.category || 'Не обрано'}</dd>
                    <dt className="text-gray-500">Інструктор:</dt>
                    <dd className="font-medium">{formData.instructor || 'Не призначено'}</dd>
                  </dl>
                </div>
              )}

              {formData.role === 'INSTRUCTOR' && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Професійна інформація</h3>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <dt className="text-gray-500">Досвід:</dt>
                    <dd className="font-medium">{formData.experience} років</dd>
                    <dt className="text-gray-500">Ставка:</dt>
                    <dd className="font-medium">₴{formData.hourlyRate}/год</dd>
                    <dt className="text-gray-500">Спеціалізації:</dt>
                    <dd className="font-medium">{formData.specializations?.join(', ') || 'Не вказано'}</dd>
                  </dl>
                </div>
              )}
            </div>

            <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Користувач буде створений з наступними правами:</p>
                <ul className="list-disc list-inside space-y-1">
                  {formData.role === 'STUDENT' && (
                    <>
                      <li>Перегляд та бронювання занять</li>
                      <li>Доступ до навчальних матеріалів</li>
                      <li>Відстеження прогресу</li>
                    </>
                  )}
                  {formData.role === 'INSTRUCTOR' && (
                    <>
                      <li>Управління розкладом</li>
                      <li>Оцінювання студентів</li>
                      <li>Перегляд статистики</li>
                    </>
                  )}
                  {formData.role === 'MANAGER' && (
                    <>
                      <li>Управління бронюваннями</li>
                      <li>Перегляд звітів</li>
                      <li>Робота з клієнтами</li>
                    </>
                  )}
                  {formData.role === 'ADMIN' && (
                    <>
                      <li>Повний доступ до системи</li>
                      <li>Управління користувачами</li>
                      <li>Налаштування системи</li>
                    </>
                  )}
                </ul>
                {formData.sendWelcomeEmail && (
                  <p className="mt-2">На email буде надіслано дані для входу</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={step === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад
          </button>

          {step < getTotalSteps() ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              Далі
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Створення...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Створити користувача
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}