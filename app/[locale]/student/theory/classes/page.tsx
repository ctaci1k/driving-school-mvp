// app/[locale]/student/theory/classes/page.tsx

'use client';

import { useState } from 'react';
import { 
  Calendar,
  Clock,
  Users,
  MapPin,
  Video,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Bell,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BookOpen,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TheoryClassesPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const monthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  const classTypes = [
    { id: 'all', name: 'Wszystkie' },
    { id: 'lecture', name: 'Wykłady' },
    { id: 'workshop', name: 'Warsztaty' },
    { id: 'practice', name: 'Ćwiczenia' },
    { id: 'online', name: 'Online' }
  ];

  const statusTypes = [
    { id: 'all', name: 'Wszystkie' },
    { id: 'upcoming', name: 'Nadchodzące' },
    { id: 'completed', name: 'Ukończone' },
    { id: 'missed', name: 'Opuszczone' },
    { id: 'cancelled', name: 'Odwołane' }
  ];

  const classes = [
    {
      id: 1,
      title: 'Znaki drogowe - nakazu i zakazu',
      date: '2024-01-25',
      time: '16:00-18:00',
      type: 'lecture',
      status: 'upcoming',
      instructor: 'mgr Jan Kowalski',
      room: 'Sala 3',
      attendees: 12,
      maxAttendees: 20,
      description: 'Omówienie znaków nakazu i zakazu, przykłady z praktyki',
      materials: true,
      online: false
    },
    {
      id: 2,
      title: 'Jazda w różnych warunkach atmosferycznych',
      date: '2024-01-26',
      time: '18:00-20:00',
      type: 'workshop',
      status: 'upcoming',
      instructor: 'mgr Anna Nowak',
      room: 'Sala 1',
      attendees: 8,
      maxAttendees: 15,
      description: 'Techniki jazdy w deszczu, śniegu i mgle',
      materials: true,
      online: true
    },
    {
      id: 3,
      title: 'Budowa i obsługa pojazdu',
      date: '2024-01-27',
      time: '14:00-15:30',
      type: 'practice',
      status: 'upcoming',
      instructor: 'inż. Piotr Wiśniewski',
      room: 'Warsztat',
      attendees: 10,
      maxAttendees: 10,
      description: 'Praktyczne zajęcia w warsztacie - kontrola płynów, wymiana koła',
      materials: false,
      online: false
    },
    {
      id: 4,
      title: 'Pierwsza pomoc',
      date: '2024-02-01',
      time: '16:00-17:00',
      type: 'lecture',
      status: 'upcoming',
      instructor: 'dr Maria Lewandowska',
      room: 'Sala 2',
      attendees: 5,
      maxAttendees: 25,
      description: 'Podstawy udzielania pierwszej pomocy w wypadkach drogowych',
      materials: true,
      online: true
    },
    {
      id: 5,
      title: 'Przepisy ruchu drogowego',
      date: '2024-01-20',
      time: '16:00-18:00',
      type: 'lecture',
      status: 'completed',
      instructor: 'mgr Jan Kowalski',
      room: 'Sala 3',
      attendees: 18,
      maxAttendees: 20,
      description: 'Podstawowe przepisy, pierwszeństwo przejazdu',
      materials: true,
      online: false,
      attended: true,
      score: 92
    },
    {
      id: 6,
      title: 'Znaki drogowe - ostrzegawcze',
      date: '2024-01-18',
      time: '16:00-17:30',
      type: 'lecture',
      status: 'completed',
      instructor: 'mgr Jan Kowalski',
      room: 'Sala 3',
      attendees: 15,
      maxAttendees: 20,
      description: 'Znaki ostrzegające o niebezpieczeństwach',
      materials: true,
      online: false,
      attended: true,
      score: 88
    },
    {
      id: 7,
      title: 'Manewry parkingowe',
      date: '2024-01-15',
      time: '14:00-16:00',
      type: 'practice',
      status: 'completed',
      instructor: 'mgr Tomasz Zieliński',
      room: 'Plac manewrowy',
      attendees: 8,
      maxAttendees: 8,
      description: 'Praktyczne ćwiczenia parkowania',
      materials: false,
      online: false,
      attended: true,
      score: 85
    },
    {
      id: 8,
      title: 'Ekonomiczna jazda',
      date: '2024-01-22',
      time: '18:00-19:00',
      type: 'online',
      status: 'missed',
      instructor: 'mgr Anna Nowak',
      room: 'Online',
      attendees: 12,
      maxAttendees: 50,
      description: 'Techniki eco-drivingu',
      materials: true,
      online: true,
      attended: false
    }
  ];

  const filteredClasses = classes.filter(class_ => {
    if (selectedType !== 'all' && class_.type !== selectedType) return false;
    if (selectedStatus !== 'all' && class_.status !== selectedStatus) return false;
    return true;
  });

  const upcomingClasses = filteredClasses.filter(c => c.status === 'upcoming');
  const completedClasses = filteredClasses.filter(c => c.status === 'completed');
  const missedClasses = filteredClasses.filter(c => c.status === 'missed');

  const getStatusBadge = (status: string, attended?: boolean) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-700">Nadchodzące</Badge>;
      case 'completed':
        return attended 
          ? <Badge className="bg-green-100 text-green-700">Ukończone</Badge>
          : <Badge className="bg-gray-100 text-gray-700">Nieobecny</Badge>;
      case 'missed':
        return <Badge className="bg-red-100 text-red-700">Opuszczone</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-500">Odwołane</Badge>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      lecture: { color: 'bg-purple-100 text-purple-700', label: 'Wykład' },
      workshop: { color: 'bg-blue-100 text-blue-700', label: 'Warsztat' },
      practice: { color: 'bg-green-100 text-green-700', label: 'Ćwiczenia' },
      online: { color: 'bg-indigo-100 text-indigo-700', label: 'Online' }
    };
    const badge = badges[type as keyof typeof badges];
    return badge ? <Badge className={badge.color}>{badge.label}</Badge> : null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Harmonogram zajęć teoretycznych</h1>
          <p className="text-gray-600 mt-1">Zarządzaj swoją obecnością na zajęciach</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Eksportuj do kalendarza
          </Button>
          <Button className="gap-2">
            <Bell className="h-4 w-4" />
            Przypomnienia
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Obecność</span>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">85%</p>
          <p className="text-xs text-gray-500 mt-1">17 z 20 zajęć</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Nadchodzące</span>
            <Calendar className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">4</p>
          <p className="text-xs text-gray-500 mt-1">W tym tygodniu</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Opuszczone</span>
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">3</p>
          <p className="text-xs text-gray-500 mt-1">Do nadrobienia</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Godziny</span>
            <Clock className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">22/30h</p>
          <p className="text-xs text-gray-500 mt-1">Ukończone</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Filtry:</span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {classTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusTypes.map(status => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Classes List */}
      <div className="space-y-6">
        {/* Upcoming Classes */}
        {upcomingClasses.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Nadchodzące zajęcia</h2>
            <div className="space-y-3">
              {upcomingClasses.map((class_) => (
                <div key={class_.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{class_.title}</h3>
                        {getTypeBadge(class_.type)}
                        {getStatusBadge(class_.status)}
                        {class_.online && (
                          <Badge className="bg-indigo-100 text-indigo-700">
                            <Video className="h-3 w-3 mr-1" />
                            Online
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{class_.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{class_.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{class_.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{class_.room}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="h-4 w-4" />
                          <span>{class_.instructor}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {class_.attendees}/{class_.maxAttendees} uczestników
                          </span>
                          {class_.attendees >= class_.maxAttendees && (
                            <Badge className="bg-red-100 text-red-700 text-xs">Brak miejsc</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {class_.materials && (
                            <Button size="sm" variant="outline">
                              <BookOpen className="h-4 w-4 mr-1" />
                              Materiały
                            </Button>
                          )}
                          <Button size="sm">
                            Zapisz się
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Classes */}
        {completedClasses.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ukończone zajęcia</h2>
            <div className="space-y-3">
              {completedClasses.map((class_) => (
                <div key={class_.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-gray-900">{class_.title}</h4>
                        {getStatusBadge(class_.status, class_.attended)}
                        {class_.score && (
                          <span className="text-sm font-medium text-green-600">
                            Wynik: {class_.score}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>{class_.date}</span>
                        <span>{class_.time}</span>
                        <span>{class_.instructor}</span>
                      </div>
                    </div>
                    {class_.materials && (
                      <Button size="sm" variant="ghost">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Materiały
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missed Classes */}
        {missedClasses.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Opuszczone zajęcia</h2>
            <div className="bg-red-50 rounded-xl p-4 mb-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-900">Uwaga! Masz {missedClasses.length} opuszczone zajęcia</p>
                  <p className="text-red-700 mt-1">
                    Wymagana obecność to minimum 90%. Skontaktuj się z sekretariatem w celu ustalenia terminu nadrobienia.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {missedClasses.map((class_) => (
                <div key={class_.id} className="bg-white border border-red-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-gray-900">{class_.title}</h4>
                        {getStatusBadge(class_.status)}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>{class_.date}</span>
                        <span>{class_.time}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Umów nadrobienie
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}