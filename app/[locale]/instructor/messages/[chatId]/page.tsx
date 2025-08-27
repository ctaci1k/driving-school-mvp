// /app/[locale]/instructor/messages/[chatId]/page.tsx

'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, Send, Paperclip, MoreVertical, Phone, Video,
  Info, Search, Smile, Mic, Image, File, MapPin,
  CheckCheck, Check, Clock, Edit, Reply, Copy, Trash2,
  Star, Forward, Download, X, Play, Pause
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { format, isToday, isYesterday } from 'date-fns'
import { pl } from 'date-fns/locale'

interface Message {
  id: string
  text?: string
  type: 'text' | 'image' | 'file' | 'voice' | 'location'
  sender: 'you' | 'them'
  timestamp: Date
  status: 'sending' | 'sent' | 'delivered' | 'read'
  isEdited?: boolean
  replyTo?: string
  attachments?: {
    name: string
    size: string
    url: string
  }[]
}

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const chatId = params?.chatId as string
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [messageText, setMessageText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  // Mock participant data
  const participant = {
    id: chatId,
    name: 'Maria Nowak',
    avatar: 'https://ui-avatars.com/api/?name=MN&background=EC4899&color=fff',
    status: 'online',
    lastSeen: new Date(),
    phone: '+48 123 456 789',
    email: 'maria.nowak@example.com',
    role: 'Student',
    lessonsCompleted: 15,
    nextLesson: '5 lutego, 14:00'
  }

  // Mock messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Dzień dobry! Chciałabym zapytać o jutrzejszą lekcję.',
      type: 'text',
      sender: 'them',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'read'
    },
    {
      id: '2',
      text: 'Dzień dobry! Oczywiście, o co chodzi?',
      type: 'text',
      sender: 'you',
      timestamp: new Date(Date.now() - 1000 * 60 * 55),
      status: 'read'
    },
    {
      id: '3',
      text: 'Czy moglibyśmy zacząć trochę później? Mam wizytę u lekarza o 13:00 i nie wiem czy zdążę na 14:00.',
      type: 'text',
      sender: 'them',
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
      status: 'read'
    },
    {
      id: '4',
      text: 'Jasne, możemy przesunąć na 15:00. Pasuje?',
      type: 'text',
      sender: 'you',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      status: 'read'
    },
    {
      id: '5',
      text: 'Idealnie! Bardzo dziękuję za wyrozumiałość 😊',
      type: 'text',
      sender: 'them',
      timestamp: new Date(Date.now() - 1000 * 60 * 40),
      status: 'read'
    },
    {
      id: '6',
      text: 'Nie ma za co. Do zobaczenia jutro o 15:00.',
      type: 'text',
      sender: 'you',
      timestamp: new Date(Date.now() - 1000 * 60 * 35),
      status: 'read'
    },
    {
      id: '7',
      text: 'Jeszcze jedno pytanie - czy mogłabym dostać materiały do nauki teorii?',
      type: 'text',
      sender: 'them',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'read'
    },
    {
      id: '8',
      text: 'Oczywiście, zaraz przesyłam.',
      type: 'text',
      sender: 'you',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      status: 'read'
    },
    {
      id: '9',
      type: 'file',
      attachments: [{
        name: 'Materiały_do_teorii.pdf',
        size: '2.3 MB',
        url: '#'
      }],
      sender: 'you',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      status: 'read'
    },
    {
      id: '10',
      text: 'Dziękuję! Przeczytam przed jutrzejszą lekcją.',
      type: 'text',
      sender: 'them',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      status: 'read'
    }
  ])

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: String(messages.length + 1),
        text: messageText,
        type: 'text',
        sender: 'you',
        timestamp: new Date(),
        status: 'sending',
        replyTo: replyingTo?.id
      }
      
      setMessages([...messages, newMessage])
      setMessageText('')
      setReplyingTo(null)
      
      // Simulate message status updates
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === newMessage.id ? { ...m, status: 'sent' } : m
        ))
      }, 500)
      
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === newMessage.id ? { ...m, status: 'delivered' } : m
        ))
      }, 1000)
      
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === newMessage.id ? { ...m, status: 'read' } : m
        ))
      }, 1500)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const newMessage: Message = {
        id: String(messages.length + 1),
        type: 'file',
        attachments: [{
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          url: '#'
        }],
        sender: 'you',
        timestamp: new Date(),
        status: 'sending'
      }
      setMessages([...messages, newMessage])
    }
  }

  const formatMessageTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'HH:mm')
    } else if (isYesterday(date)) {
      return `Wczoraj ${format(date, 'HH:mm')}`
    } else {
      return format(date, 'dd.MM.yyyy HH:mm')
    }
  }

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3" />
      case 'sent':
        return <Check className="w-3 h-3" />
      case 'delivered':
        return <CheckCheck className="w-3 h-3" />
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Chat header */}
      <Card className="rounded-b-none">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="md:hidden"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <Avatar>
                <AvatarImage src={participant.avatar} />
                <AvatarFallback>
                  {participant.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="font-semibold">{participant.name}</h2>
                <p className="text-sm text-gray-500">
                  {participant.status === 'online' ? (
                    <span className="text-green-600">Online</span>
                  ) : (
                    `Ostatnio widziany ${formatMessageTime(participant.lastSeen)}`
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="w-5 h-5" />
              </Button>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Informacje o kontakcie</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div className="flex flex-col items-center">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="mt-3 font-semibold text-lg">{participant.name}</h3>
                      <Badge>{participant.role}</Badge>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Telefon</p>
                        <p className="font-medium">{participant.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{participant.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ukończone lekcje</p>
                        <p className="font-medium">{participant.lessonsCompleted}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Następna lekcja</p>
                        <p className="font-medium">{participant.nextLesson}</p>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          {/* Search bar */}
          {showSearch && (
            <div className="mt-4">
              <Input
                placeholder="Szukaj w konwersacji..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Messages area */}
      <ScrollArea className="flex-1 p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'you' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] ${
                  message.sender === 'you' ? 'order-2' : 'order-1'
                }`}
              >
                {/* Reply reference */}
                {message.replyTo && (
                  <div className="text-xs text-gray-500 mb-1 px-3">
                    Odpowiedź na wiadomość
                  </div>
                )}
                
                <div
                  className={`relative group ${
                    message.sender === 'you'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white'
                  } rounded-lg shadow-sm`}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    setSelectedMessage(message.id)
                  }}
                >
                  {message.type === 'text' && (
                    <div className="px-4 py-2">
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    </div>
                  )}
                  
                  {message.type === 'file' && message.attachments && (
                    <div className="p-4">
                      {message.attachments.map((attachment, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <File className="w-8 h-8" />
                          <div className="flex-1">
                            <p className="font-medium">{attachment.name}</p>
                            <p className="text-sm opacity-75">{attachment.size}</p>
                          </div>
                          <Button size="icon" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className={`flex items-center justify-between px-4 pb-2 text-xs ${
                    message.sender === 'you' ? 'text-white/75' : 'text-gray-500'
                  }`}>
                    <span>
                      {formatMessageTime(message.timestamp)}
                      {message.isEdited && ' (edytowano)'}
                    </span>
                    {message.sender === 'you' && (
                      <span className="ml-2">
                        {getMessageStatusIcon(message.status)}
                      </span>
                    )}
                  </div>
                  
                  {/* Message actions */}
                  <div className={`absolute top-0 ${
                    message.sender === 'you' ? '-left-24' : '-right-24'
                  } hidden group-hover:flex items-center gap-1 bg-white rounded-lg shadow-lg p-1`}>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => setReplyingTo(message)}
                    >
                      <Reply className="w-4 h-4" />
                    </Button>
                    {message.sender === 'you' && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => setEditingMessage(message.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                    {message.sender === 'you' && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Reply preview */}
      {replyingTo && (
        <div className="px-4 py-2 bg-gray-100 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Odpowiadasz na:</p>
              <p className="text-sm truncate">{replyingTo.text}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => setReplyingTo(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Message input */}
      <Card className="rounded-t-none">
        <CardContent className="p-4">
          <div className="flex items-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
            />
            
            <div className="flex-1">
              <Textarea
                placeholder="Napisz wiadomość..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="min-h-[40px] max-h-[120px] resize-none"
                rows={1}
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Smile className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid grid-cols-8 gap-2">
                  {['😊', '😂', '😍', '🤔', '👍', '👏', '🎉', '❤️'].map((emoji) => (
                    <button
                      key={emoji}
                      className="text-2xl hover:bg-gray-100 rounded p-1"
                      onClick={() => setMessageText(messageText + emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            {messageText.trim() ? (
              <Button onClick={handleSendMessage}>
                <Send className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                variant={isRecording ? 'destructive' : 'default'}
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? <Pause className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}