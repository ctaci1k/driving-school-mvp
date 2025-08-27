// app/[locale]/student/support/tickets/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Calendar,
  User,
  Paperclip,
  Send,
  MoreVertical,
  Eye,
  Archive,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';

interface Ticket {
  id: string;
  number: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  lastReply: string;
  agent?: {
    name: string;
    avatar: string;
  };
  messages: Message[];
  attachments: number;
}

interface Message {
  id: string;
  author: string;
  authorType: 'student' | 'agent';
  content: string;
  timestamp: string;
  attachments?: string[];
}

export default function SupportTicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newTicketDialog, setNewTicketDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  
  // New ticket form
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState('medium');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  
  // Reply form
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Mock data
    const mockTickets: Ticket[] = [
      {
        id: '1',
        number: 'TKT-2024-001',
        subject: 'Problem z rezerwacją lekcji',
        category: 'booking',
        status: 'open',
        priority: 'high',
        createdAt: '2024-08-25T10:00:00',
        updatedAt: '2024-08-25T14:30:00',
        lastReply: '2024-08-25T14:30:00',
        agent: {
          name: 'Anna Kowalska',
          avatar: 'https://ui-avatars.com/api/?name=Anna+Kowalska&background=8B5CF6&color=fff'
        },
        messages: [
          {
            id: '1',
            author: 'Ty',
            authorType: 'student',
            content: 'Nie mogę zarezerwować lekcji na przyszły tydzień. System pokazuje błąd.',
            timestamp: '2024-08-25T10:00:00'
          },
          {
            id: '2',
            author: 'Anna Kowalska',
            authorType: 'agent',
            content: 'Dziękujemy za zgłoszenie. Sprawdzamy problem i wkrótce go rozwiążemy.',
            timestamp: '2024-08-25T14:30:00'
          }
        ],
        attachments: 2
      },
      {
        id: '2',
        number: 'TKT-2024-002',
        subject: 'Zwrot płatności',
        category: 'payment',
        status: 'resolved',
        priority: 'medium',
        createdAt: '2024-08-20T09:00:00',
        updatedAt: '2024-08-22T16:00:00',
        lastReply: '2024-08-22T16:00:00',
        messages: [],
        attachments: 0
      },
      {
        id: '3',
        number: 'TKT-2024-003',
        subject: 'Zmiana instruktora',
        category: 'instructor',
        status: 'in_progress',
        priority: 'low',
        createdAt: '2024-08-23T11:00:00',
        updatedAt: '2024-08-24T10:00:00',
        lastReply: '2024-08-24T10:00:00',
        agent: {
          name: 'Piotr Nowak',
          avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff'
        },
        messages: [],
        attachments: 1
      }
    ];

    setTimeout(() => {
      setTickets(mockTickets);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchQuery === '' || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.number.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: Ticket['status']) => {
    const variants = {
      open: { label: 'Otwarty', className: 'bg-blue-100 text-blue-700' },
      in_progress: { label: 'W trakcie', className: 'bg-yellow-100 text-yellow-700' },
      resolved: { label: 'Rozwiązany', className: 'bg-green-100 text-green-700' },
      closed: { label: 'Zamknięty', className: 'bg-gray-100 text-gray-700' }
    };
    return variants[status];
  };

  const getPriorityBadge = (priority: Ticket['priority']) => {
    const variants = {
      low: { label: 'Niski', className: 'bg-gray-100 text-gray-700' },
      medium: { label: 'Średni', className: 'bg-blue-100 text-blue-700' },
      high: { label: 'Wysoki', className: 'bg-orange-100 text-orange-700' },
      critical: { label: 'Krytyczny', className: 'bg-red-100 text-red-700' }
    };
    return variants[priority];
  };

  const handleCreateTicket = async () => {
    if (!newTicketSubject || !newTicketCategory || !newTicketMessage) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie wymagane pola",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Zgłoszenie utworzone",
      description: "Otrzymasz odpowiedź w ciągu 24 godzin"
    });
    
    setNewTicketDialog(false);
    setNewTicketSubject('');
    setNewTicketCategory('');
    setNewTicketMessage('');
    setIsSubmitting(false);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (selectedTicket) {
      const newMessage: Message = {
        id: Date.now().toString(),
        author: 'Ty',
        authorType: 'student',
        content: replyMessage,
        timestamp: new Date().toISOString()
      };
      
      setSelectedTicket({
        ...selectedTicket,
        messages: [...selectedTicket.messages, newMessage]
      });
    }
    
    setReplyMessage('');
    setIsSubmitting(false);
    
    toast({
      title: "Odpowiedź wysłana",
      description: "Twoja wiadomość została dodana do zgłoszenia"
    });
  };

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Moje zgłoszenia</h1>
          <p className="text-muted-foreground mt-1">
            Zarządzaj swoimi zgłoszeniami do supportu
          </p>
        </div>
        <Button onClick={() => setNewTicketDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nowe zgłoszenie
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wszystkie zgłoszenia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Otwarte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{ticketStats.open}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              W trakcie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{ticketStats.inProgress}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rozwiązane
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{ticketStats.resolved}</div>
          </CardContent>
        </Card>
      </div>

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
                  placeholder="Szukaj zgłoszeń..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="open">Otwarte</SelectItem>
                <SelectItem value="in_progress">W trakcie</SelectItem>
                <SelectItem value="resolved">Rozwiązane</SelectItem>
                <SelectItem value="closed">Zamknięte</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Priorytet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="low">Niski</SelectItem>
                <SelectItem value="medium">Średni</SelectItem>
                <SelectItem value="high">Wysoki</SelectItem>
                <SelectItem value="critical">Krytyczny</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nie masz jeszcze żadnych zgłoszeń</p>
              <Button 
                className="mt-4"
                onClick={() => setNewTicketDialog(true)}
              >
                Utwórz pierwsze zgłoszenie
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map(ticket => {
            const statusInfo = getStatusBadge(ticket.status);
            const priorityInfo = getPriorityBadge(ticket.priority);
            
            return (
              <Card 
                key={ticket.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm text-muted-foreground">#{ticket.number}</p>
                            <Badge className={statusInfo.className}>
                              {statusInfo.label}
                            </Badge>
                            <Badge className={priorityInfo.className}>
                              {priorityInfo.label}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedTicket(ticket)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Zobacz szczegóły
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="w-4 h-4 mr-2" />
                              Archiwizuj
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Utworzono: {new Date(ticket.createdAt).toLocaleDateString('pl-PL')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Ostatnia odpowiedź: {new Date(ticket.lastReply).toLocaleDateString('pl-PL')}
                        </div>
                        {ticket.attachments > 0 && (
                          <div className="flex items-center gap-1">
                            <Paperclip className="w-4 h-4" />
                            {ticket.attachments} załącznik(i)
                          </div>
                        )}
                      </div>

                      {ticket.agent && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={ticket.agent.avatar} alt={ticket.agent.name} />
                            <AvatarFallback>{ticket.agent.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            Przypisany do: {ticket.agent.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button variant="ghost" size="icon">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* New Ticket Dialog */}
      <Dialog open={newTicketDialog} onOpenChange={setNewTicketDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nowe zgłoszenie</DialogTitle>
            <DialogDescription>
              Opisz swój problem, a nasz zespół pomoże Ci go rozwiązać
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Temat *</Label>
              <Input
                id="subject"
                value={newTicketSubject}
                onChange={(e) => setNewTicketSubject(e.target.value)}
                placeholder="Krótki opis problemu"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategoria *</Label>
                <Select value={newTicketCategory} onValueChange={setNewTicketCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="booking">Rezerwacje</SelectItem>
                    <SelectItem value="payment">Płatności</SelectItem>
                    <SelectItem value="instructor">Instruktorzy</SelectItem>
                    <SelectItem value="technical">Problemy techniczne</SelectItem>
                    <SelectItem value="account">Konto</SelectItem>
                    <SelectItem value="other">Inne</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priorytet</Label>
                <Select value={newTicketPriority} onValueChange={setNewTicketPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Niski</SelectItem>
                    <SelectItem value="medium">Średni</SelectItem>
                    <SelectItem value="high">Wysoki</SelectItem>
                    <SelectItem value="critical">Krytyczny</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Opis problemu *</Label>
              <Textarea
                id="message"
                value={newTicketMessage}
                onChange={(e) => setNewTicketMessage(e.target.value)}
                placeholder="Opisz szczegółowo swój problem..."
                rows={6}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewTicketDialog(false)}
              disabled={isSubmitting}
            >
              Anuluj
            </Button>
            <Button onClick={handleCreateTicket} disabled={isSubmitting}>
              {isSubmitting ? 'Wysyłanie...' : 'Utwórz zgłoszenie'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ticket Details Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          {selectedTicket && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle>{selectedTicket.subject}</DialogTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-sm text-muted-foreground">#{selectedTicket.number}</p>
                      <Badge className={getStatusBadge(selectedTicket.status).className}>
                        {getStatusBadge(selectedTicket.status).label}
                      </Badge>
                      <Badge className={getPriorityBadge(selectedTicket.priority).className}>
                        {getPriorityBadge(selectedTicket.priority).label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {selectedTicket.messages.map(message => (
                    <div key={message.id} className={`flex gap-3 ${
                      message.authorType === 'agent' ? 'flex-row-reverse' : ''
                    }`}>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {message.author[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex-1 ${
                        message.authorType === 'agent' ? 'text-right' : ''
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{message.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleString('pl-PL')}
                          </p>
                        </div>
                        <div className={`inline-block p-3 rounded-lg ${
                          message.authorType === 'agent'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator />

              <div className="flex gap-2">
                <Input
                  placeholder="Napisz odpowiedź..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                />
                <Button onClick={handleSendReply} disabled={isSubmitting || !replyMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}