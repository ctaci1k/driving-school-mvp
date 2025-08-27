// app/[locale]/student/support/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  FileText,
  Search,
  Send,
  ChevronRight,
  AlertCircle,
  BookOpen,
  Users,
  Shield,
  CreditCard,
  Car,
  Calendar,
  Settings,
  Zap,
  Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';

interface QuickAction {
  icon: React.ElementType;
  title: string;
  description: string;
  action: string;
  color: string;
}

interface ContactMethod {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
  available: boolean;
}

export default function StudentSupportPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quickActions: QuickAction[] = [
    {
      icon: FileText,
      title: 'Moje zgłoszenia',
      description: 'Zobacz status swoich zgłoszeń',
      action: '/student/support/tickets',
      color: 'blue'
    },
    {
      icon: HelpCircle,
      title: 'FAQ',
      description: 'Najczęściej zadawane pytania',
      action: '/student/support/faq',
      color: 'purple'
    },
    {
      icon: BookOpen,
      title: 'Baza wiedzy',
      description: 'Poradniki i instrukcje',
      action: '/student/support/knowledge',
      color: 'green'
    },
    {
      icon: MessageSquare,
      title: 'Czat na żywo',
      description: 'Porozmawiaj z konsultantem',
      action: 'chat',
      color: 'orange'
    }
  ];

  const contactMethods: ContactMethod[] = [
    {
      icon: Phone,
      title: 'Telefon',
      value: '+48 123 456 789',
      description: 'Pon-Pt 8:00-20:00, Sob 9:00-15:00',
      available: true
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'pomoc@szkola-jazdy.pl',
      description: 'Odpowiadamy w ciągu 24h',
      available: true
    },
    {
      icon: MessageSquare,
      title: 'Czat',
      value: 'Dostępny',
      description: 'Pon-Pt 8:00-20:00',
      available: true
    },
    {
      icon: Headphones,
      title: 'WhatsApp',
      value: '+48 123 456 789',
      description: 'Szybkie odpowiedzi',
      available: true
    }
  ];

  const popularTopics = [
    { icon: Calendar, label: 'Rezerwacje', count: 156 },
    { icon: CreditCard, label: 'Płatności', count: 89 },
    { icon: Car, label: 'Pojazdy', count: 67 },
    { icon: Users, label: 'Instruktorzy', count: 45 },
    { icon: Shield, label: 'Bezpieczeństwo', count: 34 },
    { icon: Settings, label: 'Konto', count: 28 }
  ];

  const categories = [
    { value: 'booking', label: 'Problem z rezerwacją' },
    { value: 'payment', label: 'Problem z płatnością' },
    { value: 'instructor', label: 'Problem z instruktorem' },
    { value: 'technical', label: 'Problem techniczny' },
    { value: 'account', label: 'Problem z kontem' },
    { value: 'other', label: 'Inne' }
  ];

  const handleQuickSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Błąd",
        description: "Wpisz swoją wiadomość",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        title: "Błąd",
        description: "Wybierz kategorię problemu",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setMessage('');
    setSelectedCategory('');
    
    toast({
      title: "Zgłoszenie wysłane",
      description: "Otrzymasz odpowiedź w ciągu 24 godzin"
    });
    
    router.push('/student/support/tickets');
  };

  const handleQuickAction = (action: string) => {
    if (action === 'chat') {
      // Open chat widget
      toast({
        title: "Czat uruchomiony",
        description: "Konsultant odpowie za chwilę"
      });
    } else {
      router.push(action);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Centrum pomocy</h1>
        <p className="text-muted-foreground">
          Jak możemy Ci pomóc? Znajdź odpowiedzi lub skontaktuj się z nami
        </p>
      </div>

      {/* Search Bar */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Szukaj pomocy... np. 'jak anulować lekcję'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchQuery) {
                  router.push(`/student/support/faq?search=${searchQuery}`);
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleQuickAction(action.action)}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`w-14 h-14 rounded-full bg-${action.color}-100 flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 text-${action.color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Contact Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Szybkie zgłoszenie</CardTitle>
              <CardDescription>
                Opisz swój problem, a my skontaktujemy się z Tobą
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategoria problemu</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Opis problemu</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Opisz szczegółowo swój problem..."
                  rows={5}
                />
              </div>

              <Button 
                className="w-full" 
                onClick={handleQuickSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Wysyłanie...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Wyślij zgłoszenie
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Popular Topics */}
          <Card>
            <CardHeader>
              <CardTitle>Popularne tematy</CardTitle>
              <CardDescription>
                Najczęściej przeglądane kategorie pomocy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {popularTopics.map((topic, index) => {
                  const Icon = topic.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start"
                      onClick={() => router.push(`/student/support/faq?category=${topic.label.toLowerCase()}`)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <span className="flex-1 text-left">{topic.label}</span>
                      <Badge variant="secondary" className="ml-2">
                        {topic.count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kontakt</CardTitle>
              <CardDescription>
                Wybierz preferowaną metodę kontaktu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{method.title}</p>
                        {method.available && (
                          <Badge variant="outline" className="text-xs">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                            Dostępny
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-primary">{method.value}</p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Support Agent */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <Avatar className="w-16 h-16 mx-auto">
                  <AvatarImage src="https://ui-avatars.com/api/?name=Support&background=10B981&color=fff" />
                  <AvatarFallback>SP</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Potrzebujesz pomocy?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Nasz zespół jest dostępny 7 dni w tygodniu
                  </p>
                </div>
                <Button className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Rozpocznij czat
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription>
              <strong>Pilny problem?</strong><br />
              Zadzwoń: <a href="tel:+48123456789" className="font-semibold text-orange-600">+48 123 456 789</a>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}