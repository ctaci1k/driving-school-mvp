// Шлях: /app/[locale]/student/progress/exam-readiness/page.tsx

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  GraduationCap, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  TrendingUp,
  Brain,
  Car,
  BookOpen,
  Target,
  Calendar,
  FileCheck,
  AlertCircle,
  ChevronRight,
  Download,
  PlayCircle,
  Shield,
  Award,
  Info,
  X,
  Check,
  Circle,
  Gauge
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/badge';
import ReadinessGauge from '@/components/charts/ReadinessGauge';
import PredictionChart from '@/components/charts/PredictionChart';

export default function ExamReadinessPage() {
  const t = useTranslations('student.examReadiness');
  const [selectedExamType, setSelectedExamType] = useState('practical');
  const [showSimulation, setShowSimulation] = useState(false);

  const overallReadiness = 72;
  const theoryReadiness = 85;
  const practicalReadiness = 72;
  
  const predictedExamDate = new Date('2024-02-15');
  const daysUntilReady = Math.floor((predictedExamDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const requirements = {
    theory: [
      { id: '1', name: t('requirements.theory.courseCompleted'), completed: true, mandatory: true },
      { id: '2', name: t('requirements.theory.attendance'), completed: true, mandatory: true },
      { id: '3', name: t('requirements.theory.mockTest'), completed: true, mandatory: false },
      { id: '4', name: t('requirements.theory.allModules'), completed: true, mandatory: true },
      { id: '5', name: t('requirements.theory.examFee'), completed: false, mandatory: true }
    ],
    practical: [
      { id: '1', name: t('requirements.practical.minHours'), completed: true, mandatory: true, current: 32, required: 30 },
      { id: '2', name: t('requirements.practical.theoryPassed'), completed: true, mandatory: true },
      { id: '3', name: t('requirements.practical.allManeuvers'), completed: false, mandatory: true, current: 6, required: 8 },
      { id: '4', name: t('requirements.practical.cityDriving'), completed: true, mandatory: true },
      { id: '5', name: t('requirements.practical.outsideCity'), completed: true, mandatory: true },
      { id: '6', name: t('requirements.practical.internalExam'), completed: false, mandatory: false },
      { id: '7', name: t('requirements.practical.examFee'), completed: false, mandatory: true }
    ]
  };

  const skillCategories = [
    {
      name: t('skills.categories.maneuvers'),
      skills: [
        { name: t('skills.parallelParking'), score: 75, required: 70 },
        { name: t('skills.perpendicularParking'), score: 82, required: 70 },
        { name: t('skills.turning'), score: 60, required: 70 },
        { name: t('skills.hillStart'), score: 78, required: 70 }
      ]
    },
    {
      name: t('skills.categories.cityDriving'),
      skills: [
        { name: t('skills.intersections'), score: 72, required: 75 },
        { name: t('skills.rightOfWay'), score: 85, required: 75 },
        { name: t('skills.roadSigns'), score: 90, required: 80 },
        { name: t('skills.pedestrianCrossings'), score: 88, required: 75 }
      ]
    },
    {
      name: t('skills.categories.drivingTechnique'),
      skills: [
        { name: t('skills.smoothDriving'), score: 70, required: 70 },
        { name: t('skills.mirrorUse'), score: 75, required: 75 },
        { name: t('skills.gearChanging'), score: 85, required: 70 },
        { name: t('skills.braking'), score: 80, required: 75 }
      ]
    }
  ];

  const weakPoints = [
    {
      skill: t('weakPoints.turning.skill'),
      issue: t('weakPoints.turning.issue'),
      recommendation: t('weakPoints.turning.recommendation'),
      priority: 'high',
      estimatedLessons: 2
    },
    {
      skill: t('weakPoints.intersections.skill'),
      issue: t('weakPoints.intersections.issue'),
      recommendation: t('weakPoints.intersections.recommendation'),
      priority: 'medium',
      estimatedLessons: 1
    },
    {
      skill: t('weakPoints.highway.skill'),
      issue: t('weakPoints.highway.issue'),
      recommendation: t('weakPoints.highway.recommendation'),
      priority: 'medium',
      estimatedLessons: 1
    }
  ];

  const examHistory = [
    {
      type: t('examHistory.theoryMock'),
      date: '2024-01-10',
      result: t('examHistory.passed'),
      score: '70/74',
      success: true
    },
    {
      type: t('examHistory.theoryState'),
      date: '2024-01-15',
      result: t('examHistory.passed'),
      score: '71/74',
      success: true
    },
    {
      type: t('examHistory.practicalInternal'),
      date: '2024-01-18',
      result: t('examHistory.failed'),
      score: '65%',
      success: false
    }
  ];

  const recommendations = [
    {
      priority: 'high',
      title: t('recommendations.completeManeuvers.title'),
      description: t('recommendations.completeManeuvers.description'),
      action: t('recommendations.completeManeuvers.action'),
      icon: Car
    },
    {
      priority: 'medium',
      title: t('recommendations.improveWeakPoints.title'),
      description: t('recommendations.improveWeakPoints.description'),
      action: t('recommendations.improveWeakPoints.action'),
      icon: Target
    },
    {
      priority: 'low',
      title: t('recommendations.internalExam.title'),
      description: t('recommendations.internalExam.description'),
      action: t('recommendations.internalExam.action'),
      icon: FileCheck
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {t('buttons.downloadReport')}
          </Button>
          <Button className="gap-2">
            <PlayCircle className="h-4 w-4" />
            {t('buttons.examSimulation')}
          </Button>
        </div>
      </div>

      {/* Overall Readiness */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Readiness Gauge */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('overallReadiness.title')}</h2>
            <ReadinessGauge value={overallReadiness} />
            <p className="text-sm text-gray-600 mt-4">{t('overallReadiness.description')}</p>
          </div>

          {/* Prediction */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('prediction.title')}</h2>
            <PredictionChart currentReadiness={overallReadiness} />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-600">
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">{t('prediction.expectedDate')}</span>
                </div>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {predictedExamDate.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-xs text-gray-500">{t('prediction.inDays', { days: daysUntilReady })}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-medium">{t('prediction.recommendedLessons')}</span>
                </div>
                <p className="text-lg font-bold text-gray-900 mt-1">5-7</p>
                <p className="text-xs text-gray-500">{t('prediction.toFullReadiness')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Type Selector */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedExamType('theory')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              selectedExamType === 'theory'
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>{t('examTypes.theory')}</span>
              <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 border-green-200">
                {t('status.passed')}
              </Badge>
            </div>
          </button>
          <button
            onClick={() => setSelectedExamType('practical')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              selectedExamType === 'practical'
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Car className="h-5 w-5" />
              <span>{t('examTypes.practical')}</span>
              <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-600 border-yellow-200">
                {t('status.inPreparation')}
              </Badge>
            </div>
          </button>
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedExamType === 'theory' ? t('requirements.theoryTitle') : t('requirements.practicalTitle')}
            </h2>
            <span className="text-sm text-gray-500">
              {requirements[selectedExamType as keyof typeof requirements].filter(r => r.completed).length}/
              {requirements[selectedExamType as keyof typeof requirements].length} {t('requirements.completed')}
            </span>
          </div>
          <div className="space-y-3">
            {requirements[selectedExamType as keyof typeof requirements].map((req) => (
              <div key={req.id} className="flex items-start gap-3">
                <div className={`mt-0.5 ${req.completed ? 'text-green-500' : 'text-gray-300'}`}>
                  {req.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${req.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {req.name}
                    </p>
                    {req.mandatory && (
                      <Badge variant="outline" className="text-xs">{t('requirements.mandatory')}</Badge>
                    )}
                  </div>
                  {'current' in req && (
                    <div className="mt-1">
                      <ProgressBar 
                        value={(req.current! / req.required!) * 100} 
                        color={req.completed ? 'green' : 'yellow'}
                        className="h-1"
                      />
                      <span className="text-xs text-gray-500">{req.current}/{req.required}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Points */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('weakPoints.title')}</h2>
          <div className="space-y-3">
            {weakPoints.map((point, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${
                      point.priority === 'high' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                    <p className="font-medium text-gray-900">{point.skill}</p>
                  </div>
                  <Badge 
                    variant="outline"
                    className={point.priority === 'high' ? 'text-red-600 border-red-200' : 'text-yellow-600 border-yellow-200'}
                  >
                    {point.priority === 'high' ? t('priority.high') : t('priority.medium')}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{point.issue}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600">{point.recommendation}</span>
                  <span className="text-gray-500">{t('weakPoints.lessons', { count: point.estimatedLessons })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('skills.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <div key={index}>
              <h3 className="font-medium text-gray-700 mb-3">{category.name}</h3>
              <div className="space-y-2">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">{skill.name}</span>
                      <span className={`text-sm font-medium ${
                        skill.score >= skill.required ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {skill.score}%
                      </span>
                    </div>
                    <div className="relative">
                      <ProgressBar 
                        value={skill.score} 
                        color={skill.score >= skill.required ? 'green' : 'red'}
                        className="h-2"
                      />
                      <div 
                        className="absolute top-0 h-2 w-0.5 bg-gray-800"
                        style={{ left: `${skill.required}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('skills.required')}: {skill.required}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('recommendations.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            const priorityColors = {
              high: 'bg-red-50 border-red-200',
              medium: 'bg-yellow-50 border-yellow-200',
              low: 'bg-blue-50 border-blue-200'
            };
            
            return (
              <div key={index} className={`border rounded-lg p-4 ${priorityColors[rec.priority as keyof typeof priorityColors]}`}>
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{rec.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    <Button size="sm" variant="link" className="mt-2 p-0 h-auto text-blue-600">
                      {rec.action} <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam History */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('examHistory.title')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left text-sm font-medium text-gray-600 pb-3">{t('examHistory.type')}</th>
                <th className="text-left text-sm font-medium text-gray-600 pb-3">{t('examHistory.date')}</th>
                <th className="text-left text-sm font-medium text-gray-600 pb-3">{t('examHistory.result')}</th>
                <th className="text-left text-sm font-medium text-gray-600 pb-3">{t('examHistory.score')}</th>
              </tr>
            </thead>
            <tbody>
              {examHistory.map((exam, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-900">{exam.type}</td>
                  <td className="py-3 text-sm text-gray-600">{exam.date}</td>
                  <td className="py-3">
                    <Badge 
                      variant="outline"
                      className={exam.success 
                        ? 'bg-green-50 text-green-600 border-green-200' 
                        : 'bg-red-50 text-red-600 border-red-200'
                      }
                    >
                      {exam.result}
                    </Badge>
                  </td>
                  <td className="py-3 text-sm font-medium text-gray-900">{exam.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('tips.title')}</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>{t('tips.sleep')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>{t('tips.breakfast')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>{t('tips.arriveEarly')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>{t('tips.documents')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>{t('tips.glasses')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>{t('tips.stayCalm')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <Button variant="outline" size="lg" className="gap-2">
          <Calendar className="h-5 w-5" />
          {t('actions.bookPreparationLesson')}
        </Button>
        <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
          <GraduationCap className="h-5 w-5" />
          {t('actions.registerForExam')}
        </Button>
      </div>
    </div>
  );
}