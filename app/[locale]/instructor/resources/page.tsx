// /app/[locale]/instructor/resources/page.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, Video, Download, Upload, Search, Filter,
  FolderOpen, File, Image, PlayCircle, BookOpen,
  Eye, Share2, Trash2, Edit, Plus, Grid, List,
  Calendar, Clock, Star, Users, ChevronRight,
  ExternalLink, Copy, MoreVertical, Info
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

export default function ResourcesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('date')

  // Mock resources data
  const resources = [
    {
      id: '1',
      title: 'Kodeks drogowy 2024',
      description: 'Kompletny zbiór przepisów ruchu drogowego',
      type: 'pdf',
      category: 'teoria',
      size: '4.2 MB',
      downloads: 234,
      rating: 4.8,
      uploadedAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-01'),
      tags: ['przepisy', 'teoria', 'egzamin'],
      thumbnail: null,
      isPublic: true,
      views: 1234
    },
    {
      id: '2',
      title: 'Parkowanie równoległe - tutorial',
      description: 'Film instruktażowy pokazujący technikę parkowania równoległego',
      type: 'video',
      category: 'praktyka',
      size: '156 MB',
      duration: '12:34',
      downloads: 189,
      rating: 4.9,
      uploadedAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      tags: ['parkowanie', 'praktyka', 'film'],
      thumbnail: '📹',
      isPublic: true,
      views: 2341
    },
    {
      id: '3',
      title: 'Testy egzaminacyjne - kategoria B',
      description: 'Zbiór 500 pytań testowych z odpowiedziami',
      type: 'pdf',
      category: 'testy',
      size: '8.7 MB',
      downloads: 567,
      rating: 4.7,
      uploadedAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-02-02'),
      tags: ['test', 'egzamin', 'pytania'],
      thumbnail: null,
      isPublic: true,
      views: 4567
    },
    {
      id: '4',
      title: 'Znaki drogowe - prezentacja',
      description: 'Interaktywna prezentacja wszystkich znaków drogowych',
      type: 'presentation',
      category: 'teoria',
      size: '12.3 MB',
      downloads: 145,
      rating: 4.6,
      uploadedAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25'),
      tags: ['znaki', 'teoria', 'prezentacja'],
      thumbnail: '📊',
      isPublic: true,
      views: 1890
    },
    {
      id: '5',
      title: 'Pierwsza pomoc - poradnik',
      description: 'Podstawy pierwszej pomocy dla kierowców',
      type: 'pdf',
      category: 'dodatkowe',
      size: '3.1 MB',
      downloads: 89,
      rating: 4.5,
      uploadedAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
      tags: ['pierwsza pomoc', 'bezpieczeństwo'],
      thumbnail: null,
      isPublic: true,
      views: 567
    },
    {
      id: '6',
      title: 'Manewry na placu - film',
      description: 'Kompletny przewodnik po manewrach egzaminacyjnych',
      type: 'video',
      category: 'praktyka',
      size: '234 MB',
      duration: '18:45',
      downloads: 234,
      rating: 4.9,
      uploadedAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
      tags: ['manewry', 'plac', 'egzamin'],
      thumbnail: '📹',
      isPublic: false,
      views: 3456
    }
  ]

  // Categories
  const categories = [
    { value: 'all', label: 'Wszystkie', count: resources.length },
    { value: 'teoria', label: 'Teoria', count: 2 },
    { value: 'praktyka', label: 'Praktyka', count: 2 },
    { value: 'testy', label: 'Testy', count: 1 },
    { value: 'dodatkowe', label: 'Dodatkowe', count: 1 }
  ]

  // Recent activity
  const recentActivity = [
    { action: 'pobranie', resource: 'Kodeks drogowy 2024', user: 'Anna Nowak', time: '5 min temu' },
    { action: 'wyświetlenie', resource: 'Parkowanie równoległe', user: 'Jan Kowalski', time: '15 min temu' },
    { action: 'pobranie', resource: 'Testy egzaminacyjne', user: 'Maria Wiśniewska', time: '1 godz. temu' },
    { action: 'ocena', resource: 'Znaki drogowe', user: 'Piotr Zieliński', time: '2 godz. temu' }
  ]

  // Statistics
  const stats = {
    totalResources: resources.length,
    totalDownloads: resources.reduce((sum, r) => sum + r.downloads, 0),
    totalViews: resources.reduce((sum, r) => sum + r.views, 0),
    averageRating: (resources.reduce((sum, r) => sum + r.rating, 0) / resources.length).toFixed(1),
    totalSize: '419 MB',
    mostPopular: 'Testy egzaminacyjne - kategoria B'
  }

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    if (sortBy === 'date') return b.uploadedAt.getTime() - a.uploadedAt.getTime()
    if (sortBy === 'downloads') return b.downloads - a.downloads
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'name') return a.title.localeCompare(b.title)
    return 0
  })

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-8 h-8 text-red-500" />
      case 'video': return <PlayCircle className="w-8 h-8 text-blue-500" />
      case 'presentation': return <BookOpen className="w-8 h-8 text-orange-500" />
      case 'image': return <Image className="w-8 h-8 text-green-500" />
      default: return <File className="w-8 h-8 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Materiały edukacyjne</h1>
          <p className="text-gray-600 mt-1">
            Zarządzaj materiałami dla studentów
          </p>
        </div>
        <Button onClick={() => router.push('/instructor/resources/upload')}>
          <Upload className="w-4 h-4 mr-2" />
          Dodaj materiał
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Materiały</p>
            <p className="text-2xl font-bold">{stats.totalResources}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Pobrania</p>
            <p className="text-2xl font-bold">{stats.totalDownloads}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Wyświetlenia</p>
            <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Ocena</p>
            <p className="text-2xl font-bold">⭐ {stats.averageRating}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Rozmiar</p>
            <p className="text-2xl font-bold">{stats.totalSize}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Popularny</p>
            <p className="text-sm font-semibold truncate" title={stats.mostPopular}>
              {stats.mostPopular}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Szukaj materiałów..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label} ({cat.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Najnowsze</SelectItem>
            <SelectItem value="downloads">Najpopularniejsze</SelectItem>
            <SelectItem value="rating">Najlepiej oceniane</SelectItem>
            <SelectItem value="name">Alfabetycznie</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resources */}
        <div className="lg:col-span-2">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      {getFileIcon(resource.type)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Podgląd
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Pobierz
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Udostępnij
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edytuj
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Usuń
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {resource.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {resource.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {resource.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {resource.rating}
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t flex justify-between text-xs text-gray-500">
                      <span>{resource.size}</span>
                      <span>{format(resource.uploadedAt, 'dd.MM.yyyy')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredResources.map((resource) => (
                    <div key={resource.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        {getFileIcon(resource.type)}
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                            {resource.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{resource.size}</span>
                            <span>↓ {resource.downloads}</span>
                            <span>👁 {resource.views}</span>
                            <span>⭐ {resource.rating}</span>
                            <span>{format(resource.uploadedAt, 'dd.MM.yyyy')}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ostatnia aktywność</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                    <div>
                      <p>
                        <span className="font-medium">{activity.user}</span>{' '}
                        {activity.action === 'pobranie' && 'pobrał'}{' '}
                        {activity.action === 'wyświetlenie' && 'wyświetlił'}{' '}
                        {activity.action === 'ocena' && 'ocenił'}{' '}
                        <span className="font-medium">{activity.resource}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Storage Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Wykorzystanie przestrzeni</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Wykorzystano</span>
                    <span className="font-medium">419 MB / 5 GB</span>
                  </div>
                  <Progress value={8.4} className="h-2" />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">📄 Dokumenty</span>
                    <span>16.0 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">📹 Filmy</span>
                    <span>390 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">📊 Prezentacje</span>
                    <span>12.3 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">🖼 Obrazy</span>
                    <span>700 KB</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Wskazówka:</strong> Regularnie aktualizuj materiały, aby studenci mieli dostęp do najnowszych informacji.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}