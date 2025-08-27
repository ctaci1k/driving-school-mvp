// /app/[locale]/instructor/messages/page.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  MessageSquare, Search, Filter, Plus, Archive,
  Star, Pin, Trash2, MoreVertical, Send, 
  Circle, CheckCheck, Clock, AlertCircle,
  Users, User, Bell, BellOff, Phone, Video
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format, formatDistanceToNow } from 'date-fns'
import { pl } from 'date-fns/locale'

export default function MessagesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Mock conversations data
  const conversations = [
    {
      id: '1',
      type: 'individual',
      participant: {
        name: 'Maria Nowak',
        avatar: 'https://ui-avatars.com/api/?name=MN&background=EC4899&color=fff',
        role: 'Student',
        status: 'online'
      },
      lastMessage: {
        text: 'Dziękuję za dzisiejszą lekcję! Do zobaczenia w przyszłym tygodniu.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isRead: true,
        sender: 'them'
      },
      unreadCount: 0,
      isPinned: true,
      isMuted: false
    },
    {
      id: '2',
      type: 'individual',
      participant: {
        name: 'Jan Kowalski',
        avatar: 'https://ui-avatars.com/api/?name=JK&background=3B82F6&color=fff',
        role: 'Student',
        status: 'offline'
      },
      lastMessage: {
        text: 'Czy możemy przełożyć jutrzejszą lekcję na 16:00?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isRead: false,
        sender: 'them'
      },
      unreadCount: 1,
      isPinned: false,
      isMuted: false
    },
    {
      id: '3',
      type: 'group',
      participant: {
        name: 'Grupa poniedziałkowa',
        avatar: 'https://ui-avatars.com/api/?name=GP&background=10B981&color=fff',
        role: 'Grupa',
        memberCount: 8
      },
      lastMessage: {
        text: 'Przypomnienie: jutro teoria o 18:00',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        isRead: true,
        sender: 'you'
      },
      unreadCount: 0,
      isPinned: false,
      isMuted: false
    },
    {
      id: '4',
      type: 'individual',
      participant: {
        name: 'Anna Wiśniewska',
        avatar: 'https://ui-avatars.com/api/?name=AW&background=8B5CF6&color=fff',
        role: 'Student',
        status: 'away'
      },
      lastMessage: {
        text: 'Mam pytanie odnośnie egzaminu praktycznego',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        isRead: false,
        sender: 'them'
      },
      unreadCount: 2,
      isPinned: false,
      isMuted: false
    },
    {
      id: '5',
      type: 'individual',
      participant: {
        name: 'Administracja',
        avatar: 'https://ui-avatars.com/api/?name=AD&background=F59E0B&color=fff',
        role: 'Administracja',
        status: 'online'
      },
      lastMessage: {
        text: 'Nowy harmonogram na luty jest już dostępny',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        isRead: true,
        sender: 'them'
      },
      unreadCount: 0,
      isPinned: true,
      isMuted: false
    },
    {
      id: '6',
      type: 'individual',
      participant: {
        name: 'Piotr Zieliński',
        avatar: 'https://ui-avatars.com/api/?name=PZ&background=EF4444&color=fff',
        role: 'Student',
        status: 'offline'
      },
      lastMessage: {
        text: 'Potwierdzam obecność na zajęciach',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
        isRead: true,
        sender: 'them'
      },
      unreadCount: 0,
      isPinned: false,
      isMuted: true
    }
  ]

  // Quick replies templates
  const quickReplies = [
    { id: 1, text: 'Tak, potwierdzam' },
    { id: 2, text: 'Nie mogę, przepraszam' },
    { id: 3, text: 'Zobaczmy się o ustalonej godzinie' },
    { id: 4, text: 'Proszę o kontakt telefoniczny' },
    { id: 5, text: 'Dziękuję za wiadomość' }
  ]

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'unread' && conv.unreadCount > 0) ||
                         (selectedFilter === 'groups' && conv.type === 'group') ||
                         (selectedFilter === 'pinned' && conv.isPinned)
    
    return matchesSearch && matchesFilter
  })

  const handleConversationClick = (chatId: string) => {
    router.push(`/instructor/messages/${chatId}`)
  }

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wiadomości</h1>
          <p className="text-gray-600">
            {totalUnread > 0 ? `${totalUnread} nieprzeczytanych` : 'Wszystkie przeczytane'}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nowa wiadomość
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Szukaj wiadomości lub osoby..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie</SelectItem>
            <SelectItem value="unread">Nieprzeczytane</SelectItem>
            <SelectItem value="groups">Grupy</SelectItem>
            <SelectItem value="pinned">Przypięte</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Conversations list */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Konwersacje</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y max-h-[calc(100vh-20rem)] overflow-y-auto">
                  {filteredConversations.map((conversation) => (
<div
  key={conversation.id}
  onClick={() => handleConversationClick(conversation.id)}
  className="w-full p-4 hover:bg-gray-50 transition-colors text-left cursor-pointer"
  role="button"
  tabIndex={0}
>
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={conversation.participant.avatar} />
                            <AvatarFallback>
                              {conversation.participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.participant.status && (
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              conversation.participant.status === 'online' ? 'bg-green-500' :
                              conversation.participant.status === 'away' ? 'bg-yellow-500' :
                              'bg-gray-300'
                            }`} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900 truncate">
                                {conversation.participant.name}
                              </p>
                              {conversation.isPinned && (
                                <Pin className="w-3 h-3 text-gray-400" />
                              )}
                              {conversation.isMuted && (
                                <BellOff className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(conversation.lastMessage.timestamp, {
                                addSuffix: false,
                                locale: pl
                              })}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <p className={`text-sm truncate ${
                              !conversation.lastMessage.isRead ? 'font-medium text-gray-900' : 'text-gray-600'
                            }`}>
                              {conversation.lastMessage.sender === 'you' && (
                                <span className="text-gray-400 mr-1">Ty:</span>
                              )}
                              {conversation.lastMessage.text}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="default" className="ml-2 min-w-[20px] h-5 px-1">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {conversation.participant.role}
                            </Badge>
                            {conversation.type === 'group' && (
                              <span className="text-xs text-gray-500">
                                {conversation.participant.memberCount} członków
                              </span>
                            )}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              {conversation.isPinned ? 'Odepnij' : 'Przypnij'}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {conversation.isMuted ? 'Włącz powiadomienia' : 'Wycisz'}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              Oznacz jako przeczytane
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Archive className="w-4 h-4 mr-2" />
                              Archiwizuj
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Usuń
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message preview / placeholder */}
          <div className="lg:col-span-2">
            <Card className="h-full flex items-center justify-center">
              <div className="text-center p-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Wybierz konwersację
                </h3>
                <p className="text-gray-600 mb-4">
                  Kliknij na konwersację po lewej stronie, aby zobaczyć wiadomości
                </p>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Rozpocznij nową rozmowę
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Quick replies */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Szybkie odpowiedzi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <Button
                key={reply.id}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {reply.text}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}