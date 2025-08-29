// app/[locale]/instructor/schedule/components/tabs/TemplatesTab.tsx
// Вкладка керування шаблонами розкладу з операціями CRUD та швидким застосуванням

'use client'

import React, { useState, useMemo } from 'react'
import { 
  Plus, Copy, Edit2, Trash2, CheckCircle, Star,
  Clock, Calendar, Settings, Download, Upload,
  AlertCircle, Search, Filter, MoreVertical,
  ChevronRight, Save, X, FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { useScheduleContext } from '../../providers/ScheduleProvider'
import { ScheduleTemplate, WorkingHours } from '../../types/schedule.types'
import { formatDate } from '../../utils/dateHelpers'

interface TemplatesTabProps {
  searchTerm?: string
  className?: string
}

// Компонент картки шаблону
const TemplateCard: React.FC<{
  template: ScheduleTemplate
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
  onApply: () => void
  onSetDefault: () => void
  t: any
}> = ({ template, onEdit, onDelete, onDuplicate, onApply, onSetDefault, t }) => {
  const [showMenu, setShowMenu] = useState(false)

  // Обчислити статистику шаблону
  const stats = useMemo(() => {
    let totalHours = 0
    let workingDays = 0
    
    Object.entries(template.workingHours).forEach(([day, hours]) => {
      if (hours.enabled) {
        workingDays++
        hours.intervals.forEach(interval => {
          const start = interval.start.split(':').map(Number)
          const end = interval.end.split(':').map(Number)
          totalHours += (end[0] + end[1]/60) - (start[0] + start[1]/60)
        })
      }
    })
    
    return {
      workingDays,
      totalHours: Math.round(totalHours * 10) / 10,
      slotsPerDay: Math.floor(totalHours * 60 / (template.workingHours.poniedziałek?.slotDuration || 120))
    }
  }, [template])

  return (
    <div className={cn(
      "border rounded-lg p-4 hover:shadow-md transition-all",
      template.isDefault && "border-blue-500 bg-blue-50"
    )}>
      {/* Заголовок */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          {template.isDefault && (
            <Star className="w-5 h-5 text-blue-600 mt-0.5" />
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{template.name}</h3>
            {template.description && (
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
            )}
          </div>
        </div>
        
        {/* Меню дій */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border z-20 py-1">
                <button
                  onClick={() => {
                    onEdit()
                    setShowMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <Edit2 className="w-3 h-3" />
                  {t('buttons.edit')}
                </button>
                <button
                  onClick={() => {
                    onDuplicate()
                    setShowMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <Copy className="w-3 h-3" />
                  {t('buttons.duplicate')}
                </button>
                {!template.isDefault && (
                  <button
                    onClick={() => {
                      onSetDefault()
                      setShowMenu(false)
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Star className="w-3 h-3" />
                    {t('buttons.setAsDefault')}
                  </button>
                )}
                <hr className="my-1" />
                <button
                  onClick={() => {
                    onDelete()
                    setShowMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 className="w-3 h-3" />
                  {t('buttons.delete')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-semibold">{stats.workingDays}</div>
          <div className="text-xs text-gray-600">{t('card.workDays')}</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-semibold">{stats.totalHours}год</div>
          <div className="text-xs text-gray-600">{t('card.weekly')}</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-semibold">{stats.slotsPerDay}</div>
          <div className="text-xs text-gray-600">{t('card.slotsPerDay')}</div>
        </div>
      </div>

      {/* Дні роботи */}
      <div className="mb-3">
        <div className="text-xs text-gray-600 mb-2">{t('card.workingDays')}</div>
        <div className="flex gap-1">
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
            const dayNames = ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela']
            const isEnabled = template.workingHours[dayNames[['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(day)]]?.enabled
            
            return (
              <div
                key={day}
                className={cn(
                  "flex-1 text-center py-1 text-xs rounded",
                  isEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                )}
              >
                {t(`card.${day}`)}
              </div>
            )
          })}
        </div>
      </div>

      {/* Кнопки дій */}
      <div className="flex gap-2">
        <button
          onClick={onApply}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <CheckCircle className="w-4 h-4" />
          {t('buttons.apply')}
        </button>
        <button
          onClick={onEdit}
          className="px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Дата створення */}
      {template.createdAt && (
        <div className="mt-3 pt-3 border-t text-xs text-gray-500">
          {t('card.createdAt')} {formatDate(new Date(template.createdAt))}
        </div>
      )}
    </div>
  )
}

// Компонент форми шаблону
const TemplateForm: React.FC<{
  template?: ScheduleTemplate
  onSave: (data: Omit<ScheduleTemplate, 'id' | 'createdAt'>) => void
  onCancel: () => void
  t: any
}> = ({ template, onSave, onCancel, t }) => {
  const [formData, setFormData] = useState<{
    name: string
    description: string
    workingHours: Record<string, WorkingHours>
    isDefault: boolean
  }>({
    name: template?.name || '',
    description: template?.description || '',
    workingHours: template?.workingHours || getDefaultWorkingHours(),
    isDefault: template?.isDefault || false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const updateWorkingDay = (day: string, updates: Partial<WorkingHours>) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: { ...prev.workingHours[day], ...updates }
      }
    }))
  }

  const dayTranslations = {
    'poniedziałek': 'monday',
    'wtorek': 'tuesday',
    'środa': 'wednesday',
    'czwartek': 'thursday',
    'piątek': 'friday',
    'sobota': 'saturday',
    'niedziela': 'sunday'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Назва та опис */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('form.templateName')}
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={t('form.templateNamePlaceholder')}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('form.description')}
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={2}
          placeholder={t('form.descriptionPlaceholder')}
        />
      </div>

      {/* Години роботи */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">{t('form.workingHours')}</h3>
        <div className="space-y-3">
          {Object.entries(formData.workingHours).map(([day, hours]) => (
            <div key={day} className="flex items-center gap-3">
              <label className="flex items-center gap-2 w-32">
                <input
                  type="checkbox"
                  checked={hours.enabled}
                  onChange={(e) => updateWorkingDay(day, { enabled: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm capitalize">
                  {t(`form.days.${dayTranslations[day as keyof typeof dayTranslations]}`)}
                </span>
              </label>
              
              {hours.enabled && (
                <>
                  {hours.intervals.map((interval, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={interval.start}
                        onChange={(e) => {
                          const newIntervals = [...hours.intervals]
                          newIntervals[index] = { ...interval, start: e.target.value }
                          updateWorkingDay(day, { intervals: newIntervals })
                        }}
                        className="px-2 py-1 border rounded text-sm"
                      />
                      <span>-</span>
                      <input
                        type="time"
                        value={interval.end}
                        onChange={(e) => {
                          const newIntervals = [...hours.intervals]
                          newIntervals[index] = { ...interval, end: e.target.value }
                          updateWorkingDay(day, { intervals: newIntervals })
                        }}
                        className="px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  ))}
                  
                  <select
                    value={hours.slotDuration}
                    onChange={(e) => updateWorkingDay(day, { slotDuration: Number(e.target.value) })}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="60">{t('form.minutes', { minutes: 60 })}</option>
                    <option value="90">{t('form.minutes', { minutes: 90 })}</option>
                    <option value="120">{t('form.minutes', { minutes: 120 })}</option>
                    <option value="150">{t('form.minutes', { minutes: 150 })}</option>
                  </select>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Основний шаблон */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.isDefault}
          onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
          className="rounded"
        />
        <span className="text-sm">{t('form.setAsDefault')}</span>
      </label>

      {/* Кнопки */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Save className="w-4 h-4 inline mr-2" />
          {template ? t('buttons.saveChanges') : t('buttons.createTemplate')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <X className="w-4 h-4 inline mr-2" />
          {t('buttons.cancel')}
        </button>
      </div>
    </form>
  )
}

// Функція-хелпер - основні години роботи
function getDefaultWorkingHours(): Record<string, WorkingHours> {
  return {
    'poniedziałek': {
      enabled: true,
      intervals: [{ start: '08:00', end: '16:00' }],
      slotDuration: 120,
      breakDuration: 15
    },
    'wtorek': {
      enabled: true,
      intervals: [{ start: '08:00', end: '16:00' }],
      slotDuration: 120,
      breakDuration: 15
    },
    'środa': {
      enabled: true,
      intervals: [{ start: '08:00', end: '16:00' }],
      slotDuration: 120,
      breakDuration: 15
    },
    'czwartek': {
      enabled: true,
      intervals: [{ start: '08:00', end: '16:00' }],
      slotDuration: 120,
      breakDuration: 15
    },
    'piątek': {
      enabled: true,
      intervals: [{ start: '08:00', end: '16:00' }],
      slotDuration: 120,
      breakDuration: 15
    },
    'sobota': {
      enabled: false,
      intervals: [],
      slotDuration: 120,
      breakDuration: 15
    },
    'niedziela': {
      enabled: false,
      intervals: [],
      slotDuration: 120,
      breakDuration: 15
    }
  }
}

export default function TemplatesTab({
  searchTerm = '',
  className
}: TemplatesTabProps) {
  const t = useTranslations('instructor.schedule.templates')
  const { 
    templates, 
    createTemplate, 
    updateTemplate, 
    deleteTemplate, 
    applyTemplate 
  } = useScheduleContext()
  
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<ScheduleTemplate | null>(null)
  const [filter, setFilter] = useState<'all' | 'default' | 'custom'>('all')

  // Фільтрування шаблонів
  const filteredTemplates = useMemo(() => {
    let filtered = [...templates]
    
    // Фільтр пошуку
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(term) ||
        template.description?.toLowerCase().includes(term)
      )
    }
    
    // Фільтр типу
    if (filter === 'default') {
      filtered = filtered.filter(t => t.isDefault)
    } else if (filter === 'custom') {
      filtered = filtered.filter(t => !t.isDefault)
    }
    
    // Сортування - основні спочатку
    return filtered.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1
      if (!a.isDefault && b.isDefault) return 1
      return a.name.localeCompare(b.name)
    })
  }, [templates, searchTerm, filter])

  // Обробники
  const handleCreateTemplate = async (data: Omit<ScheduleTemplate, 'id' | 'createdAt'>) => {
    await createTemplate(data)
    setShowForm(false)
  }

  const handleUpdateTemplate = async (data: Omit<ScheduleTemplate, 'id' | 'createdAt'>) => {
    if (editingTemplate) {
      await updateTemplate(editingTemplate.id, data)
      setEditingTemplate(null)
      setShowForm(false)
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    if (confirm(t('confirmDelete'))) {
      await deleteTemplate(id)
    }
  }

  const handleDuplicateTemplate = async (template: ScheduleTemplate) => {
    const duplicated = {
      ...template,
      name: `${template.name} (копія)`,
      isDefault: false
    }
    delete (duplicated as any).id
    delete (duplicated as any).createdAt
    await createTemplate(duplicated)
  }

  const handleSetDefault = async (template: ScheduleTemplate) => {
    // Видалити основний статус з інших шаблонів
    for (const temp of templates) {
      if (temp.isDefault && temp.id !== template.id) {
        await updateTemplate(temp.id, { ...temp, isDefault: false })
      }
    }
    // Встановити як основний
    await updateTemplate(template.id, { ...template, isDefault: true })
  }

  const handleExport = () => {
    const data = JSON.stringify(templates, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = t('export.filename', { date: formatDate(new Date()) })
    link.click()
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          for (const template of data) {
            delete template.id
            delete template.createdAt
            await createTemplate(template)
          }
        } catch (error) {
          console.error(t('import.error'), error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Заголовок з кнопками */}
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">{t('title')}</h2>
            <p className="text-sm text-gray-600">{t('subtitle')}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingTemplate(null)
                setShowForm(true)
              }}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              {t('buttons.newTemplate')}
            </button>
            
            <button
              onClick={handleExport}
              className="p-2 border rounded-lg hover:bg-gray-50"
              title={t('buttons.export')}
            >
              <Download className="w-4 h-4" />
            </button>
            
            <label className="p-2 border rounded-lg hover:bg-gray-50 cursor-pointer" title={t('buttons.import')}>
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Фільтри */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "px-3 py-1 rounded-lg text-sm",
              filter === 'all' ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
            )}
          >
            {t('filters.all')} {t('filters.count', { count: templates.length })}
          </button>
          <button
            onClick={() => setFilter('default')}
            className={cn(
              "px-3 py-1 rounded-lg text-sm",
              filter === 'default' ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
            )}
          >
            {t('filters.default')} {t('filters.count', { count: templates.filter(temp => temp.isDefault).length })}
          </button>
          <button
            onClick={() => setFilter('custom')}
            className={cn(
              "px-3 py-1 rounded-lg text-sm",
              filter === 'custom' ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
            )}
          >
            {t('filters.custom')} {t('filters.count', { count: templates.filter(temp => !temp.isDefault).length })}
          </button>
        </div>
      </div>

      {/* Форма (модал) */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingTemplate ? t('form.editTitle') : t('form.newTitle')}
            </h2>
            <TemplateForm
              template={editingTemplate || undefined}
              onSave={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
              onCancel={() => {
                setShowForm(false)
                setEditingTemplate(null)
              }}
              t={t}
            />
          </div>
        </div>
      )}

      {/* Список шаблонів */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={() => {
                setEditingTemplate(template)
                setShowForm(true)
              }}
              onDelete={() => handleDeleteTemplate(template.id)}
              onDuplicate={() => handleDuplicateTemplate(template)}
              onApply={() => applyTemplate(template.id)}
              onSetDefault={() => handleSetDefault(template)}
              t={t}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {t('empty.title')}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {t('empty.description')}
          </p>
          <button
            onClick={() => {
              setEditingTemplate(null)
              setShowForm(true)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            {t('empty.createButton')}
          </button>
        </div>
      )}
    </div>
  )
}