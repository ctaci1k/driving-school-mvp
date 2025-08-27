// app/[locale]/student/progress/achievements/page.tsx

'use client';

import { useState } from 'react';
import { 
  Trophy, 
  Star, 
  Target, 
  Award,
  Medal,
  Zap,
  TrendingUp,
  Lock,
  Unlock,
  Clock,
  Calendar,
  Car,
  BookOpen,
  Users,
  Shield,
  Heart,
  Gem,
  Crown,
  Flame,
  CheckCircle2,
  Circle,
  Gift,
  Share2,
  Filter
} from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);

  // Import statements for missing icons (using fallbacks)
  const Road = Car; // Using Car as fallback for Road
  const Flag = Target; // Using Target as fallback for Flag
  const Moon = Clock; // Using Clock as fallback for Moon
  const Sun = Star; // Using Star as fallback for Sun
  const GitBranch = Shield; // Using Shield as fallback for GitBranch

  const totalPoints = 1250;
  const currentLevel = 8;
  const pointsToNextLevel = 250;
  const currentLevelPoints = 150;

  const categories = [
    { id: 'all', name: 'Wszystkie', icon: Trophy },
    { id: 'skills', name: 'Umiejętności', icon: Target },
    { id: 'milestones', name: 'Kamienie milowe', icon: Flag },
    { id: 'special', name: 'Specjalne', icon: Star },
    { id: 'social', name: 'Społecznościowe', icon: Users }
  ];

  const achievements = [
    {
      id: '1',
      title: 'Pierwsza jazda',
      description: 'Ukończ swoją pierwszą lekcję jazdy',
      icon: Car,
      category: 'milestones',
      points: 50,
      unlocked: true,
      unlockedDate: '2023-11-15',
      rarity: 'common',
      progress: { current: 1, total: 1 }
    },
    {
      id: '2',
      title: 'Mistrz parkowania',
      description: 'Wykonaj 5 perfekcyjnych parkowań równoległych z rzędu',
      icon: Medal,
      category: 'skills',
      points: 100,
      unlocked: true,
      unlockedDate: '2024-01-12',
      rarity: 'rare',
      progress: { current: 5, total: 5 }
    },
    {
      id: '3',
      title: 'Nocny jeźdźca',
      description: 'Ukończ 3 lekcje jazdy nocnej',
      icon: Moon,
      category: 'skills',
      points: 150,
      unlocked: true,
      unlockedDate: '2024-01-15',
      rarity: 'rare',
      progress: { current: 3, total: 3 }
    },
    {
      id: '4',
      title: 'Teoretyk',
      description: 'Zdaj egzamin teoretyczny za pierwszym razem',
      icon: BookOpen,
      category: 'milestones',
      points: 200,
      unlocked: true,
      unlockedDate: '2024-01-05',
      rarity: 'epic',
      progress: { current: 1, total: 1 }
    },
    {
      id: '5',
      title: 'Maraton drogowy',
      description: 'Przejedź łącznie 500 km podczas lekcji',
      icon: Road,
      category: 'milestones',
      points: 300,
      unlocked: false,
      rarity: 'epic',
      progress: { current: 320, total: 500 }
    },
    {
      id: '6',
      title: 'Perfekcjonista',
      description: 'Uzyskaj ocenę 10/10 w 5 lekcjach z rzędu',
      icon: Star,
      category: 'skills',
      points: 250,
      unlocked: false,
      rarity: 'legendary',
      progress: { current: 3, total: 5 }
    },
    {
      id: '7',
      title: 'Speed Demon',
      description: 'Ukończ kurs jazdy autostradowej',
      icon: Zap,
      category: 'skills',
      points: 150,
      unlocked: false,
      rarity: 'rare',
      progress: { current: 2, total: 4 }
    },
    {
      id: '8',
      title: 'Pomocna dłoń',
      description: 'Poleć szkołę jazdy 3 znajomym',
      icon: Heart,
      category: 'social',
      points: 100,
      unlocked: true,
      unlockedDate: '2024-01-10',
      rarity: 'common',
      progress: { current: 3, total: 3 }
    },
    {
      id: '9',
      title: 'Wczesny ptak',
      description: 'Ukończ 10 lekcji rozpoczynających się przed 8:00',
      icon: Sun,
      category: 'special',
      points: 100,
      unlocked: false,
      rarity: 'rare',
      progress: { current: 7, total: 10 }
    },
    {
      id: '10',
      title: 'Mistrz manewrów',
      description: 'Opanuj wszystkie wymagane manewry na poziomie 80%+',
      icon: GitBranch,
      category: 'skills',
      points: 400,
      unlocked: false,
      rarity: 'legendary',
      progress: { current: 6, total: 8 }
    },
    {
      id: '11',
      title: 'Złota rączka',
      description: 'Zdaj egzamin praktyczny za pierwszym razem',
      icon: Crown,
      category: 'milestones',
      points: 500,
      unlocked: false,
      rarity: 'legendary',
      progress: { current: 0, total: 1 }
    },
    {
      id: '12',
      title: 'Regularny student',
      description: 'Nie opuść żadnej zaplanowanej lekcji przez 2 miesiące',
      icon: Calendar,
      category: 'special',
      points: 150,
      unlocked: true,
      unlockedDate: '2024-01-20',
      rarity: 'rare',
      progress: { current: 2, total: 2 }
    }
  ];

  const filteredAchievements = achievements.filter(achievement => {
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) return false;
    if (showOnlyUnlocked && !achievement.unlocked) return false;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalAchievements) * 100);

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-100 text-gray-600 border-gray-300',
      rare: 'bg-blue-100 text-blue-600 border-blue-300',
      epic: 'bg-purple-100 text-purple-600 border-purple-300',
      legendary: 'bg-orange-100 text-orange-600 border-orange-300'
    };
    return colors[rarity as keyof typeof colors] || colors.common;
  };

  const getRarityLabel = (rarity: string) => {
    const labels = {
      common: 'Zwykłe',
      rare: 'Rzadkie',
      epic: 'Epickie',
      legendary: 'Legendarne'
    };
    return labels[rarity as keyof typeof labels] || 'Zwykłe';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Osiągnięcia</h1>
          <p className="text-gray-600 mt-1">Zdobywaj odznaki i punkty za swoje postępy</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          Udostępnij
        </Button>
      </div>

      {/* Level Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Poziom {currentLevel}</h2>
            <p className="text-sm text-gray-600">Łącznie zdobyte punkty: {totalPoints}</p>
          </div>
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center">
                <Crown className="h-10 w-10 text-yellow-500" />
              </div>
              <span className="absolute -bottom-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                Lvl {currentLevel}
              </span>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Postęp do poziomu {currentLevel + 1}</span>
            <span className="font-medium">{currentLevelPoints}/{pointsToNextLevel} pkt</span>
          </div>
          <ProgressBar value={(currentLevelPoints / pointsToNextLevel) * 100} color="blue" />
          <p className="text-xs text-gray-500 mt-2">
            Zdobądź {pointsToNextLevel - currentLevelPoints} punktów, aby awansować
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-900">{unlockedCount}/{totalAchievements}</span>
          </div>
          <p className="text-sm text-gray-600">Odblokowane</p>
          <ProgressBar value={completionPercentage} color="yellow" className="mt-2" />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <Gem className="h-8 w-8 text-purple-500" />
            <span className="text-2xl font-bold text-gray-900">{totalPoints}</span>
          </div>
          <p className="text-sm text-gray-600">Łączne punkty</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <Flame className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">7</span>
          </div>
          <p className="text-sm text-gray-600">Seria dni</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <Medal className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold text-gray-900">2</span>
          </div>
          <p className="text-sm text-gray-600">Legendarne</p>
        </div>
      </div>

      {/* Filters */}
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
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowOnlyUnlocked(!showOnlyUnlocked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showOnlyUnlocked
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="text-sm">Tylko odblokowane</span>
            </button>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => {
          const Icon = achievement.icon;
          const progressPercentage = achievement.progress 
            ? Math.round((achievement.progress.current / achievement.progress.total) * 100)
            : 0;

          return (
            <div
              key={achievement.id}
              className={`bg-white rounded-xl shadow-sm p-4 relative overflow-hidden ${
                !achievement.unlocked ? 'opacity-75' : ''
              }`}
            >
              {/* Rarity Badge */}
              <div className="absolute top-2 right-2">
                <Badge className={getRarityColor(achievement.rarity)}>
                  {getRarityLabel(achievement.rarity)}
                </Badge>
              </div>

              {/* Icon and Lock Status */}
              <div className="flex items-start gap-4 mb-3">
                <div className={`relative p-3 rounded-xl ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-yellow-100 to-orange-100' 
                    : 'bg-gray-100'
                }`}>
                  <Icon className={`h-8 w-8 ${
                    achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                  }`} />
                  {!achievement.unlocked && (
                    <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl flex items-center justify-center">
                      <Lock className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                </div>
              </div>

              {/* Progress Bar (for locked achievements) */}
              {!achievement.unlocked && achievement.progress && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">Postęp</span>
                    <span className="font-medium">
                      {achievement.progress.current}/{achievement.progress.total}
                    </span>
                  </div>
                  <ProgressBar value={progressPercentage} color="gray" />
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-semibold">{achievement.points}</span>
                  </div>
                  <span className="text-xs text-gray-500">punktów</span>
                </div>
                
                {achievement.unlocked && achievement.unlockedDate && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{achievement.unlockedDate}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Achievements */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Blisko odblokowania</h2>
        <div className="space-y-3">
          {achievements
            .filter(a => !a.unlocked && a.progress)
            .sort((a, b) => {
              const aProgress = (a.progress!.current / a.progress!.total) * 100;
              const bProgress = (b.progress!.current / b.progress!.total) * 100;
              return bProgress - aProgress;
            })
            .slice(0, 3)
            .map((achievement) => {
              const Icon = achievement.icon;
              const progressPercentage = achievement.progress 
                ? Math.round((achievement.progress.current / achievement.progress.total) * 100)
                : 0;

              return (
                <div key={achievement.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <Icon className="h-6 w-6 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{achievement.title}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <ProgressBar value={progressPercentage} className="flex-1" />
                      <span className="text-sm text-gray-600">
                        {achievement.progress?.current}/{achievement.progress?.total}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-yellow-600">+{achievement.points}</p>
                    <p className="text-xs text-gray-500">punktów</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}