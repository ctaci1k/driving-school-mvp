// app/[locale]/admin/reports/analytics/page.tsx
// Strona analityki - wykresy, statystyki i analizy biznesowe

'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Car,
  DollarSign,
  Calendar,
  Activity,
  Target,
  Award,
  Clock,
  MapPin,
  BookOpen,
  Filter,
  Download,
  RefreshCw,
  Info,
  ChevronUp,
  ChevronDown,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from 'recharts';
import { cn } from '@/lib/utils';

// Typy
interface Metric {
  label: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  color: string;
}

interface ChartData {
  [key: string]: any;
}

// Mock data
const kpiMetrics: Metric[] = [
  {
    label: 'Przychody',
    value: '485,750 zł',
    change: 12.5,
    changeType: 'increase',
    icon: DollarSign,
    color: 'green'
  },
  {
    label: 'Aktywni kursanci',
    value: 342,
    change: 8.2,
    changeType: 'increase',
    icon: Users,
    color: 'blue'
  },
  {
    label: 'Wskaźnik zdawalności',
    value: '87%',
    change: -2.1,
    changeType: 'decrease',
    icon: Award,
    color: 'purple'
  },
  {
    label: 'Średnia ocena',
    value: 4.6,
    change: 0.3,
    changeType: 'increase',
    icon: Target,
    color: 'yellow'
  }
];

const revenueData = [
  { month: 'Sty', revenue: 65000, costs: 42000, profit: 23000, students: 45 },
  { month: 'Lut', revenue: 72000, costs: 45000, profit: 27000, students: 52 },
  { month: 'Mar', revenue: 68000, costs: 41000, profit: 27000, students: 48 },
  { month: 'Kwi', revenue: 85000, costs: 48000, profit: 37000, students: 65 },
  { month: 'Maj', revenue: 92000, costs: 52000, profit: 40000, students: 72 },
  { month: 'Cze', revenue: 88000, costs: 49000, profit: 39000, students: 68 },
  { month: 'Lip', revenue: 95000, costs: 53000, profit: 42000, students: 78 },
  { month: 'Sie', revenue: 82000, costs: 47000, profit: 35000, students: 62 },
  { month: 'Wrz', revenue: 98000, costs: 55000, profit: 43000, students: 85 },
  { month: 'Paź', revenue: 102000, costs: 58000, profit: 44000, students: 88 },
  { month: 'Lis', revenue: 96000, costs: 54000, profit: 42000, students: 82 },
  { month: 'Gru', revenue: 105000, costs: 59000, profit: 46000, students: 92 }
];

const categoryDistribution = [
  { name: 'Kategoria B', value: 65, students: 222 },
  { name: 'Kategoria A', value: 20, students: 68 },
  { name: 'Kategoria C', value: 10, students: 34 },
  { name: 'Kategoria A2', value: 3, students: 10 },
  { name: 'Inne', value: 2, students: 8 }
];

const instructorPerformance = [
  { name: 'Adam Nowak', lessons: 245, rating: 4.8, passRate: 92, revenue: 48500 },
  { name: 'Ewa Mazur', lessons: 198, rating: 4.9, passRate: 89, revenue: 39200 },
  { name: 'Tomasz Wójcik', lessons: 165, rating: 4.6, passRate: 85, revenue: 32600 },
  { name: 'Maria Lewandowska', lessons: 280, rating: 4.9, passRate: 94, revenue: 55400 },
  { name: 'Piotr Zieliński', lessons: 152, rating: 4.5, passRate: 82, revenue: 30100 }
];

const locationStats = [
  { location: 'Warszawa Centrum', bookings: 145, revenue: 28900, utilization: 87 },
  { location: 'Warszawa Mokotów', bookings: 98, revenue: 19500, utilization: 72 },
  { location: 'Warszawa Praga', bookings: 76, revenue: 15100, utilization: 58 },
  { location: 'Warszawa Ursynów', bookings: 112, revenue: 22300, utilization: 78 }
];

const studentProgress = [
  { stage: 'Rejestracja', count: 420, percentage: 100 },
  { stage: 'Teoria rozpoczęta', count: 385, percentage: 91.7 },
  { stage: 'Teoria ukończona', count: 342, percentage: 81.4 },
  { stage: 'Praktyka rozpoczęta', count: 320, percentage: 76.2 },
  { stage: 'Praktyka ukończona', count: 285, percentage: 67.9 },
  { stage: 'Egzamin zdany', count: 248, percentage: 59.0 }
];

