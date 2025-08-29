// app/[locale]/student/messages/[conversationId]/page.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Info,
  Search,
  MoreVertical,
  Star,
  Bell,
  BellOff,
  Archive,
  Trash2,
  Image,
  File,
  Mic,
  StopCircle,
  CheckCheck,
  Check,
  Clock,
  Edit,
  Reply,
  Copy,
  Forward,
  Download,
  X,
  Calendar,
  MapPin,
  Car,
  AlertCircle,
  FileText,
  Play,
  Pause
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('student.conversation');
  
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock conversation data
  const mockConversation = {
    id: '1',
    type: 'direct',
    name: 'Piotr Nowak',
    avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff',
    role: t('role'),
    online: true,
    lastSeen: t('online'),
    phone: '+48 601 234 567',
    email: 'piotr.nowak@szkola-jazdy.pl'
  };

  const mockMessages = [
    {
      id: '1',
      sender: 'Piotr Nowak',
      senderAvatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff',
      content: t('messages.greeting'),
      time: '14:30',
      date: '2024-08-27',
      isMe: false,
      status: 'read',
      type: 'text'
    },
    {
      id: '2',
      sender: 'Я',
      content: t('messages.progressResponse'),
      time: '14:32',
      date: '2024-08-27',
      isMe: true,
      status: 'read',
      type: 'text'
    },
    {
      id: '3',
      sender: 'Piotr Nowak',
      senderAvatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff',
      content: t('messages.encouragement'),
      time: '14:33',
      date: '2024-08-27',
      isMe: false,
      status: 'read',
      type: 'text'
    },
    {
      id: '4',
      sender: 'Piotr Nowak',
      senderAvatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff',
      content: t('messages.sendingMaterials'),
      time: '14:34',
      date: '2024-08-27',
      isMe: false,
      status: 'read',
      type: 'text'
    },
    {
      id: '5',
      sender: 'Piotr Nowak',
      senderAvatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff',
      content: '',
      attachment: {
        type: 'pdf',
        name: t('attachments.parkingInstructions'),
        size: '2.3',
        url: '#'
      },
      time: '14:34',
      date: '2024-08-27',
      isMe: false,
      status: 'read',
      type: 'file'
    },
    {
      id: '6',
      sender: 'Я',
      content: t('messages.thanksReview'),
      time: '14:35',
      date: '2024-08-27',
      isMe: true,
      status: 'read',
      type: 'text'
    },
    {
      id: '7',
      sender: 'Piotr Nowak',
      senderAvatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff',
      content: '',
      lessonInfo: {
        date: '2024-08-30',
        time: '14:00-16:00',
        type: t('lessonCard.cityDriving'),
        location: 'ul. Puławska 145, Warszawa',
        vehicle: 'Toyota Yaris (WZ 12345)'
      },
      time: '14:36',
      date: '2024-08-27',
      isMe: false,
      status: 'read',
      type: 'lesson'
    },
    {
      id: '8',
      sender: 'Я',
      content: t('messages.seeYouFriday'),
      time: '14:37',
      date: '2024-08-27',
      isMe: true,
      status: 'delivered',
      type: 'text'
    },
    {
      id: '9',
      sender: 'Piotr Nowak',
      senderAvatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff',
      content: t('messages.greatJob'),
      time: '16:45',
      date: '2024-08-27',
      isMe: false,
      status: 'read',
      type: 'text'
    }
  ];

  const quickReplies = [
    t('quickReplies.ok'),
    t('quickReplies.seeYou'),
    t('quickReplies.understood'),
    t('quickReplies.canIReschedule'),
    t('quickReplies.needHelp'),
    t('quickReplies.great')
  ];

  useEffect(() => {
    scrollToBottom();
  }, [mockMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle send message
      console.log('Sending:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageStatus = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="h-4 w-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-4 w-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  const formatMessageDate = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (date === today) return t('dateLabels.today');
    if (date === yesterday) return t('dateLabels.yesterday');
    return new Date(date).toLocaleDateString('uk-UA');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Chat Header */}
      <Card className="rounded-none border-x-0 border-t-0">
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/student/messages')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <Avatar>
                <AvatarImage src={mockConversation.avatar} />
                <AvatarFallback>{mockConversation.name[0]}</AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">{mockConversation.name}</h2>
                  {mockConversation.online && (
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {mockConversation.role} • {mockConversation.lastSeen}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(!showSearch)}>
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowInfo(!showInfo)}>
                <Info className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Bell className="h-4 w-4 mr-2" />
                    {t('header.mute')}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Star className="h-4 w-4 mr-2" />
                    {t('header.star')}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Archive className="h-4 w-4 mr-2" />
                    {t('header.archive')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('header.deleteConversation')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t('header.searchInConversation')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-9"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                onClick={() => {
                  setSearchTerm('');
                  setShowSearch(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardHeader>
      </Card>

      <div className="flex-1 flex">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 px-4">
            <div className="py-4 space-y-4">
              {/* Date Separator */}
              <div className="flex items-center justify-center">
                <Badge variant="secondary" className="px-3">
                  {formatMessageDate(mockMessages[0].date)}
                </Badge>
              </div>

              {/* Messages */}
              {mockMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[70%] ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                    {!msg.isMe && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.senderAvatar} />
                        <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                      </Avatar>
                    )}

                    <div>
                      {/* Message Content */}
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          msg.isMe
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setSelectedMessage(msg.id);
                        }}
                      >
                        {msg.type === 'text' && <p>{msg.content}</p>}
                        
                        {msg.type === 'file' && msg.attachment && (
                          <div className="flex items-center gap-3 p-2 bg-white/10 rounded">
                            <FileText className="h-8 w-8" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{msg.attachment.name}</p>
                              <p className="text-xs opacity-75">{t('attachments.fileSize', { size: msg.attachment.size })}</p>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        {msg.type === 'lesson' && msg.lessonInfo && (
                          <div className="space-y-2 p-2 bg-white/10 rounded">
                            <p className="font-semibold">{t('lessonCard.nextLesson')}:</p>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{msg.lessonInfo.date}, {msg.lessonInfo.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Car className="h-4 w-4" />
                                <span>{msg.lessonInfo.vehicle}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{msg.lessonInfo.location}</span>
                              </div>
                            </div>
                            <Button size="sm" variant="secondary" className="w-full">
                              {t('lessonCard.viewDetails')}
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Message Time & Status */}
                      <div className={`flex items-center gap-1 mt-1 ${
                        msg.isMe ? 'justify-end' : 'justify-start'
                      }`}>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                        {msg.isMe && getMessageStatus(msg.status)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={mockConversation.avatar} />
                    <AvatarFallback>{mockConversation.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Replies */}
          <div className="px-4 py-2 border-t">
            <div className="flex gap-2 overflow-x-auto">
              {quickReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => setMessage(reply)}
                >
                  {reply}
                </Button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-end gap-2">
              <div className="flex gap-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,application/pdf"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Smile className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1">
                <Textarea
                  placeholder={t('input.placeholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-[40px] max-h-[120px] resize-none"
                  rows={1}
                />
              </div>

              <div className="flex gap-1">
                {message.trim() ? (
                  <Button onClick={handleSendMessage}>
                    <Send className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    variant={isRecording ? 'destructive' : 'default'}
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    {isRecording ? (
                      <StopCircle className="h-5 w-5" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        {showInfo && (
          <Card className="w-80 rounded-none border-y-0 border-r-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{t('info.title')}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowInfo(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-3">
                  <AvatarImage src={mockConversation.avatar} />
                  <AvatarFallback>{mockConversation.name[0]}</AvatarFallback>
                </Avatar>
                <h4 className="font-semibold">{mockConversation.name}</h4>
                <p className="text-sm text-gray-500">{mockConversation.role}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t('info.phone')}</p>
                  <p className="font-medium">{mockConversation.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t('info.email')}</p>
                  <p className="font-medium">{mockConversation.email}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">{t('attachments.sharedFiles')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium">{t('attachments.parkingInstructions')}</p>
                      <p className="text-xs text-gray-500">2.3 MB • 27.08.2024</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">{t('info.upcomingLessons')}</h4>
                <Alert>
                  <Calendar className="h-4 w-4" />
                  <AlertDescription>
                    <strong>30.08.2024, 14:00-16:00</strong><br />
                    {t('lessonCard.cityDriving')}
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}