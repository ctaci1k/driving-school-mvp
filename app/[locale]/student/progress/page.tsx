// app\[locale]\(student)\student\progress\page.tsx
'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, Award, Target, Calendar, Clock, Star, 
  CheckCircle, XCircle, AlertCircle, ChevronRight, Download,
  Car, Users, BookOpen, Trophy, Zap, Shield, Brain,
  BarChart3, PieChart, Activity, Lock, Unlock, Medal
} from 'lucide-react';

export default function StudentProgressPage() {
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('all');
  const [timeRange, setTimeRange] = useState('all'); // all, month, week

  // Mock data
  const overallProgress = {
    totalLessons: 24,
    totalHours: 36,
    averageRating: 4.8,
    examReadiness: 75,
    predictedSuccessRate: 85,
    lessonsRemaining: 8,
    strongPoints: 3,
    weakPoints: 2
  };

  const skillCategories = [
    { id: 'basic', name: 'Podstawowe', icon: Car, color: 'blue' },
    { id: 'maneuvers', name: 'Manewry', icon: Activity, color: 'green' },
    { id: 'traffic', name: 'Ruch drogowy', icon: Users, color: 'purple' },
    { id: 'special', name: 'Specjalne', icon: Zap, color: 'orange' },
    { id: 'theory', name: 'Teoria', icon: BookOpen, color: 'pink' }
  ];

  const skills = [
    // Basic skills
    { id: 1, name: 'Ruszanie i zatrzymywanie', category: 'basic', progress: 95, status: 'mastered', lastPracticed: '2 dni temu' },
    { id: 2, name: 'Zmiana biegów', category: 'basic', progress: 90, status: 'mastered', lastPracticed: '3 dni temu' },
    { id: 3, name: 'Użycie sprzęgła', category: 'basic', progress: 88, status: 'proficient', lastPracticed: '3 dni temu' },
    { id: 4, name: 'Kontrola kierownicy', category: 'basic', progress: 92, status: 'mastered', lastPracticed: '1 dzień temu' },
    
    // Maneuvers
    { id: 5, name: 'Parkowanie równoległe', category: 'maneuvers', progress: 75, status: 'proficient', lastPracticed: '1 tydzień temu' },
    { id: 6, name: 'Parkowanie prostopadłe', category: 'maneuvers', progress: 80, status: 'proficient', lastPracticed: '4 dni temu' },
    { id: 7, name: 'Zawracanie', category: 'maneuvers', progress: 70, status: 'learning', lastPracticed: '2 tygodnie temu' },
    { id: 8, name: 'Cofanie', category: 'maneuvers', progress: 85, status: 'proficient', lastPracticed: '5 dni temu' },
    { id: 9, name: 'Ruszanie pod górkę', category: 'maneuvers', progress: 65, status: 'learning', lastPracticed: '1 tydzień temu' },
    
    // Traffic
    { id: 10, name: 'Jazda w mieście', category: 'traffic', progress: 82, status: 'proficient', lastPracticed: '2 dni temu' },
    { id: 11, name: 'Rondo', category: 'traffic', progress: 78, status: 'proficient', lastPracticed: '3 dni temu' },
    { id: 12, name: 'Skrzyżowania', category: 'traffic', progress: 85, status: 'proficient', lastPracticed: '1 dzień temu' },
    { id: 13, name: 'Zmiana pasa ruchu', category: 'traffic', progress: 88, status: 'proficient', lastPracticed: '2 dni temu' },
    { id: 14, name: 'Wyprzedzanie', category: 'traffic', progress: 60, status: 'learning', lastPracticed: '2 tygodnie temu' },
    
    // Special conditions
    { id: 15, name: 'Jazda nocna', category: 'special', progress: 45, status: 'learning', lastPracticed: '3 tygodnie temu' },
    { id: 16, name: 'Jazda w deszczu', category: 'special', progress: 50, status: 'learning', lastPracticed: 'Nigdy' },
    { id: 17, name: 'Jazda autostradą', category: 'special', progress: 55, status: 'learning', lastPracticed: '2 tygodnie temu' },
    { id: 18, name: 'Jazda w korku', category: 'special', progress: 70, status: 'proficient', lastPracticed: '1 tydzień temu' },
    
    // Theory
    { id: 19, name: 'Znaki drogowe', category: 'theory', progress: 90, status: 'mastered', lastPracticed: '1 tydzień temu' },
    { id: 20, name: 'Przepisy ruchu', category: 'theory', progress: 85, status: 'proficient', lastPracticed: '4 dni temu' },
    { id: 21, name: 'Pierwszeństwo', category: 'theory', progress: 88, status: 'proficient', lastPracticed: '3 dni temu' },
    { id: 22, name: 'Bezpieczeństwo', category: 'theory', progress: 92, status: 'mastered', lastPracticed: '2 dni temu' }
  ];

  const achievements = [
    { id: 1, name: 'Pierwsza lekcja', description: 'Ukończ swoją pierwszą lekcję', icon: Star, unlocked: true, date: '2024-06-15' },
    { id: 2, name: '10 lekcji', description: 'Ukończ 10 lekcji jazdy', icon: Trophy, unlocked: true, date: '2024-07-20' },
    { id: 3, name: 'Mistrz parkowania', description: 'Osiągnij 90% w parkowaniu', icon: Medal, unlocked: false, progress: 75 },
    { id: 4, name: 'Nocny jeździec', description: 'Ukończ 5 lekcji jazdy nocnej', icon: Shield, unlocked: false, progress: 20 },
    { id: 5, name: 'Perfekcjonista', description: 'Otrzymaj ocenę 5/5 przez 5 lekcji z rzędu', icon: Award, unlocked: true, date: '2024-08-10' },
    { id: 6, name: 'Gotowy na egzamin', description: 'Osiągnij 80% gotowości', icon: Brain, unlocked: false, progress: 75 }
  ];

  const recentFeedback = [
    {
      date: '2024-08-24',
      instructor: 'Piotr Nowak',
      rating: 5,
      strengths: ['Pewne ruszanie', 'Dobra obserwacja drogi', 'Płynna zmiana biegów'],
      improvements: ['Więcej praktyki parkowania równoległego'],
      note: 'Świetne postępy! Jeszcze kilka lekcji i będziesz gotowy.'
    },
    {
      date: '2024-08-22',
      instructor: 'Anna Kowalczyk',
      rating: 4,
      strengths: ['Dobre manewry', 'Spokojna jazda'],
      improvements: ['Praca nad jazdą w korku', 'Większa pewność przy wyprzedzaniu'],
      note: 'Dobra lekcja, widać poprawę w manewrach.'
    }
  ];

  const examChecklist = [
    { category: 'Dokumenty', items: [
      { name: 'Prawo jazdy kategorii B - teoria', completed: true },
      { name: 'Badania lekarskie', completed: true },
      { name: 'Profil kandydata na kierowcę', completed: true }
    ]},
    { category: 'Umiejętności podstawowe', items: [
      { name: 'Ruszanie i zatrzymywanie', completed: true },
      { name: 'Zmiana biegów', completed: true },
      { name: 'Jazda po łuku', completed: true }
    ]},
    { category: 'Manewry', items: [
      { name: 'Parkowanie równoległe', completed: false },
      { name: 'Parkowanie prostopadłe', completed: true },
      { name: 'Zawracanie', completed: false }
    ]},
    { category: 'Jazda w ruchu', items: [
      { name: 'Jazda w mieście', completed: true },
      { name: 'Jazda poza miastem', completed: false },
      { name: 'Jazda w różnych warunkach', completed: false }
    ]}
  ];
const getStatusColor = (status: string) => {
  switch(status) {
    case 'mastered': return 'text-green-600 bg-green-100';
    case 'proficient': return 'text-blue-600 bg-blue-100';
    case 'learning': return 'text-orange-600 bg-orange-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getStatusLabel = (status: string) => {
  switch(status) {
    case 'mastered': return 'Opanowane';
    case 'proficient': return 'Biegły';
    case 'learning': return 'W trakcie nauki';
    default: return 'Nie rozpoczęte';
  }
};

const getProgressColor = (progress: number) => {
  if (progress >= 90) return 'bg-green-500';
  if (progress >= 70) return 'bg-blue-500';
  if (progress >= 50) return 'bg-yellow-500';
  return 'bg-orange-500';
};

  const filteredSkills = selectedSkillCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === selectedSkillCategory);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Moje postępy</h1>
        <p className="text-gray-600">Śledź swoje umiejętności i przygotowanie do egzaminu</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{overallProgress.examReadiness}%</h3>
          <p className="text-sm text-gray-500">Gotowość do egzaminu</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">+2 w tym tyg.</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{overallProgress.totalLessons}</h3>
          <p className="text-sm text-gray-500">Ukończone lekcje</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{overallProgress.totalHours}h</h3>
          <p className="text-sm text-gray-500">Godzin jazdy</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{overallProgress.averageRating}</h3>
          <p className="text-sm text-gray-500">Średnia ocena</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills Progress - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills by Category */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Umiejętności</h2>
              <select
                value={selectedSkillCategory}
                onChange={(e) => setSelectedSkillCategory(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Wszystkie kategorie</option>
                {skillCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {filteredSkills.map(skill => (
                <div key={skill.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-800">{skill.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(skill.status)}`}>
                        {getStatusLabel(skill.status)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{skill.lastPracticed}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${getProgressColor(skill.progress)}`}
                          style={{ width: `${skill.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{skill.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Ostatnie oceny instruktorów</h2>
            
            <div className="space-y-4">
              {recentFeedback.map((feedback, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{feedback.instructor}</p>
                        <p className="text-xs text-gray-500">{feedback.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-1">Mocne strony:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {feedback.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-orange-600 mb-1">Do poprawy:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {feedback.improvements.map((improvement, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <AlertCircle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {feedback.note && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600 italic">"{feedback.note}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Exam Readiness */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Gotowość do egzaminu</h2>
            
            <div className="relative mb-6">
              <svg className="w-full h-32">
                <circle
                  cx="50%"
                  cy="50%"
                  r="50"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="10"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="50"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="10"
                  strokeDasharray={`${overallProgress.examReadiness * 3.14} 314`}
                  strokeLinecap="round"
                  transform="rotate(-90 64 64)"
                  style={{ transformOrigin: '50% 50%' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">{overallProgress.examReadiness}%</span>
                <span className="text-sm text-gray-500">Gotowy</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Przewidywany sukces:</span>
                <span className="font-semibold text-green-600">{overallProgress.predictedSuccessRate}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Pozostało lekcji:</span>
                <span className="font-semibold">{overallProgress.lessonsRemaining}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Mocne strony:</span>
                <span className="font-semibold text-green-600">{overallProgress.strongPoints}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Słabe strony:</span>
                <span className="font-semibold text-orange-600">{overallProgress.weakPoints}</span>
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Sprawdź gotowość
            </button>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Osiągnięcia</h2>
              <span className="text-sm text-gray-500">3/6 odblokowane</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {achievements.map(achievement => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`relative p-3 rounded-lg border-2 transition-all ${
                      achievement.unlocked 
                        ? 'border-yellow-400 bg-yellow-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <Icon className={`w-8 h-8 mb-1 ${
                        achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                      }`} />
                      <p className="text-xs text-center font-medium text-gray-700">
                        {achievement.name}
                      </p>
                    </div>
                    
                    {!achievement.unlocked && achievement.progress && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b">
                        <div 
                          className="h-full bg-yellow-400 rounded-b"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    )}
                    
                    {!achievement.unlocked && (
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-10 rounded-lg flex items-center justify-center">
                        <Lock className="w-4 h-4 text-gray-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button className="w-full mt-4 text-sm text-blue-600 hover:underline">
              Zobacz wszystkie →
            </button>
          </div>

          {/* Exam Checklist */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Lista kontrolna egzaminu</h2>
            
            <div className="space-y-3">
              {examChecklist.map((category, index) => {
                const completedCount = category.items.filter(item => item.completed).length;
                const totalCount = category.items.length;
                const percentage = (completedCount / totalCount) * 100;
                
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-700">{category.category}</h3>
                      <span className="text-xs text-gray-500">{completedCount}/{totalCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${percentage === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Pobierz pełną listę
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}