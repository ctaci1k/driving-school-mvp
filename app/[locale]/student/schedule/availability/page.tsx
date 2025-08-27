// app/[locale]/student/schedule/availability/page.tsx

'use client';

import { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Car,
  MapPin,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Star,
  Info,
  Zap,
  Sun,
  Moon,
  CloudRain,
  Check,
  X,
  AlertCircle,
  Coffee,
  Sunrise,
  Sunset
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

// Mock data
const mockAvailableSlots = [
  {
    id: '1',
    date: '2024-08-29',
    dayName: 'Czwartek',
    slots: [
      {
        id: 's1',
        time: '08:00',
        instructor: { name: 'Piotr Nowak', avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff', rating: 4.9 },
        vehicle: 'Toyota Yaris',
        location: 'ul. Puławska 145',
        available: true,
        popular: false,
        discount: 0,
        weather: 'sunny'
      },
      {
        id: 's2',
        time: '10:00',
        instructor: { name: 'Anna Kowalczyk', avatar: 'https://ui-avatars.com/api/?name=Anna+Kowalczyk&background=8B5CF6&color=fff', rating: 4.8 },
        vehicle: 'VW Golf',
        location: 'ul. Wilanowska 89',
        available: true,
        popular: true,
        discount: 10,
        weather: 'sunny'
      },
      {
        id: 's3',
        time: '14:00',
        instructor: { name: 'Piotr Nowak', avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff', rating: 4.9 },
        vehicle: 'Toyota Yaris',
        location: 'ul. Puławska 145',
        available: false,
        popular: true,
        discount: 0,
        weather: 'cloudy'
      },
      {
        id: 's4',
        time: '16:00',
        instructor: { name: 'Tomasz Wiśniewski', avatar: 'https://ui-avatars.com/api/?name=Tomasz+Wisniewski&background=F59E0B&color=fff', rating: 4.7 },
        vehicle: 'Škoda Fabia',
        location: 'al. KEN 36',
        available: true,
        popular: false,
        discount: 0,
        weather: 'cloudy'
      },
      {
        id: 's5',
        time: '18:00',
        instructor: { name: 'Katarzyna Nowak', avatar: 'https://ui-avatars.com/api/?name=Katarzyna+Nowak&background=EC4899&color=fff', rating: 5.0 },
        vehicle: 'Toyota Yaris',
        location: 'ul. Puławska 145',
        available: true,
        popular: false,
        discount: 15,
        weather: 'sunny'
      }
    ]
  },
  {
    id: '2',
    date: '2024-08-30',
    dayName: 'Piątek',
    slots: [
      {
        id: 's6',
        time: '09:00',
        instructor: { name: 'Anna Kowalczyk', avatar: 'https://ui-avatars.com/api/?name=Anna+Kowalczyk&background=8B5CF6&color=fff', rating: 4.8 },
        vehicle: 'VW Golf',
        location: 'ul. Wilanowska 89',
        available: true,
        popular: false,
        discount: 0,
        weather: 'rainy'
      },
      {
        id: 's7',
        time: '11:00',
        instructor: { name: 'Piotr Nowak', avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff', rating: 4.9 },
        vehicle: 'Toyota Yaris',
        location: 'ul. Puławska 145',
        available: true,
        popular: true,
        discount: 0,
        weather: 'rainy'
      },
      {
        id: 's8',
        time: '15:00',
        instructor: { name: 'Katarzyna Nowak', avatar: 'https://ui-avatars.com/api/?name=Katarzyna+Nowak&background=EC4899&color=fff', rating: 5.0 },
        vehicle: 'Toyota Yaris',
        location: 'ul. Puławska 145',
        available: true,
        popular: false,
        discount: 20,
        weather: 'cloudy'
      }
    ]
  }
];

const instructors = [
  { id: '1', name: 'Piotr Nowak', rating: 4.9 },
  { id: '2', name: 'Anna Kowalczyk', rating: 4.8 },
  { id: '3', name: 'Tomasz Wiśniewski', rating: 4.7 },
  { id: '4', name: 'Katarzyna Nowak', rating: 5.0 }
];

const locations = [
  { id: '1', name: 'ul. Puławska 145', distance: '2.3 km' },
  { id: '2', name: 'ul. Wilanowska 89', distance: '4.1 km' },
  { id: '3', name: 'al. KEN 36', distance: '0.8 km' }
];

export default function AvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState('2024-08-29');
  const [selectedInstructor, setSelectedInstructor] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [priceRange, setPriceRange] = useState([100, 400]);
  const [showOnlyDiscounted, setShowOnlyDiscounted] = useState(false);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);
  const [sortBy, setSortBy] = useState('time');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getWeatherIcon = (weather: string) => {
    switch(weather) {
      case 'sunny': return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'cloudy': return <Moon className="h-4 w-4 text-gray-500" />;
      case 'rainy': return <CloudRain className="h-4 w-4 text-blue-500" />;
      default: return <Sun className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 9) return <Sunrise className="h-4 w-4 text-orange-400" />;
    if (hour < 12) return <Coffee className="h-4 w-4 text-brown-400" />;
    if (hour < 17) return <Sun className="h-4 w-4 text-yellow-500" />;
    return <Sunset className="h-4 w-4 text-purple-400" />;
  };

  const getTimeRangeLabel = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 9) return 'Poranek';
    if (hour < 12) return 'Przedpołudnie';
    if (hour < 17) return 'Popołudnie';
    return 'Wieczór';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dostępne terminy</h1>
          <p className="text-gray-600">Znajdź idealny termin na swoją następną lekcję</p>
        </div>
        <Link href="/student/bookings/book">
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Szybka rezerwacja
          </Button>
        </Link>
      </div>

      {/* AI Recommendations */}
      <Alert className="border-blue-200 bg-blue-50">
        <Sparkles className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          <strong>Rekomendacja AI:</strong> Na podstawie Twojego postępu, polecamy lekcję parkowania z Anną Kowalczyk w piątek o 9:00. 
          Pogoda będzie sprzyjająca, a ruch na drogach mniejszy.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Filtry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date Range */}
            <div>
              <Label>Zakres dat</Label>
              <div className="mt-2 space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  29.08 - 05.09.2024
                </Button>
              </div>
            </div>

            {/* Instructor */}
            <div>
              <Label>Instruktor</Label>
              <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Wszyscy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszyscy instruktorzy</SelectItem>
                  {instructors.map(instructor => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{instructor.name}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs">{instructor.rating}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div>
              <Label>Lokalizacja</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Wszystkie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie lokalizacje</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{location.name}</span>
                        <span className="text-xs text-gray-500">{location.distance}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time of Day */}
            <div>
              <Label>Pora dnia</Label>
              <RadioGroup value={selectedTimeRange} onValueChange={setSelectedTimeRange} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">Cały dzień</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="morning" id="morning" />
                  <Label htmlFor="morning">Rano (6:00-12:00)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="afternoon" id="afternoon" />
                  <Label htmlFor="afternoon">Popołudnie (12:00-18:00)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="evening" id="evening" />
                  <Label htmlFor="evening">Wieczór (18:00-22:00)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Price Range */}
            <div>
              <Label>Zakres cenowy</Label>
              <div className="mt-2 px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  min={100}
                  max={400}
                  step={10}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{priceRange[0]} PLN</span>
                  <span>{priceRange[1]} PLN</span>
                </div>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="discounted">Tylko promocje</Label>
                <Switch
                  id="discounted"
                  checked={showOnlyDiscounted}
                  onCheckedChange={setShowOnlyDiscounted}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="available">Tylko dostępne</Label>
                <Switch
                  id="available"
                  checked={showOnlyAvailable}
                  onCheckedChange={setShowOnlyAvailable}
                />
              </div>
            </div>

            <Button className="w-full" variant="outline">
              <X className="h-4 w-4 mr-2" />
              Wyczyść filtry
            </Button>
          </CardContent>
        </Card>

        {/* Available Slots */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sorting and View Options */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sortuj" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time">Według czasu</SelectItem>
                      <SelectItem value="price">Według ceny</SelectItem>
                      <SelectItem value="rating">Według oceny</SelectItem>
                      <SelectItem value="distance">Według odległości</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="secondary">
                    {mockAvailableSlots.reduce((acc, day) => acc + day.slots.filter(s => s.available).length, 0)} wolnych terminów
                  </Badge>
                </div>
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                  <TabsList>
                    <TabsTrigger value="grid">Siatka</TabsTrigger>
                    <TabsTrigger value="list">Lista</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* Slots by Day */}
          {mockAvailableSlots.map(day => (
            <Card key={day.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{day.dayName}, {day.date}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {day.slots.filter(s => s.available).length} z {day.slots.length} terminów dostępnych
                    </p>
                  </div>
                  <Badge variant="outline">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Popularny dzień
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {day.slots.map(slot => (
                      <div
                        key={slot.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          slot.available
                            ? 'border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer'
                            : 'border-gray-100 bg-gray-50 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={slot.instructor.avatar} />
                              <AvatarFallback>{slot.instructor.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{slot.instructor.name}</p>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs">{slot.instructor.rating}</span>
                              </div>
                            </div>
                          </div>
                          {slot.discount > 0 && (
                            <Badge className="bg-red-100 text-red-700">
                              -{slot.discount}%
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">{slot.time}</span>
                            <Badge variant="outline" className="text-xs">
                              {getTimeRangeLabel(slot.time)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Car className="h-4 w-4" />
                            <span>{slot.vehicle}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{slot.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            {getWeatherIcon(slot.weather)}
                            <span>Prognoza: {slot.weather === 'sunny' ? 'Słonecznie' : slot.weather === 'cloudy' ? 'Pochmurno' : 'Deszczowo'}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-gray-900">
                              {slot.discount > 0 ? (
                                <>
                                  <span className="line-through text-gray-400 text-sm mr-2">180 PLN</span>
                                  {180 - (180 * slot.discount / 100)} PLN
                                </>
                              ) : (
                                '180 PLN'
                              )}
                            </p>
                          </div>
                          {slot.available ? (
                            <Link href="/student/bookings/book">
                              <Button size="sm">
                                Zarezerwuj
                              </Button>
                            </Link>
                          ) : (
                            <Button size="sm" disabled>
                              Zajęte
                            </Button>
                          )}
                        </div>

                        {slot.popular && (
                          <div className="mt-3 flex items-center gap-1 text-xs text-orange-600">
                            <Zap className="h-3 w-3" />
                            <span>Popularny termin - rezerwuj szybko!</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {day.slots.map(slot => (
                      <div
                        key={slot.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          slot.available
                            ? 'border-gray-200 hover:bg-gray-50'
                            : 'border-gray-100 bg-gray-50 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={slot.instructor.avatar} />
                            <AvatarFallback>{slot.instructor.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{slot.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span>{slot.instructor.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Car className="h-4 w-4 text-gray-400" />
                              <span>{slot.vehicle}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{slot.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {slot.discount > 0 && (
                            <Badge className="bg-red-100 text-red-700">
                              -{slot.discount}%
                            </Badge>
                          )}
                          <span className="font-bold">
                            {slot.discount > 0 ? 180 - (180 * slot.discount / 100) : 180} PLN
                          </span>
                          {slot.available ? (
                            <Link href="/student/bookings/book">
                              <Button size="sm">Zarezerwuj</Button>
                            </Link>
                          ) : (
                            <Button size="sm" disabled>Zajęte</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* Load More */}
          <div className="text-center">
            <Button variant="outline" className="w-full max-w-xs">
              Pokaż więcej terminów
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}