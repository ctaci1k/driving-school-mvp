// /app/[locale]/admin/reports/export/page.tsx
// Сторінка експорту даних та звітів

'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
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

// Типи
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

export default function ReportsExportPage() {
  const t = useTranslations('admin.reports.export')
  
  const [activeTab, setActiveTab] = useState<'new' | 'templates' | 'history' | 'scheduled'>('new')
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('xlsx')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedDataType, setSelectedDataType] = useState<ExportType>('financial')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [selectedFields, setSelectedFields] = useState<string[]>([])

  // Історія експортів
  const exportHistory: ExportHistoryItem[] = [
    {
      id: 'exp-001',
      name: 'Фінансовий звіт - Січень 2024',
      type: 'financial',
      format: 'xlsx',
      size: '2.4 MB',
      status: 'completed',
      createdAt: '2024-01-31 14:30',
      createdBy: 'Іван Коваленко',
      downloadUrl: '#',
      expiresAt: '2024-02-15',
      downloads: 12
    },
    {
      id: 'exp-002',
      name: 'Список учнів - Активні',
      type: 'students',
      format: 'csv',
      size: '845 KB',
      status: 'completed',
      createdAt: '2024-01-30 10:15',
      createdBy: 'Марія Новак',
      downloadUrl: '#',
      expiresAt: '2024-02-14',
      downloads: 5
    },
    {
      id: 'exp-003',
      name: 'Звіт бронювань - Q1 2024',
      type: 'bookings',
      format: 'pdf',
      size: '5.2 MB',
      status: 'processing',
      createdAt: '2024-01-30 09:45',
      createdBy: 'Петро Вишневський',
      progress: 65,
      downloads: 0
    },
    {
      id: 'exp-004',
      name: 'Статистика інструкторів',
      type: 'instructors',
      format: 'xlsx',
      size: '1.8 MB',
      status: 'failed',
      createdAt: '2024-01-29 16:20',
      createdBy: 'Анна Вовк',
      error: t('history.errorMessage'),
      downloads: 0
    }
  ]

  // Шаблони експорту
  const exportTemplates: ExportTemplate[] = [
    {
      id: 'tpl-001',
      name: t('templates.monthlyFinancialReport'),
      description: t('templates.monthlyFinancialDescription'),
      type: 'financial',
      fields: ['revenue', 'expenses', 'profit', 'transactions'],
      lastUsed: '3 дні тому',
      usageCount: 45
    },
    {
      id: 'tpl-002',
      name: t('templates.activeStudentsList'),
      description: t('templates.activeStudentsDescription'),
      type: 'students',
      fields: ['name', 'email', 'phone', 'package', 'progress'],
      lastUsed: '1 тиждень тому',
      usageCount: 28
    },
    {
      id: 'tpl-003',
      name: t('templates.vehicleUsageReport'),
      description: t('templates.vehicleUsageDescription'),
      type: 'vehicles',
      fields: ['vehicle', 'mileage', 'bookings', 'maintenance', 'fuel'],
      lastUsed: '2 тижні тому',
      usageCount: 15
    }
  ]

  const formats: FormatOption[] = [
    { id: 'xlsx', name: t('formats.xlsx.name'), icon: FileSpreadsheet, description: t('formats.xlsx.description') },
    { id: 'csv', name: t('formats.csv.name'), icon: FileText, description: t('formats.csv.description') },
    { id: 'pdf', name: t('formats.pdf.name'), icon: FileText, description: t('formats.pdf.description') },
    { id: 'json', name: t('formats.json.name'), icon: FileText, description: t('formats.json.description') }
  ]

  const dataTypes: DataTypeOption[] = [
    { id: 'financial', label: t('dataTypes.financial'), icon: '💰' },
    { id: 'students', label: t('dataTypes.students'), icon: '👥' },
    { id: 'bookings', label: t('dataTypes.bookings'), icon: '📅' },
    { id: 'instructors', label: t('dataTypes.instructors'), icon: '🎓' },
    { id: 'vehicles', label: t('dataTypes.vehicles'), icon: '🚗' },
    { id: 'locations', label: t('dataTypes.locations'), icon: '📍' }
  ]

  const availableFields: Record<ExportType, DataField[]> = {
    financial: [
      { id: 'revenue', name: t('fields.financial.revenue'), selected: true },
      { id: 'expenses', name: t('fields.financial.expenses'), selected: true },
      { id: 'profit', name: t('fields.financial.profit'), selected: true },
      { id: 'transactions', name: t('fields.financial.transactions'), selected: false },
      { id: 'refunds', name: t('fields.financial.refunds'), selected: false },
      { id: 'packages', name: t('fields.financial.packages'), selected: false }
    ],
    students: [
      { id: 'personal', name: t('fields.students.personal'), selected: true },
      { id: 'contact', name: t('fields.students.contact'), selected: true },
      { id: 'package', name: t('fields.students.package'), selected: true },
      { id: 'progress', name: t('fields.students.progress'), selected: true },
      { id: 'payments', name: t('fields.students.payments'), selected: false },
      { id: 'attendance', name: t('fields.students.attendance'), selected: false }
    ],
    bookings: [
      { id: 'date', name: t('fields.bookings.date'), selected: true },
      { id: 'student', name: t('fields.bookings.student'), selected: true },
      { id: 'instructor', name: t('fields.bookings.instructor'), selected: true },
      { id: 'vehicle', name: t('fields.bookings.vehicle'), selected: true },
      { id: 'status', name: t('fields.bookings.status'), selected: true },
      { id: 'notes', name: t('fields.bookings.notes'), selected: false }
    ],
    instructors: [
      { id: 'personal', name: t('fields.instructors.personal'), selected: true },
      { id: 'contact', name: t('fields.instructors.contact'), selected: true },
      { id: 'rating', name: t('fields.instructors.rating'), selected: true },
      { id: 'students', name: t('fields.instructors.students'), selected: true },
      { id: 'schedule', name: t('fields.instructors.schedule'), selected: false },
      { id: 'earnings', name: t('fields.instructors.earnings'), selected: false }
    ],
    vehicles: [
      { id: 'basic', name: t('fields.vehicles.basic'), selected: true },
      { id: 'registration', name: t('fields.vehicles.registration'), selected: true },
      { id: 'mileage', name: t('fields.vehicles.mileage'), selected: true },
      { id: 'maintenance', name: t('fields.vehicles.maintenance'), selected: false },
      { id: 'bookings', name: t('fields.vehicles.bookings'), selected: false },
      { id: 'fuel', name: t('fields.vehicles.fuel'), selected: false }
    ],
    locations: [
      { id: 'name', name: t('fields.locations.name'), selected: true },
      { id: 'address', name: t('fields.locations.address'), selected: true },
      { id: 'capacity', name: t('fields.locations.capacity'), selected: true },
      { id: 'schedule', name: t('fields.locations.schedule'), selected: false },
      { id: 'bookings', name: t('fields.locations.bookings'), selected: false },
      { id: 'revenue', name: t('fields.locations.revenue'), selected: false }
    ]
  }

  const getStatusBadge = (status: ExportStatus) => {
    const statusConfig: Record<ExportStatus, { icon: LucideIcon; color: string; label: string }> = {
      completed: { icon: CheckCircle, color: 'text-green-600 bg-green-50', label: t('status.completed') },
      processing: { icon: RefreshCw, color: 'text-blue-600 bg-blue-50', label: t('status.processing') },
      failed: { icon: XCircle, color: 'text-red-600 bg-red-50', label: t('status.failed') },
      queued: { icon: Clock, color: 'text-yellow-600 bg-yellow-50', label: t('status.queued') }
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
      {/* Заголовок */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
            <p className="text-gray-600 mt-1">{t('subtitle')}</p>
          </div>
          <button 
            onClick={() => setActiveTab('new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FilePlus className="w-5 h-5" />
            {t('buttons.newExport')}
          </button>
        </div>
      </div>

      {/* Таби */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'new' as const, label: t('tabs.new') },
              { id: 'templates' as const, label: t('tabs.templates') },
              { id: 'history' as const, label: t('tabs.history') },
              { id: 'scheduled' as const, label: t('tabs.scheduled') }
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

        {/* Контент табів */}
        <div className="p-6">
          {activeTab === 'new' && (
            <div className="grid grid-cols-3 gap-6">
              {/* Ліва колонка - Конфігурація */}
              <div className="col-span-2 space-y-6">
                {/* Вибір типу даних */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">{t('dataTypes.title')}</h3>
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

                {/* Діапазон дат */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">{t('dateRange.title')}</h3>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('dateRange.from')}</label>
                      <input
                        type="date"
                        value={dateRange.from}
                        onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('dateRange.to')}</label>
                      <input
                        type="date"
                        value={dateRange.to}
                        onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {['today', 'yesterday', 'thisWeek', 'thisMonth', 'thisQuarter'].map((range) => (
                      <button
                        key={range}
                        onClick={() => console.log('Set range:', range)}
                        className="px-3 py-1 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {t(`dateRange.${range}`)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Вибір полів */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">{t('fields.title')}</h3>
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

              {/* Права колонка - Формат та попередній перегляд */}
              <div className="space-y-6">
                {/* Вибір формату */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">{t('formats.title')}</h3>
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

                {/* Опції експорту */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">{t('options.title')}</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-gray-700">{t('options.compressFile')}</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-gray-700">{t('options.sendEmail')}</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-gray-700">{t('options.saveTemplate')}</span>
                    </label>
                  </div>
                </div>

                {/* Кнопки дій */}
                <div className="space-y-2">
                  <button 
                    onClick={handleExport}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Download className="w-5 h-5" />
                    {t('buttons.generateExport')}
                  </button>
                  <button 
                    onClick={() => console.log('Schedule export')}
                    className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    {t('buttons.scheduleLater')}
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
                        <span>{t('templates.usedCount', { count: template.usageCount })}</span>
                        <span>•</span>
                        <span>{t('templates.lastUsed', { time: template.lastUsed })}</span>
                        <span>•</span>
                        <span>{t('templates.fieldsCount', { count: template.fields.length })}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUseTemplate(template.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        {t('buttons.useTemplate')}
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
              {/* Пошук та фільтри */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t('history.searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  {t('history.filters')}
                </button>
              </div>

              {/* Список історії експортів */}
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
                                <span>{t('history.downloads', { count: item.downloads })}</span>
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
                            {t('buttons.download')}
                          </button>
                        )}
                        {item.status === 'failed' && (
                          <button 
                            onClick={() => handleRetry(item.id)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-1"
                          >
                            <RefreshCw className="w-4 h-4" />
                            {t('buttons.retry')}
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
              <h3 className="text-lg font-medium mb-2">{t('scheduled.noScheduledExports')}</h3>
              <p className="text-gray-400 mb-6">{t('scheduled.scheduleDescription')}</p>
              <button 
                onClick={() => setActiveTab('new')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('buttons.scheduleExport')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}