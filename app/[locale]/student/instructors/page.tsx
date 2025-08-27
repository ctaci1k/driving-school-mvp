// app/[locale]/student/instructors/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Star,
  User,
  Award,
  Calendar,
  Clock,
  Car,
  MessageSquare,
  TrendingUp,
  Search,
  Filter,
  Heart,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Users,
  Target,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


interface Instructor {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalReviews: number;
  experience: string;
  specializations: string[];
  completedLessons: number;
  successRate: number;
  favorite: boolean;
  nextAvailable: string;
  bio: string;
  languages: string[];
  categories: string[];
  pricePerHour: number;
  totalStudents: number;
  myLessonsCount: number;
  lastLessonDate?: string;
  availability: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    weekend: boolean;
  };
}

export default function StudentInstructorsPage() {
  const router = useRouter();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    const mockInstructors: Instructor[] = [
      {
        id: '1',
        name: 'Piotr Nowak',
        avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff',
        rating: 4.9,
        totalReviews: 124,
        experience: '8 lat',
        specializations: ['Egzaminy', 'Jazda nocna', 'Autostrady'],
        completedLessons: 1250,
        successRate: 94,
        favorite: true,
        nextAvailable: 'Jutro 14:00',
        bio: 'Profesjonalny instruktor z pasją do nauczania. Specjalizuję się w przygotowaniu do egzaminu państwowego.',
        languages: ['Polski', 'Angielski'],
        categories: ['B', 'B automat'],
        pricePerHour: 180,
        totalStudents: 215,
        myLessonsCount: 15,
        lastLessonDate: '2024-08-25',
        availability: {
          morning: true,
          afternoon: true,
          evening: false,
          weekend: true
        }
      },
      {
        id: '2',
        name: 'Anna Kowalczyk',
        avatar: 'https://ui-avatars.com/api/?name=Anna+Kowalczyk&background=8B5CF6&color=fff',
        rating: 4.8,
        totalReviews: 98,
        experience: '5 lat',
        specializations: ['Parkowanie', 'Manewry', 'Miasto'],
        completedLessons: 890,
        successRate: 92,
        favorite: false,
        nextAvailable: 'Dziś 18:00',
        bio: 'Cierpliwa i dokładna. Uczę bezpiecznej i pewnej jazdy w ruchu miejskim.',
        languages: ['Polski'],
        categories: ['B'],
        pricePerHour: 160,
        totalStudents: 156,
        myLessonsCount: 8,
        lastLessonDate: '2024-08-20',
        availability: {
          morning: false,
          afternoon: true,
          evening: true,
          weekend: false
        }
      },
      {
        id: '3',
        name: 'Tomasz Wiśniewski',
        avatar: 'https://ui-avatars.com/api/?name=Tomasz+Wisniewski&background=F59E0B&color=fff',
        rating: 4.7,
        totalReviews: 156,
        experience: '10 lat',
        specializations: ['Początkujący', 'Manewry', 'Egzaminy'],
        completedLessons: 2100,
        successRate: 89,
        favorite: false,
        nextAvailable: 'Poniedziałek 10:00',
        bio: 'Doświadczony instruktor z indywidualnym podejściem do każdego kursanta.',
        languages: ['Polski', 'Niemiecki'],
        categories: ['B', 'C'],
        pricePerHour: 200,
        totalStudents: 342,
        myLessonsCount: 0,
        availability: {
          morning: true,
          afternoon: true,
          evening: true,
          weekend: true
        }
      }
    ];

    setTimeout(() => {
      setInstructors(mockInstructors);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleFavorite = (instructorId: string) => {
    setInstructors(prev =>
      prev.map(instructor =>
        instructor.id === instructorId
          ? { ...instructor, favorite: !instructor.favorite }
          : instructor
      )
    );
  };

  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = searchQuery === '' || 
      instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.specializations.some(spec => 
        spec.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesSpecialization = filterSpecialization === 'all' || 
      instructor.specializations.includes(filterSpecialization);
    
    const matchesFavorites = !showFavoritesOnly || instructor.favorite;
    
    const matchesTab = selectedTab === 'all' || 
      (selectedTab === 'my' && instructor.myLessonsCount > 0) ||
      (selectedTab === 'favorites' && instructor.favorite);
    
    return matchesSearch && matchesSpecialization && matchesFavorites && matchesTab;
  });

  const myInstructorsCount = instructors.filter(i => i.myLessonsCount > 0).length;
  const favoritesCount = instructors.filter(i => i.favorite).length;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Instruktorzy</h1>
        <p className="text-muted-foreground mt-1">
          Poznaj naszych instruktorów i wybierz najlepszego dla siebie
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wszyscy instruktorzy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{instructors.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Moi instruktorzy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold">{myInstructorsCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ulubieni
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold">{favoritesCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">Wszyscy</TabsTrigger>
          <TabsTrigger value="my">Moi instruktorzy</TabsTrigger>
          <TabsTrigger value="favorites">Ulubieni</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Szukaj instruktora lub specjalizacji..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={filterSpecialization} onValueChange={setFilterSpecialization}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Specjalizacja" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie</SelectItem>
                    <SelectItem value="Egzaminy">Egzaminy</SelectItem>
                    <SelectItem value="Parkowanie">Parkowanie</SelectItem>
                    <SelectItem value="Miasto">Miasto</SelectItem>
                    <SelectItem value="Autostrady">Autostrady</SelectItem>
                    <SelectItem value="Jazda nocna">Jazda nocna</SelectItem>
                    <SelectItem value="Początkujący">Początkujący</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Instructors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstructors.map(instructor => (
              <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={instructor.avatar} alt={instructor.name} />
                        <AvatarFallback>
                          {instructor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{instructor.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{instructor.rating}</span>
                          <span className="text-sm text-muted-foreground">({instructor.totalReviews})</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(instructor.id)}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          instructor.favorite ? 'text-red-500 fill-current' : 'text-gray-400'
                        }`}
                      />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {instructor.bio}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Doświadczenie</span>
                      <span className="font-medium">{instructor.experience}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Skuteczność</span>
                      <div className="flex items-center gap-2">
                        <Progress value={instructor.successRate} className="w-16 h-2" />
                        <span className="font-medium">{instructor.successRate}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Cena/h</span>
                      <span className="font-medium">{instructor.pricePerHour} PLN</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {instructor.specializations.slice(0, 3).map((spec, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {instructor.specializations.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{instructor.specializations.length - 3}
                      </Badge>
                    )}
                  </div>

                  {instructor.myLessonsCount > 0 && (
                    <div className="bg-primary/5 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Twoje lekcje</span>
                        </div>
                        <span className="text-sm font-bold text-primary">
                          {instructor.myLessonsCount}
                        </span>
                      </div>
                      {instructor.lastLessonDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Ostatnia: {new Date(instructor.lastLessonDate).toLocaleDateString('pl-PL')}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="w-4 h-4" />
                    <span>Najbliższy termin: {instructor.nextAvailable}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => router.push(`/student/instructors/${instructor.id}`)}
                    >
                      Zobacz profil
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => router.push(`/student/bookings/book?instructor=${instructor.id}`)}
                    >
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredInstructors.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nie znaleziono instruktorów</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterSpecialization('all');
                    setShowFavoritesOnly(false);
                  }}
                >
                  Wyczyść filtry
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}