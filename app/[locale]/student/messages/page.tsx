// File: /app/[locale]/(student)/student/messages/page.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Send, Paperclip, Search, Filter, Phone, Video,
  Info, Smile, Mic, Image, File, Check, CheckCheck, Clock,
  Bell, BellOff, Archive, Trash2, Star, MoreVertical, X,
  User, Users, Megaphone, HelpCircle, AlertCircle, ChevronDown
} from 'lucide-react';

export default function StudentMessagesPage() {
  const [selectedChat, setSelectedChat] = useState('1');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, instructors, support, announcements
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data
  const chats = [
    {
      id: '1',
      type: 'instructor',
      name: 'Piotr Nowak',
      avatar: 'https://ui-avatars.com/api/?name=Piotr+Nowak&background=10B981&color=fff',
      lastMessage: 'Świetnie Ci poszło dzisiaj! Do zobaczenia na następnej lekcji.',
      timestamp: '14:30',
      unread: 2,
      online: true,
      role: 'Instruktor'
    },
    {
      id: '2',
      type: 'instructor',
      name: 'Anna Kowalczyk',
      avatar: 'https://ui-avatars.com/api/?name=Anna+Kowalczyk&background=8B5CF6&color=fff',
      lastMessage: 'Pamiętaj o materiałach, które Ci wysłałam',
      timestamp: 'Wczoraj',
      unread: 0,
      online: false,
      role: 'Instruktor'
    },
    {
      id: '3',
      type: 'support',
      name: 'Wsparcie AutoSzkoła',
      avatar: 'https://ui-avatars.com/api/?name=Support&background=3B82F6&color=fff',
      lastMessage: 'Twoje zgłoszenie zostało rozwiązane',
      timestamp: '2 dni',
      unread: 0,
      online: true,
      role: 'Support'
    },
    {
      id: '4',
      type: 'announcement',
      name: 'Ogłoszenia szkoły',
      avatar: 'https://ui-avatars.com/api/?name=Info&background=F59E0B&color=fff',
      lastMessage: '📢 Nowe godziny otwarcia biura',
      timestamp: '3 dni',
      unread: 1,
      online: null,
      role: 'Ogłoszenia'
    }
  ];

  const messages = {
    '1': [
      {
        id: 1,
        sender: 'instructor',
        text: 'Cześć Jan! Jak się czujesz przed jutrzejszą lekcją?',
        timestamp: '14:15',
        read: true
      },
      {
        id: 2,
        sender: 'user',
        text: 'Cześć! Trochę się stresuję, bo to będzie moja pierwsza jazda nocna',
        timestamp: '14:20',
        read: true
      },
      {
        id: 3,
        sender: 'instructor',
        text: 'Nie martw się, będziemy jechać spokojnie. Zaczniemy od mniej ruchliwych ulic.',
        timestamp: '14:22',
        read: true
      },
      {
        id: 4,
        sender: 'instructor',
        text: 'Przygotowałem dla Ciebie specjalną trasę, która pozwoli Ci stopniowo przyzwyczaić się do jazdy w ciemności',
        timestamp: '14:25',
        read: true,
        attachment: {
          type: 'file',
          name: 'trasa_jazda_nocna.pdf',
          size: '245 KB'
        }
      },
      {
        id: 5,
        sender: 'user',
        text: 'Super, dziękuję! Przejrzę przed lekcją',
        timestamp: '14:28',
        read: true
      },
      {
        id: 6,
        sender: 'instructor',
        text: 'Świetnie Ci poszło dzisiaj! Do zobaczenia na następnej lekcji.',
        timestamp: '14:30',
        read: false
      }
    ],
    '2': [
      {
        id: 1,
        sender: 'instructor',
        text: 'Witam! Wysyłam materiały z dzisiejszej lekcji',
        timestamp: 'Wczoraj 16:00',
        read: true
      },
      {
        id: 2,
        sender: 'instructor',
        text: 'Znajdziesz tu wszystkie znaki drogowe, które omawialiśmy',
        timestamp: 'Wczoraj 16:01',
        read: true,
        attachment: {
          type: 'image',
          name: 'znaki_drogowe.jpg',
          size: '1.2 MB'
        }
      },
      {
        id: 3,
        sender: 'user',
        text: 'Dziękuję bardzo! Na pewno powtórzę przed następną lekcją',
        timestamp: 'Wczoraj 18:30',
        read: true
      },
      {
        id: 4,
        sender: 'instructor',
        text: 'Pamiętaj o materiałach, które Ci wysłałam',
        timestamp: 'Wczoraj 19:00',
        read: true
      }
    ],
    '3': [
      {
        id: 1,
        sender: 'support',
        text: 'Dzień dobry! Otrzymaliśmy Pana zgłoszenie dotyczące problemu z rezerwacją.',
        timestamp: '3 dni temu',
        read: true
      },
      {
        id: 2,
        sender: 'user',
        text: 'Tak, nie mogę zarezerwować lekcji na przyszły tydzień',
        timestamp: '3 dni temu',
        read: true
      },
      {
        id: 3,
        sender: 'support',
        text: 'Sprawdziliśmy system i znaleźliśmy błąd. Został już naprawiony.',
        timestamp: '2 dni temu',
        read: true
      },
      {
        id: 4,
        sender: 'support',
        text: 'Twoje zgłoszenie zostało rozwiązane',
        timestamp: '2 dni temu',
        read: true
      }
    ],
    '4': [
      {
        id: 1,
        sender: 'announcement',
        text: '📢 Informujemy, że od przyszłego tygodnia zmieniają się godziny otwarcia biura.',
        timestamp: '3 dni temu',
        read: false
      },
      {
        id: 2,
        sender: 'announcement',
        text: 'Nowe godziny:\nPoniedziałek - Piątek: 8:00 - 18:00\nSobota: 9:00 - 14:00\nNiedziela: Nieczynne',
        timestamp: '3 dni temu',
        read: false
      }
    ]
  };

  const quickReplies = [
    'Dziękuję!',
    'Ok, rozumiem',
    'Do zobaczenia',
    'Będę o tej godzinie',
    'Muszę przełożyć lekcję'
  ];

  const emojis = ['😊', '👍', '👌', '🚗', '✅', '🎉', '💪', '🙏'];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat]);

  const sendMessage = () => {
    if (messageText.trim()) {
      // Handle sending message
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const filteredChats = chats.filter(chat => {
    if (filterType !== 'all' && chat.type !== filterType) return false;
    if (searchQuery && !chat.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

const currentChat = chats.find(chat => chat.id === selectedChat);
const currentMessages = messages[selectedChat as keyof typeof messages] || [];

  return (
    <div className="h-[calc(100vh-64px)] flex bg-gray-50">
      {/* Chat List Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Search and Filter */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Szukaj konwersacji..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Wszystkie' },
              { value: 'instructor', label: 'Instruktorzy' },
              { value: 'support', label: 'Wsparcie' },
              { value: 'announcement', label: 'Ogłoszenia' }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => setFilterType(filter.value)}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  filterType === filter.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors ${
                selectedChat === chat.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="relative">
                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full" />
                {chat.online !== null && (
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    chat.online ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
              
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-800">{chat.name}</p>
                  <span className="text-xs text-gray-500">{chat.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate pr-2">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">{chat.role}</span>
              </div>
            </button>
          ))}
        </div>

        {/* New Message Button */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Nowa wiadomość
          </button>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={currentChat.avatar} alt={currentChat.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-800">{currentChat.name}</p>
                    <p className="text-sm text-gray-500">
                      {currentChat.online === true ? 'Online' : 
                       currentChat.online === false ? 'Offline' : 
                       currentChat.role}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {currentChat.type === 'instructor' && (
                    <>
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Phone className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Video className="w-5 h-5 text-gray-600" />
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => setShowChatInfo(!showChatInfo)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Info className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {currentMessages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
  <div className={`rounded-lg px-4 py-2 ${
    message.sender === 'user' 
      ? 'bg-blue-500 text-white' 
      : 'bg-white text-gray-800 border border-gray-200'
  }`}>
    <p className="text-sm">{message.text}</p>
    
    {(message as any).attachment && (
      <div className={`mt-2 p-2 rounded flex items-center gap-2 ${
        message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-50'
      }`}>
        {(message as any).attachment.type === 'image' ? (
          <Image className="w-4 h-4" />
        ) : (
          <File className="w-4 h-4" />
        )}
        <span className="text-xs">{(message as any).attachment.name}</span>
        <span className="text-xs opacity-75">({(message as any).attachment.size})</span>
      </div>
    )}
  </div>
  
  <div className={`flex items-center gap-2 mt-1 ${
    message.sender === 'user' ? 'justify-end' : 'justify-start'
  }`}>
    <span className="text-xs text-gray-500">{message.timestamp}</span>
    {message.sender === 'user' && (
      message.read ? (
        <CheckCheck className="w-3 h-3 text-blue-500" />
      ) : (
        <Check className="w-3 h-3 text-gray-400" />
      )
    )}
  </div>
</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {currentChat.type === 'instructor' && (
              <div className="px-6 py-2 bg-white border-t border-gray-100">
                <div className="flex gap-2 overflow-x-auto">
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => setMessageText(reply)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors whitespace-nowrap"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex items-end space-x-3">
                <button 
                  onClick={handleFileUpload}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => console.log('File selected:', e.target.files)}
                />
                
                <div className="flex-1 relative">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Napisz wiadomość..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={1}
                  />
                  
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-2 bottom-2 p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <Smile className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  {showEmojiPicker && (
                    <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                      <div className="grid grid-cols-4 gap-1">
                        {emojis.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => {
                              setMessageText(messageText + emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="p-2 hover:bg-gray-100 rounded transition-colors text-xl"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Mic className="w-5 h-5 text-gray-600" />
                </button>
                
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim()}
                  className={`p-2 rounded-lg transition-colors ${
                    messageText.trim()
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Wybierz konwersację, aby rozpocząć</p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Info Sidebar */}
      {showChatInfo && currentChat && (
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Informacje</h3>
            <button 
              onClick={() => setShowChatInfo(false)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="text-center mb-6">
            <img src={currentChat.avatar} alt={currentChat.name} className="w-20 h-20 rounded-full mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800">{currentChat.name}</h4>
            <p className="text-sm text-gray-500">{currentChat.role}</p>
          </div>

          {currentChat.type === 'instructor' && (
            <>
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-sm text-gray-800">piotr.nowak@autoszkola.pl</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Telefon</p>
                  <p className="text-sm text-gray-800">+48 123 456 789</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Specjalizacje</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">Egzaminy</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">Jazda nocna</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">Autostrady</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Zarezerwuj lekcję
                </button>
                <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Zobacz profil
                </button>
              </div>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Opcje czatu</h4>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <Bell className="w-4 h-4" />
                Wycisz powiadomienia
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <Archive className="w-4 h-4" />
                Archiwizuj
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
                Usuń konwersację
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}