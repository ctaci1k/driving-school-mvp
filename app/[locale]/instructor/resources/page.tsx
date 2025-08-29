// app/[locale]/instructor/resources/page.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
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
import { uk } from 'date-fns/locale'

export default function ResourcesPage() {
  const router = useRouter()
  const t = useTranslations('instructor.resources.main')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('date')

  // Mock resources data
  const resources = [
    {
      id: '1',
      title: 'Правила дорожнього руху 2024',
      description: 'Повний збірник правил дорожнього руху',
      type: 'pdf',
      category: 'theory',
      size: '4.2 MB',
      downloads: 234,
      rating: 4.8,
      uploadedAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-01'),
      tags: ['правила', 'теорія', 'іспит'],
      thumbnail: null,
      isPublic: true,
      views: 1234
    },
    {
      id: '2',
      title: 'Паралельне паркування - відеоурок',
      description: 'Навчальне відео з техніки паралельного паркування',
      type: 'video',
      category: 'practice',
      size: '156 MB',
      duration: '12:34',
      downloads: 189,
      rating: 4.9,
      uploadedAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
      tags: ['паркування', 'практика', 'відео'],
      thumbnail: '📹',
      isPublic: true,
      views: 2341
    },
    {
      id: '3',
      title: 'Тести для іспиту - категорія B',
      description: 'Збірник з 500 тестових питань з відповідями',
      type: 'pdf',
      category: 'tests',
      size: '8.7 MB',
      downloads: 567,
      rating: 4.7,
      uploadedAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-02-02'),
      tags: ['тест', 'іспит', 'питання'],
      thumbnail: null,
      isPublic: true,
      views: 4567
    },
    {
      id: '4',
      title: 'Дорожні знаки - презентація',
      description: 'Інтерактивна презентація всіх дорожніх знаків',
      type: 'presentation',
      category: 'theory',
      size: '12.3 MB',
      downloads: 145,
      rating: 4.6,
      uploadedAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25'),
      tags: ['знаки', 'теорія', 'презентація'],
      thumbnail: '📊',
      isPublic: true,
      views: 1890
    },
    {
      id: '5',
      title: 'Перша допомога - посібник',
      description: 'Основи першої допомоги для водіїв',
      type: 'pdf',
      category: 'additional',
      size: '3.1 MB',
      downloads: 89,
      rating: 4.5,
      uploadedAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
      tags: ['перша допомога', 'безпека'],
      thumbnail: null,
      isPublic: true,
      views: 567
    },
    {
      id: '6',
      title: 'Маневри на майданчику - відео',
      description: 'Повний посібник з екзаменаційних маневрів',
      type: 'video',
      category: 'practice',
      size: '234 MB',
      duration: '18:45',
      downloads: 234,
      rating: 4.9,
      uploadedAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-18'),
      tags: ['маневри', 'майданчик', 'іспит'],
      thumbnail: '📹',
      isPublic: false,
      views: 3456
    }
  ]

  // Categories
  const categories = [
    { value: 'all', label: t('categories.all'), count: resources.length },
    { value: 'theory', label: t('categories.theory'), count: 2 },
    { value: 'practice', label: t('categories.practice'), count: 2 },
    { value: 'tests', label: t('categories.tests'), count: 1 },
    { value: 'additional', label: t('categories.additional'), count: 1 }
  ]

  // Recent activity
  const recentActivity = [
    { action: 'download', resource: 'Правила дорожнього руху 2024', user: 'Анна Новак', time: t('recentActivity.minutesAgo', { count: 5 }) },
    { action: 'view', resource: 'Паралельне паркування', user: 'Іван Коваленко', time: t('recentActivity.minutesAgo', { count: 15 }) },
    { action: 'download', resource: 'Тести для іспиту', user: 'Марія Вишневська', time: t('recentActivity.hoursAgo', { count: 1 }) },
    { action: 'rate', resource: 'Дорожні знаки', user: 'Петро Зеленський', time: t('recentActivity.hoursAgo', { count: 2 }) }
  ]

  // Statistics
  const stats = {
    totalResources: resources.length,
    totalDownloads: resources.reduce((sum, r) => sum + r.downloads, 0),
    totalViews: resources.reduce((sum, r) => sum + r.views, 0),
    averageRating: (resources.reduce((sum, r) => sum + r.rating, 0) / resources.length).toFixed(1),
    totalSize: '419 MB',
    mostPopular: 'Тести для іспиту - категорія B'
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
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('subtitle')}
          </p>
        </div>
        <Button onClick={() => router.push('/instructor/resources/upload')}>
          <Upload className="w-4 h-4 mr-2" />
          {t('addMaterial')}
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">{t('stats.materials')}</p>
            <p className="text-2xl font-bold">{stats.totalResources}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">{t('stats.downloads')}</p>
            <p className="text-2xl font-bold">{stats.totalDownloads}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">{t('stats.views')}</p>
            <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">{t('stats.rating')}</p>
            <p className="text-2xl font-bold">⭐ {stats.averageRating}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">{t('stats.size')}</p>
            <p className="text-2xl font-bold">{stats.totalSize}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">{t('stats.popular')}</p>
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
            placeholder={t('search.placeholder')}
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
            <SelectItem value="date">{t('sort.date')}</SelectItem>
            <SelectItem value="downloads">{t('sort.downloads')}</SelectItem>
            <SelectItem value="rating">{t('sort.rating')}</SelectItem>
            <SelectItem value="name">{t('sort.name')}</SelectItem>
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
                            {t('actions.preview')}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            {t('actions.download')}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            {t('actions.share')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            {t('actions.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t('actions.delete')}
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
              <CardTitle className="text-base">{t('recentActivity.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                    <div>
                      <p>
                        <span className="font-medium">{activity.user}</span>{' '}
                        {t(`recentActivity.${activity.action}`)}{' '}
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
              <CardTitle className="text-base">{t('storage.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{t('storage.used')}</span>
                    <span className="font-medium">419 MB / 5 GB</span>
                  </div>
                  <Progress value={8.4} className="h-2" />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">📄 {t('storage.documents')}</span>
                    <span>16.0 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">📹 {t('storage.videos')}</span>
                    <span>390 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">📊 {t('storage.presentations')}</span>
                    <span>12.3 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">🖼 {t('storage.images')}</span>
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
              <strong>{t('tip.title')}</strong> {t('tip.description')}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}