// app/[locale]/student/support/tickets/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('student.support.tickets');
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
        subject: t('mockData.bookingProblem'),
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
            author: t('detailsDialog.you'),
            authorType: 'student',
            content: t('mockData.bookingError'),
            timestamp: '2024-08-25T10:00:00'
          },
          {
            id: '2',
            author: 'Anna Kowalska',
            authorType: 'agent',
            content: t('mockData.bookingReply'),
            timestamp: '2024-08-25T14:30:00'
          }
        ],
        attachments: 2
      },
      {
        id: '2',
        number: 'TKT-2024-002',
        subject: t('mockData.paymentRefund'),
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
        subject: t('mockData.instructorChange'),
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
  }, [t]);

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
      open: { label: t('status.open'), className: 'bg-blue-100 text-blue-700' },
      in_progress: { label: t('status.inProgress'), className: 'bg-yellow-100 text-yellow-700' },
      resolved: { label: t('status.resolved'), className: 'bg-green-100 text-green-700' },
      closed: { label: t('status.closed'), className: 'bg-gray-100 text-gray-700' }
    };
    return variants[status];
  };

  const getPriorityBadge = (priority: Ticket['priority']) => {
    const variants = {
      low: { label: t('priority.low'), className: 'bg-gray-100 text-gray-700' },
      medium: { label: t('priority.medium'), className: 'bg-blue-100 text-blue-700' },
      high: { label: t('priority.high'), className: 'bg-orange-100 text-orange-700' },
      critical: { label: t('priority.critical'), className: 'bg-red-100 text-red-700' }
    };
    return variants[priority];
  };

  const handleCreateTicket = async () => {
    if (!newTicketSubject || !newTicketCategory || !newTicketMessage) {
      toast({
        title: t('toast.error'),
        description: t('toast.fillAllFields'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: t('toast.created'),
      description: t('toast.createdDescription')
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
        author: t('detailsDialog.you'),
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
      title: t('toast.replySent'),
      description: t('toast.replyDescription')
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
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('subtitle')}
          </p>
        </div>
        <Button onClick={() => setNewTicketDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('newTicket')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('stats.allTickets')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('stats.open')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{ticketStats.open}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('stats.inProgress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{ticketStats.inProgress}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('stats.resolved')}
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
          <CardTitle className="text-lg">{t('filters.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t('filters.searchPlaceholder')}
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
                <SelectItem value="all">{t('filters.status.all')}</SelectItem>
                <SelectItem value="open">{t('filters.status.open')}</SelectItem>
                <SelectItem value="in_progress">{t('filters.status.inProgress')}</SelectItem>
                <SelectItem value="resolved">{t('filters.status.resolved')}</SelectItem>
                <SelectItem value="closed">{t('filters.status.closed')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('newDialog.priority')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.priority.all')}</SelectItem>
                <SelectItem value="low">{t('filters.priority.low')}</SelectItem>
                <SelectItem value="medium">{t('filters.priority.medium')}</SelectItem>
                <SelectItem value="high">{t('filters.priority.high')}</SelectItem>
                <SelectItem value="critical">{t('filters.priority.critical')}</SelectItem>
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
              <p className="text-muted-foreground">{t('empty.title')}</p>
              <Button 
                className="mt-4"
                onClick={() => setNewTicketDialog(true)}
              >
                {t('empty.createFirst')}
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
                              {t('actions.viewDetails')}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="w-4 h-4 mr-2" />
                              {t('actions.archive')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {t('ticketCard.created')}: {new Date(ticket.createdAt).toLocaleDateString('uk-UA')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {t('ticketCard.lastReply')}: {new Date(ticket.lastReply).toLocaleDateString('uk-UA')}
                        </div>
                        {ticket.attachments > 0 && (
                          <div className="flex items-center gap-1">
                            <Paperclip className="w-4 h-4" />
                            {t('ticketCard.attachments', {count: ticket.attachments})}
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
                            {t('ticketCard.assignedTo')}: {ticket.agent.name}
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
            <DialogTitle>{t('newDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('newDialog.description')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">{t('newDialog.subject')}</Label>
              <Input
                id="subject"
                value={newTicketSubject}
                onChange={(e) => setNewTicketSubject(e.target.value)}
                placeholder={t('newDialog.subjectPlaceholder')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">{t('newDialog.category')}</Label>
                <Select value={newTicketCategory} onValueChange={setNewTicketCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder={t('newDialog.categoryPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="booking">{t('newDialog.categories.booking')}</SelectItem>
                    <SelectItem value="payment">{t('newDialog.categories.payment')}</SelectItem>
                    <SelectItem value="instructor">{t('newDialog.categories.instructor')}</SelectItem>
                    <SelectItem value="technical">{t('newDialog.categories.technical')}</SelectItem>
                    <SelectItem value="account">{t('newDialog.categories.account')}</SelectItem>
                    <SelectItem value="other">{t('newDialog.categories.other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">{t('newDialog.priority')}</Label>
                <Select value={newTicketPriority} onValueChange={setNewTicketPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('priority.low')}</SelectItem>
                    <SelectItem value="medium">{t('priority.medium')}</SelectItem>
                    <SelectItem value="high">{t('priority.high')}</SelectItem>
                    <SelectItem value="critical">{t('priority.critical')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{t('newDialog.message')}</Label>
              <Textarea
                id="message"
                value={newTicketMessage}
                onChange={(e) => setNewTicketMessage(e.target.value)}
                placeholder={t('newDialog.messagePlaceholder')}
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
              {t('newDialog.cancel')}
            </Button>
            <Button onClick={handleCreateTicket} disabled={isSubmitting}>
              {isSubmitting ? t('newDialog.creating') : t('newDialog.create')}
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
                            {new Date(message.timestamp).toLocaleString('uk-UA')}
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
                  placeholder={t('detailsDialog.replyPlaceholder')}
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