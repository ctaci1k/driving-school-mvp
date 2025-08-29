// app/[locale]/student/theory/materials/page.tsx

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  FileText,
  Video,
  Download,
  Eye,
  Search,
  Filter,
  BookOpen,
  Image,
  File,
  Clock,
  Star,
  Folder,
  ChevronRight,
  Lock,
  CheckCircle2,
  PlayCircle,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TheoryMaterialsPage() {
  const t = useTranslations('student.theoryMaterials');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: t('categories.all'), count: 42 },
    { id: 'rules', name: t('categories.rules'), count: 12 },
    { id: 'signs', name: t('categories.signs'), count: 15 },
    { id: 'safety', name: t('categories.safety'), count: 8 },
    { id: 'mechanics', name: t('categories.mechanics'), count: 7 }
  ];

  const materialTypes = [
    { id: 'all', name: t('types.all') },
    { id: 'pdf', name: t('types.pdf'), icon: FileText },
    { id: 'video', name: t('types.video'), icon: Video },
    { id: 'presentation', name: t('types.presentation'), icon: Image },
    { id: 'quiz', name: t('types.quiz'), icon: CheckCircle2 }
  ];

  const materials = [
    {
      id: 1,
      title: t('materials.trafficCode.title'),
      category: 'rules',
      type: 'pdf',
      size: '2.4 MB',
      pages: 48,
      duration: null,
      uploadDate: '2024-01-15',
      views: 324,
      rating: 4.8,
      isNew: false,
      isPremium: false,
      completed: true,
      description: t('materials.trafficCode.description')
    },
    {
      id: 2,
      title: t('materials.warningSignsPresentation.title'),
      category: 'signs',
      type: 'presentation',
      size: '5.2 MB',
      pages: 35,
      duration: null,
      uploadDate: '2024-01-18',
      views: 189,
      rating: 4.6,
      isNew: true,
      isPremium: false,
      completed: true,
      description: t('materials.warningSignsPresentation.description')
    },
    {
      id: 3,
      title: t('materials.difficultConditions.title'),
      category: 'safety',
      type: 'video',
      size: '156 MB',
      pages: null,
      duration: '25:30',
      uploadDate: '2024-01-20',
      views: 456,
      rating: 4.9,
      isNew: true,
      isPremium: true,
      completed: false,
      progress: 65,
      description: t('materials.difficultConditions.description')
    },
    {
      id: 4,
      title: t('materials.priorityQuiz.title'),
      category: 'rules',
      type: 'quiz',
      size: null,
      pages: null,
      duration: '15 min',
      uploadDate: '2024-01-12',
      views: 567,
      rating: 4.7,
      isNew: false,
      isPremium: false,
      completed: true,
      score: 92,
      description: t('materials.priorityQuiz.description')
    },
    {
      id: 5,
      title: t('materials.engineConstruction.title'),
      category: 'mechanics',
      type: 'video',
      size: '89 MB',
      pages: null,
      duration: '12:45',
      uploadDate: '2024-01-10',
      views: 234,
      rating: 4.5,
      isNew: false,
      isPremium: false,
      completed: false,
      progress: 30,
      description: t('materials.engineConstruction.description')
    },
    {
      id: 6,
      title: t('materials.mandatoryProhibitorySignsPDF.title'),
      category: 'signs',
      type: 'pdf',
      size: '3.1 MB',
      pages: 28,
      duration: null,
      uploadDate: '2024-01-22',
      views: 412,
      rating: 4.8,
      isNew: true,
      isPremium: false,
      completed: false,
      description: t('materials.mandatoryProhibitorySignsPDF.description')
    },
    {
      id: 7,
      title: t('materials.firstAidGuide.title'),
      category: 'safety',
      type: 'pdf',
      size: '1.8 MB',
      pages: 20,
      duration: null,
      uploadDate: '2024-01-08',
      views: 178,
      rating: 4.4,
      isNew: false,
      isPremium: false,
      completed: true,
      description: t('materials.firstAidGuide.description')
    },
    {
      id: 8,
      title: t('materials.parkingManeuversTutorial.title'),
      category: 'rules',
      type: 'video',
      size: '210 MB',
      pages: null,
      duration: '35:20',
      uploadDate: '2024-01-25',
      views: 892,
      rating: 5.0,
      isNew: true,
      isPremium: true,
      completed: false,
      progress: 0,
      description: t('materials.parkingManeuversTutorial.description')
    }
  ];

  const filteredMaterials = materials.filter(material => {
    if (selectedCategory !== 'all' && material.category !== selectedCategory) return false;
    if (selectedType !== 'all' && material.type !== selectedType) return false;
    if (searchQuery && !material.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const recentlyViewed = materials.filter(m => m.completed).slice(0, 3);
  const recommended = materials.filter(m => m.rating >= 4.8).slice(0, 3);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'video':
        return Video;
      case 'presentation':
        return Image;
      case 'quiz':
        return CheckCircle2;
      default:
        return File;
    }
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      pdf: { color: 'bg-red-100 text-red-700', label: t('badges.pdf') },
      video: { color: 'bg-blue-100 text-blue-700', label: t('badges.video') },
      presentation: { color: 'bg-purple-100 text-purple-700', label: t('badges.presentation') },
      quiz: { color: 'bg-green-100 text-green-700', label: t('badges.quiz') }
    };
    const badge = badges[type as keyof typeof badges];
    return badge ? <Badge className={badge.color}>{badge.label}</Badge> : null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
        <Button className="gap-2">
          <Folder className="h-4 w-4" />
          {t('buttons.myLibrary')}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {materialTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recently Viewed */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('sections.recentlyViewed')}</h2>
          <div className="space-y-3">
            {recentlyViewed.map((material) => {
              const Icon = getTypeIcon(material.type);
              return (
                <div key={material.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{material.title}</p>
                    <p className="text-xs text-gray-500">{material.uploadDate}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('sections.recommended')}</h2>
          <div className="space-y-3">
            {recommended.map((material) => {
              const Icon = getTypeIcon(material.type);
              return (
                <div key={material.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <Icon className="h-5 w-5 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{material.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-500">{material.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">• {material.views} {t('metadata.views')}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((material) => {
          const Icon = getTypeIcon(material.type);
          
          return (
            <div key={material.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    {getTypeBadge(material.type)}
                    {material.isNew && (
                      <Badge className="bg-green-100 text-green-700">{t('badges.new')}</Badge>
                    )}
                    {material.isPremium && (
                      <Badge className="bg-yellow-100 text-yellow-700">{t('badges.premium')}</Badge>
                    )}
                  </div>
                  {material.completed && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{material.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{material.description}</p>
              </div>

              {/* Card Body */}
              <div className="p-4">
                {/* Progress for videos */}
                {material.type === 'video' && material.progress !== undefined && !material.completed && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500">{t('metadata.progress')}</span>
                      <span className="font-medium">{material.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${material.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Quiz score */}
                {material.type === 'quiz' && material.score && (
                  <div className="mb-3 p-2 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{t('metadata.yourScore')}</span>
                      <span className="font-semibold text-green-700">{material.score}%</span>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-3">
                    {material.size && <span>{material.size}</span>}
                    {material.pages && <span>{t('metadata.pages', {count: material.pages})}</span>}
                    {material.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {material.duration}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{material.views}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(material.rating)
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">{material.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {material.uploadDate}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {material.type === 'video' ? (
                    <Button size="sm" className="flex-1">
                      <PlayCircle className="h-4 w-4 mr-1" />
                      {material.completed ? t('buttons.watchAgain') : material.progress ? t('buttons.continue') : t('buttons.start')}
                    </Button>
                  ) : material.type === 'quiz' ? (
                    <Button size="sm" className="flex-1">
                      {material.completed ? t('buttons.repeatQuiz') : t('buttons.startQuiz')}
                    </Button>
                  ) : (
                    <Button size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      {material.completed ? t('buttons.viewAgain') : t('buttons.open')}
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      <div className="flex justify-center">
        <Button variant="outline">
          {t('buttons.loadMore')}
        </Button>
      </div>
    </div>
  );
}