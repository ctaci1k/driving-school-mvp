// Шлях: /app/[locale]/student/progress/page.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('student.progress');
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
    { name: t('skills.parallelParking'), score: 75, category: t('skillCategories.maneuvers') },
    { name: t('skills.perpendicularParking'), score: 82, category: t('skillCategories.maneuvers') },
    { name: t('skills.cityDriving'), score: 70, category: t('skillCategories.driving') },
    { name: t('skills.highwayDriving'), score: 65, category: t('skillCategories.driving') },
    { name: t('skills.roadSigns'), score: 90, category: t('skillCategories.theory') },
    { name: t('skills.rightOfWay'), score: 85, category: t('skillCategories.theory') },
    { name: t('skills.turning'), score: 60, category: t('skillCategories.maneuvers') },
    { name: t('skills.roundabout'), score: 72, category: t('skillCategories.driving') }
  ];

  const recentAchievements = [
    {
      id: 1,
      title: t('achievements.firstNightDrive.title'),
      description: t('achievements.firstNightDrive.description'),
      icon: '🌙',
      date: '2024-01-15',
      points: 50
    },
    {
      id: 2,
      title: t('achievements.parkingMaster.title'),
      description: t('achievements.parkingMaster.description'),
      icon: '🏆',
      date: '2024-01-12',
      points: 100
    },
    {
      id: 3,
      title: t('achievements.tenLessons.title'),
      description: t('achievements.tenLessons.description'),
      icon: '🎯',
      date: '2024-01-10',
      points: 200
    }
  ];

  const milestones = [
    { title: t('milestones.firstLesson'), completed: true, date: '2023-11-15' },
    { title: t('milestones.tenHours'), completed: true, date: '2023-12-20' },
    { title: t('milestones.theoryPassed'), completed: true, date: '2024-01-05' },
    { title: t('milestones.twentyFiveHours'), completed: true, date: '2024-01-18' },
    { title: t('milestones.internalExam'), completed: false, date: null },
    { title: t('milestones.stateExam'), completed: false, date: null }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-gray-600 mt-1">{t('subtitle')}</p>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">{t('overallProgress.title')}</h2>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-blue-600">{overallProgress}%</span>
            <div className="flex items-center text-green-600 text-sm">
              <ArrowUp className="h-4 w-4" />
              <span>{t('overallProgress.monthlyIncrease')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{t('overallProgress.drivingHours')}</span>
              <span className="text-sm font-medium">{hoursCompleted}/{hoursRequired}{t('overallProgress.hoursUnit')}</span>
            </div>
            <ProgressBar value={(hoursCompleted / hoursRequired) * 100} className="mb-4" />
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{t('overallProgress.theoryCourse')}</span>
              <span className="text-sm font-medium">{theoryCourseProgress}%</span>
            </div>
            <ProgressBar value={theoryCourseProgress} color="green" className="mb-4" />
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{t('overallProgress.practicalSkills')}</span>
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
          title={t('stats.completedLessons.title')}
          value={stats.totalLessons}
          icon={Car}
          trend={{ value: 3, isPositive: true }}
          subtitle={t('stats.completedLessons.subtitle')}
        />
        <StatsCard
          title={t('stats.averageScore.title')}
          value={stats.averageScore.toFixed(1)}
          icon={Star}
          trend={{ value: 0.5, isPositive: true }}
          subtitle={t('stats.averageScore.subtitle')}
        />
        <StatsCard
          title={t('stats.improvement.title')}
          value={`${stats.improvement}%`}
          icon={TrendingUp}
          trend={{ value: stats.improvement, isPositive: true }}
          subtitle={t('stats.improvement.subtitle')}
        />
        <StatsCard
          title={t('stats.ranking.title')}
          value={`${stats.ranking}/${stats.totalStudents}`}
          icon={Trophy}
          trend={{ value: 5, isPositive: true }}
          subtitle={t('stats.ranking.subtitle')}
        />
      </div>

      {/* Skills & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Radar */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('skillsSection.title')}</h2>
            <Link 
              href="/uk/student/progress/skills"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              {t('skillsSection.viewDetails')}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <SkillsRadar skills={skills} />
          
          {/* Top Skills */}
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">{t('skillsSection.topSkills')}:</p>
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
            <h2 className="text-lg font-semibold text-gray-900">{t('achievementsSection.title')}</h2>
            <Link 
              href="/uk/student/progress/achievements"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              {t('achievementsSection.viewAll')}
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
                  <p className="text-sm font-medium text-blue-600">+{achievement.points} {t('achievementsSection.points')}</p>
                  <p className="text-xs text-gray-500">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('milestonesSection.title')}</h2>
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
            <h2 className="text-lg font-semibold text-gray-900">{t('examReadiness.title')}</h2>
            <p className="text-sm text-gray-600 mt-1">{t('examReadiness.description')}</p>
          </div>
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <Gauge className="h-16 w-16 text-blue-600" />
              <span className="absolute text-lg font-bold">{practicalProgress}%</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{t('examReadiness.readiness')}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">{t('examReadiness.strengths')}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{t('examReadiness.strengthsList')}</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{t('examReadiness.toImprove')}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{t('examReadiness.improvementList')}</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-600">
              <Brain className="h-5 w-5" />
              <span className="font-medium">{t('examReadiness.recommendation')}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{t('examReadiness.recommendationText')}</p>
          </div>
        </div>
        <Link 
          href="/uk/student/progress/exam-readiness"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('examReadiness.viewAnalysis')}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}