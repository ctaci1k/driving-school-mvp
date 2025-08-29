// app/[locale]/instructor/students/page.tsx
// Сторінка керування курсантами з пошуком, фільтруванням та детальною інформацією

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
import { useTranslations } from 'next-intl'

export default function InstructorStudents() {
  const t = useTranslations('instructor.students.main')
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
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('subtitle')}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          {t('addStudent')}
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t('stats.total')}</p>
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
                <p className="text-sm text-gray-500">{t('stats.active')}</p>
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
                <p className="text-sm text-gray-500">{t('stats.progress')}</p>
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
                <p className="text-sm text-gray-500">{t('stats.exams')}</p>
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
                <p className="text-sm text-gray-500">{t('stats.hours')}</p>
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
                <p className="text-sm text-gray-500">{t('stats.rating')}</p>
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
              placeholder={t('search.placeholder')}
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
            <SelectItem value="all">{t('filters.all')}</SelectItem>
            <SelectItem value="active">{t('filters.active')}</SelectItem>
            <SelectItem value="paused">{t('filters.paused')}</SelectItem>
            <SelectItem value="completed">{t('filters.completed')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">{t('filters.sortBy.name')}</SelectItem>
            <SelectItem value="progress">{t('filters.sortBy.progress')}</SelectItem>
            <SelectItem value="lessons">{t('filters.sortBy.lessons')}</SelectItem>
            <SelectItem value="rating">{t('filters.sortBy.rating')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Students Tabs */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full max-w-[200px] grid-cols-2">
          <TabsTrigger value="grid">{t('tabs.cards')}</TabsTrigger>
          <TabsTrigger value="list">{t('tabs.list')}</TabsTrigger>
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
                        <p className="text-sm text-gray-500">{t('card.category', { category: student.category })}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('dropdown.label')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link href={`/instructor/students/${student.id}`} className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            {t('dropdown.profile')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/instructor/students/${student.id}/progress`} className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            {t('dropdown.progress')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" />
                          {t('dropdown.report')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Phone className="w-4 h-4 mr-2" />
                          {t('dropdown.call')}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {t('dropdown.message')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('card.overallProgress')}</span>
                      <span className="font-medium">{student.progress}%</span>
                    </div>
                    <Progress value={student.progress} className="h-2" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-gray-500">{t('card.lessons')}</p>
                      <p className="font-semibold">{t('card.lessonsCount', { completed: student.lessonsCompleted, total: student.lessonsCompleted + student.lessonsRemaining })}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-gray-500">{t('card.rating')}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{student.averageScore}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                      {student.status === 'active' ? t('card.status.active') : t('card.status.paused')}
                    </Badge>
                    {student.payments === 'overdue' && (
                      <Badge variant="destructive">{t('card.payment.overdue')}</Badge>
                    )}
                    {student.examDate && (
                      <Badge variant="outline">
                        {t('card.exam', { date: student.examDate })}
                      </Badge>
                    )}
                  </div>

                  {/* Next lesson */}
                  {student.nextLesson && (
                    <div className="p-3 bg-blue-50 rounded-lg mb-4">
                      <p className="text-sm font-medium text-blue-900">{t('card.nextLesson.title')}</p>
                      <p className="text-sm text-blue-700">{t('card.nextLesson.dateTime', { dateTime: student.nextLesson })}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/instructor/students/${student.id}`}>
                        {t('card.actions.details')}
                      </Link>
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/instructor/students/${student.id}/progress`}>
                        {t('card.actions.progress')}
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
                      <TableHead>{t('table.headers.student')}</TableHead>
                      <TableHead>{t('table.headers.progress')}</TableHead>
                      <TableHead>{t('table.headers.lessons')}</TableHead>
                      <TableHead>{t('table.headers.nextLesson')}</TableHead>
                      <TableHead>{t('table.headers.status')}</TableHead>
                      <TableHead>{t('table.headers.actions')}</TableHead>
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
                            {t('table.lessonsFrom', { completed: student.lessonsCompleted, total: student.lessonsCompleted + student.lessonsRemaining })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {student.nextLesson || t('table.noNextLesson')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                            {student.status === 'active' ? t('card.status.active') : t('card.status.paused')}
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
          <CardTitle>{t('quickActions.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start">
              <FileText className="w-4 h-4 mr-2" />
              {t('quickActions.generateReport')}
            </Button>
            <Button variant="outline" className="justify-start">
              <Download className="w-4 h-4 mr-2" />
              {t('quickActions.exportData')}
            </Button>
            <Button variant="outline" className="justify-start">
              <MessageSquare className="w-4 h-4 mr-2" />
              {t('quickActions.bulkMessage')}
            </Button>
            <Button variant="outline" className="justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              {t('quickActions.scheduleLessons')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}