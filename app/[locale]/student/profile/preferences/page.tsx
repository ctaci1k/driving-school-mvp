// app/[locale]/student/profile/preferences/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Sun,
  Moon,
  Clock,
  Calendar,
  MapPin,
  Car,
  Users,
  Bell,
  Volume2,
  Vibrate,
  Mail,
  MessageSquare,
  Smartphone,
  Globe,
  BookOpen,
  Target,
  Zap,
  Info,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  Settings,
  User,
  Star,
  Heart,
  Coffee,
  Sunrise,
  Sunset,
  Shield,
  Leaf
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

// Mock preferences data
const mockPreferences = {
  learning: {
    preferredTime: 'afternoon',
    weekDays: ['monday', 'wednesday', 'friday'],
    weekendAvailable: true,
    lessonDuration: 120,
    intensityLevel: 'moderate',
    preferredInstructor: 'any',
    preferredVehicle: 'manual',
    preferredLocation: 'city_center',
    groupLessons: false,
    theoryPreference: 'online'
  },
  notifications: {
    email: true,
    sms: true,
    push: true,
    reminderTime: 24,
    cancelNotifications: true,
    newsAndOffers: false,
    lessonFeedback: true,
    progressReports: true,
    sound: true,
    vibration: true
  },
  communication: {
    preferredLanguage: 'pl',
    preferredContact: 'phone',
    availableHours: '09:00-18:00',
    emergencyAlerts: true,
    instructorMessages: true,
    adminMessages: true,
    groupMessages: false
  },
  goals: {
    targetExamDate: '2024-10-15',
    weeklyLessons: 2,
    focusAreas: ['parking', 'highway', 'night'],
    examType: 'standard',
    additionalTraining: ['defensive', 'eco']
  },
  accessibility: {
    largeText: false,
    highContrast: false,
    reducedMotion: false,
    screenReader: false
  }
};

const timePreferences = [
  { value: 'morning', label: 'Rano (6:00-12:00)', icon: Sunrise },
  { value: 'afternoon', label: 'Popołudnie (12:00-18:00)', icon: Sun },
  { value: 'evening', label: 'Wieczór (18:00-22:00)', icon: Sunset }
];

const weekDays = [
  { value: 'monday', label: 'Poniedziałek' },
  { value: 'tuesday', label: 'Wtorek' },
  { value: 'wednesday', label: 'Środa' },
  { value: 'thursday', label: 'Czwartek' },
  { value: 'friday', label: 'Piątek' },
  { value: 'saturday', label: 'Sobota' },
  { value: 'sunday', label: 'Niedziela' }
];

const focusAreas = [
  { value: 'parking', label: 'Parkowanie', description: 'Równoległe i prostopadłe' },
  { value: 'highway', label: 'Autostrada', description: 'Jazda z wysoką prędkością' },
  { value: 'night', label: 'Jazda nocna', description: 'W warunkach ograniczonej widoczności' },
  { value: 'city', label: 'Miasto', description: 'Ruch miejski i skrzyżowania' },
  { value: 'maneuvers', label: 'Manewry', description: 'Zawracanie, cofanie' },
  { value: 'hills', label: 'Wzniesienia', description: 'Ruszanie pod górkę' }
];

