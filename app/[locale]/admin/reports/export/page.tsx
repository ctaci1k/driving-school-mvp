// /app/[locale]/admin/reports/export/page.tsx
// Strona eksportu danych i raportów

'use client'

import React, { useState } from 'react'
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FilePlus,
  Calendar,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  ChevronRight,
  Search,
  Settings,
  Share2,
  Archive,
  Trash2,
  MoreHorizontal,
  LucideIcon
} from 'lucide-react'

// Types
type ExportStatus = 'completed' | 'processing' | 'failed' | 'queued'
type ExportFormat = 'xlsx' | 'csv' | 'pdf' | 'json'
type ExportType = 'financial' | 'students' | 'bookings' | 'instructors' | 'vehicles' | 'locations'

interface ExportHistoryItem {
  id: string
  name: string
  type: ExportType
  format: ExportFormat
  size: string
  status: ExportStatus
  createdAt: string
  createdBy: string
  downloadUrl?: string
  expiresAt?: string
  downloads: number
  progress?: number
  error?: string
}

interface ExportTemplate {
  id: string
  name: string
  description: string
  type: ExportType
  fields: string[]
  lastUsed: string
  usageCount: number
}

interface DataField {
  id: string
  name: string
  selected: boolean
}

interface DataTypeOption {
  id: ExportType
  label: string
  icon: string
}

interface FormatOption {
  id: ExportFormat
  name: string
  icon: LucideIcon
  description: string
}

// Mock data dla historii eksportów
const exportHistory: ExportHistoryItem[] = [
  {
    id: 'exp-001',
    name: 'Raport finansowy - Styczeń 2024',
    type: 'financial',
    format: 'xlsx',
    size: '2.4 MB',
    status: 'completed',
    createdAt: '2024-01-31 14:30',
    createdBy: 'Jan Kowalski',
    downloadUrl: '#',
    expiresAt: '2024-02-15',
    downloads: 12
  },
  {
    id: 'exp-002',
    name: 'Lista studentów - Aktywni',
    type: 'students',
    format: 'csv',
    size: '845 KB',
    status: 'completed',
    createdAt: '2024-01-30 10:15',
    createdBy: 'Maria Nowak',
    downloadUrl: '#',
    expiresAt: '2024-02-14',
    downloads: 5
  },
  {
    id: 'exp-003',
    name: 'Raport rezerwacji - Q1 2024',
    type: 'bookings',
    format: 'pdf',
    size: '5.2 MB',
    status: 'processing',
    createdAt: '2024-01-30 09:45',
    createdBy: 'Piotr Wiśniewski',
    progress: 65,
    downloads: 0
  },
  {
    id: 'exp-004',
    name: 'Statystyki instruktorów',
    type: 'instructors',
    format: 'xlsx',
    size: '1.8 MB',
    status: 'failed',
    createdAt: '2024-01-29 16:20',
    createdBy: 'Anna Wójcik',
    error: 'Przekroczono limit czasu',
    downloads: 0
  }
]

// Mock data dla szablonów
const exportTemplates: ExportTemplate[] = [
  {
    id: 'tpl-001',
    name: 'Miesięczny raport finansowy',
    description: 'Kompleksowy raport przychodów i wydatków',
    type: 'financial',
    fields: ['revenue', 'expenses', 'profit', 'transactions'],
    lastUsed: '3 dni temu',
    usageCount: 45
  },
  {
    id: 'tpl-002',
    name: 'Lista aktywnych studentów',
    description: 'Export danych studentów z aktywnymi pakietami',
    type: 'students',
    fields: ['name', 'email', 'phone', 'package', 'progress'],
    lastUsed: '1 tydzień temu',
    usageCount: 28
  },
  {
    id: 'tpl-003',
    name: 'Raport wykorzystania pojazdów',
    description: 'Statystyki użytkowania floty',
    type: 'vehicles',
    fields: ['vehicle', 'mileage', 'bookings', 'maintenance', 'fuel'],
    lastUsed: '2 tygodnie temu',
    usageCount: 15
  }
]

