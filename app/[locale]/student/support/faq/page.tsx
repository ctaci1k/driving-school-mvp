// app/[locale]/student/support/faq/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  CreditCard,
  Car,
  Users,
  Shield,
  Settings,
  BookOpen,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
  tags: string[];
  relatedQuestions?: string[];
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  count: number;
  description: string;
}

export default function SupportFAQPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';
  
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [votedItems, setVotedItems] = useState<Set<string>>(new Set());

  const categories: Category[] = [
    { id: 'all', name: 'Wszystkie', icon: BookOpen, count: 0, description: 'Wszystkie pytania' },
    { id: 'rezerwacje', name: 'Rezerwacje', icon: Calendar, count: 12, description: 'Rezerwacje i harmonogram' },
    { id: 'platnosci', name: 'Płatności', icon: CreditCard, count: 8, description: 'Płatności i faktury' },
    { id: 'pojazdy', name: 'Pojazdy', icon: Car, count: 6, description: 'Pojazdy i wyposażenie' },
    { id: 'instruktorzy', name: 'Instruktorzy', icon: Users, count: 7, description: 'Instruktorzy i oceny' },
    { id: 'bezpieczenstwo', name: 'Bezpieczeństwo', icon: Shield, count: 5, description: 'Bezpieczeństwo i zasady' },
    { id: 'konto', name: 'Konto', icon: Settings, count: 9, description: 'Ustawienia konta' }
  ];

  useEffect(() => {
    // Mock FAQ data
    const mockFAQ: FAQItem[] = [
      // Rezerwacje
      {
        id: '1',
        question: 'Jak zarezerwować lekcję jazdy?',
        answer: 'Aby zarezerwować lekcję jazdy, przejdź do sekcji "Rezerwacje" w menu głównym, wybierz preferowany termin, instruktora i potwierdź rezerwację. System automatycznie sprawdzi dostępność i prześle potwierdzenie na Twój email.',
        category: 'rezerwacje',
        helpful: 145,
        notHelpful: 12,
        tags: ['rezerwacja', 'lekcja', 'termin'],
        relatedQuestions: ['2', '3']
      },
      {
        id: '2',
        question: 'Jak anulować lub przełożyć lekcję?',
        answer: 'Lekcję możesz anulować lub przełożyć do 24 godzin przed jej rozpoczęciem bez utraty kredytów. Wejdź w szczegóły rezerwacji i wybierz odpowiednią opcję. W przypadku anulowania z krótszym wyprzedzeniem, kredyty mogą przepaść zgodnie z regulaminem.',
        category: 'rezerwacje',
        helpful: 89,
        notHelpful: 5,
        tags: ['anulowanie', 'przełożenie', 'zmiana terminu']
      },
      {
        id: '3',
        question: 'Co się dzieje, gdy instruktor anuluje lekcję?',
        answer: 'Jeśli instruktor anuluje lekcję, otrzymasz pełny zwrot kredytów oraz propozycję alternatywnego terminu. Zostaniesz powiadomiony SMS-em i emailem. Możesz wybrać innego instruktora lub termin bez dodatkowych opłat.',
        category: 'rezerwacje',
        helpful: 67,
        notHelpful: 3,
        tags: ['anulowanie', 'instruktor', 'zwrot']
      },
      
      // Płatności
      {
        id: '4',
        question: 'Jakie metody płatności są dostępne?',
        answer: 'Akceptujemy płatności kartą kredytową/debetową, przelewy bankowe, BLIK, oraz płatności przez Przelewy24. Możesz także kupić pakiety kredytów z rabatem. Wszystkie transakcje są zabezpieczone protokołem SSL.',
        category: 'platnosci',
        helpful: 234,
        notHelpful: 8,
        tags: ['płatność', 'karta', 'przelew', 'blik']
      },
      {
        id: '5',
        question: 'Jak otrzymać fakturę?',
        answer: 'Faktura jest automatycznie generowana po każdej płatności i wysyłana na email. Możesz też pobrać ją z sekcji "Płatności" > "Historia płatności". Jeśli potrzebujesz faktury na firmę, zaktualizuj dane w ustawieniach konta przed płatnością.',
        category: 'platnosci',
        helpful: 156,
        notHelpful: 4,
        tags: ['faktura', 'dokument', 'rozliczenie']
      },
      {
        id: '6',
        question: 'Czy mogę otrzymać zwrot pieniędzy?',
        answer: 'Zwrot pieniędzy jest możliwy zgodnie z regulaminem - w ciągu 14 dni od zakupu pakietu, jeśli nie wykorzystałeś żadnego kredytu. W przypadku pojedynczych lekcji, zwrot następuje tylko przy anulowaniu z 24-godzinnym wyprzedzeniem.',
        category: 'platnosci',
        helpful: 78,
        notHelpful: 12,
        tags: ['zwrot', 'refundacja', 'anulowanie']
      },
      
      // Instruktorzy
      {
        id: '7',
        question: 'Jak zmienić instruktora?',
        answer: 'Możesz zmienić instruktora w dowolnym momencie. Przejdź do sekcji "Instruktorzy", wybierz nowego instruktora i zarezerwuj z nim lekcję. Jeśli masz wykupiony pakiet, kredyty pozostają bez zmian.',
        category: 'instruktorzy',
        helpful: 92,
        notHelpful: 6,
        tags: ['instruktor', 'zmiana', 'wybór']
      },
      {
        id: '8',
        question: 'Jak ocenić instruktora?',
        answer: 'Po każdej lekcji otrzymasz prośbę o ocenę instruktora. Możesz też dodać opinię w sekcji "Historia lekcji". Twoja opinia pomoże innym kursantom w wyborze instruktora i pomoże nam podnosić jakość usług.',
        category: 'instruktorzy',
        helpful: 45,
        notHelpful: 2,
        tags: ['ocena', 'opinia', 'feedback']
      },
      
      // Konto
      {
        id: '9',
        question: 'Jak zmienić hasło?',
        answer: 'Aby zmienić hasło, przejdź do "Ustawienia konta" > "Bezpieczeństwo" i wybierz "Zmień hasło". Będziesz musiał podać obecne hasło oraz nowe hasło (minimum 8 znaków, zawierające litery i cyfry).',
        category: 'konto',
        helpful: 123,
        notHelpful: 3,
        tags: ['hasło', 'bezpieczeństwo', 'zmiana']
      },
      {
        id: '10',
        question: 'Nie mogę się zalogować - co robić?',
        answer: 'Sprawdź czy wprowadzasz poprawny email i hasło. Jeśli zapomniałeś hasła, użyj opcji "Zapomniałem hasła" na stronie logowania. Jeśli problem persist, skontaktuj się z supportem.',
        category: 'konto',
        helpful: 189,
        notHelpful: 7,
        tags: ['logowanie', 'hasło', 'dostęp']
      }
    ];

    setTimeout(() => {
      setFaqItems(mockFAQ);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredFAQ = faqItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleVote = (itemId: string, isHelpful: boolean) => {
    if (votedItems.has(itemId)) {
      toast({
        title: "Już głosowałeś",
        description: "Możesz ocenić każde pytanie tylko raz",
        variant: "destructive"
      });
      return;
    }

    setFaqItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          helpful: isHelpful ? item.helpful + 1 : item.helpful,
          notHelpful: !isHelpful ? item.notHelpful + 1 : item.notHelpful
        };
      }
      return item;
    }));

    setVotedItems(prev => new Set([...prev, itemId]));

    toast({
      title: "Dziękujemy za opinię",
      description: "Twoja ocena pomoże nam ulepszyć FAQ"
    });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/student/support')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Często zadawane pytania</h1>
          <p className="text-muted-foreground mt-1">
            Znajdź odpowiedzi na najczęściej zadawane pytania
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Szukaj pytań..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 h-auto">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{category.name}</span>
                {category.count > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {filteredFAQ.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nie znaleziono pytań pasujących do Twoich kryteriów
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  Wyczyść filtry
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFAQ.map(item => (
                <AccordionItem key={item.id} value={item.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-start gap-3 text-left">
                      <HelpCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium">{item.question}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <p className="text-muted-foreground mb-4 pl-8">
                      {item.answer}
                    </p>
                    
                    <div className="flex items-center justify-between pl-8">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          Czy to było pomocne?
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVote(item.id, true)}
                            disabled={votedItems.has(item.id)}
                          >
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            {item.helpful}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVote(item.id, false)}
                            disabled={votedItems.has(item.id)}
                          >
                            <ThumbsDown className="w-4 h-4 mr-1" />
                            {item.notHelpful}
                          </Button>
                        </div>
                      </div>
                      
                      {item.relatedQuestions && item.relatedQuestions.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Zobacz też: {item.relatedQuestions.length} powiązanych pytań
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>
      </Tabs>

      {/* Still need help? */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Nie znalazłeś odpowiedzi?</CardTitle>
          <CardDescription>
            Nasz zespół support jest gotowy, aby Ci pomóc
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button onClick={() => router.push('/student/support/tickets')}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Utwórz zgłoszenie
            </Button>
            <Button variant="outline" onClick={() => router.push('/student/support')}>
              <HelpCircle className="w-4 h-4 mr-2" />
              Centrum pomocy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}