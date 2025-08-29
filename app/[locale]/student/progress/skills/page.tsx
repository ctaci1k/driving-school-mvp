// Шлях: /app/[locale]/student/progress/skills/page.tsx

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Target, 
  TrendingUp, 
  Award, 
  AlertTriangle,
  CheckCircle2,
  Info,
  Filter,
  Download,
  Car,
  BookOpen,
  Navigation,
  GitBranch,
  Zap,
  Shield,
  Eye,
  Moon,
  Cloud,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProgressBar from '@/components/ui/ProgressBar';

export default function SkillsPage() {
  const t = useTranslations('student.skills');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: t('categories.all'), count: 24 },
    { id: 'maneuvers', name: t('categories.maneuvers'), count: 8, icon: GitBranch },
    { id: 'city', name: t('categories.cityDriving'), count: 6, icon: Navigation },
    { id: 'highway', name: t('categories.highways'), count: 4, icon: Zap },
    { id: 'theory', name: t('categories.theory'), count: 6, icon: BookOpen }
  ];

  const skillsData = [
    {
      id: '1',
      name: t('items.parallelParking.name'),
      category: 'maneuvers',
      currentScore: 75,
      previousScore: 60,
      attempts: 45,
      successRate: 75,
      lastPracticed: '2024-01-20',
      instructorNotes: t('items.parallelParking.notes'),
      difficulty: 'hard',
      requiredForExam: true,
      trend: 'up'
    },
    {
      id: '2',
      name: t('items.perpendicularParking.name'),
      category: 'maneuvers',
      currentScore: 82,
      previousScore: 78,
      attempts: 38,
      successRate: 82,
      lastPracticed: '2024-01-19',
      instructorNotes: t('items.perpendicularParking.notes'),
      difficulty: 'medium',
      requiredForExam: true,
      trend: 'up'
    },
    {
      id: '3',
      name: t('items.trafficJams.name'),
      category: 'city',
      currentScore: 70,
      previousScore: 70,
      attempts: 25,
      successRate: 70,
      lastPracticed: '2024-01-18',
      instructorNotes: t('items.trafficJams.notes'),
      difficulty: 'medium',
      requiredForExam: false,
      trend: 'stable'
    },
    {
      id: '4',
      name: t('items.highwayLaneChange.name'),
      category: 'highway',
      currentScore: 65,
      previousScore: 72,
      attempts: 15,
      successRate: 65,
      lastPracticed: '2024-01-17',
      instructorNotes: t('items.highwayLaneChange.notes'),
      difficulty: 'hard',
      requiredForExam: true,
      trend: 'down'
    },
    {
      id: '5',
      name: t('items.roadSigns.name'),
      category: 'theory',
      currentScore: 90,
      previousScore: 85,
      attempts: 120,
      successRate: 90,
      lastPracticed: '2024-01-21',
      instructorNotes: t('items.roadSigns.notes'),
      difficulty: 'easy',
      requiredForExam: true,
      trend: 'up'
    },
    {
      id: '6',
      name: t('items.rightOfWay.name'),
      category: 'theory',
      currentScore: 85,
      previousScore: 80,
      attempts: 95,
      successRate: 85,
      lastPracticed: '2024-01-21',
      instructorNotes: t('items.rightOfWay.notes'),
      difficulty: 'medium',
      requiredForExam: true,
      trend: 'up'
    },
    {
      id: '7',
      name: t('items.turning.name'),
      category: 'maneuvers',
      currentScore: 60,
      previousScore: 55,
      attempts: 20,
      successRate: 60,
      lastPracticed: '2024-01-16',
      instructorNotes: t('items.turning.notes'),
      difficulty: 'hard',
      requiredForExam: true,
      trend: 'up'
    },
    {
      id: '8',
      name: t('items.nightDriving.name'),
      category: 'city',
      currentScore: 68,
      previousScore: 60,
      attempts: 8,
      successRate: 68,
      lastPracticed: '2024-01-15',
      instructorNotes: t('items.nightDriving.notes'),
      difficulty: 'hard',
      requiredForExam: false,
      trend: 'up'
    }
  ];

  const filteredSkills = skillsData.filter(
    skill => selectedCategory === 'all' || skill.category === selectedCategory
  );

  const sortedSkills = [...filteredSkills].sort((a, b) => {
    if (sortBy === 'score') return b.currentScore - a.currentScore;
    if (sortBy === 'progress') return (b.currentScore - b.previousScore) - (a.currentScore - a.previousScore);
    if (sortBy === 'attempts') return b.attempts - a.attempts;
    return 0;
  });

  const averageScore = Math.round(
    sortedSkills.reduce((acc, skill) => acc + skill.currentScore, 0) / sortedSkills.length
  );

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      hard: 'bg-red-100 text-red-700'
    };
    return (
      <Badge className={colors[difficulty as keyof typeof colors]}>
        {t(`difficulty.${difficulty}`)}
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
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          {t('buttons.exportReport')}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{t('stats.averageScore')}</span>
            <Target className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
          <p className="text-xs text-green-600 mt-1">{t('stats.monthlyProgress')}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{t('stats.bestSkill')}</span>
            <Award className="h-4 w-4 text-yellow-500" />
          </div>
          <p className="text-lg font-semibold text-gray-900">{t('items.roadSigns.name')}</p>
          <p className="text-sm text-gray-500">{t('stats.successRate', { rate: 90 })}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{t('stats.needsWork')}</span>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </div>
          <p className="text-lg font-semibold text-gray-900">{t('items.turning.name')}</p>
          <p className="text-sm text-gray-500">{t('stats.successRate', { rate: 60 })}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{t('stats.examReadiness')}</span>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">72%</p>
          <p className="text-xs text-gray-500">{t('stats.skillsReady', { ready: 6, total: 8 })}</p>
        </div>
      </div>

      {/* Filters and Categories */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span className="font-medium">{category.name}</span>
                  <span className="text-sm">({category.count})</span>
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{t('filters.sortBy')}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="score">{t('filters.byScore')}</option>
              <option value="progress">{t('filters.byProgress')}</option>
              <option value="attempts">{t('filters.byAttempts')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedSkills.map((skill) => (
          <div key={skill.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                  {skill.requiredForExam && (
                    <Badge variant="outline" className="text-xs">{t('badges.exam')}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  {getDifficultyBadge(skill.difficulty)}
                  <span className="flex items-center gap-1">
                    {getTrendIcon(skill.trend)}
                    {skill.currentScore - skill.previousScore > 0 ? '+' : ''}{skill.currentScore - skill.previousScore}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{skill.currentScore}%</p>
                <p className="text-xs text-gray-500">{t('attempts', { count: skill.attempts })}</p>
              </div>
            </div>
            
            <ProgressBar 
              value={skill.currentScore} 
              color={skill.currentScore >= 80 ? 'green' : skill.currentScore >= 60 ? 'yellow' : 'red'}
              className="mb-3"
            />
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{skill.instructorNotes}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('lastPracticed')}: {skill.lastPracticed}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowDetails(showDetails === skill.id ? null : skill.id)}
              className="w-full mt-3 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              {showDetails === skill.id ? t('buttons.hideDetails') : t('buttons.showHistory')}
              <ChevronDown className={`h-4 w-4 transition-transform ${showDetails === skill.id ? 'rotate-180' : ''}`} />
            </button>
            
            {showDetails === skill.id && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                {/* SkillHistoryChart component would go here */}
                <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                  <span className="text-sm">{t('charts.skillHistory')}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comparison with Average */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('comparison.title')}</h2>
        {/* ComparisonChart component would go here */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
          <span>{t('charts.comparison')}</span>
        </div>
      </div>
    </div>
  );
}