// File: /app/[locale]/(student)/student/help/page.tsx
'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, Search, MessageSquare, Phone, Mail, MapPin,
  Clock, ChevronRight, ChevronDown, Book, Video, FileText,
  AlertCircle, CheckCircle, Info, Users, Car, CreditCard,
  Calendar, Shield, Smartphone, Globe, Headphones, Send,
  ExternalLink, Star, ThumbsUp, ThumbsDown, Copy, Check
} from 'lucide-react';

export default function StudentHelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: 'general',
    message: '',
    priority: 'normal'
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [helpfulArticles, setHelpfulArticles] = useState<Set<string>>(new Set());

  // Mock data
  const categories = [
    { id: 'all', name: 'Wszystkie', icon: Book, count: 45 },
    { id: 'booking', name: 'Rezerwacje', icon: Calendar, count: 12 },
    { id: 'payment', name: 'Płatności', icon: CreditCard, count: 8 },
    { id: 'account', name: 'Konto', icon: Users, count: 10 },
    { id: 'lessons', name: 'Lekcje', icon: Car, count: 15 }
  ];

  const faqItems = [
    {
      id: 'faq1',
      category: 'booking',
      question: 'Jak zarezerwować pierwszą lekcję?',
      answer: 'Aby zarezerwować pierwszą lekcję, przejdź do sekcji "Zarezerwuj lekcję" w menu głównym. Wybierz preferowanego instruktora, datę i godzinę, a następnie potwierdź rezerwację. Pamiętaj, że pierwsza lekcja wymaga wcześniejszego kontaktu z instruktorem.',
      helpful: 234,
      views: 1567
    },
    {
      id: 'faq2',
      category: 'booking',
      question: 'Jak anulować lub przełożyć lekcję?',
      answer: 'Lekcję możesz anulować lub przełożyć do 24 godzin przed jej rozpoczęciem bez utraty kredytów. Wejdź w "Mój kalendarz", znajdź lekcję i wybierz odpowiednią opcję. W przypadku anulowania później, kredyty mogą przepaść.',
      helpful: 189,
      views: 945
    },
    {
      id: 'faq3',
      category: 'payment',
      question: 'Jak kupić pakiet kredytów?',
      answer: 'Przejdź do sekcji "Płatności" i wybierz zakładkę "Pakiety". Wybierz odpowiedni pakiet, kliknij "Kup pakiet" i postępuj zgodnie z instrukcjami płatności. Akceptujemy płatności przez Przelewy24, BLIK i karty kredytowe.',
      helpful: 156,
      views: 823
    },
    {
      id: 'faq4',
      category: 'payment',
      question: 'Czy mogę otrzymać fakturę?',
      answer: 'Tak, faktury są automatycznie generowane po każdej płatności. Znajdziesz je w sekcji "Płatności" → "Historia płatności". Możesz je pobrać w formacie PDF lub wysłać na email.',
      helpful: 98,
      views: 412
    },
    {
      id: 'faq5',
      category: 'account',
      question: 'Jak zmienić hasło do konta?',
      answer: 'Aby zmienić hasło, przejdź do "Profil" → "Bezpieczeństwo" → "Zmień hasło". Wprowadź obecne hasło, a następnie nowe hasło dwukrotnie. Ze względów bezpieczeństwa zalecamy używanie silnych haseł.',
      helpful: 67,
      views: 289
    },
    {
      id: 'faq6',
      category: 'lessons',
      question: 'Ile trwa standardowa lekcja jazdy?',
      answer: 'Standardowa lekcja jazdy trwa 90 minut. Możliwe są również lekcje 60-minutowe (dla powtórek) oraz 120-minutowe (intensywne, np. przed egzaminem). Czas lekcji wybierasz podczas rezerwacji.',
      helpful: 245,
      views: 1890
    }
  ];

  const videoTutorials = [
    {
      id: 'v1',
      title: 'Jak zarezerwować pierwszą lekcję',
      duration: '3:45',
      thumbnail: 'https://placehold.co/300x200?text=Tutorial+1',
      views: 2345
    },
    {
      id: 'v2',
      title: 'Zarządzanie kredytami',
      duration: '2:30',
      thumbnail: 'https://placehold.co/300x200?text=Tutorial+2',
      views: 1567
    },
    {
      id: 'v3',
      title: 'Korzystanie z kalendarza',
      duration: '4:15',
      thumbnail: 'https://placehold.co/300x200?text=Tutorial+3',
      views: 987
    }
  ];

  const helpArticles = [
    {
      id: 'a1',
      category: 'booking',
      title: 'Kompletny przewodnik po rezerwacji lekcji',
      description: 'Dowiedz się wszystkiego o procesie rezerwacji, od wyboru instruktora po potwierdzenie terminu.',
      readTime: '5 min',
      icon: Calendar,
      updated: '2024-08-20'
    },
    {
      id: 'a2',
      category: 'payment',
      title: 'System kredytów - jak to działa?',
      description: 'Zrozum system kredytów, pakiety i oszczędności przy zakupie większych pakietów.',
      readTime: '3 min',
      icon: Coins,
      updated: '2024-08-15'
    },
    {
      id: 'a3',
      category: 'lessons',
      title: 'Przygotowanie do pierwszej lekcji',
      description: 'Co zabrać, jak się przygotować i czego oczekiwać na pierwszej lekcji jazdy.',
      readTime: '4 min',
      icon: Car,
      updated: '2024-08-10'
    },
    {
      id: 'a4',
      category: 'account',
      title: 'Bezpieczeństwo konta i danych',
      description: 'Najlepsze praktyki zabezpieczania konta i ochrony danych osobowych.',
      readTime: '6 min',
      icon: Shield,
      updated: '2024-08-05'
    }
  ];

  const contactInfo = {
    phone: '+48 123 456 789',
    email: 'pomoc@autoszkola.pl',
    address: 'ul. Przykładowa 123, 00-001 Warszawa',
    hours: {
      weekdays: '8:00 - 20:00',
      saturday: '9:00 - 16:00',
      sunday: '10:00 - 14:00'
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleHelpful = (articleId: string) => {
    setHelpfulArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const filteredFaq = faqItems.filter(item => 
    (selectedCategory === 'all' || item.category === selectedCategory) &&
    (searchQuery === '' || 
     item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredArticles = helpArticles.filter(article =>
    (selectedCategory === 'all' || article.category === selectedCategory) &&
    (searchQuery === '' || 
     article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     article.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Centrum pomocy</h1>
        <p className="text-gray-600">Znajdź odpowiedzi na swoje pytania</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Czego szukasz? Np. 'jak anulować lekcję'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>
          
          {/* Quick Categories */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.name}</span>
                  {cat.id !== 'all' && (
                    <span className="text-xs opacity-75">({cat.count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">Czat na żywo</h3>
          <p className="text-sm text-gray-600">Porozmawiaj z konsultantem</p>
          <p className="text-xs text-green-600 mt-2">● Dostępny teraz</p>
        </button>

        <button className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">Zadzwoń do nas</h3>
          <p className="text-sm text-gray-600">{contactInfo.phone}</p>
          <p className="text-xs text-gray-500 mt-2">Pon-Pt: {contactInfo.hours.weekdays}</p>
        </button>

        <button className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">Wyślij email</h3>
          <p className="text-sm text-gray-600">{contactInfo.email}</p>
          <p className="text-xs text-gray-500 mt-2">Odpowiedź w ciągu 24h</p>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Najczęściej zadawane pytania</h2>
            
            <div className="space-y-3">
              {filteredFaq.map(item => (
                <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <HelpCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-800">{item.question}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedFaq === item.id ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {expandedFaq === item.id && (
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700 mb-3">{item.answer}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-green-600">
                            <ThumbsUp className="w-4 h-4" />
                            <span>Pomocne ({item.helpful})</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-500 hover:text-red-600">
                            <ThumbsDown className="w-4 h-4" />
                            <span>Niepomocne</span>
                          </button>
                        </div>
                        <span className="text-xs text-gray-400">{item.views} wyświetleń</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Help Articles */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Przydatne artykuły</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map(article => {
                const Icon = article.icon;
                return (
                  <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{article.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{article.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{article.readTime} czytania</span>
                            <span>•</span>
                            <span>Zaktualizowano {article.updated}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                        Czytaj więcej
                      </button>
                      <button
                        onClick={() => toggleHelpful(article.id)}
                        className={`px-3 py-1.5 rounded-lg transition-colors ${
                          helpfulArticles.has(article.id)
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Video Tutorials */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Samouczki wideo</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {videoTutorials.map(video => (
                <div key={video.id} className="group cursor-pointer">
                  <div className="relative mb-2 rounded-lg overflow-hidden">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-32 object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <Video className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-800 text-sm mb-1">{video.title}</h4>
                  <p className="text-xs text-gray-500">{video.views} wyświetleń</p>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 text-blue-600 hover:underline text-sm">
              Zobacz wszystkie samouczki →
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Nie znalazłeś odpowiedzi?</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temat</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Krótki opis problemu"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria</label>
                <select
                  value={contactForm.category}
                  onChange={(e) => setContactForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">Ogólne</option>
                  <option value="technical">Problem techniczny</option>
                  <option value="payment">Płatności</option>
                  <option value="booking">Rezerwacje</option>
                  <option value="other">Inne</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wiadomość</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Opisz swój problem..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priorytet</label>
                <div className="flex gap-2">
                  {['low', 'normal', 'high'].map(priority => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setContactForm(prev => ({ ...prev, priority }))}
                      className={`flex-1 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                        contactForm.priority === priority
                          ? priority === 'high' ? 'bg-red-500 text-white' :
                            priority === 'normal' ? 'bg-blue-500 text-white' :
                            'bg-gray-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {priority === 'low' ? 'Niski' : priority === 'normal' ? 'Normalny' : 'Wysoki'}
                    </button>
                  ))}
                </div>
              </div>
              
              <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Wyślij wiadomość
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Kontakt</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">{contactInfo.phone}</p>
                  <button
                    onClick={() => handleCopy(contactInfo.phone, 'phone')}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                  >
                    {copiedId === 'phone' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedId === 'phone' ? 'Skopiowano!' : 'Kopiuj'}
                  </button>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">{contactInfo.email}</p>
                  <button
                    onClick={() => handleCopy(contactInfo.email, 'email')}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                  >
                    {copiedId === 'email' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedId === 'email' ? 'Skopiowano!' : 'Kopiuj'}
                  </button>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">Biuro główne</p>
                  <p className="text-sm text-gray-600">{contactInfo.address}</p>
                  <a href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1">
                    Zobacz na mapie
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium text-gray-800 mb-2">Godziny otwarcia</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Poniedziałek - Piątek:</span>
                      <span className="font-medium">{contactInfo.hours.weekdays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sobota:</span>
                      <span className="font-medium">{contactInfo.hours.saturday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Niedziela:</span>
                      <span className="font-medium">{contactInfo.hours.sunday}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Kontakt awaryjny</h3>
            </div>
            <p className="text-sm text-red-700 mb-3">
              W przypadku sytuacji awaryjnej podczas lekcji:
            </p>
            <button className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 font-semibold">
              <Phone className="w-4 h-4" />
              112 - Numer alarmowy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add missing import
import { Coins } from 'lucide-react';