// app/[locale]/student/theory/page.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { 
  BookOpen, 
  Video, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Calendar,
  PlayCircle,
  Download,
  ChevronRight,
  Award,
  TrendingUp,
  Users,
  Star,
  Lock,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProgressBar from '@/components/ui/ProgressBar';

export default function TheoryPage() {
  const t = useTranslations('student.theory');
  const params = useParams();
  const locale = params.locale as string;
  const [selectedCategory, setSelectedCategory] = useState('all');

  const overallProgress = 75;
  const totalLessons = 24;
  const completedLessons = 18;
  const hoursCompleted = 22;
  const totalHours = 30;
  const averageScore = 82;

  const categories = [
    { id: 'all', name: t('categories.all'), count: 24 },
    { id: 'rules', name: t('categories.rules'), count: 8 },
    { id: 'signs', name: t('categories.signs'), count: 6 },
    { id: 'safety', name: t('categories.safety'), count: 5 },
    { id: 'mechanics', name: t('categories.mechanics'), count: 5 }
  ];

  const modules = [
    {
      id: 1,
      title: t('modules.basicRules.title'),
      category: 'rules',
      description: t('modules.basicRules.description'),
      duration: t('modules.duration', {hours: '2'}),
      lessons: 4,
      completedLessons: 4,
      status: 'completed',
      score: 92,
      nextClass: null
    },
    {
      id: 2,
      title: t('modules.warningSignsModule.title'),
      category: 'signs',
      description: t('modules.warningSignsModule.description'),
      duration: t('modules.duration', {hours: '1.5'}),
      lessons: 3,
      completedLessons: 3,
      status: 'completed',
      score: 88,
      nextClass: null
    },
    {
      id: 3,
      title: t('modules.mandatoryProhibitorySigns.title'),
      category: 'signs',
      description: t('modules.mandatoryProhibitorySigns.description'),
      duration: t('modules.duration', {hours: '2'}),
      lessons: 3,
      completedLessons: 2,
      status: 'in-progress',
      score: 0,
      nextClass: '2024-01-25 16:00'
    },
    {
      id: 4,
      title: t('modules.maneuversParking.title'),
      category: 'rules',
      description: t('modules.maneuversParking.description'),
      duration: t('modules.duration', {hours: '1.5'}),
      lessons: 4,
      completedLessons: 4,
      status: 'completed',
      score: 85,
      nextClass: null
    },
    {
      id: 5,
      title: t('modules.drivingConditions.title'),
      category: 'safety',
      description: t('modules.drivingConditions.description'),
      duration: t('modules.duration', {hours: '2'}),
      lessons: 5,
      completedLessons: 3,
      status: 'in-progress',
      score: 0,
      nextClass: '2024-01-26 18:00'
    },
    {
      id: 6,
      title: t('modules.firstAid.title'),
      category: 'safety',
      description: t('modules.firstAid.description'),
      duration: t('modules.duration', {hours: '1'}),
      lessons: 2,
      completedLessons: 0,
      status: 'locked',
      score: 0,
      nextClass: '2024-02-01 16:00'
    },
    {
      id: 7,
      title: t('modules.vehicleMaintenance.title'),
      category: 'mechanics',
      description: t('modules.vehicleMaintenance.description'),
      duration: t('modules.duration', {hours: '1.5'}),
      lessons: 3,
      completedLessons: 2,
      status: 'in-progress',
      score: 0,
      nextClass: '2024-01-27 14:00'
    },
    {
      id: 8,
      title: t('modules.documentsInsurance.title'),
      category: 'rules',
      description: t('modules.documentsInsurance.description'),
      duration: t('modules.duration', {hours: '1'}),
      lessons: 2,
      completedLessons: 0,
      status: 'locked',
      score: 0,
      nextClass: '2024-02-03 16:00'
    }
  ];

  const upcomingClasses = [
    {
      id: 1,
      title: t('modules.mandatoryProhibitorySigns.title'),
      date: '2024-01-25',
      time: '16:00-18:00',
      instructor: 'mgr Jan Kowalski',
      room: 'Sala 3',
      type: t('upcomingClasses.types.lecture')
    },
    {
      id: 2,
      title: t('modules.drivingConditions.title'),
      date: '2024-01-26',
      time: '18:00-20:00',
      instructor: 'mgr Anna Nowak',
      room: 'Sala 1',
      type: t('upcomingClasses.types.workshop')
    },
    {
      id: 3,
      title: t('modules.vehicleMaintenance.title'),
      date: '2024-01-27',
      time: '14:00-15:30',
      instructor: 'inż. Piotr Wiśniewski',
      room: 'Warsztat',
      type: t('upcomingClasses.types.practice')
    }
  ];

  const recentTests = [
    { name: t('recentTests.rulesTest'), score: 92, maxScore: 100, date: '2024-01-20' },
    { name: t('recentTests.warningSignsTest'), score: 44, maxScore: 50, date: '2024-01-18' },
    { name: t('recentTests.maneuversTest'), score: 38, maxScore: 45, date: '2024-01-15' }
  ];

  const filteredModules = modules.filter(
    module => selectedCategory === 'all' || module.category === selectedCategory
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">{t('status.completed')}</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-700">{t('status.inProgress')}</Badge>;
      case 'locked':
        return <Badge className="bg-gray-100 text-gray-500">{t('status.locked')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/student/theory/tests`}>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              {t('buttons.practiceTests')}
            </Button>
          </Link>
          <Link href={`/${locale}/student/theory/materials`}>
            <Button className="gap-2">
              <BookOpen className="h-4 w-4" />
              {t('buttons.materials')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{t('progress.courseProgress')}</span>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{overallProgress}%</p>
            <ProgressBar value={overallProgress} color="blue" className="mt-2" />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{t('progress.completedLessons')}</span>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{completedLessons}/{totalLessons}</p>
            <p className="text-xs text-gray-500 mt-1">{t('progress.remaining', {count: totalLessons - completedLessons})}</p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{t('progress.theoryHours')}</span>
              <Clock className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{hoursCompleted}h/{totalHours}h</p>
            <p className="text-xs text-gray-500 mt-1">{t('progress.requiredMinimum')}</p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{t('progress.averageScore')}</span>
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
            <p className="text-xs text-gray-500 mt-1">{t('progress.fromTests')}</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredModules.map((module) => (
          <div
            key={module.id}
            className={`bg-white rounded-xl shadow-sm p-6 ${
              module.status === 'locked' ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{module.title}</h3>
                  {getStatusBadge(module.status)}
                </div>
                <p className="text-sm text-gray-600">{module.description}</p>
              </div>
              {module.status === 'locked' && (
                <Lock className="h-5 w-5 text-gray-400" />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t('lessonProgress')}</span>
                <span className="font-medium">{module.completedLessons}/{module.lessons}</span>
              </div>
              <ProgressBar 
                value={(module.completedLessons / module.lessons) * 100} 
                color={module.status === 'completed' ? 'green' : 'blue'}
              />

              {module.status === 'completed' && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray-600">{t('testResult')}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-900">{module.score}%</span>
                  </div>
                </div>
              )}

              {module.nextClass && (
                <div className="flex items-center gap-2 pt-2 text-sm text-blue-600">
                  <Calendar className="h-4 w-4" />
                  <span>{t('nextClass')}: {module.nextClass}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-3">
                <span className="text-sm text-gray-500">
                  <Clock className="h-4 w-4 inline mr-1" />
                  {module.duration}
                </span>
                {module.status !== 'locked' && (
                  <Button size="sm" variant={module.status === 'completed' ? 'outline' : 'default'}>
                    {module.status === 'completed' ? t('buttons.repeat') : t('buttons.continue')}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Classes & Recent Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('upcomingClasses.title')}</h2>
            <Link href={`/${locale}/student/theory/classes`} className="text-sm text-blue-600 hover:text-blue-700">
              {t('buttons.viewAll')}
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingClasses.map((class_) => (
              <div key={class_.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{class_.title}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {class_.date} • {class_.time} • {class_.room}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {class_.instructor}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {class_.type}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tests */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('recentTests.title')}</h2>
            <Link href={`/${locale}/student/theory/tests`} className="text-sm text-blue-600 hover:text-blue-700">
              {t('buttons.allTests')}
            </Link>
          </div>
          <div className="space-y-3">
            {recentTests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{test.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{test.date}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-gray-400" />
                    <span className="font-semibold text-gray-900">
                      {test.score}/{test.maxScore}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((test.score / test.maxScore) * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link href={`/${locale}/student/theory/tests`}>
            <Button variant="outline" className="w-full mt-4">
              <PlayCircle className="h-4 w-4 mr-2" />
              {t('buttons.startNewTest')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('studyTips.title')}</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• {t('studyTips.tip1')}</li>
              <li>• {t('studyTips.tip2')}</li>
              <li>• {t('studyTips.tip3')}</li>
              <li>• {t('studyTips.tip4')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}