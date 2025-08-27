// app/[locale]/student/progress/page.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Award, 
  Target, 
  Clock, 
  Car, 
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Calendar,
  Users,
  BookOpen,
  Trophy,
  Star,
  ChevronRight,
  Gauge,
  Brain
} from 'lucide-react';
import ProgressChart from '@/components/charts/ProgressChart';
import SkillsRadar from '@/components/charts/SkillsRadar';
import StatsCard from '@/components/cards/StatsCard';
import ProgressBar from '@/components/ui/ProgressBar';
import MilestoneCard from '@/components/cards/MilestoneCard';

export default function ProgressPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const overallProgress = 65;
  const hoursCompleted = 32;
  const hoursRequired = 50;
  const lessonsCompleted = 18;
  const theoryCourseProgress = 85;
  const practicalProgress = 60;

  const stats = {
    totalLessons: 18,
    averageScore: 7.8,
    improvement: 15,
    ranking: 12,
    totalStudents: 156
  };

  const skills = [
    { name: 'Parkowanie równoległe', score: 75, category: 'Manewry' },
    { name: 'Parkowanie prostopadłe', score: 82, category: 'Manewry' },
    { name: 'Jazda w mieście', score: 70, category: 'Jazda' },
    { name: 'Jazda autostradą', score: 65, category: 'Jazda' },
    { name: 'Znaki drogowe', score: 90, category: 'Teoria' },
    { name: 'Pierwszeństwo', score: 85, category: 'Teoria' },
    { name: 'Zawracanie', score: 60, category: 'Manewry' },
    { name: 'Ruch okrężny', score: 72, category: 'Jazda' }
  ];

  const recentAchievements = [
    {
      id: 1,
      title: 'Pierwsza jazda nocna',
      description: 'Ukończono pierwszą lekcję jazdy w nocy',
      icon: '🌙',
      date: '2024-01-15',
      points: 50
    },
    {
      id: 2,
      title: 'Mistrz parkowania',
      description: '5 perfekcyjnych parkowań z rzędu',
      icon: '🏆',
      date: '2024-01-12',
      points: 100
    },
    {
      id: 3,
      title: '10 lekcji ukończonych',
      description: 'Kamień milowy - 10 lekcji',
      icon: '🎯',
      date: '2024-01-10',
      points: 200
    }
  ];

  const milestones = [
    { title: 'Pierwsza lekcja', completed: true, date: '2023-11-15' },
    { title: '10 godzin jazdy', completed: true, date: '2023-12-20' },
    { title: 'Teoria zaliczona', completed: true, date: '2024-01-05' },
    { title: '25 godzin jazdy', completed: true, date: '2024-01-18' },
    { title: 'Egzamin wewnętrzny', completed: false, date: null },
    { title: 'Egzamin państwowy', completed: false, date: null }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mój postęp</h1>
        <p className="text-gray-600 mt-1">Śledź swoje osiągnięcia i rozwój umiejętności</p>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Postęp ogólny</h2>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-blue-600">{overallProgress}%</span>
            <div className="flex items-center text-green-600 text-sm">
              <ArrowUp className="h-4 w-4" />
              <span>+5% w tym miesiącu</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Godziny jazdy</span>
              <span className="text-sm font-medium">{hoursCompleted}/{hoursRequired}h</span>
            </div>
            <ProgressBar value={(hoursCompleted / hoursRequired) * 100} className="mb-4" />
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Kurs teoretyczny</span>
              <span className="text-sm font-medium">{theoryCourseProgress}%</span>
            </div>
            <ProgressBar value={theoryCourseProgress} color="green" className="mb-4" />
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Umiejętności praktyczne</span>
              <span className="text-sm font-medium">{practicalProgress}%</span>
            </div>
            <ProgressBar value={practicalProgress} color="purple" />
          </div>

          <div>
            <ProgressChart period={selectedPeriod} />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Ukończone lekcje"
          value={stats.totalLessons}
          icon={Car}
          trend={{ value: 3, isPositive: true }}
          subtitle="W tym miesiącu"
        />
        <StatsCard
          title="Średnia ocena"
          value={stats.averageScore.toFixed(1)}
          icon={Star}
          trend={{ value: 0.5, isPositive: true }}
          subtitle="Z 10 punktów"
        />
        <StatsCard
          title="Poprawa"
          value={`${stats.improvement}%`}
          icon={TrendingUp}
          trend={{ value: stats.improvement, isPositive: true }}
          subtitle="Od początku"
        />
        <StatsCard
          title="Pozycja w rankingu"
          value={`${stats.ranking}/${stats.totalStudents}`}
          icon={Trophy}
          trend={{ value: 5, isPositive: true }}
          subtitle="Wśród studentów"
        />
      </div>

      {/* Skills & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Radar */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Umiejętności</h2>
            <Link 
              href="/pl/student/progress/skills"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Zobacz szczegóły
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <SkillsRadar skills={skills} />
          
          {/* Top Skills */}
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Najlepsze umiejętności:</p>
            {skills
              .sort((a, b) => b.score - a.score)
              .slice(0, 3)
              .map((skill, index) => (
                <div key={index} className="flex items-center justify-between py-1">
                  <span className="text-sm text-gray-600">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-600">{skill.score}%</span>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Ostatnie osiągnięcia</h2>
            <Link 
              href="/pl/student/progress/achievements"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Zobacz wszystkie
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{achievement.title}</p>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">+{achievement.points} pkt</p>
                  <p className="text-xs text-gray-500">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Kamienie milowe</h2>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <MilestoneCard
              key={index}
              title={milestone.title}
              completed={milestone.completed}
              date={milestone.date}
              isLast={index === milestones.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Exam Readiness */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Gotowość do egzaminu</h2>
            <p className="text-sm text-gray-600 mt-1">
              Na podstawie Twoich wyników i postępów
            </p>
          </div>
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <Gauge className="h-16 w-16 text-blue-600" />
              <span className="absolute text-lg font-bold">{practicalProgress}%</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Gotowość</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Mocne strony</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Teoria, parkowanie prostopadłe</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Do poprawy</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Jazda autostradą, zawracanie</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-600">
              <Brain className="h-5 w-5" />
              <span className="font-medium">Zalecenie</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Jeszcze 5-7 lekcji praktycznych</p>
          </div>
        </div>
        <Link 
          href="/pl/student/progress/exam-readiness"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sprawdź szczegółową analizę
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}