// app/[locale]/student/instructors/feedback/[bookingId]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Star,
  User,
  Car,
  Calendar,
  Clock,
  MessageSquare,
  ThumbsUp,
  Send,
  ChevronLeft,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

interface BookingDetails {
  id: string;
  date: string;
  time: string;
  lessonType: string;
  duration: number;
  instructor: {
    id: string;
    name: string;
    avatar: string;
  };
  vehicle: {
    make: string;
    model: string;
    registration: string;
  };
}

interface FeedbackForm {
  overallRating: number;
  punctuality: number;
  teaching: number;
  communication: number;
  patience: number;
  wouldRecommend: boolean | null;
  comment: string;
  improvements: string[];
}

export default function InstructorFeedbackPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.bookingId as string;
  const t = useTranslations('student.instructorFeedback');

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  const [feedback, setFeedback] = useState<FeedbackForm>({
    overallRating: 0,
    punctuality: 50,
    teaching: 50,
    communication: 50,
    patience: 50,
    wouldRecommend: null,
    comment: '',
    improvements: []
  });

  const improvementOptions = [
    t('improvements.moreParking'),
    t('improvements.moreCityDriving'),
    t('improvements.highwayDriving'),
    t('improvements.defensiveDriving'),
    t('improvements.emergencyManeuvers'),
    t('improvements.difficultConditions'),
    t('improvements.moreTheory'),
    t('improvements.examPreparation')
  ];

  useEffect(() => {
    // Mock fetch booking details
    setTimeout(() => {
      setBooking({
        id: bookingId,
        date: '2024-08-25',
        time: '10:00',
        lessonType: t('lessonTypes.standard'),
        duration: 90,
        instructor: {
          id: '1',
          name: 'Piotr Nowak',
          avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff'
        },
        vehicle: {
          make: 'Toyota',
          model: 'Yaris',
          registration: 'WZ 12345'
        }
      });
      setLoading(false);
    }, 1000);
  }, [bookingId, t]);

  const handleSubmit = async () => {
    if (feedback.overallRating === 0) {
      toast({
        title: t('toast.error'),
        description: t('errors.selectRating'),
        variant: "destructive"
      });
      return;
    }

    if (feedback.wouldRecommend === null) {
      toast({
        title: t('toast.error'),
        description: t('errors.selectRecommendation'),
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setFeedbackSubmitted(true);
    setSubmitting(false);
    
    toast({
      title: t('toast.thankYou'),
      description: t('toast.helpImprove')
    });
    
    setTimeout(() => {
      router.push('/student/bookings');
    }, 3000);
  };

  const toggleImprovement = (improvement: string) => {
    setFeedback(prev => ({
      ...prev,
      improvements: prev.improvements.includes(improvement)
        ? prev.improvements.filter(i => i !== improvement)
        : [...prev.improvements, improvement]
    }));
  };

  const getRatingMessage = (rating: number) => {
    switch (rating) {
      case 5:
        return t('overallRating.excellent');
      case 4:
        return t('overallRating.veryGood');
      case 3:
        return t('overallRating.okay');
      case 2:
        return t('overallRating.couldBeBetter');
      case 1:
        return t('overallRating.poor');
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('lessonNotFound')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (feedbackSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{t('success.title')}</h2>
            <p className="text-muted-foreground mb-4">
              {t('success.description')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('redirecting')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Lesson Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('lessonInfo.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={booking.instructor.avatar} alt={booking.instructor.name} />
                <AvatarFallback>
                  {booking.instructor.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{booking.instructor.name}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(booking.date).toLocaleDateString('uk-UA')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {booking.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Car className="w-3 h-3" />
                    {booking.vehicle.make} {booking.vehicle.model}
                  </span>
                </div>
              </div>
            </div>
            <Badge>{booking.lessonType}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Overall Rating */}
      <Card>
        <CardHeader>
          <CardTitle>{t('overallRating.title')}</CardTitle>
          <CardDescription>
            {t('overallRating.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setFeedback(prev => ({ ...prev, overallRating: rating }))}
                className="p-2 transition-all hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    rating <= feedback.overallRating
                      ? 'text-yellow-500 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {feedback.overallRating > 0 && (
            <p className="text-center mt-4 text-muted-foreground">
              {getRatingMessage(feedback.overallRating)}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Detailed Ratings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('detailedRating.title')}</CardTitle>
          <CardDescription>
            {t('detailedRating.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>{t('detailedRating.punctuality')}</Label>
              <span className="text-sm font-medium">{feedback.punctuality}%</span>
            </div>
            <Slider
              value={[feedback.punctuality]}
              onValueChange={(value) => setFeedback(prev => ({ ...prev, punctuality: value[0] }))}
              max={100}
              step={10}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>{t('detailedRating.teachingSkills')}</Label>
              <span className="text-sm font-medium">{feedback.teaching}%</span>
            </div>
            <Slider
              value={[feedback.teaching]}
              onValueChange={(value) => setFeedback(prev => ({ ...prev, teaching: value[0] }))}
              max={100}
              step={10}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>{t('detailedRating.communication')}</Label>
              <span className="text-sm font-medium">{feedback.communication}%</span>
            </div>
            <Slider
              value={[feedback.communication]}
              onValueChange={(value) => setFeedback(prev => ({ ...prev, communication: value[0] }))}
              max={100}
              step={10}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>{t('detailedRating.patience')}</Label>
              <span className="text-sm font-medium">{feedback.patience}%</span>
            </div>
            <Slider
              value={[feedback.patience]}
              onValueChange={(value) => setFeedback(prev => ({ ...prev, patience: value[0] }))}
              max={100}
              step={10}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recommendation.title')}</CardTitle>
          <CardDescription>
            {t('recommendation.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={feedback.wouldRecommend?.toString() || ''}
            onValueChange={(value) => setFeedback(prev => ({ ...prev, wouldRecommend: value === 'true' }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="recommend-yes" />
              <Label htmlFor="recommend-yes" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-green-500" />
                  {t('recommendation.yes')}
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="recommend-no" />
              <Label htmlFor="recommend-no" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-red-500 rotate-180" />
                  {t('recommendation.no')}
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Written Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>{t('writtenFeedback.title')}</CardTitle>
          <CardDescription>
            {t('writtenFeedback.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="comment">{t('writtenFeedback.commentLabel')}</Label>
            <Textarea
              id="comment"
              placeholder={t('writtenFeedback.commentPlaceholder')}
              value={feedback.comment}
              onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
              className="mt-2"
              rows={4}
            />
          </div>

          <div>
            <Label>{t('writtenFeedback.areasToImprove')}</Label>
            <p className="text-sm text-muted-foreground mb-3">
              {t('writtenFeedback.areasDescription')}
            </p>
            <div className="flex flex-wrap gap-2">
              {improvementOptions.map((option) => (
                <Badge
                  key={option}
                  variant={feedback.improvements.includes(option) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleImprovement(option)}
                >
                  {option}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={submitting}
        >
          {t('buttons.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <>{t('buttons.submitting')}</>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              {t('buttons.submit')}
            </>
          )}
        </Button>
      </div>

      <Alert>
        <MessageSquare className="h-4 w-4" />
        <AlertDescription>
          {t('alert.anonymous')}
        </AlertDescription>
      </Alert>
    </div>
  );
}