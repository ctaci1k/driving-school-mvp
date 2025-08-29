// app/[locale]/student/profile/page.tsx

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Car,
  Award,
  Star,
  Edit,
  Camera,
  Save,
  X,
  Check,
  CheckCircle,
  AlertCircle,
  Shield,
  Clock,
  CreditCard,
  FileText,
  Download,
  Upload,
  Trash2,
  ChevronRight,
  BadgeCheck,
  Target,
  TrendingUp,
  Activity,
  Users,
  BookOpen,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';

export default function ProfilePage() {
  const t = useTranslations('student.profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data
  const [profileData, setProfileData] = useState({
    id: 'STU-2024-0123',
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@example.com',
    phone: '+48 601 234 567',
    birthDate: '1998-05-15',
    address: 'ul. Wilanowska 89/15',
    city: 'Warszawa',
    postalCode: '02-765',
    avatar: 'https://ui-avatars.com/api/?name=Jan+Kowalski&background=3B82F6&color=fff',
    
    // License info
    licenseNumber: 'PKK123456789',
    licenseCategories: ['B'],
    medicalCertExpiry: '2025-03-15',
    theoryExamDate: '2024-06-15',
    theoryExamStatus: 'passed',
    
    // Learning progress
    totalLessons: 24,
    completedLessons: 15,
    totalHours: 30,
    averageScore: 4.2,
    joinDate: '2024-06-01',
    estimatedExamDate: '2024-10-15',
    
    // Emergency contact
    emergencyContact: {
      name: 'Anna Kowalska',
      relation: t('details.wife'),
      phone: '+48 602 345 678'
    },
    
    // Documents
    documents: [
      { id: '1', name: 'PKK', type: 'pdf', uploadDate: '2024-06-01', status: 'verified' },
      { id: '2', name: t('documents.types.medical'), type: 'pdf', uploadDate: '2024-05-28', status: 'verified' },
      { id: '3', name: t('documents.types.id'), type: 'jpg', uploadDate: '2024-06-01', status: 'verified' }
    ],
    
    // Achievements
    achievements: [
      { id: '1', name: t('achievements.firstLesson'), icon: '🚗', unlocked: true, date: '2024-06-05' },
      { id: '2', name: t('achievements.lessons10'), icon: '🎯', unlocked: true, date: '2024-07-20' },
      { id: '3', name: t('achievements.theoryPassed'), icon: '📚', unlocked: true, date: '2024-06-15' },
      { id: '4', name: t('achievements.parkingMaster'), icon: '🏆', unlocked: false, progress: 75 },
      { id: '5', name: t('achievements.nightRider'), icon: '🌙', unlocked: true, date: '2024-08-10' }
    ],
    
    // Statistics
    stats: {
      punctuality: 95,
      attendance: 100,
      progressRate: 62,
      skillsImprovement: 85
    }
  });

  const handleSaveProfile = () => {
    // Save profile logic
    setIsEditing(false);
  };

  const handleAvatarChange = () => {
    // Handle avatar upload
    console.log('Change avatar');
  };

  const getExamStatusBadge = (status: string) => {
    switch(status) {
      case 'passed':
        return <Badge className="bg-green-100 text-green-700">{t('overview.passed')}</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700">{t('overview.failed')}</Badge>;
      default:
        return <Badge>{t('overview.pending')}</Badge>;
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    switch(status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-700">{t('documents.verified')}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">{t('documents.inVerification')}</Badge>;
      default:
        return <Badge>{t('documents.uploaded')}</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/student/profile/preferences">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              {t('preferences')}
            </Button>
          </Link>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                {t('cancel')}
              </Button>
              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                {t('saveChanges')}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              {t('editProfile')}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profileData.avatar} />
                  <AvatarFallback>
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full"
                    onClick={handleAvatarChange}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <h2 className="text-xl font-semibold mt-4">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-gray-500">ID: {profileData.id}</p>
              
              <div className="flex items-center justify-center gap-2 mt-3">
                <Badge>{t('activeStudent')}</Badge>
                <Badge variant="outline">
                  <Star className="h-3 w-3 mr-1" />
                  {profileData.averageScore}
                </Badge>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('stats.courseProgress')}</span>
                  <span className="font-medium">{profileData.stats.progressRate}%</span>
                </div>
                <Progress value={profileData.stats.progressRate} />
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {profileData.completedLessons}
                    </p>
                    <p className="text-xs text-gray-600">{t('stats.completedLessons')}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {profileData.totalHours}h
                    </p>
                    <p className="text-xs text-gray-600">{t('stats.drivingHours')}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
              <TabsTrigger value="details">{t('tabs.details')}</TabsTrigger>
              <TabsTrigger value="documents">{t('tabs.documents')}</TabsTrigger>
              <TabsTrigger value="achievements">{t('tabs.achievements')}</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('overview.courseInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">{t('overview.startDate')}</Label>
                      <p className="font-medium">{profileData.joinDate}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">{t('overview.plannedExam')}</Label>
                      <p className="font-medium">{profileData.estimatedExamDate}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">{t('overview.category')}</Label>
                      <div className="flex gap-2 mt-1">
                        {profileData.licenseCategories.map(cat => (
                          <Badge key={cat} variant="outline">{cat}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-600">{t('overview.pkkNumber')}</Label>
                      <p className="font-medium">{profileData.licenseNumber}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-gray-600 mb-2">{t('overview.theoryExam')}</Label>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">{t('overview.passed')}</p>
                          <p className="text-sm text-gray-600">{profileData.theoryExamDate}</p>
                        </div>
                      </div>
                      {getExamStatusBadge(profileData.theoryExamStatus)}
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-600 mb-2">{t('overview.medicalCert')}</Label>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{t('overview.validUntil')}</p>
                          <p className="text-sm text-gray-600">{profileData.medicalCertExpiry}</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">{t('overview.current')}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('overview.statistics')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('overview.punctuality')}</span>
                        <span className="font-medium">{profileData.stats.punctuality}%</span>
                      </div>
                      <Progress value={profileData.stats.punctuality} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('overview.attendance')}</span>
                        <span className="font-medium">{profileData.stats.attendance}%</span>
                      </div>
                      <Progress value={profileData.stats.attendance} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('overview.learningProgress')}</span>
                        <span className="font-medium">{profileData.stats.progressRate}%</span>
                      </div>
                      <Progress value={profileData.stats.progressRate} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t('overview.skillsImprovement')}</span>
                        <span className="font-medium">{profileData.stats.skillsImprovement}%</span>
                      </div>
                      <Progress value={profileData.stats.skillsImprovement} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Personal Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('details.personalData')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">{t('details.firstName')}</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">{t('details.lastName')}</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t('details.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t('details.phone')}</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthDate">{t('details.birthDate')}</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={profileData.birthDate}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, birthDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="licenseNumber">{t('details.pkkNumber')}</Label>
                      <Input
                        id="licenseNumber"
                        value={profileData.licenseNumber}
                        disabled
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">{t('details.address')}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="address">{t('details.streetAndNumber')}</Label>
                        <Input
                          id="address"
                          value={profileData.address}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">{t('details.postalCode')}</Label>
                        <Input
                          id="postalCode"
                          value={profileData.postalCode}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, postalCode: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">{t('details.city')}</Label>
                        <Input
                          id="city"
                          value={profileData.city}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">{t('details.emergencyContact')}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>{t('details.contactName')}</Label>
                        <Input
                          value={profileData.emergencyContact.name}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>{t('details.relation')}</Label>
                        <Input
                          value={profileData.emergencyContact.relation}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>{t('details.contactPhone')}</Label>
                        <Input
                          value={profileData.emergencyContact.phone}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t('documents.title')}</CardTitle>
                    <Button onClick={() => setShowUploadDialog(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      {t('documents.addDocument')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profileData.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-gray-500">
                              {t('documents.uploadDate')} {doc.uploadDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getDocumentStatusBadge(doc.status)}
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {t('documents.securityNote')}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('achievements.title')}</CardTitle>
                  <CardDescription>
                    {t('achievements.unlockedCount', { 
                      unlocked: profileData.achievements.filter(a => a.unlocked).length,
                      total: profileData.achievements.length
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {profileData.achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg text-center ${
                          achievement.unlocked
                            ? 'bg-yellow-50 border-2 border-yellow-300'
                            : 'bg-gray-100 opacity-50'
                        }`}
                      >
                        <div className="text-3xl mb-2">{achievement.icon}</div>
                        <p className="font-medium text-sm">{achievement.name}</p>
                        {achievement.unlocked ? (
                          <p className="text-xs text-gray-600 mt-1">{achievement.date}</p>
                        ) : (
                          achievement.progress && (
                            <div className="mt-2">
                              <Progress value={achievement.progress} className="h-1" />
                              <p className="text-xs text-gray-600 mt-1">{achievement.progress}%</p>
                            </div>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Upload Document Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('documents.dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('documents.dialog.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t('documents.dialog.documentType')}</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={t('documents.dialog.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">{t('documents.types.id')}</SelectItem>
                  <SelectItem value="medical">{t('documents.types.medical')}</SelectItem>
                  <SelectItem value="pkk">{t('documents.types.pkk')}</SelectItem>
                  <SelectItem value="other">{t('documents.types.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('documents.dialog.file')}</Label>
              <Input type="file" accept=".pdf,.jpg,.png" />
              <p className="text-xs text-gray-500 mt-1">
                {t('documents.dialog.maxSize')}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              {t('cancel')}
            </Button>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              {t('documents.dialog.upload')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}