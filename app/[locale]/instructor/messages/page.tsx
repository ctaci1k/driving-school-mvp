// /app/[locale]/instructor/messages/page.tsx
'use client'

import { useState } from 'react'
import { 
  MessageSquare, Search, Send, Paperclip, MoreVertical,
  Phone, Video, Info, Smile, Mic, Image as ImageIcon,
  Check, CheckCheck, Clock, Star, Archive, Trash,
  Filter, Plus, ChevronLeft, Pin, VolumeX 
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: string
  read: boolean
  delivered: boolean
  type: 'text' | 'image' | 'file' | 'voice'
  attachment?: {
    url: string
    name: string
    size?: string
  }
}

interface Conversation {
  id: string
  user: {
    id: string
    name: string
    avatar: string
    role: 'student' | 'admin' | 'parent'
    online: boolean
    lastSeen?: string
  }
  lastMessage: {
    text: string
    timestamp: string
    isMe: boolean
  }
  unreadCount: number
  isPinned?: boolean
  isMuted?: boolean
}

export default function InstructorMessages() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1')
  const [messageText, setMessageText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Mock conversations
  const conversations: Conversation[] = [
    {
      id: '1',
      user: {
        id: 's1',
        name: 'Марія Шевчук',
        avatar: 'https://ui-avatars.com/api/?name=MS&background=10B981&color=fff',
        role: 'student',
        online: true
      },
      lastMessage: {
        text: 'Дякую за сьогоднішнє заняття!',
        timestamp: '2024-02-03T18:30:00',
        isMe: false
      },
      unreadCount: 2,
      isPinned: true
    },
    {
      id: '2',
      user: {
        id: 's2',
        name: 'Іван Петренко',
        avatar: 'https://ui-avatars.com/api/?name=IP&background=3B82F6&color=fff',
        role: 'student',
        online: false,
        lastSeen: '2024-02-03T16:00:00'
      },
      lastMessage: {
        text: 'Добре, зустрінемось завтра о 10:00',
        timestamp: '2024-02-03T14:20:00',
        isMe: true
      },
      unreadCount: 0
    },
    {
      id: '3',
      user: {
        id: 'a1',
        name: 'Адміністрація',
        avatar: 'https://ui-avatars.com/api/?name=A&background=6366F1&color=fff',
        role: 'admin',
        online: false
      },
      lastMessage: {
        text: 'Нагадуємо про звіт за місяць',
        timestamp: '2024-02-02T10:00:00',
        isMe: false
      },
      unreadCount: 1
    },
    {
      id: '4',
      user: {
        id: 's3',
        name: 'Олена Коваленко',
        avatar: 'https://ui-avatars.com/api/?name=OK&background=EC4899&color=fff',
        role: 'student',
        online: false,
        lastSeen: '2024-02-03T12:00:00'
      },
      lastMessage: {
        text: 'Чи можна перенести заняття на інший час?',
        timestamp: '2024-02-03T11:45:00',
        isMe: false
      },
      unreadCount: 1
    }
  ]

  // Mock messages for selected conversation
  const messages: Message[] = [
    {
      id: '1',
      senderId: 's1',
      text: 'Доброго дня! Чи можна сьогодні попрацювати над паралельним паркуванням?',
      timestamp: '2024-02-03T10:00:00',
      read: true,
      delivered: true,
      type: 'text'
    },
    {
      id: '2',
      senderId: 'me',
      text: 'Звичайно! Сьогодні обов\'язково приділимо цьому увагу.',
      timestamp: '2024-02-03T10:05:00',
      read: true,
      delivered: true,
      type: 'text'
    },
    {
      id: '3',
      senderId: 's1',
      text: 'Супер! До зустрічі о 14:30',
      timestamp: '2024-02-03T10:10:00',
      read: true,
      delivered: true,
      type: 'text'
    },
    {
      id: '4',
      senderId: 'me',
      text: '👍',
      timestamp: '2024-02-03T10:11:00',
      read: true,
      delivered: true,
      type: 'text'
    },
    {
      id: '5',
      senderId: 's1',
      text: 'Дякую за сьогоднішнє заняття!',
      timestamp: '2024-02-03T18:25:00',
      read: true,
      delivered: true,
      type: 'text'
    },
    {
      id: '6',
      senderId: 's1',
      text: 'Паралельне паркування вже краще виходить 😊',
      timestamp: '2024-02-03T18:30:00',
      read: false,
      delivered: true,
      type: 'text'
    }
  ]

  const currentConversation = conversations.find(c => c.id === selectedConversation)

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log('Sending message:', messageText)
      setMessageText('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => 
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Conversations List */}
      <Card className="w-80 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-3">
            <CardTitle>Повідомлення</CardTitle>
            <Button size="icon" variant="ghost">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Пошук..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full">
            <div className="p-3 space-y-2">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all hover:bg-gray-50 ${
                    selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.user.avatar} />
                        <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
                      </Avatar>
                      {conversation.user.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{conversation.user.name}</p>
                          {conversation.isPinned && <Pin className="w-3 h-3 text-gray-400" />}
                          {conversation.isMuted && <VolumeX  className="w-3 h-3 text-gray-400" />}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {format(new Date(conversation.lastMessage.timestamp), 'HH:mm')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage.isMe && <span className="text-gray-400">Ви: </span>}
                          {conversation.lastMessage.text}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge className="ml-2 h-5 min-w-[20px] px-1">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      {currentConversation ? (
        <Card className="flex-1 flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button size="icon" variant="ghost" className="lg:hidden">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Avatar>
                  <AvatarImage src={currentConversation.user.avatar} />
                  <AvatarFallback>{currentConversation.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{currentConversation.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {currentConversation.user.online 
                      ? 'Онлайн' 
                      : currentConversation.user.lastSeen 
                        ? `Був(ла) ${format(new Date(currentConversation.user.lastSeen), 'HH:mm')}`
                        : 'Офлайн'
                    }
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Video className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Info className="w-4 h-4 mr-2" />
                      Інформація
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Search className="w-4 h-4 mr-2" />
                      Пошук в чаті
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pin className="w-4 h-4 mr-2" />
                      Закріпити
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <VolumeX  className="w-4 h-4 mr-2" />
                      Вимкнути сповіщення
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Archive className="w-4 h-4 mr-2" />
                      Архівувати
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.senderId === 'me' ? 'order-2' : ''}`}>
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          message.senderId === 'me'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="break-words">{message.text}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 ${
                          message.senderId === 'me' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span className="text-xs">
                            {format(new Date(message.timestamp), 'HH:mm')}
                          </span>
                          {message.senderId === 'me' && (
                            message.read ? (
                              <CheckCheck className="w-3 h-3" />
                            ) : message.delivered ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                    <span className="text-sm">друкує...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Button size="icon" variant="ghost">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <ImageIcon className="w-4 h-4" />
              </Button>
              <Textarea
                placeholder="Написати повідомлення..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                rows={1}
              />
              <Button size="icon" variant="ghost">
                <Smile className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Mic className="w-4 h-4" />
              </Button>
              <Button 
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Оберіть чат для початку спілкування</p>
          </div>
        </Card>
      )}
    </div>
  )
}