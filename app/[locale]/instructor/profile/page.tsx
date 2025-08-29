// app/[locale]/instructor/profile/page.tsx

'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { 
  User, Mail, Phone, MapPin, Calendar, Award, Star,
  Car, Clock, Users, FileText, Upload, Camera, Edit,
  Save, X, Shield, CheckCircle, AlertCircle, Download,
  Languages, GraduationCap, Briefcase, Heart, ChevronRight,
  Trophy, Target, TrendingUp, Activity
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

export default function InstructorProfile() {
  const router = useRouter()
  const t = useTranslations('instructor.profile.main')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Profile data
  const [profile, setProfile] = useState({
    firstName: 'Петро',
    lastName: 'Коваленко',
    email: 'petro.kovalenko@autoshkola.ua',
    phone: '+38 093 234 56 78',
    dateOfBirth: '1985-03-15',
    address: 'вул. Головна 100',
    city: 'Київ',
    postalCode: '01001',
    avatar: 'https://ui-avatars.com/api/?name=Petro+Kovalenko&background=10B981&color=fff',
    
    // Professional info
    instructorId: 'INS-2024-001',
    licenseNumber: 'UA123456789',
    licenseExpiry: '2026-05-20',
    experience: 8,
    categories: ['B', 'BE'],
    languages: [t('languages.ukrainian'), t('languages.english')],
    specializations: [t('specializations.beginners'), t('specializations.exam'), t('specializations.nightDriving')],
    
    // Employment
    employmentType: 'full-time',
    startDate: '2016-03-01',
    department: 'Київ - Центр',
    workSchedule: 'Пн-Сб, 8:00-20:00',
    
    // Bio
    bio: 'Досвідчений інструктор з водіння з 8-річним стажем. Спеціалізуюся на підготовці початківців та підготовці до іспиту. Індивідуальний підхід до кожного курсанта.',
    
    // Emergency contact
    emergencyContact: 'Марія Коваленко',
    emergencyPhone: '+38 093 234 56 79',
    emergencyRelation: 'Дружина'
  })

  // Statistics
  const stats = {
    totalStudents: 245,
    activeStudents: 15,
    successRate: 92,
    averageRating: 4.9,
    totalLessons: 3420,
    totalHours: 5130,
    currentMonthLessons: 65,
    currentMonthHours: 97.5,
    passedExams: 225,
    failedExams: 20
  }

  // Recent achievements
  const achievements = [
    {
      id: 1,
      title: t('achievements.instructorOfYear.title'),
      description: t('achievements.instructorOfYear.description'),
      date: '2023-12-15',
      icon: Trophy
    },
    {
      id: 2,
      title: t('achievements.graduates200.title'),
      description: t('achievements.graduates200.description'),
      date: '2023-08-20',
      icon: Users
    },
    {
      id: 3,
      title: t('achievements.hours5000.title'),
      description: t('achievements.hours5000.description'),
      date: '2023-05-10',
      icon: Clock
    },
    {
      id: 4,
      title: t('achievements.rating49.title'),
      description: t('achievements.rating49.description'),
      date: '2023-03-01',
      icon: Star
    }
  ]

  // Performance metrics
  const performanceData = [
    { month: t('performance.months.jan'), students: 18, rating: 4.8 },
    { month: t('performance.months.feb'), students: 22, rating: 4.9 },
    { month: t('performance.months.mar'), students: 20, rating: 4.85 },
    { month: t('performance.months.apr'), students: 25, rating: 4.92 },
    { month: t('performance.months.may'), students: 23, rating: 4.88 },
    { month: t('performance.months.jun'), students: 21, rating: 4.9 }
  ]

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    console.log('Saving profile:', profile)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback>ПК</AvatarFallback>
              </Avatar>
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Basic info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-gray-600">{profile.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="default">{t('instructor')}</Badge>
                    <span className="text-sm text-gray-500">ID: {profile.instructorId}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{stats.averageRating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        <X className="w-4 h-4 mr-2" />
                        {t('cancel')}
                      </Button>
                      <Button onClick={handleSaveProfile}>
                        <Save className="w-4 h-4 mr-2" />
                        {t('save')}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      {t('edit')}
                    </Button>
                  )}
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">{t('stats.students')}</p>
                  <p className="text-xl font-bold">{stats.totalStudents}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('stats.successRate')}</p>
                  <p className="text-xl font-bold">{stats.successRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('stats.experience')}</p>
                  <p className="text-xl font-bold">{t('stats.years', { count: profile.experience })}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('stats.hours')}</p>
                  <p className="text-xl font-bold">{stats.totalHours.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/instructor/profile/documents')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{t('navigation.documents.title')}</h3>
                  <p className="text-sm text-gray-600">{t('navigation.documents.subtitle')}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/instructor/profile/settings')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{t('navigation.settings.title')}</h3>
                  <p className="text-sm text-gray-600">{t('navigation.settings.subtitle')}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
          <TabsTrigger value="personal">{t('tabs.personal')}</TabsTrigger>
          <TabsTrigger value="professional">{t('tabs.professional')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('performance.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((data, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-12">{data.month}</span>
                    <div className="flex-1">
                      <Progress value={(data.students / 25) * 100} className="h-2" />
                    </div>
                    <span className="text-sm font-medium w-12">{data.students}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{data.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>{t('achievements.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <achievement.icon className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(achievement.date), 'dd MMMM yyyy', { locale: uk })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('personalInfo.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t('personalInfo.firstName')}</Label>
                  <Input
                    value={profile.firstName}
                    onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>{t('personalInfo.lastName')}</Label>
                  <Input
                    value={profile.lastName}
                    onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>{t('personalInfo.email')}</Label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>{t('personalInfo.phone')}</Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>{t('personalInfo.dateOfBirth')}</Label>
                  <Input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>{t('personalInfo.city')}</Label>
                  <Input
                    value={profile.city}
                    onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>{t('personalInfo.address')}</Label>
                  <Input
                    value={profile.address}
                    onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="mt-6">
                <Label>{t('personalInfo.bio')}</Label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  className="h-24"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('emergencyContact.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>{t('emergencyContact.name')}</Label>
                  <Input
                    value={profile.emergencyContact}
                    onChange={(e) => setProfile(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>{t('emergencyContact.phone')}</Label>
                  <Input
                    value={profile.emergencyPhone}
                    onChange={(e) => setProfile(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>{t('emergencyContact.relation')}</Label>
                  <Input
                    value={profile.emergencyRelation}
                    onChange={(e) => setProfile(prev => ({ ...prev, emergencyRelation: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('professionalInfo.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t('professionalInfo.licenseNumber')}</Label>
                  <Input value={profile.licenseNumber} disabled />
                </div>
                <div>
                  <Label>{t('professionalInfo.validUntil')}</Label>
                  <Input type="date" value={profile.licenseExpiry} disabled />
                </div>
                <div>
                  <Label>{t('professionalInfo.workExperience')}</Label>
                  <Input value={t('stats.years', { count: profile.experience })} disabled />
                </div>
                <div>
                  <Label>{t('professionalInfo.employmentType')}</Label>
                  <Select value={profile.employmentType} disabled={!isEditing}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">{t('professionalInfo.employmentTypes.fullTime')}</SelectItem>
                      <SelectItem value="part-time">{t('professionalInfo.employmentTypes.partTime')}</SelectItem>
                      <SelectItem value="contract">{t('professionalInfo.employmentTypes.contract')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6">
                <Label>{t('professionalInfo.categories')}</Label>
                <div className="flex gap-2 mt-2">
                  {profile.categories.map(cat => (
                    <Badge key={cat} variant="outline">{cat}</Badge>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Label>{t('professionalInfo.specializations')}</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.specializations.map(spec => (
                    <Badge key={spec} variant="secondary">{spec}</Badge>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Label>{t('professionalInfo.languages')}</Label>
                <div className="flex gap-2 mt-2">
                  {profile.languages.map(lang => (
                    <Badge key={lang}>{lang}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}