const radarData = [
  { subject: 'Teoria', A: 85, B: 92, fullMark: 100 },
  { subject: 'Praktyka', A: 78, B: 85, fullMark: 100 },
  { subject: 'Manewry', A: 82, B: 88, fullMark: 100 },
  { subject: 'Miasto', A: 75, B: 82, fullMark: 100 },
  { subject: 'Trasa', A: 88, B: 90, fullMark: 100 },
  { subject: 'Bezpieczeństwo', A: 92, B: 95, fullMark: 100 }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('month');
  const [compareMode, setCompareMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleExport = () => {
    console.log('Export analytics data');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString('pl-PL')} zł`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('zł') || entry.dataKey.includes('revenue') || entry.dataKey.includes('profit') || entry.dataKey.includes('costs')
                ? formatCurrency(entry.value)
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Nagłówek */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Analityka</h1>
              <p className="text-gray-600">Szczegółowe analizy i statystyki biznesowe</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Ten tydzień</SelectItem>
                <SelectItem value="month">Ten miesiąc</SelectItem>
                <SelectItem value="quarter">Ten kwartał</SelectItem>
                <SelectItem value="year">Ten rok</SelectItem>
                <SelectItem value="custom">Niestandardowy</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCompareMode(!compareMode)}
              className={compareMode ? 'bg-blue-50' : ''}
            >
              <Activity className="w-4 h-4 mr-2" />
              {compareMode ? 'Wyłącz porównanie' : 'Porównaj okresy'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Eksportuj
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {kpiMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="bg-white border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    metric.color === 'green' && "bg-green-100",
                    metric.color === 'blue' && "bg-blue-100",
                    metric.color === 'purple' && "bg-purple-100",
                    metric.color === 'yellow' && "bg-yellow-100"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5",
                      metric.color === 'green' && "text-green-600",
                      metric.color === 'blue' && "text-blue-600",
                      metric.color === 'purple' && "text-purple-600",
                      metric.color === 'yellow' && "text-yellow-600"
                    )} />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    metric.changeType === 'increase' ? "text-green-600" : 
                    metric.changeType === 'decrease' ? "text-red-600" : 
                    "text-gray-600"
                  )}>
                    {metric.changeType === 'increase' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : metric.changeType === 'decrease' ? (
                      <ArrowDownRight className="w-4 h-4" />
                    ) : null}
                    <span>{Math.abs(metric.change)}%</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</p>
                <p className="text-sm text-gray-600">{metric.label}</p>
                {compareMode && (
                  <p className="text-xs text-gray-500 mt-2">
                    Poprzedni okres: {typeof metric.value === 'string' ? '425,000 zł' : Math.round(Number(metric.value) * 0.9)}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs z wykresami */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-gray-100">
          <TabsTrigger value="overview">Przegląd</TabsTrigger>
          <TabsTrigger value="financial">Finanse</TabsTrigger>
          <TabsTrigger value="students">Kursanci</TabsTrigger>
          <TabsTrigger value="instructors">Instruktorzy</TabsTrigger>
          <TabsTrigger value="locations">Lokalizacje</TabsTrigger>
          <TabsTrigger value="performance">Wydajność</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Główny wykres przychodów */}
          <Card className="bg-white border-gray-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Przychody i koszty</CardTitle>
                  <CardDescription>Analiza finansowa w czasie</CardDescription>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Przychody</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Koszty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Zysk</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Przychody" />
                  <Bar dataKey="costs" fill="#ef4444" name="Koszty" />
                  <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} name="Zysk" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Podział kategorii */}
            <Card className="bg-white border-gray-100">
              <CardHeader>
                <CardTitle>Podział według kategorii</CardTitle>
                <CardDescription>Rozkład kursantów w kategoriach</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {categoryDistribution.map((cat, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{cat.name}</span>
                      </div>
                      <span className="font-medium">{cat.students} kursantów</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Funnel konwersji */}
            <Card className="bg-white border-gray-100">
              <CardHeader>
                <CardTitle>Lejek konwersji</CardTitle>
                <CardDescription>Postęp kursantów w procesie nauki</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentProgress.map((stage, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{stage.stage}</span>
                        <span className="text-gray-600">{stage.count} ({stage.percentage}%)</span>
                      </div>
                      <Progress 
                        value={stage.percentage} 
                        className="h-2"
                        style={{
                          background: `linear-gradient(to right, ${COLORS[index % COLORS.length]} ${stage.percentage}%, #e5e5e5 ${stage.percentage}%)`
                        }}
                      />
                    </div>
                  ))}
                </div>
                <Alert className="mt-4 bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Wskaźnik konwersji: <strong>59%</strong> (248 z 420 kursantów zdało egzamin)
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white border-gray-100">
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 mb-2">Przychody YTD</p>
                <p className="text-3xl font-bold text-gray-800">1,148,750 zł</p>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+18.5% vs poprzedni rok</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-100">
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 mb-2">Średni przychód/kursant</p>
                <p className="text-3xl font-bold text-gray-800">3,358 zł</p>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+5.2% vs poprzedni okres</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-100">
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 mb-2">Marża zysku</p>
                <p className="text-3xl font-bold text-gray-800">42.3%</p>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600">-1.8% vs poprzedni okres</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>Trend przychodów</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" name="Przychody" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>Dynamika liczby kursantów</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="students" stroke="#8b5cf6" strokeWidth={2} name="Liczba kursantów" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border-gray-100">
              <CardHeader>
                <CardTitle>Demografia kursantów</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>18-25 lat</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>26-35 lat</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <Progress value={30} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>36-45 lat</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <Progress value={15} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>46+ lat</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <Progress value={10} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-100">
              <CardHeader>
                <CardTitle>Źródła pozyskania</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Google Ads</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <Progress value={35} className="bg-blue-100" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Polecenia</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <Progress value={28} className="bg-green-100" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Facebook</span>
                      <span className="font-medium">22%</span>
                    </div>
                    <Progress value={22} className="bg-purple-100" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Strona WWW</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <Progress value={15} className="bg-yellow-100" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="instructors" className="space-y-6">
          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>Wydajność instruktorów</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {instructorPerformance.map((instructor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{instructor.name}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>{instructor.lessons} lekcji</span>
                        <span>★ {instructor.rating}</span>
                        <span>{instructor.passRate}% zdawalność</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{formatCurrency(instructor.revenue)}</p>
                      <p className="text-sm text-gray-500">przychód</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>Porównanie kompetencji</CardTitle>
              <CardDescription>Średnie wyniki instruktorów w różnych obszarach</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e5e5" />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Ten miesiąc" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Radar name="Poprzedni miesiąc" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {locationStats.map((location, index) => (
              <Card key={index} className="bg-white border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <Badge variant="outline">{location.utilization}%</Badge>
                  </div>
                  <p className="font-semibold text-gray-800 mb-1">{location.location}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rezerwacje:</span>
                      <span className="font-medium">{location.bookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Przychód:</span>
                      <span className="font-medium">{formatCurrency(location.revenue)}</span>
                    </div>
                  </div>
                  <Progress value={location.utilization} className="mt-3" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>Wykorzystanie lokalizacji</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={locationStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="utilization" fill="#3b82f6" name="Wykorzystanie %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <Badge className="bg-green-100 text-green-700">+5%</Badge>
                </div>
                <p className="text-2xl font-bold text-gray-800">42 min</p>
                <p className="text-sm text-gray-600">Średni czas lekcji</p>
                <Progress value={85} className="mt-3" />
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Target className="w-5 h-5 text-green-600" />
                  <Badge className="bg-green-100 text-green-700">Dobry</Badge>
                </div>
                <p className="text-2xl font-bold text-gray-800">87%</p>
                <p className="text-sm text-gray-600">Wskaźnik zdawalności</p>
                <Progress value={87} className="mt-3" />
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-5 h-5 text-blue-600" />
                  <Badge variant="outline">342</Badge>
                </div>
                <p className="text-2xl font-bold text-gray-800">94%</p>
                <p className="text-sm text-gray-600">Satysfakcja klientów</p>
                <Progress value={94} className="mt-3" />
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border-gray-100">
            <CardHeader>
              <CardTitle>Kluczowe wskaźniki wydajności (KPI)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Średni czas oczekiwania na lekcję</span>
                  </div>
                  <span className="font-semibold">3.2 dni</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">Współczynnik rezygnacji</span>
                  </div>
                  <span className="font-semibold">8.5%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Średnia liczba lekcji na kursanta</span>
                  </div>
                  <span className="font-semibold">32.4</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="font-medium">Wykorzystanie floty pojazdów</span>
                  </div>
                  <span className="font-semibold">78%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}