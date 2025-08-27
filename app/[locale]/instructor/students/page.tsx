// app/[locale]/instructor/students/page.tsx
// Strona zarządzania kursantami z wyszukiwaniem, filtrowaniem i szczegółowymi informacjami

'use client'

import { useState } from 'react'
import { 
  Users, Search, Filter, ChevronRight, Star, TrendingUp,
  Calendar, Clock, Target, Award, AlertCircle, Phone,
  MessageSquare, FileText, Download, Plus, MoreVertical,
  GraduationCap, BookOpen, Car, CheckCircle, User
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'

export default function InstructorStudents() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  // Mock students data
  const students = [
    {
      id: '1',
      name: 'Maria Kowalska',
      avatar: 'https://ui-avatars.com/api/?name=MK&background=10B981&color=fff',
      phone: '+48501234567',
      email: 'maria.k@email.com',
      status: 'active',
      progress: 85,
      lessonsCompleted: 24,
      lessonsRemaining: 4,
      nextLesson: '5 lutego, 14:00',
      examDate: '12 lutego',
      category: 'B',
      joinedDate: '2024-01-05',
      averageScore: 4.8,
      weakPoints: ['Parkowanie równoległe', 'Jazda tyłem'],
      strongPoints: ['Przestrzeganie przepisów', 'Pewna jazda'],
      totalHours: 36,
      payments: 'paid',
      lastActivity: '2 dni temu'
    },
    {
      id: '2',
      name: 'Jan Nowak',
      avatar: 'https://ui-avatars.com/api/?name=JN&background=3B82F6&color=fff',
      phone: '+48501234568',
      email: 'jan.n@email.com',
      status: 'active',
      progress: 30,
      lessonsCompleted: 8,
      lessonsRemaining: 20,
      nextLesson: '4 lutego, 10:00',
      examDate: null,
      category: 'B',
      joinedDate: '2024-01-20',
      averageScore: 4.2,
      weakPoints: ['Pewność siebie', 'Szybkość reakcji'],
      strongPoints: ['Teoria', 'Ostrożność'],
      totalHours: 12,
      payments: 'paid',
      lastActivity: 'Wczoraj'
    },
    {
      id: '3',
      name: 'Elena Wiśniewska',
      avatar: 'https://ui-avatars.com/api/?name=EW&background=EC4899&color=fff',
      phone: '+48501234569',
      email: 'elena.w@email.com',
      status: 'active',
      progress: 65,
      lessonsCompleted: 18,
      lessonsRemaining: 10,
      nextLesson: '6 lutego, 16:00',
      examDate: null,
      category: 'B',
      joinedDate: '2024-01-10',
      averageScore: 4.5,
      weakPoints: ['Parkowanie'],
      strongPoints: ['Manewrowanie', 'Uwaga'],
      totalHours: 27,
      payments: 'pending',
      lastActivity: '3 dni temu'
    },
    {
      id: '4',
      name: 'Andrzej Kowalczyk',
      avatar: 'https://ui-avatars.com/api/?name=AK&background=F59E0B&color=fff',
      phone: '+48501234570',
      email: 'andrzej.k@email.com',
      status: 'active',
      progress: 55,
      lessonsCompleted: 15,
      lessonsRemaining: 13,
      nextLesson: '4 lutego, 14:30',
      examDate: null,
      category: 'B',
      joinedDate: '2024-01-08',
      averageScore: 4.3,
      weakPoints: ['Jazda po trasie'],
      strongPoints: ['Jazda miejska', 'Parkowanie'],
      totalHours: 22.5,
      payments: 'paid',
      lastActivity: 'Dzisiaj'
    },
    {
      id: '5',
      name: 'Natalia Lewandowska',
      avatar: 'https://ui-avatars.com/api/?name=NL&background=8B5CF6&color=fff',
      phone: '+48501234571',
      email: 'natalia.l@email.com',
      status: 'active',
      progress: 70,
      lessonsCompleted: 20,
      lessonsRemaining: 8,
      nextLesson: '5 lutego, 18:00',
      examDate: '20 lutego',
      category: 'B',
      joinedDate: '2024-01-03',
      averageScore: 4.6,
      weakPoints: ['Jazda nocna'],
      strongPoints: ['Technika jazdy', 'Znajomość przepisów'],
      totalHours: 30,
      payments: 'paid',
      lastActivity: '1 dzień temu'
    },
    {
      id: '6',
      name: 'Szymon Woźniak',
      avatar: 'https://ui-avatars.com/api/?name=SW&background=EF4444&color=fff',
      phone: '+48501234572',
      email: 'szymon.w@email.com',
      status: 'paused',
      progress: 45,
      lessonsCompleted: 12,
      lessonsRemaining: 16,
      nextLesson: null,
      examDate: null,
      category: 'B',
      joinedDate: '2024-01-15',
      averageScore: 3.9,
      weakPoints: ['Koncentracja', 'Przepisy'],
      strongPoints: ['Podstawowe umiejętności'],
      totalHours: 18,
      payments: 'overdue',
      lastActivity: '1 tydzień temu'
    }
  ]

  // Statistics
  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === 'active').length,
    averageProgress: Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length),
    upcomingExams: students.filter(s => s.examDate).length,
    totalHours: students.reduce((acc, s) => acc + s.totalHours, 0),
    averageRating: (students.reduce((acc, s) => acc + s.averageScore, 0) / students.length).toFixed(1)
  }

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.phone.includes(searchQuery)
    
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus
    
    return matchesSearch && matchesFilter
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'progress') return b.progress - a.progress
    if (sortBy === 'lessons') return b.lessonsCompleted - a.lessonsCompleted
    if (sortBy === 'rating') return b.averageScore - a.averageScore
    return 0
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Moi kursanci</h1>
          <p className="text-gray-600 mt-1">
            Zarządzanie i śledzenie postępów kursantów
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Dodaj kursanta
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Łącznie</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Aktywni</p>
                <p className="text-2xl font-bold">{stats.activeStudents}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Postęp</p>
                <p className="text-2xl font-bold">{stats.averageProgress}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Egzaminy</p>
                <p className="text-2xl font-bold">{stats.upcomingExams}</p>
              </div>
              <GraduationCap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Godziny</p>
                <p className="text-2xl font-bold">{stats.totalHours}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ocena</p>
                <p className="text-2xl font-bold">{stats.averageRating}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Wyszukaj według imienia, email lub telefonu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszyscy kursanci</SelectItem>
            <SelectItem value="active">Aktywni</SelectItem>
            <SelectItem value="paused">Wstrzymani</SelectItem>
            <SelectItem value="completed">Ukończyli</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Według imienia</SelectItem>
            <SelectItem value="progress">Według postępu</SelectItem>
            <SelectItem value="lessons">Według lekcji</SelectItem>
            <SelectItem value="rating">Według oceny</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Students Tabs */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full max-w-[200px] grid-cols-2">
          <TabsTrigger value="grid">Karty</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-gray-500">kategoria {student.category}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link href={`/instructor/students/${student.id}`} className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Profil
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/instructor/students/${student.id}/progress`} className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Postęp
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" />
                          Raport
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Phone className="w-4 h-4 mr-2" />
                          Zadzwoń
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Wiadomość
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ogólny postęp</span>
                      <span className="font-medium">{student.progress}%</span>
                    </div>
                    <Progress value={student.progress} className="h-2" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-gray-500">Lekcje</p>
                      <p className="font-semibold">{student.lessonsCompleted}/{student.lessonsCompleted + student.lessonsRemaining}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-gray-500">Ocena</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{student.averageScore}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                      {student.status === 'active' ? 'Aktywny' : 'Wstrzymany'}
                    </Badge>
                    {student.payments === 'overdue' && (
                      <Badge variant="destructive">Zaległość</Badge>
                    )}
                    {student.examDate && (
                      <Badge variant="outline">
                        Egzamin: {student.examDate}
                      </Badge>
                    )}
                  </div>

                  {/* Next lesson */}
                  {student.nextLesson && (
                    <div className="p-3 bg-blue-50 rounded-lg mb-4">
                      <p className="text-sm font-medium text-blue-900">Następna lekcja</p>
                      <p className="text-sm text-blue-700">{student.nextLesson}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/instructor/students/${student.id}`}>
                        Szczegóły
                      </Link>
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/instructor/students/${student.id}/progress`}>
                        Postęp
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kursant</TableHead>
                      <TableHead>Postęp</TableHead>
                      <TableHead>Lekcje</TableHead>
                      <TableHead>Następna</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Akcje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={student.avatar} />
                              <AvatarFallback>{student.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.phone}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={student.progress} className="w-20 h-2" />
                            <span className="text-sm text-gray-600">{student.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {student.lessonsCompleted} z {student.lessonsCompleted + student.lessonsRemaining}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {student.nextLesson || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                            {student.status === 'active' ? 'Aktywny' : 'Wstrzymany'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/instructor/students/${student.id}`}>
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Szybkie akcje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Generuj raport
            </Button>
            <Button variant="outline" className="justify-start">
              <Download className="w-4 h-4 mr-2" />
              Eksport danych
            </Button>
            <Button variant="outline" className="justify-start">
              <MessageSquare className="w-4 h-4 mr-2" />
              Masowa wysyłka
            </Button>
            <Button variant="outline" className="justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Planuj lekcje
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}