export default function ReportsExportPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'templates' | 'history' | 'scheduled'>('new')
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('xlsx')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedDataType, setSelectedDataType] = useState<ExportType>('financial')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [selectedFields, setSelectedFields] = useState<string[]>([])

  const formats: FormatOption[] = [
    { id: 'xlsx', name: 'Excel', icon: FileSpreadsheet, description: 'Najlepszy do analizy danych' },
    { id: 'csv', name: 'CSV', icon: FileText, description: 'Uniwersalny format' },
    { id: 'pdf', name: 'PDF', icon: FileText, description: 'Do drukowania i prezentacji' },
    { id: 'json', name: 'JSON', icon: FileText, description: 'Do integracji API' }
  ]

  const dataTypes: DataTypeOption[] = [
    { id: 'financial', label: 'Dane finansowe', icon: '💰' },
    { id: 'students', label: 'Studenci', icon: '👥' },
    { id: 'bookings', label: 'Rezerwacje', icon: '📅' },
    { id: 'instructors', label: 'Instruktorzy', icon: '🎓' },
    { id: 'vehicles', label: 'Pojazdy', icon: '🚗' },
    { id: 'locations', label: 'Lokalizacje', icon: '📍' }
  ]

  const availableFields: Record<ExportType, DataField[]> = {
    financial: [
      { id: 'revenue', name: 'Przychody', selected: true },
      { id: 'expenses', name: 'Wydatki', selected: true },
      { id: 'profit', name: 'Zysk', selected: true },
      { id: 'transactions', name: 'Transakcje', selected: false },
      { id: 'refunds', name: 'Zwroty', selected: false },
      { id: 'packages', name: 'Sprzedane pakiety', selected: false }
    ],
    students: [
      { id: 'personal', name: 'Dane osobowe', selected: true },
      { id: 'contact', name: 'Dane kontaktowe', selected: true },
      { id: 'package', name: 'Pakiet', selected: true },
      { id: 'progress', name: 'Postęp', selected: true },
      { id: 'payments', name: 'Płatności', selected: false },
      { id: 'attendance', name: 'Frekwencja', selected: false }
    ],
    bookings: [
      { id: 'date', name: 'Data', selected: true },
      { id: 'student', name: 'Student', selected: true },
      { id: 'instructor', name: 'Instruktor', selected: true },
      { id: 'vehicle', name: 'Pojazd', selected: true },
      { id: 'status', name: 'Status', selected: true },
      { id: 'notes', name: 'Notatki', selected: false }
    ],
    instructors: [
      { id: 'personal', name: 'Dane osobowe', selected: true },
      { id: 'contact', name: 'Dane kontaktowe', selected: true },
      { id: 'rating', name: 'Ocena', selected: true },
      { id: 'students', name: 'Liczba studentów', selected: true },
      { id: 'schedule', name: 'Harmonogram', selected: false },
      { id: 'earnings', name: 'Zarobki', selected: false }
    ],
    vehicles: [
      { id: 'basic', name: 'Podstawowe dane', selected: true },
      { id: 'registration', name: 'Rejestracja', selected: true },
      { id: 'mileage', name: 'Przebieg', selected: true },
      { id: 'maintenance', name: 'Przeglądy', selected: false },
      { id: 'bookings', name: 'Rezerwacje', selected: false },
      { id: 'fuel', name: 'Zużycie paliwa', selected: false }
    ],
    locations: [
      { id: 'name', name: 'Nazwa', selected: true },
      { id: 'address', name: 'Adres', selected: true },
      { id: 'capacity', name: 'Pojemność', selected: true },
      { id: 'schedule', name: 'Harmonogram', selected: false },
      { id: 'bookings', name: 'Rezerwacje', selected: false },
      { id: 'revenue', name: 'Przychody', selected: false }
    ]
  }

  const getStatusBadge = (status: ExportStatus) => {
    const statusConfig: Record<ExportStatus, { icon: LucideIcon; color: string; label: string }> = {
      completed: { icon: CheckCircle, color: 'text-green-600 bg-green-50', label: 'Zakończony' },
      processing: { icon: RefreshCw, color: 'text-blue-600 bg-blue-50', label: 'Przetwarzanie' },
      failed: { icon: XCircle, color: 'text-red-600 bg-red-50', label: 'Błąd' },
      queued: { icon: Clock, color: 'text-yellow-600 bg-yellow-50', label: 'W kolejce' }
    }
    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    )
  }

  const getFormatIcon = (format: ExportFormat) => {
    const icons: Record<ExportFormat, LucideIcon> = {
      xlsx: FileSpreadsheet,
      csv: FileText,
      pdf: FileText,
      json: FileText
    }
    const Icon = icons[format]
    return <Icon className="w-4 h-4" />
  }

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    )
  }

  const handleExport = () => {
    console.log('Export with:', {
      dataType: selectedDataType,
      format: selectedFormat,
      dateRange,
      fields: selectedFields
    })
  }

  const handleUseTemplate = (templateId: string) => {
    console.log('Use template:', templateId)
    setSelectedTemplate(templateId)
  }

  const handleDownload = (exportId: string) => {
    console.log('Download export:', exportId)
  }

  const handleRetry = (exportId: string) => {
    console.log('Retry export:', exportId)
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Eksport danych</h1>
            <p className="text-gray-600 mt-1">Generuj i pobieraj raporty w różnych formatach</p>
          </div>
          <button 
            onClick={() => setActiveTab('new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FilePlus className="w-5 h-5" />
            Nowy eksport
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'new' as const, label: 'Nowy eksport' },
              { id: 'templates' as const, label: 'Szablony' },
              { id: 'history' as const, label: 'Historia' },
              { id: 'scheduled' as const, label: 'Zaplanowane' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'new' && (
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Configuration */}
              <div className="col-span-2 space-y-6">
                {/* Data Type Selection */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Typ danych</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {dataTypes.map((type) => (
                      <label
                        key={type.id}
                        className="flex items-center p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-400 transition-colors"
                      >
                        <input 
                          type="radio" 
                          name="dataType" 
                          value={type.id}
                          checked={selectedDataType === type.id}
                          onChange={(e) => setSelectedDataType(e.target.value as ExportType)}
                          className="mr-3" 
                        />
                        <span className="text-2xl mr-3">{type.icon}</span>
                        <span className="font-medium text-gray-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Zakres dat</h3>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Od</label>
                      <input
                        type="date"
                        value={dateRange.from}
                        onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Do</label>
                      <input
                        type="date"
                        value={dateRange.to}
                        onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {['Dziś', 'Wczoraj', 'Ten tydzień', 'Ten miesiąc', 'Ten kwartał'].map((range) => (
                      <button
                        key={range}
                        onClick={() => console.log('Set range:', range)}
                        className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fields Selection */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Pola do eksportu</h3>
                  <div className="space-y-2">
                    {availableFields[selectedDataType].map((field) => (
                      <label key={field.id} className="flex items-center p-2 hover:bg-white rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={field.selected}
                          onChange={() => handleFieldToggle(field.id)}
                          className="mr-3 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{field.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Format & Preview */}
              <div className="space-y-6">
                {/* Format Selection */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Format eksportu</h3>
                  <div className="space-y-2">
                    {formats.map((format) => {
                      const Icon = format.icon
                      return (
                        <label
                          key={format.id}
                          className={`flex items-start p-3 bg-white rounded-lg border cursor-pointer transition-all ${
                            selectedFormat === format.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="format"
                            value={format.id}
                            checked={selectedFormat === format.id}
                            onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
                            className="mt-1 mr-3"
                          />
                          <Icon className="w-5 h-5 mt-1 mr-3 text-gray-600" />
                          <div>
                            <div className="font-medium text-gray-800">{format.name}</div>
                            <div className="text-sm text-gray-600">{format.description}</div>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Export Options */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Opcje</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-gray-700">Kompresuj plik (ZIP)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-gray-700">Wyślij na email</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-gray-700">Zapisz jako szablon</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button 
                    onClick={handleExport}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Download className="w-5 h-5" />
                    Generuj eksport
                  </button>
                  <button 
                    onClick={() => console.log('Schedule export')}
                    className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Zaplanuj na później
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-4">
              {exportTemplates.map((template) => (
                <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{template.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span>Użyto: {template.usageCount} razy</span>
                        <span>•</span>
                        <span>Ostatnio: {template.lastUsed}</span>
                        <span>•</span>
                        <span>{template.fields.length} pól</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUseTemplate(template.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Użyj szablonu
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Szukaj eksportów..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtry
                </button>
              </div>

              {/* Export History List */}
              <div className="space-y-3">
                {exportHistory.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getFormatIcon(item.format)}
                        <div>
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span>{item.createdBy}</span>
                            <span>•</span>
                            <span>{item.createdAt}</span>
                            <span>•</span>
                            <span>{item.size}</span>
                            {item.downloads > 0 && (
                              <>
                                <span>•</span>
                                <span>{item.downloads} pobrań</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(item.status)}
                        {item.status === 'processing' && item.progress && (
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        )}
                        {item.status === 'completed' && (
                          <button 
                            onClick={() => handleDownload(item.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
                          >
                            <Download className="w-4 h-4" />
                            Pobierz
                          </button>
                        )}
                        {item.status === 'failed' && (
                          <button 
                            onClick={() => handleRetry(item.id)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-1"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Ponów
                          </button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {item.status === 'failed' && item.error && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                        <span className="text-sm text-red-700">{item.error}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'scheduled' && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Clock className="w-12 h-12 mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Brak zaplanowanych eksportów</h3>
              <p className="text-gray-400 mb-6">Zaplanuj automatyczne generowanie raportów</p>
              <button 
                onClick={() => setActiveTab('new')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Zaplanuj eksport
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}