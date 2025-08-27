// app/[locale]/admin/reports/page.tsx
"use client";

import React, { useState } from 'react';
import {
  FileText, Download, Calendar, Filter, TrendingUp, Users,
  DollarSign, Car, GraduationCap, PieChart, BarChart3,
  Activity, Target, Award, Clock, CheckCircle, AlertCircle,
  ChevronRight, Loader2, Send, Printer, Share2, Save,
  FileSpreadsheet, FilePlus, Eye, Settings, Database
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function AdminReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState('financial');
  const [dateFrom, setDateFrom] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [savedReports, setSavedReports] = useState<any[]>([]);

  // Mock data - polskie miasta
  const locations = ['Warszawa - Centrum', 'Warszawa - Mokotów', 'Warszawa - Wola', 'Kraków', 'Wrocław'];
  const instructors = [
    'Piotr Kowalski', 'Anna Nowak', 'Jan Wiśniewski', 'Katarzyna Wójcik',
    'Marek Kowalczyk', 'Maria Kamińska', 'Aleksander Lewandowski'
  ];
  const categories = ['B', 'B+E', 'C', 'C+E', 'D'];

  const reportTypes = [
    {
      id: 'financial',
      name: 'Raport finansowy',
      description: 'Przychody, wydatki, zysk za okres',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 'students',
      name: 'Raport kursantów',
      description: 'Statystyki kursantów i ich postępów',
      icon: Users,
      color: 'blue'
    },
    {
      id: 'instructors',
      name: 'Raport instruktorów',
      description: 'Efektywność i obciążenie instruktorów',
      icon: GraduationCap,
      color: 'purple'
    },
    {
      id: 'bookings',
      name: 'Raport rezerwacji',
      description: 'Analiza rezerwacji i obłożenia',
      icon: Calendar,
      color: 'orange'
    },
    {
      id: 'vehicles',
      name: 'Raport pojazdów',
      description: 'Wykorzystanie i obsługa floty',
      icon: Car,
      color: 'indigo'
    },
    {
      id: 'performance',
      name: 'Raport wydajności',
      description: 'KPI i ogólna efektywność szkoły',
      icon: Target,
      color: 'red'
    }
  ];

  const predefinedPeriods = [
    { label: 'Dzisiaj', value: 'today' },
    { label: 'Wczoraj', value: 'yesterday' },
    { label: 'Ten tydzień', value: 'week' },
    { label: 'Ten miesiąc', value: 'month' },
    { label: 'Poprzedni miesiąc', value: 'lastMonth' },
    { label: 'Ten kwartał', value: 'quarter' },
    { label: 'Ten rok', value: 'year' }
  ];

  const scheduleOptions = [
    { label: 'Codziennie', value: 'daily' },
    { label: 'Co tydzień', value: 'weekly' },
    { label: 'Co miesiąc', value: 'monthly' },
    { label: 'Co kwartał', value: 'quarterly' }
  ];

  const handlePeriodSelect = (period: string) => {
    const today = new Date();
    
    switch(period) {
      case 'today':
        setDateFrom(format(today, 'yyyy-MM-dd'));
        setDateTo(format(today, 'yyyy-MM-dd'));
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        setDateFrom(format(yesterday, 'yyyy-MM-dd'));
        setDateTo(format(yesterday, 'yyyy-MM-dd'));
        break;
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1);
        setDateFrom(format(weekStart, 'yyyy-MM-dd'));
        setDateTo(format(today, 'yyyy-MM-dd'));
        break;
      case 'month':
        setDateFrom(format(startOfMonth(today), 'yyyy-MM-dd'));
        setDateTo(format(endOfMonth(today), 'yyyy-MM-dd'));
        break;
      case 'lastMonth':
        const lastMonth = subMonths(today, 1);
        setDateFrom(format(startOfMonth(lastMonth), 'yyyy-MM-dd'));
        setDateTo(format(endOfMonth(lastMonth), 'yyyy-MM-dd'));
        break;
      case 'quarter':
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        setDateFrom(format(quarterStart, 'yyyy-MM-dd'));
        setDateTo(format(today, 'yyyy-MM-dd'));
        break;
      case 'year':
        setDateFrom(format(new Date(today.getFullYear(), 0, 1), 'yyyy-MM-dd'));
        setDateTo(format(today, 'yyyy-MM-dd'));
        break;
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setGeneratedReport({
      type: selectedReportType,
      period: { from: dateFrom, to: dateTo },
      generatedAt: new Date(),
      data: {
        summary: {
          totalRevenue: 125450,
          totalExpenses: 45200,
          netProfit: 80250,
          totalBookings: 342,
          completedLessons: 298,
          cancelledLessons: 44,
          averageRating: 4.7,
          studentCount: 284,
          instructorCount: 12
        }
      }
    });
    
    setIsGenerating(false);
  };

  const handleExport = (format: string) => {
    console.log(`Eksportowanie raportu jako ${format}...`);
  };

  const handleScheduleReport = () => {
    console.log('Planowanie raportu...');
  };

  const handleSaveReport = () => {
    if (generatedReport) {
      setSavedReports([...savedReports, {
        ...generatedReport,
        id: `report-${savedReports.length + 1}`,
        name: `${reportTypes.find(r => r.id === generatedReport.type)?.name} - ${format(new Date(), 'dd.MM.yyyy HH:mm')}`
      }]);
      setGeneratedReport(null);
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      red: 'bg-red-100 text-red-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Raporty</h1>
          <p className="text-gray-600 mt-1">Tworzenie i analiza raportów</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Database className="w-4 h-4" />
            Zapisane raporty
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <FilePlus className="w-4 h-4" />
            Nowy raport
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Type Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Typ raportu</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedReportType === type.id;
                
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedReportType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getColorClasses(type.color)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{type.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Okres</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Od</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Do</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {predefinedPeriods.map((period) => (
                  <button
                    key={period.value}
                    onClick={() => handlePeriodSelect(period.value)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtry</h3>
            <div className="space-y-4">
              {/* Locations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lokalizacje</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {locations.map((location) => (
                    <label key={location} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(location)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLocations([...selectedLocations, location]);
                          } else {
                            setSelectedLocations(selectedLocations.filter(l => l !== location));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Instructors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instruktorzy</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {instructors.map((instructor) => (
                    <label key={instructor} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedInstructors.includes(instructor)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedInstructors([...selectedInstructors, instructor]);
                          } else {
                            setSelectedInstructors(selectedInstructors.filter(i => i !== instructor));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{instructor}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, category]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(c => c !== category));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview & Actions */}
        <div className="space-y-6">
          {/* Preview */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Podgląd</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Typ:</p>
                <p className="font-medium text-gray-800">
                  {reportTypes.find(r => r.id === selectedReportType)?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Okres:</p>
                <p className="font-medium text-gray-800">
                  {format(new Date(dateFrom), 'dd.MM.yyyy')} - {format(new Date(dateTo), 'dd.MM.yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Lokalizacje:</p>
                <p className="font-medium text-gray-800">
                  {selectedLocations.length > 0 ? selectedLocations.join(', ') : 'Wszystkie lokalizacje'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Instruktorzy:</p>
                <p className="font-medium text-gray-800">
                  {selectedInstructors.length > 0 ? `Wybrano: ${selectedInstructors.length}` : 'Wszyscy instruktorzy'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kategorie:</p>
                <p className="font-medium text-gray-800">
                  {selectedCategories.length > 0 ? selectedCategories.join(', ') : 'Wszystkie kategorie'}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generowanie raportu...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Generuj raport
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm">
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm">
                  <FileSpreadsheet className="w-4 h-4" />
                  Excel
                </button>
              </div>

              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                Zaplanuj raport
              </button>
            </div>
          </div>

          {/* Schedule Settings */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Raporty automatyczne</h3>
            <div className="space-y-3">
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Wyłączone</option>
                {scheduleOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sendEmail"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="sendEmail" className="text-sm text-gray-700">
                  Wyślij na email
                </label>
              </div>
              
              <input
                type="email"
                placeholder="admin@szkola-jazdy.pl"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Generated Report */}
      {generatedReport && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {reportTypes.find(r => r.id === generatedReport.type)?.name}
              </h3>
              <p className="text-sm text-gray-500">
                Wygenerowano {format(generatedReport.generatedAt, 'dd.MM.yyyy HH:mm')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExport('pdf')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Pobierz PDF"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Pobierz Excel"
              >
                <FileSpreadsheet className="w-4 h-4" />
              </button>
              <button
                onClick={() => console.log('Print')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Drukuj"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={() => console.log('Share')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Udostępnij"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleSaveReport}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Zapisz"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Report Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Całkowity przychód</p>
              <p className="text-2xl font-bold text-gray-800">
                {generatedReport.data.summary.totalRevenue.toLocaleString()} zł
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Wydatki</p>
              <p className="text-2xl font-bold text-gray-800">
                {generatedReport.data.summary.totalExpenses.toLocaleString()} zł
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Zysk netto</p>
              <p className="text-2xl font-bold text-green-600">
                {generatedReport.data.summary.netProfit.toLocaleString()} zł
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Wszystkie rezerwacje</p>
              <p className="text-2xl font-bold text-gray-800">
                {generatedReport.data.summary.totalBookings}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600">
              Szczegółowy raport zawiera pełną analitykę za wybrany okres. 
              Pobierz pełny raport w formacie PDF lub Excel do szczegółowego przeglądu.
            </p>
          </div>
        </div>
      )}

      {/* Recent Reports */}
      {savedReports.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ostatnie zapisane raporty</h3>
          <div className="space-y-3">
            {savedReports.slice(-5).reverse().map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-800">{report.name}</p>
                    <p className="text-sm text-gray-500">
                      {format(report.generatedAt, 'dd.MM.yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}