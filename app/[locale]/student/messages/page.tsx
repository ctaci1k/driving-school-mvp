// app/[locale]/student/messages/page.tsx

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  MessageSquare,
  Search,
  Filter,
  Bell,
  BellOff,
  Star,
  Archive,
  Trash2,
  MoreVertical,
  Send,
  Paperclip,
  Phone,
  Video,
  Info,
  Circle,
  CheckCheck,
  Clock,
  AlertCircle,
  Users,
  User,
  Hash,
  Plus,
  Edit,
  Pin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function MessagesPage() {
  const t = useTranslations('student.messagesList');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  // Mock data with translations
  const mockConversations = [
    {
      id: '1',
      type: 'direct',
      name: 'Piotr Nowak',
      avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff',
      role: t('roles.instructor'),
      lastMessage: t('lastMessage.greatJob'),
      lastMessageTime: t('timeAgo.minutes', { count: 10 }),
      unread: 2,
      online: true,
      pinned: true,
      muted: false
    },
    {
      id: '2',
      type: 'direct',
      name: 'Anna Kowalczyk',
      avatar: 'https://ui-avatars.com/api/?name=Anna+Kowalczyk&background=8B5CF6&color=fff',
      role: t('roles.instructor'),
      lastMessage: t('lastMessage.rememberMaterials'),
      lastMessageTime: t('timeAgo.hours', { count: 2 }),
      unread: 0,
      online: false,
      pinned: false,
      muted: false
    },
    {
      id: '3',
      type: 'group',
      name: t('groupNames.theoryGroup'),
      avatar: null,
      members: 12,
      lastMessage: t('lastMessage.whoGoingExam'),
      lastMessageTime: t('timeAgo.hours', { count: 5 }),
      unread: 5,
      online: false,
      pinned: false,
      muted: true
    },
    {
      id: '4',
      type: 'direct',
      name: t('groupNames.supportOffice'),
      avatar: 'https://ui-avatars.com/api/?name=Support&background=3B82F6&color=fff',
      role: t('roles.administration'),
      lastMessage: t('lastMessage.invoiceSent'),
      lastMessageTime: t('timeAgo.yesterday'),
      unread: 0,
      online: true,
      pinned: false,
      muted: false
    },
    {
      id: '5',
      type: 'announcement',
      name: t('groupNames.schoolAnnouncements'),
      avatar: null,
      lastMessage: t('lastMessage.newOfficeHours'),
      lastMessageTime: t('timeAgo.days', { count: 2 }),
      unread: 1,
      online: false,
      pinned: true,
      muted: false
    },
    {
      id: '6',
      type: 'direct',
      name: 'Tomasz Wiśniewski',
      avatar: 'https://ui-avatars.com/api/?name=Tomasz+Wisniewski&background=F59E0B&color=fff',
      role: t('roles.instructor'),
      lastMessage: t('lastMessage.canReschedule'),
      lastMessageTime: t('timeAgo.days', { count: 3 }),
      unread: 0,
      online: false,
      pinned: false,
      muted: false
    }
  ];

  const mockAnnouncements = [
    {
      id: '1',
      title: t('announcements.openingHoursChange'),
      content: t('announcements.openingHoursContent'),
      date: '2024-08-25',
      important: true
    },
    {
      id: '2',
      title: t('announcements.packagePromotion'),
      content: t('announcements.packagePromotionContent'),
      date: '2024-08-20',
      important: false
    }
  ];

  const filteredConversations = mockConversations.filter(conv => {
    if (searchTerm && !conv.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedTab === 'unread' && conv.unread === 0) return false;
    if (selectedTab === 'instructors' && conv.role !== t('roles.instructor')) return false;
    if (selectedTab === 'groups' && conv.type !== 'group') return false;
    if (selectedTab === 'archived') return false; // No archived messages in mock
    return true;
  });

  const totalUnread = mockConversations.reduce((sum, conv) => sum + conv.unread, 0);

  const getConversationIcon = (type: string) => {
    switch (type) {
      case 'direct': return <User className="h-4 w-4" />;
      case 'group': return <Users className="h-4 w-4" />;
      case 'announcement': return <Hash className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTimeColor = (time: string) => {
    if (time.includes('хв')) return 'text-green-600';
    if (time.includes('год')) return 'text-blue-600';
    return 'text-gray-500';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600">
            {totalUnread > 0 ? t('unreadCount', { count: totalUnread }) : t('allRead')}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t('newMessage')}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('stats.activeConversations')}</p>
                <p className="text-2xl font-bold">{mockConversations.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('stats.unread')}</p>
                <p className="text-2xl font-bold text-orange-600">{totalUnread}</p>
              </div>
              <Circle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('stats.onlineNow')}</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockConversations.filter(c => c.online).length}
                </p>
              </div>
              <div className="relative">
                <User className="h-8 w-8 text-green-500" />
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('stats.responseTime')}</p>
                <p className="text-2xl font-bold">{t('stats.minutes')}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      {mockAnnouncements.length > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <div className="space-y-2">
              {mockAnnouncements.slice(0, 2).map((announcement) => (
                <div key={announcement.id} className="flex items-start justify-between">
                  <div>
                    <strong className="text-blue-900">{announcement.title}</strong>
                    <p className="text-sm text-blue-700 mt-1">{announcement.content}</p>
                  </div>
                  {announcement.important && (
                    <Badge className="bg-red-100 text-red-700">{t('announcements.important')}</Badge>
                  )}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t('conversations.title')}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Circle className="h-4 w-4 mr-2" />
                    {t('filters.all')}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="h-4 w-4 mr-2" />
                    {t('filters.unread')}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Star className="h-4 w-4 mr-2" />
                    {t('filters.starred')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Archive className="h-4 w-4 mr-2" />
                    {t('filters.archived')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Search */}
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t('conversations.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="w-full rounded-none">
                <TabsTrigger value="all" className="flex-1">{t('conversations.all')}</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  {t('conversations.unread')}
                  {totalUnread > 0 && (
                    <Badge variant="secondary" className="ml-1 px-1 min-w-[20px] h-5">
                      {totalUnread}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="groups" className="flex-1">{t('conversations.groups')}</TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[500px]">
                <div className="p-2 space-y-1">
                  {filteredConversations.map((conversation) => (
                    <Link
                      key={conversation.id}
                      href={`/student/messages/${conversation.id}`}
                      className="block"
                    >
                      <div
                        className={`p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors ${
                          selectedConversation === conversation.id ? 'bg-blue-50' : ''
                        } ${conversation.unread > 0 ? 'bg-blue-50/50' : ''}`}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            {conversation.avatar ? (
                              <Avatar>
                                <AvatarImage src={conversation.avatar} />
                                <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                {getConversationIcon(conversation.type)}
                              </div>
                            )}
                            {conversation.online && (
                              <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className={`font-medium ${conversation.unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {conversation.name}
                                  </p>
                                  {conversation.pinned && (
                                    <Pin className="h-3 w-3 text-gray-400" />
                                  )}
                                  {conversation.muted && (
                                    <BellOff className="h-3 w-3 text-gray-400" />
                                  )}
                                </div>
                                {conversation.role && (
                                  <p className="text-xs text-gray-500">{conversation.role}</p>
                                )}
                              </div>
                              <span className={`text-xs ${getTimeColor(conversation.lastMessageTime)}`}>
                                {conversation.lastMessageTime}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-1">
                              <p className={`text-sm truncate ${
                                conversation.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                              }`}>
                                {conversation.lastMessage}
                              </p>
                              {conversation.unread > 0 && (
                                <Badge className="bg-blue-500 text-white min-w-[20px] h-5 px-1">
                                  {conversation.unread}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>

        {/* Message Preview / Empty State */}
        <Card className="lg:col-span-2">
          <CardContent className="h-[600px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('emptyState.selectConversation')}</h3>
              <p className="text-gray-500 mb-4">
                {t('emptyState.clickToView')}
              </p>
              <Link href="/student/messages/1">
                <Button variant="outline">
                  {t('emptyState.openLastConversation')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('quickActions.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-2" />
              {t('quickActions.starred')}
            </Button>
            <Button variant="outline" size="sm">
              <Archive className="h-4 w-4 mr-2" />
              {t('quickActions.archive')}
            </Button>
            <Button variant="outline" size="sm">
              <BellOff className="h-4 w-4 mr-2" />
              {t('quickActions.muted')}
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              {t('quickActions.trash')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}