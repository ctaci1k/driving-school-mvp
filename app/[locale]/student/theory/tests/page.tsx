// app/[locale]/student/theory/tests/page.tsx

'use client';

import { useState } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const testCategories = [
    { id: 'all', name: 'Wszystkie', count: 25 },
    { id: 'official', name: 'Oficjalne', count: 5 },
    { id: 'practice', name: 'Ćwiczeniowe', count: 15 },
    { id: 'exam', name: 'Egzaminacyjne', count: 5 }
  ];

  const difficultyLevels = [
    { id: 'all', name: 'Wszystkie poziomy' },
    { id: 'easy', name: 'Łatwy', color: 'green' },
    { id: 'medium', name: 'Średni', color: 'yellow' },
    { id: 'hard', name: 'Trudny', color: 'red' }
  ];

  const availableTests = [
    {
      id: 1,
      title: 'Test egzaminacyjny WORD #1',
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
      title: 'Znaki drogowe - kompletny test',
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
      title: 'Pierwszeństwo przejazdu',
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
      title: 'Test egzaminacyjny WORD #2',
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
      title: 'Sytuacje niebezpieczne',
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
      title: 'Przepisy ruchu drogowego',
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
      title: 'Budowa pojazdu - podstawy',
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
      title: 'Egzamin próbny - pełny',
      category: 'exam',
      difficulty: 'hard',
      questions: 74,
      timeLimit: 25,
      passingScore: 68,
      attempts: 0,
      bestScore: null,
      lastAttempt: null,
      status: 'locked',
      unlockRequirement: 'Ukończ wszystkie testy ćwiczeniowe'
    }
  ];

  const testHistory = [
    {
      id: 1,
      testTitle: 'Test egzaminacyjny WORD #1',
      date: '2024-01-20 14:30',
      score: 71,
      maxScore: 74,
      passed: true,
      duration: '23:45'
    },
    {
      id: 2,
      testTitle: 'Test egzaminacyjny WORD #2',
      date: '2024-01-22 16:00',
      score: 65,
      maxScore: 74,
      passed: false,
      duration: '24:30'
    },
    {
      id: 3,
      testTitle: 'Znaki drogowe - kompletny test',
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
    bestCategory: 'Znaki drogowe',
    weakestCategory: 'Pierwszeństwo',
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
        return <Badge className="bg-green-100 text-green-700">Zaliczony</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700">Niezaliczony</Badge>;
      case 'new':
        return <Badge className="bg-blue-100 text-blue-700">Nowy</Badge>;
      case 'locked':
        return <Badge className="bg-gray-100 text-gray-500">Zablokowany</Badge>;
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
      easy: 'Łatwy',
      medium: 'Średni',
      hard: 'Trudny'
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
          <h1 className="text-2xl font-bold text-gray-900">Testy teoretyczne</h1>
          <p className="text-gray-600 mt-1">Sprawdź swoją wiedzę przed egzaminem</p>
        </div>
        <Button className="gap-2">
          <PlayCircle className="h-4 w-4" />
          Test szybki
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
            <p className="text-xs text-gray-600">Podejść</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{statistics.passedTests}</p>
            <p className="text-xs text-gray-600">Zaliczone</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{statistics.averageScore}%</p>
            <p className="text-xs text-gray-600">Średni wynik</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-sm font-bold text-gray-900">{statistics.bestCategory}</p>
            <p className="text-xs text-gray-600">Najlepsza kategoria</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-sm font-bold text-gray-900">{statistics.weakestCategory}</p>
            <p className="text-xs text-gray-600">Do poprawy</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{statistics.streak}</p>
            <p className="text-xs text-gray-600">Seria zaliczeń</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Kategoria:</span>
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
            <span className="text-sm text-gray-600">Poziom:</span>
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
                  Pytania
                </span>
                <span className="font-medium">{test.questions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Limit czasu
                </span>
                <span className="font-medium">{test.timeLimit} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  Próg zaliczenia
                </span>
                <span className="font-medium">{test.passingScore}/{test.questions} pkt</span>
              </div>
            </div>

            {test.attempts > 0 && (
              <div className="border-t pt-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Najlepszy wynik</span>
                  <span className={`font-semibold ${
                    test.bestScore! >= test.passingScore ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {test.bestScore}/{test.questions} pkt
                  </span>
                </div>
                <ProgressBar 
                  value={(test.bestScore! / test.questions) * 100}
                  color={test.bestScore! >= test.passingScore ? 'green' : 'red'}
                />
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>Podejść: {test.attempts}</span>
                  <span>Ostatnie: {test.lastAttempt}</span>
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
                  {test.attempts === 0 ? 'Rozpocznij test' : 'Powtórz test'}
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
          <h2 className="text-lg font-semibold text-gray-900">Historia testów</h2>
          <Button variant="outline" size="sm">
            Zobacz wszystkie
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left text-sm font-medium text-gray-600 pb-3">Test</th>
                <th className="text-left text-sm font-medium text-gray-600 pb-3">Data</th>
                <th className="text-center text-sm font-medium text-gray-600 pb-3">Wynik</th>
                <th className="text-center text-sm font-medium text-gray-600 pb-3">Czas</th>
                <th className="text-center text-sm font-medium text-gray-600 pb-3">Status</th>
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