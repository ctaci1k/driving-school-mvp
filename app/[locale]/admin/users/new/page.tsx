
// app/[locale]/admin/users/new/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
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
  const t = useTranslations('admin.users.new');
  const locale = useLocale();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: locale === 'uk' ? '+380' : '+48',
    birthDate: '',
    gender: 'male',
    street: '',
    city: 'Warszawa',
    postalCode: '',
    role: 'STUDENT',
    password: '',
    confirmPassword: '',
    sendWelcomeEmail: true,
    emergencyName: '',
    emergencyPhone: locale === 'uk' ? '+380' : '+48',
    emergencyRelation: '',
    specializations: [],
    workingDays: []
  });

  const packages = ['Podstawowy', 'Standard', 'Premium', 'VIP', 'Intensywny'];
  const categories = ['B', 'B+E', 'C', 'C+E', 'D'];
  const instructors = [
    'Piotr Kowalski',
    'Anna Wójcik',
    'Jan Nowak',
    'Zofia Wiśniewska'
  ];

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Partial<FormData> = {};

    if (stepNumber === 1) {
      if (!formData.firstName) newErrors.firstName = t('errors.firstNameRequired');
      if (!formData.lastName) newErrors.lastName = t('errors.lastNameRequired');
      if (!formData.email) newErrors.email = t('errors.emailRequired');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t('errors.emailInvalid');
      }
      if (!formData.phone || formData.phone.length < 11) {
        newErrors.phone = t('errors.phoneRequired');
      }
      if (!formData.birthDate) newErrors.birthDate = t('errors.birthDateRequired');
    }

    if (stepNumber === 2) {
      if (!formData.street) newErrors.street = t('errors.streetRequired');
      if (!formData.city) newErrors.city = t('errors.cityRequired');
      if (!formData.postalCode) newErrors.postalCode = t('errors.postalCodeRequired');
    }

    if (stepNumber === 3) {
      if (!formData.password) newErrors.password = t('errors.passwordRequired');
      if (formData.password.length < 8) {
        newErrors.password = t('errors.passwordMinLength');
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('errors.passwordsNotMatch');
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
      router.push(`/${locale}/admin/users`);
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
          onClick={() => router.push(`/${locale}/admin/users`)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
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
            <h2 className="text-xl font-semibold text-gray-800">{t('personal.title')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('personal.firstName')}
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('personal.firstNamePlaceholder')}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('personal.lastName')}
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('personal.lastNamePlaceholder')}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('personal.email')}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('personal.emailPlaceholder')}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('personal.phone')}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('personal.phonePlaceholder')}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('personal.birthDate')}
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
                  {t('personal.gender')}
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">{t('personal.genderOptions.male')}</option>
                  <option value="female">{t('personal.genderOptions.female')}</option>
                  <option value="other">{t('personal.genderOptions.other')}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Address */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">{t('address.title')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('address.street')}
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.street ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('address.streetPlaceholder')}
                />
                {errors.street && (
                  <p className="mt-1 text-sm text-red-600">{errors.street}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('address.city')}
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="Warszawa">Warszawa</option>
                  <option value="Kraków">Kraków</option>
                  <option value="Gdańsk">Gdańsk</option>
                  <option value="Wrocław">Wrocław</option>
                  <option value="Poznań">Poznań</option>
                </select>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('address.postalCode')}
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.postalCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('address.postalCodePlaceholder')}
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">{t('address.emergencyContact')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('address.emergencyName')}
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyName}
                    onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={t('address.emergencyNamePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('address.emergencyPhone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={t('address.emergencyPhonePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('address.emergencyRelation')}
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyRelation}
                    onChange={(e) => handleInputChange('emergencyRelation', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={t('address.emergencyRelationPlaceholder')}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Account Settings */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">{t('account.title')}</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('account.role')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'STUDENT', label: t('account.roles.student'), icon: User },
                  { value: 'INSTRUCTOR', label: t('account.roles.instructor'), icon: GraduationCap },
                  { value: 'MANAGER', label: t('account.roles.manager'), icon: Users },
                  { value: 'ADMIN', label: t('account.roles.admin'), icon: Shield }
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
                  {t('account.password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-20 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('account.passwordPlaceholder')}
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
                    title={t('buttons.generatePassword')}
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
                  {t('account.confirmPassword')}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-10 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={t('account.confirmPasswordPlaceholder')}
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
                {t('account.sendWelcomeEmail')}
              </label>
            </div>
          </div>
        )}

        {/* Step 4: Role-specific Information (Student) */}
        {step === 4 && formData.role === 'STUDENT' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">{t('studentInfo.title')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('studentInfo.package')}
                </label>
                <select
                  value={formData.package || ''}
                  onChange={(e) => handleInputChange('package', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('studentInfo.selectPackage')}</option>
                  {packages.map(pkg => (
                    <option key={pkg} value={pkg}>{pkg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('studentInfo.category')}
                </label>
                <select
                  value={formData.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('studentInfo.selectCategory')}</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('studentInfo.instructor')}
                </label>
                <select
                  value={formData.instructor || ''}
                  onChange={(e) => handleInputChange('instructor', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('studentInfo.assignLater')}</option>
                  {instructors.map(inst => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('studentInfo.startDate')}
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
            <h2 className="text-xl font-semibold text-gray-800">{t('instructorInfo.title')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('instructorInfo.licenseNumber')}
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber || ''}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={t('instructorInfo.licenseNumberPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('instructorInfo.experience')}
                </label>
                <input
                  type="number"
                  value={formData.experience || ''}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={t('instructorInfo.experiencePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('instructorInfo.hourlyRate')}
                </label>
                <input
                  type="number"
                  value={formData.hourlyRate || ''}
                  onChange={(e) => handleInputChange('hourlyRate', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={t('instructorInfo.hourlyRatePlaceholder')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('instructorInfo.specializations')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['city', 'highway', 'parking', 'night', 'extreme', 'theory'].map(spec => (
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
                    <span className="text-sm text-gray-700">
                      {t(`instructorInfo.specializationOptions.${spec}`)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('instructorInfo.workingDays')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
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
                    <span className="text-sm text-gray-700">
                      {t(`instructorInfo.weekDays.${day}`)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === getTotalSteps() && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">{t('review.title')}</h2>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">{t('review.personalData')}</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-gray-500">{t('review.fullName')}</dt>
                  <dd className="font-medium">{formData.firstName} {formData.lastName}</dd>
                  <dt className="text-gray-500">{t('review.email')}</dt>
                  <dd className="font-medium">{formData.email}</dd>
                  <dt className="text-gray-500">{t('review.phone')}</dt>
                  <dd className="font-medium">{formData.phone}</dd>
                  <dt className="text-gray-500">{t('review.role')}</dt>
                  <dd className="font-medium">{t(`account.roles.${formData.role.toLowerCase()}`)}</dd>
                </dl>
              </div>

              {formData.role === 'STUDENT' && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">{t('review.trainingInfo')}</h3>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <dt className="text-gray-500">{t('review.package')}</dt>
                    <dd className="font-medium">{formData.package || t('review.notSelected')}</dd>
                    <dt className="text-gray-500">{t('review.category')}</dt>
                    <dd className="font-medium">{formData.category || t('review.notSelected')}</dd>
                    <dt className="text-gray-500">{t('review.instructor')}</dt>
                    <dd className="font-medium">{formData.instructor || t('review.notAssigned')}</dd>
                  </dl>
                </div>
              )}

              {formData.role === 'INSTRUCTOR' && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">{t('review.professionalInfo')}</h3>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <dt className="text-gray-500">{t('review.experience')}</dt>
                    <dd className="font-medium">{t('review.years', { count: formData.experience })}</dd>
                    <dt className="text-gray-500">{t('review.rate')}</dt>
                    <dd className="font-medium">{t('review.perHour', { amount: formData.hourlyRate })}</dd>
                    <dt className="text-gray-500">{t('review.specializations')}</dt>
                    <dd className="font-medium">
                      {formData.specializations?.map(s => t(`instructorInfo.specializationOptions.${s}`)).join(', ') || t('review.notSpecified')}
                    </dd>
                  </dl>
                </div>
              )}
            </div>

            <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">{t('review.confirmMessage')}</p>
                <p>{t('review.checkData')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          {step > 1 && (
            <button
              onClick={handlePrevious}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              disabled={loading}
            >
              {t('buttons.previous')}
            </button>
          )}
          {step < getTotalSteps() ? (
            <button
              onClick={handleNext}
              className={`px-6 py-2 rounded-lg text-white transition ${
                loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } ${step === 1 ? 'ml-auto' : ''}`}
              disabled={loading}
            >
              {t('buttons.next')}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className={`px-6 py-2 rounded-lg text-white flex items-center gap-2 transition ${
                loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
              }`}
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? t('buttons.saving') : t('buttons.save')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}