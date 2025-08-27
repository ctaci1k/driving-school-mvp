// File: /app/[locale]/(student)/student/resources/page.tsx
'use client';

import React, { useState } from 'react';
import { 
  BookOpen, Video, FileText, Download, Search, Filter, 
  Clock, Eye, Star, ChevronRight, Play, Pause, Volume2,
  CheckCircle, Lock, Trophy, Brain, Car, AlertTriangle,
  Map, Users, Shield, Lightbulb, ArrowRight, Bookmark,
  Share2, ThumbsUp, MessageSquare, TrendingUp, Award
} from 'lucide-react';

export default function StudentResourcesPage() {
  const [activeTab, setActiveTab] = useState('materials'); // materials, videos, tests, rules
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([]);

  // Mock data
  const categories = [
    { id: 'all', name: 'Wszystkie', icon: BookOpen },
    { id: 'theory', name: 'Teoria', icon: Brain },
    { id: 'practice', name: 'Praktyka', icon: Car },
    { id: 'signs', name: 'Znaki drogowe', icon: AlertTriangle },
    { id: 'rules', name: 'Przepisy', icon: Shield },
    { id: 'exam', name: 'Egzamin', icon: Trophy }
  ];

  const learningMaterials = [
    {
      id: '1',
      title: 'Podstawy ruchu drogowego',
      category: 'theory',
      type: 'pdf',
      pages: 45,
      difficulty: 'beginner',
      downloads: 234,
      rating: 4.8,
      size: '2.3 MB',
      updated: '2024-08-20',
      description: 'Kompletny przewodnik po podstawowych zasadach ruchu drogowego',
      progress: 75
    },
    {
      id: '2',
      title: 'Znaki drogowe - kompendium',
      category: 'signs',
      type: 'pdf',
      pages: 120,
      difficulty: 'intermediate',
      downloads: 567,
      rating: 4.9,
      size: '5.6 MB',
      updated: '2024-08-15',
      description: 'Wszystkie znaki drogowe z opisami i przykładami',
      progress: 100
    },
    {
      id: '3',
      title: 'Parkowanie równoległe - poradnik',
      category: 'practice',
      type: 'pdf',
      pages: 15,
      difficulty: 'intermediate',
      downloads: 189,
      rating: 4.7,
      size: '1.1 MB',
      updated: '2024-08-10',
      description: 'Krok po kroku - jak opanować parkowanie równoległe',
      progress: 50
    },
    {
      id: '4',
      title: 'Pierwsza pomoc na drodze',
      category: 'theory',
      type: 'pdf',
      pages: 30,
      difficulty: 'beginner',
      downloads: 145,
      rating: 4.6,
      size: '1.8 MB',
      updated: '2024-08-05',
      description: 'Podstawy pierwszej pomocy dla kierowców',
      progress: 0
    }
  ];

  const videoTutorials = [
    {
      id: 'v1',
      title: 'Jazda w ruchu miejskim',
      category: 'practice',
      duration: '15:30',
      views: 1234,
      rating: 4.8,
      instructor: 'Piotr Nowak',
      thumbnail: 'https://placehold.co/300x200?text=Jazda+Miejska',
      difficulty: 'intermediate',
      completed: true
    },
    {
      id: 'v2',
      title: 'Manewry parkingowe',
      category: 'practice',
      duration: '12:45',
      views: 2456,
      rating: 4.9,
      instructor: 'Anna Kowalczyk',
      thumbnail: 'https://placehold.co/300x200?text=Parkowanie',
      difficulty: 'intermediate',
      completed: true
    },
    {
      id: 'v3',
      title: 'Jazda nocna - podstawy',
      category: 'practice',
      duration: '18:20',
      views: 876,
      rating: 4.7,
      instructor: 'Tomasz Wiśniewski',
      thumbnail: 'https://placehold.co/300x200?text=Jazda+Nocna',
      difficulty: 'advanced',
      completed: false
    },
    {
      id: 'v4',
      title: 'Rondo - jak przejechać bezpiecznie',
      category: 'practice',
      duration: '10:15',
      views: 3210,
      rating: 4.9,
      instructor: 'Piotr Nowak',
      thumbnail: 'https://placehold.co/300x200?text=Rondo',
      difficulty: 'beginner',
      completed: false
    }
  ];

  const practiceTests = [
    {
      id: 't1',
      title: 'Test podstawowy - znaki drogowe',
      questions: 32,
      timeLimit: 25,
      difficulty: 'beginner',
      category: 'signs',
      attempts: 3,
      bestScore: 28,
      lastAttempt: '2024-08-22',
      passingScore: 26
    },
    {
      id: 't2',
      title: 'Egzamin próbny - pełny',
      questions: 74,
      timeLimit: 50,
      difficulty: 'advanced',
      category: 'exam',
      attempts: 1,
      bestScore: 65,
      lastAttempt: '2024-08-20',
      passingScore: 68
    },
    {
      id: 't3',
      title: 'Pierwszeństwo przejazdu',
      questions: 20,
      timeLimit: 15,
      difficulty: 'intermediate',
      category: 'rules',
      attempts: 2,
      bestScore: 18,
      lastAttempt: '2024-08-18',
      passingScore: 16
    },
    {
      id: 't4',
      title: 'Sytuacje niebezpieczne',
      questions: 25,
      timeLimit: 20,
      difficulty: 'advanced',
      category: 'theory',
      attempts: 0,
      bestScore: 0,
      lastAttempt: null,
      passingScore: 20
    }
  ];

  const trafficRules = [
    {
      id: 'r1',
      title: 'Ograniczenia prędkości',
      category: 'rules',
      lastUpdated: '2024-01-15',
      bookmarked: true,
      topics: ['Obszar zabudowany', 'Drogi ekspresowe', 'Autostrady', 'Strefy zamieszkania']
    },
    {
      id: 'r2',
      title: 'Pierwszeństwo przejazdu',
      category: 'rules',
      lastUpdated: '2024-01-10',
      bookmarked: false,
      topics: ['Skrzyżowania równorzędne', 'Znaki pierwszeństwa', 'Rondo', 'Sygnalizacja świetlna']
    },
    {
      id: 'r3',
      title: 'Wyprzedzanie i omijanie',
      category: 'rules',
      lastUpdated: '2024-01-05',
      bookmarked: false,
      topics: ['Zasady wyprzedzania', 'Miejsca zakazane', 'Wyprzedzanie na autostradzie']
    },
    {
      id: 'r4',
      title: 'Parkowanie i postój',
      category: 'rules',
      lastUpdated: '2023-12-20',
      bookmarked: true,
      topics: ['Znaki zakazu', 'Parkowanie równoległe', 'Strefy płatnego parkowania']
    }
  ];

  const achievements = [
    { id: 1, name: 'Pierwszy materiał', icon: BookOpen, unlocked: true },
    { id: 2, name: '10 filmów', icon: Video, unlocked: true },
    { id: 3, name: 'Mistrz testów', icon: Trophy, unlocked: false },
    { id: 4, name: 'Ekspert przepisów', icon: Shield, unlocked: false }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'Początkujący';
      case 'intermediate': return 'Średniozaawansowany';
      case 'advanced': return 'Zaawansowany';
      default: return difficulty;
    }
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Materiały edukacyjne</h1>
        <p className="text-gray-600">Ucz się w swoim tempie z naszych materiałów</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold">12</span>
          </div>
          <p className="text-sm text-gray-600">Materiałów przeczytanych</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Video className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold">8</span>
          </div>
          <p className="text-sm text-gray-600">Filmów obejrzanych</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Brain className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold">5</span>
          </div>
          <p className="text-sm text-gray-600">Testów ukończonych</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <span className="text-2xl font-bold">2/4</span>
          </div>
          <p className="text-sm text-gray-600">Osiągnięć zdobytych</p>
          <div className="mt-2 flex gap-1">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-200'
                }`}
              >
                <achievement.icon className={`w-4 h-4 ${
                  achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'materials', label: 'Materiały', icon: FileText },
              { id: 'videos', label: 'Filmy', icon: Video },
              { id: 'tests', label: 'Testy', icon: Brain },
              { id: 'rules', label: 'Przepisy', icon: Shield }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Szukaj materiałów..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Wszystkie kategorie</option>
            {categories.slice(1).map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Wszystkie poziomy</option>
            <option value="beginner">Początkujący</option>
            <option value="intermediate">Średniozaawansowany</option>
            <option value="advanced">Zaawansowany</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningMaterials.map(material => (
              <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(material.difficulty)}`}>
                      {getDifficultyLabel(material.difficulty)}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleBookmark(material.id)}
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <Bookmark className={`w-4 h-4 ${
                      bookmarkedItems.includes(material.id) ? 'fill-current text-yellow-500' : 'text-gray-400'
                    }`} />
                  </button>
                </div>

                <h3 className="font-semibold text-gray-800 mb-2">{material.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{material.description}</p>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Strony: {material.pages}</span>
                    <span className="text-gray-500">{material.size}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-gray-700">{material.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">{material.downloads}</span>
                    </div>
                  </div>
                </div>

                {material.progress > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Postęp</span>
                      <span className="text-gray-700 font-medium">{material.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${material.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                  {material.progress > 0 ? 'Kontynuuj' : 'Rozpocznij'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoTutorials.map(video => (
              <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-blue-500 ml-1" />
                    </button>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </span>
                  {video.completed && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{video.title}</h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>{video.instructor}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(video.difficulty)}`}>
                      {getDifficultyLabel(video.difficulty)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">{video.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-gray-700">{video.rating}</span>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:underline">
                      Oglądaj →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tests Tab */}
        {activeTab === 'tests' && (
          <div className="space-y-4">
            {practiceTests.map(test => {
              const passed = test.bestScore >= test.passingScore;
              const percentage = test.attempts > 0 ? (test.bestScore / test.questions) * 100 : 0;
              
              return (
                <div key={test.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-800">{test.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(test.difficulty)}`}>
                          {getDifficultyLabel(test.difficulty)}
                        </span>
                        {passed && (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                            Zaliczony
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Pytania</p>
                          <p className="text-sm font-semibold text-gray-700">{test.questions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Czas</p>
                          <p className="text-sm font-semibold text-gray-700">{test.timeLimit} min</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Próg zaliczenia</p>
                          <p className="text-sm font-semibold text-gray-700">{test.passingScore}/{test.questions}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Podejścia</p>
                          <p className="text-sm font-semibold text-gray-700">{test.attempts}</p>
                        </div>
                      </div>

                      {test.attempts > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Najlepszy wynik: {test.bestScore}/{test.questions}</span>
                            <span className={`font-semibold ${passed ? 'text-green-600' : 'text-orange-600'}`}>
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${passed ? 'bg-green-500' : 'bg-orange-500'}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          {test.lastAttempt && (
                            <p className="text-xs text-gray-500 mt-1">Ostatnia próba: {test.lastAttempt}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      {test.attempts > 0 ? 'Spróbuj ponownie' : 'Rozpocznij test'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
            {trafficRules.map(rule => (
              <div key={rule.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{rule.title}</h3>
                    <p className="text-sm text-gray-500">Ostatnia aktualizacja: {rule.lastUpdated}</p>
                  </div>
                  <button
                    onClick={() => toggleBookmark(rule.id)}
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <Bookmark className={`w-5 h-5 ${
                      rule.bookmarked ? 'fill-current text-yellow-500' : 'text-gray-400'
                    }`} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {rule.topics.map((topic, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {topic}
                    </span>
                  ))}
                </div>

                <button className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                  Czytaj więcej
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}