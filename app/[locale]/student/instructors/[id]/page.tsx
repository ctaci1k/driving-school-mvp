// app/[locale]/student/instructors/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Star,
  Calendar,
  Clock,
  Car,
  Award,
  Users,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Heart,
  ChevronLeft,
  CheckCircle,
  TrendingUp,
  Globe,
  Shield,
  Target,
  BarChart3,
  BookOpen,
  ThumbsUp,
  Quote,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface InstructorProfile {
  id: string;
  name: string;
  avatar: string;
  coverPhoto: string;
  rating: number;
  totalReviews: number;
  experience: string;
  joinedDate: string;
  bio: string;
  specializations: string[];
  languages: string[];
  categories: string[];
  completedLessons: number;
  totalStudents: number;
  successRate: number;
  responseTime: string;
  favorite: boolean;
  verified: boolean;
  awards: string[];
  pricePerHour: number;
  availability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
  contact: {
    phone: string;
    email: string;
  };
  stats: {
    punctuality: number;
    teaching: number;
    communication: number;
    patience: number;
  };
  recentReviews: Review[];
  myLessonsWithInstructor: number;
  lastLessonDate?: string;
}

interface Review {
  id: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  date: string;
  comment: string;
  lessonType: string;
}

export default function InstructorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const instructorId = params.id as string;
  const t = useTranslations('student.instructorProfile');

  const [instructor, setInstructor] = useState<InstructorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Mock fetch instructor profile
    setTimeout(() => {
      setInstructor({
        id: instructorId,
        name: 'Piotr Nowak',
        avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff',
        coverPhoto: 'https://via.placeholder.com/1200x300?text=Cover+Photo',
        rating: 4.9,
        totalReviews: 124,
        experience: t('experience', { years: 8 }),
        joinedDate: '2016-03-15',
        bio: t('bio.passionForTeaching'),
        specializations: [
          t('bio.exams'),
          t('bio.nightDriving'),
          t('bio.highways'),
          t('about.specializations'),
          t('bio.cityTraffic')
        ],
        languages: [t('bio.polish'), t('bio.english')],
        categories: [t('bio.categoryB'), t('bio.categoryBAuto')],
        completedLessons: 1250,
        totalStudents: 215,
        successRate: 94,
        responseTime: t('availability.usuallyWithinHour'),
        favorite: true,
        verified: true,
        awards: [
          t('about.instructorOfYear', { year: 2023 }),
          t('about.safeDrivingCertificate')
        ],
        pricePerHour: 180,
        availability: {
          monday: ['08:00-12:00', '14:00-18:00'],
          tuesday: ['08:00-12:00', '14:00-18:00'],
          wednesday: ['08:00-12:00', '14:00-18:00'],
          thursday: ['08:00-12:00', '14:00-18:00'],
          friday: ['08:00-12:00', '14:00-16:00'],
          saturday: ['09:00-13:00'],
          sunday: []
        },
        contact: {
          phone: '+48 123 456 789',
          email: 'piotr.nowak@szkola.pl'
        },
        stats: {
          punctuality: 98,
          teaching: 95,
          communication: 97,
          patience: 96
        },
        recentReviews: [
          {
            id: '1',
            studentName: 'Katarzyna M.',
            studentAvatar: 'https://ui-avatars.com/api/?name=Katarzyna+M&background=EC4899&color=fff',
            rating: 5,
            date: '2024-08-20',
            comment: t('reviewComments.excellentInstructor'),
            lessonType: t('recentReviews.examPreparation')
          },
          {
            id: '2',
            studentName: 'Michał K.',
            studentAvatar: 'https://ui-avatars.com/api/?name=Michal+K&background=3B82F6&color=fff',
            rating: 5,
            date: '2024-08-15',
            comment: t('reviewComments.greatContact'),
            lessonType: t('recentReviews.standardDriving')
          },
          {
            id: '3',
            studentName: 'Anna W.',
            studentAvatar: 'https://ui-avatars.com/api/?name=Anna+W&background=8B5CF6&color=fff',
            rating: 4,
            date: '2024-08-10',
            comment: t('reviewComments.professionalApproach'),
            lessonType: t('recentReviews.parking')
          }
        ],
        myLessonsWithInstructor: 15,
        lastLessonDate: '2024-08-25'
      });
      setIsFavorite(true);
      setLoading(false);
    }, 1000);
  }, [instructorId, t]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // API call to update favorite status
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-96" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="p-6">
        <Alert>
          <AlertDescription>
            {t('notFound')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const dayNames = {
    monday: t('availability.monday'),
    tuesday: t('availability.tuesday'),
    wednesday: t('availability.wednesday'),
    thursday: t('availability.thursday'),
    friday: t('availability.friday'),
    saturday: t('availability.saturday'),
    sunday: t('availability.sunday')
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Cover */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg"></div>
        <div className="absolute -bottom-12 left-6 flex items-end gap-4">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src={instructor.avatar} alt={instructor.name} />
            <AvatarFallback>
              {instructor.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{instructor.name}</h1>
              {instructor.verified && (
                <Badge variant="secondary">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {t('verified')}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{instructor.experience}</p>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <span className="text-lg font-semibold">{instructor.rating}</span>
            <span className="text-muted-foreground">{t('reviews', { count: instructor.totalReviews })}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleFavorite}>
            <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
            {isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
          </Button>
          <Button onClick={() => router.push(`/student/bookings/book?instructor=${instructor.id}`)}>
            <Calendar className="w-4 h-4 mr-2" />
            {t('bookLesson')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>{t('about.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{instructor.bio}</p>
              
              <div>
                <h4 className="font-medium mb-2">{t('about.specializations')}</h4>
                <div className="flex flex-wrap gap-2">
                  {instructor.specializations.map((spec, index) => (
                    <Badge key={index} variant="outline">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">{t('about.languages')}</h4>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{instructor.languages.join(', ')}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t('about.categories')}</h4>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{instructor.categories.join(', ')}</span>
                  </div>
                </div>
              </div>

              {instructor.awards.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">{t('about.achievements')}</h4>
                  <div className="space-y-2">
                    {instructor.awards.map((award, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">{award}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>{t('stats.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{instructor.completedLessons}</div>
                  <p className="text-sm text-muted-foreground">{t('stats.lessons')}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{instructor.totalStudents}</div>
                  <p className="text-sm text-muted-foreground">{t('stats.students')}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{instructor.successRate}%</div>
                  <p className="text-sm text-muted-foreground">{t('stats.successRate')}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {new Date().getFullYear() - parseInt(instructor.joinedDate)}
                  </div>
                  <p className="text-sm text-muted-foreground">{t('stats.yearsWithUs')}</p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h4 className="font-medium">{t('stats.detailedRatings')}</h4>
                {Object.entries(instructor.stats).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">
                        {key === 'punctuality' ? t('stats.punctuality') :
                         key === 'teaching' ? t('stats.teaching') :
                         key === 'communication' ? t('stats.communication') :
                         t('stats.patience')}
                      </span>
                      <span className="font-medium">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>{t('recentReviews.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {instructor.recentReviews.map(review => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={review.studentAvatar} alt={review.studentName} />
                            <AvatarFallback>
                              {review.studentName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.studentName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.date).toLocaleDateString('uk-UA')} • {review.lessonType}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        <Quote className="w-3 h-3 inline mr-1" />
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4 text-center">
                <Button variant="outline" className="w-full">
                  {t('recentReviews.viewAllReviews')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t('info.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('info.pricePerHour')}</span>
                <span className="font-semibold text-lg">{t('info.currency', { amount: instructor.pricePerHour })}</span>
              </div>
              <Separator />
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  {instructor.contact.phone}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  {instructor.contact.email}
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t('info.sendMessage')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Your History */}
          {instructor.myLessonsWithInstructor > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">{t('yourHistory.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('yourHistory.completedLessons')}</span>
                  <span className="font-semibold">{instructor.myLessonsWithInstructor}</span>
                </div>
                {instructor.lastLessonDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('yourHistory.lastLesson')}</span>
                    <span className="text-sm">
                      {new Date(instructor.lastLessonDate).toLocaleDateString('uk-UA')}
                    </span>
                  </div>
                )}
                <Button variant="outline" className="w-full">
                  {t('yourHistory.viewLessonHistory')}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>{t('availability.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(instructor.availability).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {dayNames[day as keyof typeof dayNames]}
                    </span>
                    <span className="font-medium">
                      {hours.length > 0 ? hours.join(', ') : t('availability.unavailable')}
                    </span>
                  </div>
                ))}
              </div>
              <Alert className="mt-4">
                <Clock className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {t('availability.responseTime')}: {instructor.responseTime}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}