export default function PreferencesPage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState(mockPreferences);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('learning');

  const handleSave = () => {
    // Save preferences logic
    console.log('Saving preferences:', preferences);
    setHasChanges(false);
  };

  const updatePreference = (category: string, key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const toggleWeekDay = (day: string) => {
    const currentDays = preferences.learning.weekDays;
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    updatePreference('learning', 'weekDays', newDays);
  };

  const toggleFocusArea = (area: string) => {
    const currentAreas = preferences.goals.focusAreas;
    const newAreas = currentAreas.includes(area)
      ? currentAreas.filter(a => a !== area)
      : [...currentAreas, area];
    updatePreference('goals', 'focusAreas', newAreas);
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Preferencje nauki</h1>
            <p className="text-gray-600">Dostosuj proces nauki do swoich potrzeb</p>
          </div>
        </div>
        
        {hasChanges && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              Anuluj
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Zapisz zmiany
            </Button>
          </div>
        )}
      </div>

      {hasChanges && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Masz niezapisane zmiany. Pamiętaj o zapisaniu przed wyjściem.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="learning">Nauka</TabsTrigger>
          <TabsTrigger value="schedule">Harmonogram</TabsTrigger>
          <TabsTrigger value="notifications">Powiadomienia</TabsTrigger>
          <TabsTrigger value="goals">Cele</TabsTrigger>
        </TabsList>

        {/* Learning Preferences */}
        <TabsContent value="learning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferencje czasowe</CardTitle>
              <CardDescription>
                Kiedy najchętniej uczestniczysz w lekcjach?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Preferowana pora dnia</Label>
                <RadioGroup
                  value={preferences.learning.preferredTime}
                  onValueChange={(value) => updatePreference('learning', 'preferredTime', value)}
                >
                  <div className="grid grid-cols-3 gap-3">
                    {timePreferences.map((time) => {
                      const Icon = time.icon;
                      return (
                        <div key={time.value}>
                          <RadioGroupItem
                            value={time.value}
                            id={time.value}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={time.value}
                            className="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50"
                          >
                            <Icon className="h-6 w-6 mb-2" />
                            <span className="text-sm font-medium">{time.label}</span>
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="mb-3 block">Preferowana długość lekcji</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">90 min</span>
                    <span className="text-sm font-medium">{preferences.learning.lessonDuration} min</span>
                    <span className="text-sm text-gray-600">180 min</span>
                  </div>
                  <Slider
                    value={[preferences.learning.lessonDuration]}
                    onValueChange={([value]) => updatePreference('learning', 'lessonDuration', value)}
                    min={90}
                    max={180}
                    step={30}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Intensywność nauki</Label>
                <Select
                  value={preferences.learning.intensityLevel}
                  onValueChange={(value) => updatePreference('learning', 'intensityLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relaxed">
                      <div className="flex items-center gap-2">
                        <Coffee className="h-4 w-4" />
                        <span>Spokojna (1 lekcja/tydzień)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="moderate">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        <span>Umiarkowana (2-3 lekcje/tydzień)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="intensive">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        <span>Intensywna (4+ lekcje/tydzień)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferencje instruktora i pojazdu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Preferowany instruktor</Label>
                  <Select
                    value={preferences.learning.preferredInstructor}
                    onValueChange={(value) => updatePreference('learning', 'preferredInstructor', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Dowolny</SelectItem>
                      <SelectItem value="male">Mężczyzna</SelectItem>
                      <SelectItem value="female">Kobieta</SelectItem>
                      <SelectItem value="specific">Konkretny instruktor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Preferowana skrzynia biegów</Label>
                  <Select
                    value={preferences.learning.preferredVehicle}
                    onValueChange={(value) => updatePreference('learning', 'preferredVehicle', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manualna</SelectItem>
                      <SelectItem value="automatic">Automatyczna</SelectItem>
                      <SelectItem value="any">Bez znaczenia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Preferowana lokalizacja rozpoczęcia</Label>
                <Select
                  value={preferences.learning.preferredLocation}
                  onValueChange={(value) => updatePreference('learning', 'preferredLocation', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="city_center">Centrum - ul. Puławska 145</SelectItem>
                    <SelectItem value="mokotow">Mokotów - ul. Wilanowska 89</SelectItem>
                    <SelectItem value="ursynow">Ursynów - al. KEN 36</SelectItem>
                    <SelectItem value="home">Odbiór spod domu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Lekcje grupowe</Label>
                  <p className="text-sm text-gray-600">Chcę uczestniczyć w zajęciach teoretycznych grupowych</p>
                </div>
                <Switch
                  checked={preferences.learning.groupLessons}
                  onCheckedChange={(checked) => updatePreference('learning', 'groupLessons', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Preferences */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dostępność w tygodniu</CardTitle>
              <CardDescription>
                Zaznacz dni, w których możesz uczestniczyć w lekcjach
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weekDays.map((day) => (
                  <div key={day.value}>
                    <Checkbox
                      id={day.value}
                      checked={preferences.learning.weekDays.includes(day.value)}
                      onCheckedChange={() => toggleWeekDay(day.value)}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={day.value}
                      className="flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50"
                    >
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <Label>Weekendy</Label>
                  <p className="text-sm text-gray-600">Jestem dostępny również w weekendy</p>
                </div>
                <Switch
                  checked={preferences.learning.weekendAvailable}
                  onCheckedChange={(checked) => updatePreference('learning', 'weekendAvailable', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Okresy niedostępności</CardTitle>
              <CardDescription>
                Zaplanuj urlopy i przerwy w nauce
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Urlop letni</p>
                    <Badge>Aktywny</Badge>
                  </div>
                  <p className="text-sm text-gray-600">15.07.2024 - 30.07.2024</p>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Dodaj okres niedostępności
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kanały komunikacji</CardTitle>
              <CardDescription>
                Wybierz, jak chcesz otrzymywać powiadomienia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-gray-600">Ważne powiadomienia i podsumowania</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.notifications.email}
                  onCheckedChange={(checked) => updatePreference('notifications', 'email', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label>SMS</Label>
                    <p className="text-sm text-gray-600">Przypomnienia o lekcjach</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.notifications.sms}
                  onCheckedChange={(checked) => updatePreference('notifications', 'sms', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label>Powiadomienia push</Label>
                    <p className="text-sm text-gray-600">Natychmiastowe alerty w aplikacji</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.notifications.push}
                  onCheckedChange={(checked) => updatePreference('notifications', 'push', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rodzaje powiadomień</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Przypomnienia o lekcjach</Label>
                <Select
                  value={String(preferences.notifications.reminderTime)}
                  onValueChange={(value) => updatePreference('notifications', 'reminderTime', parseInt(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 godz.</SelectItem>
                    <SelectItem value="2">2 godz.</SelectItem>
                    <SelectItem value="6">6 godz.</SelectItem>
                    <SelectItem value="24">24 godz.</SelectItem>
                    <SelectItem value="48">48 godz.</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                {[
                  { key: 'cancelNotifications', label: 'Anulowania i zmiany terminów' },
                  { key: 'lessonFeedback', label: 'Feedback po lekcjach' },
                  { key: 'progressReports', label: 'Raporty postępów' },
                  { key: 'newsAndOffers', label: 'Nowości i oferty specjalne' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <Label>{item.label}</Label>
                    <Switch
                      checked={preferences.notifications[item.key as keyof typeof preferences.notifications] as boolean}
                      onCheckedChange={(checked) => updatePreference('notifications', item.key, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ustawienia dźwięku</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="h-5 w-5 text-gray-500" />
                  <Label>Dźwięk powiadomień</Label>
                </div>
                <Switch
                  checked={preferences.notifications.sound}
                  onCheckedChange={(checked) => updatePreference('notifications', 'sound', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Vibrate className="h-5 w-5 text-gray-500" />
                  <Label>Wibracje</Label>
                </div>
                <Switch
                  checked={preferences.notifications.vibration}
                  onCheckedChange={(checked) => updatePreference('notifications', 'vibration', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals */}
        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cel nauki</CardTitle>
              <CardDescription>
                Określ swoje cele i priorytety w nauce jazdy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Planowana data egzaminu</Label>
                <Input
                  type="date"
                  value={preferences.goals.targetExamDate}
                  onChange={(e) => updatePreference('goals', 'targetExamDate', e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Na podstawie tej daty dostosujemy intensywność nauki
                </p>
              </div>

              <div>
                <Label>Liczba lekcji tygodniowo</Label>
                <RadioGroup
                  value={String(preferences.goals.weeklyLessons)}
                  onValueChange={(value) => updatePreference('goals', 'weeklyLessons', parseInt(value))}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="w1" />
                      <Label htmlFor="w1">1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="w2" />
                      <Label htmlFor="w2">2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="w3" />
                      <Label htmlFor="w3">3</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="w4" />
                      <Label htmlFor="w4">4+</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Obszary do skupienia</CardTitle>
              <CardDescription>
                Wybierz umiejętności, które chcesz szczególnie ćwiczyć
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {focusAreas.map((area) => (
                  <div
                    key={area.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      preferences.goals.focusAreas.includes(area.value)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleFocusArea(area.value)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{area.label}</p>
                        <p className="text-sm text-gray-600 mt-1">{area.description}</p>
                      </div>
                      {preferences.goals.focusAreas.includes(area.value) && (
                        <Check className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dodatkowe szkolenia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Jazda defensywna</p>
                    <p className="text-sm text-gray-600">Techniki bezpiecznej jazdy</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.goals.additionalTraining.includes('defensive')}
                  onCheckedChange={(checked) => {
                    const current = preferences.goals.additionalTraining;
                    const updated = checked
                      ? [...current, 'defensive']
                      : current.filter(t => t !== 'defensive');
                    updatePreference('goals', 'additionalTraining', updated);
                  }}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Leaf className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Eco-driving</p>
                    <p className="text-sm text-gray-600">Ekonomiczna jazda</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.goals.additionalTraining.includes('eco')}
                  onCheckedChange={(checked) => {
                    const current = preferences.goals.additionalTraining;
                    const updated = checked
                      ? [...current, 'eco']
                      : current.filter(t => t !== 'eco');
                    updatePreference('goals', 'additionalTraining', updated);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}