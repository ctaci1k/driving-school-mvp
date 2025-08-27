// app/[locale]/student/profile/page.tsx

'use client';

import { useState } from 'react';
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
  Settings,
  CheckCircle
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

// Mock data
const mockProfile = {
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
    relation: 'Żona',
    phone: '+48 602 345 678'
  },
  
  // Documents
  documents: [
    { id: '1', name: 'PKK', type: 'pdf', uploadDate: '2024-06-01', status: 'verified' },
    { id: '2', name: 'Badanie lekarskie', type: 'pdf', uploadDate: '2024-05-28', status: 'verified' },
    { id: '3', name: 'Dowód osobisty', type: 'jpg', uploadDate: '2024-06-01', status: 'verified' }
  ],
  
  // Achievements
  achievements: [
    { id: '1', name: 'Pierwsza lekcja', icon: '🚗', unlocked: true, date: '2024-06-05' },
    { id: '2', name: '10 lekcji', icon: '🎯', unlocked: true, date: '2024-07-20' },
    { id: '3', name: 'Teoria zdana', icon: '📚', unlocked: true, date: '2024-06-15' },
    { id: '4', name: 'Mistrz parkowania', icon: '🏆', unlocked: false, progress: 75 },
    { id: '5', name: 'Nocny jeździec', icon: '🌙', unlocked: true, date: '2024-08-10' }
  ],
  
  // Statistics
  stats: {
    punctuality: 95,
    attendance: 100,
    progressRate: 62,
    skillsImprovement: 85
  }
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(mockProfile);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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
        return <Badge className="bg-green-100 text-green-700">Zdany</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700">Niezaliczony</Badge>;
      default:
        return <Badge>Oczekuje</Badge>;
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    switch(status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-700">Zweryfikowany</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">W weryfikacji</Badge>;
      default:
        return <Badge>Przesłany</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mój profil</h1>
          <p className="text-gray-600">Zarządzaj swoimi danymi i dokumentami</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/student/profile/preferences">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Preferencje
            </Button>
          </Link>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Anuluj
              </Button>
              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                Zapisz zmiany
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edytuj profil
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
                <Badge>Kursant aktywny</Badge>
                <Badge variant="outline">
                  <Star className="h-3 w-3 mr-1" />
                  {profileData.averageScore}
                </Badge>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Postęp kursu</span>
                  <span className="font-medium">{profileData.stats.progressRate}%</span>
                </div>
                <Progress value={profileData.stats.progressRate} />
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {profileData.completedLessons}
                    </p>
                    <p className="text-xs text-gray-600">Ukończonych lekcji</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {profileData.totalHours}h
                    </p>
                    <p className="text-xs text-gray-600">Godzin jazdy</p>
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
              <TabsTrigger value="overview">Przegląd</TabsTrigger>
              <TabsTrigger value="details">Dane osobowe</TabsTrigger>
              <TabsTrigger value="documents">Dokumenty</TabsTrigger>
              <TabsTrigger value="achievements">Osiągnięcia</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informacje o kursie</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Data rozpoczęcia</Label>
                      <p className="font-medium">{profileData.joinDate}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Planowany egzamin</Label>
                      <p className="font-medium">{profileData.estimatedExamDate}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Kategoria</Label>
                      <div className="flex gap-2 mt-1">
                        {profileData.licenseCategories.map(cat => (
                          <Badge key={cat} variant="outline">{cat}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-600">Nr PKK</Label>
                      <p className="font-medium">{profileData.licenseNumber}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-gray-600 mb-2">Egzamin teoretyczny</Label>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Zdany</p>
                          <p className="text-sm text-gray-600">{profileData.theoryExamDate}</p>
                        </div>
                      </div>
                      {getExamStatusBadge(profileData.theoryExamStatus)}
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-600 mb-2">Badanie lekarskie</Label>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Ważne do</p>
                          <p className="text-sm text-gray-600">{profileData.medicalCertExpiry}</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">Aktualne</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Statystyki</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Punktualność</span>
                        <span className="font-medium">{profileData.stats.punctuality}%</span>
                      </div>
                      <Progress value={profileData.stats.punctuality} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frekwencja</span>
                        <span className="font-medium">{profileData.stats.attendance}%</span>
                      </div>
                      <Progress value={profileData.stats.attendance} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Postęp nauki</span>
                        <span className="font-medium">{profileData.stats.progressRate}%</span>
                      </div>
                      <Progress value={profileData.stats.progressRate} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Poprawa umiejętności</span>
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
                  <CardTitle>Dane osobowe</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Imię</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nazwisko</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthDate">Data urodzenia</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={profileData.birthDate}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, birthDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="licenseNumber">Numer PKK</Label>
                      <Input
                        id="licenseNumber"
                        value={profileData.licenseNumber}
                        disabled
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Adres zamieszkania</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="address">Ulica i numer</Label>
                        <Input
                          id="address"
                          value={profileData.address}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Kod pocztowy</Label>
                        <Input
                          id="postalCode"
                          value={profileData.postalCode}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({...profileData, postalCode: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Miasto</Label>
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
                    <h4 className="font-medium mb-3">Kontakt awaryjny</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Imię i nazwisko</Label>
                        <Input
                          value={profileData.emergencyContact.name}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>Relacja</Label>
                        <Input
                          value={profileData.emergencyContact.relation}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Telefon kontaktowy</Label>
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
                    <CardTitle>Dokumenty</CardTitle>
                    <Button onClick={() => setShowUploadDialog(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Dodaj dokument
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
                              Przesłano {doc.uploadDate}
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
                      Wszystkie dokumenty są bezpiecznie przechowywane i dostępne tylko dla autoryzowanego personelu.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Osiągnięcia</CardTitle>
                  <CardDescription>
                    Odblokowano {profileData.achievements.filter(a => a.unlocked).length} z {profileData.achievements.length}
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
            <DialogTitle>Dodaj dokument</DialogTitle>
            <DialogDescription>
              Prześlij wymagane dokumenty do weryfikacji
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Typ dokumentu</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz typ dokumentu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Dowód osobisty</SelectItem>
                  <SelectItem value="medical">Badanie lekarskie</SelectItem>
                  <SelectItem value="pkk">PKK</SelectItem>
                  <SelectItem value="other">Inny</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Plik</Label>
              <Input type="file" accept=".pdf,.jpg,.png" />
              <p className="text-xs text-gray-500 mt-1">
                Maksymalny rozmiar: 10MB. Formaty: PDF, JPG, PNG
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Anuluj
            </Button>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Prześlij
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}