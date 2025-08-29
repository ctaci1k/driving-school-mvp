// app/[locale]/student/theory/tests/page.tsx

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  FileText,
  PlayCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Award,
  BarChart3,
  RefreshCw,
  Lock,
  Star,
  Target,
  BookOpen,
  ChevronRight,
  Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProgressBar from '@/components/ui/ProgressBar';

export default function TheoryTestsPage() {
  const t = useTranslations('student.theoryTests');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const testCategories = [
    { id: 'all', name: t('categories.all'), count: 25 },
    { id: 'official', name: t('categories.official'), count: 5 },
    { id: 'practice', name: t('categories.practice'), count: 15 },
    { id: 'exam', name: t('categories.exam'), count: 5 }
  ];

  const difficultyLevels = [
    { id: 'all', name: t('difficulty.all') },
    { id: 'easy', name: t('difficulty.easy'), color: 'green' },
    { id: 'medium', name: t('difficulty.medium'), color: 'yellow' },
    { id: 'hard', name: t('difficulty.hard'), color: 'red' }
  ];

  const availableTests = [
    {
      id: 1,
      title: t('tests.examWORD1.title'),
      category: 'official',
      difficulty: 'hard',
      questions: 74,
      timeLimit: 25,
      passingScore: 68,
      attempts: 2,
      bestScore: 71,
      lastAttempt: '2024-01-20',
      status: 'passed'
    },
    {
      id: 2,
      title: t('tests.roadSignsComplete.title'),
      category: 'practice',
      difficulty: 'medium',
      questions: 50,
      timeLimit: 20,
      passingScore: 40,
      attempts: 3,
      bestScore: 45,
      lastAttempt: '2024-01-18',
      status: 'passed'
    },
    {
      id: 3,
      title: t('tests.rightOfWay.title'),
      category: 'practice',
      difficulty: 'easy',
      questions: 30,
      timeLimit: 15,
      passingScore: 24,
      attempts: 1,
      bestScore: 28,
      lastAttempt: '2024-01-15',
      status: 'passed'
    },
    {
      id: 4,
      title: t('tests.examWORD2.title'),
      category: 'official',
      difficulty: 'hard',
      questions: 74,
      timeLimit: 25,
      passingScore: 68,
      attempts: 1,
      bestScore: 65,
      lastAttempt: '2024-01-22',
      status: 'failed'
    },
    {
      id: 5,
      title: t('tests.dangerousSituations.title'),
      category: 'practice',
      difficulty: 'hard',
      questions: 40,
      timeLimit: 20,
      passingScore: 32,
      attempts: 0,
      bestScore: null,
      lastAttempt: null,
      status: 'new'
    },
    {
      id: 6,
      title: t('tests.trafficRules.title'),
      category: 'practice',
      difficulty: 'medium',
      questions: 45,
      timeLimit: 20,
      passingScore: 36,
      attempts: 2,
      bestScore: 38,
      lastAttempt: '2024-01-19',
      status: 'passed'
    },
    {
      id: 7,
      title: t('tests.vehicleBasics.title'),
      category: 'practice',
      difficulty: 'easy',
      questions: 25,
      timeLimit: 15,
      passingScore: 20,
      attempts: 0,
      bestScore: null,
      lastAttempt: null,
      status: 'new'
    },
    {
      id: 8,
      title: t('tests.fullExamPractice.title'),
      category: 'exam',
      difficulty: 'hard',
      questions: 74,
      timeLimit: 25,
      passingScore: 68,
      attempts: 0,
      bestScore: null,
      lastAttempt: null,
      status: 'locked',
      unlockRequirement: t('unlockRequirement')
    }
  ];

  const testHistory = [
    {
      id: 1,
      testTitle: t('tests.examWORD1.title'),
      date: '2024-01-20 14:30',
      score: 71,
      maxScore: 74,
      passed: true,
      duration: '23:45'
    },
    {
      id: 2,
      testTitle: t('tests.examWORD2.title'),
      date: '2024-01-22 16:00',
      score: 65,
      maxScore: 74,
      passed: false,
      duration: '24:30'
    },
    {
      id: 3,
      testTitle: t('tests.roadSignsComplete.title'),
      date: '2024-01-18 10:15',
      score: 45,
      maxScore: 50,
      passed: true,
      duration: '18:20'
    }
  ];

  const statistics = {
    totalAttempts: 15,
    passedTests: 12,
    averageScore: 82,
    bestCategory: t('categoryNames.roadSigns'),
    weakestCategory: t('categoryNames.priority'),
    streak: 5
  };

  const filteredTests = availableTests.filter(test => {
    if (selectedCategory !== 'all' && test.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && test.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-green-100 text-green-700">{t('status.passed')}</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700">{t('status.failed')}</Badge>;
      case 'new':
        return <Badge className="bg-blue-100 text-blue-700">{t('status.new')}</Badge>;
      case 'locked':
        return <Badge className="bg-gray-100 text-gray-500">{t('status.locked')}</Badge>;
      default:
        return null;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      hard: 'bg-red-100 text-red-700'
    };
    const labels = {
      easy: t('difficulty.easy'),
      medium: t('difficulty.medium'),
      hard: t('difficulty.hard')
    };
    return (
      <Badge className={colors[difficulty as keyof typeof colors]}>
        {labels[difficulty as keyof typeof labels]}
      </Badge>
    );
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
          <PlayCircle className="h-4 w-4" />
          {t('buttons.quickTest')}
        </Button>
      </div>

      {/* Statistics Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{statistics.totalAttempts}</p>
            <p className="text-xs text-gray-600">{t('statistics.attempts')}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{statistics.passedTests}</p>
            <p className="text-xs text-gray-600">{t('statistics.passed')}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{statistics.averageScore}%</p>
            <p className="text-xs text-gray-600">{t('statistics.averageScore')}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-sm font-bold text-gray-900">{statistics.bestCategory}</p>
            <p className="text-xs text-gray-600">{t('statistics.bestCategory')}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-sm font-bold text-gray-900">{statistics.weakestCategory}</p>
            <p className="text-xs text-gray-600">{t('statistics.weakestCategory')}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{statistics.streak}</p>
            <p className="text-xs text-gray-600">{t('statistics.streak')}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{t('filters.category')}:</span>
            <div className="flex items-center gap-2">
              {testCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{t('filters.level')}:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {difficultyLevels.map(level => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Available Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTests.map(test => (
          <div key={test.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{test.title}</h3>
                <div className="flex items-center gap-2">
                  {getDifficultyBadge(test.difficulty)}
                  {getStatusBadge(test.status)}
                </div>
              </div>
              {test.status === 'locked' && (
                <Lock className="h-5 w-5 text-gray-400" />
              )}
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {t('testInfo.questions')}
                </span>
                <span className="font-medium">{test.questions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {t('testInfo.timeLimit')}
                </span>
                <span className="font-medium">{test.timeLimit} {t('testInfo.min')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  {t('testInfo.passingScore')}
                </span>
                <span className="font-medium">{test.passingScore}/{test.questions} {t('testInfo.points')}</span>
              </div>
            </div>

            {test.attempts > 0 && (
              <div className="border-t pt-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{t('testInfo.bestScore')}</span>
                  <span className={`font-semibold ${
                    test.bestScore! >= test.passingScore ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {test.bestScore}/{test.questions} {t('testInfo.points')}
                  </span>
                </div>
                <ProgressBar 
                  value={(test.bestScore! / test.questions) * 100}
                  color={test.bestScore! >= test.passingScore ? 'green' : 'red'}
                />
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>{t('testInfo.attempts')}: {test.attempts}</span>
                  <span>{t('testInfo.lastAttempt')}: {test.lastAttempt}</span>
                </div>
              </div>
            )}

            {test.status === 'locked' ? (
              <div className="text-sm text-gray-500 italic">
                {test.unlockRequirement}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  variant={test.attempts === 0 ? 'default' : 'outline'}
                >
                  {test.attempts === 0 ? t('buttons.startTest') : t('buttons.repeatTest')}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                {test.attempts > 0 && (
                  <Button size="sm" variant="ghost">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Test History */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('history.title')}</h2>
          <Button variant="outline" size="sm">
            {t('buttons.viewAll')}
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left text-sm font-medium text-gray-600 pb-3">{t('history.columns.test')}</th>
                <th className="text-left text-sm font-medium text-gray-600 pb-3">{t('history.columns.date')}</th>
                <th className="text-center text-sm font-medium text-gray-600 pb-3">{t('history.columns.score')}</th>
                <th className="text-center text-sm font-medium text-gray-600 pb-3">{t('history.columns.time')}</th>
                <th className="text-center text-sm font-medium text-gray-600 pb-3">{t('history.columns.status')}</th>
              </tr>
            </thead>
            <tbody>
              {testHistory.map(history => (
                <tr key={history.id} className="border-b border-gray-100">
                  <td className="py-3">
                    <p className="font-medium text-gray-900">{history.testTitle}</p>
                  </td>
                  <td className="py-3 text-sm text-gray-600">{history.date}</td>
                  <td className="py-3 text-center">
                    <span className={`font-semibold ${
                      history.passed ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {history.score}/{history.maxScore}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({Math.round((history.score / history.maxScore) * 100)}%)
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <Timer className="h-3 w-3" />
                      {history.duration}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    {history.passed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}