// app/[locale]/instructor/schedule/components/tabs/TemplatesTab.tsx
// Zakładka zarządzania szablonami harmonogramu z operacjami CRUD i szybkim zastosowaniem

'use client'

import React, { useState, useMemo } from 'react'
import { 
  Plus, Copy, Edit2, Trash2, CheckCircle, Star,
  Clock, Calendar, Settings, Download, Upload,
  AlertCircle, Search, Filter, MoreVertical,
  ChevronRight, Save, X, FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScheduleContext } from '../../providers/ScheduleProvider'
import { ScheduleTemplate, WorkingHours } from '../../types/schedule.types'
import { formatDate } from '../../utils/dateHelpers'

interface TemplatesTabProps {
  searchTerm?: string
  className?: string
}

// Komponent karty szablonu
const TemplateCard: React.FC<{
  template: ScheduleTemplate
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
  onApply: () => void
  onSetDefault: () => void
}> = ({ template, onEdit, onDelete, onDuplicate, onApply, onSetDefault }) => {
  const [showMenu, setShowMenu] = useState(false)

  // Oblicz statystyki szablonu
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
      {/* Nagłówek */}
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
        
        {/* Menu akcji */}
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
                  Edytuj
                </button>
                <button
                  onClick={() => {
                    onDuplicate()
                    setShowMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <Copy className="w-3 h-3" />
                  Duplikuj
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
                    Ustaw jako domyślny
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
                  Usuń
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-semibold">{stats.workingDays}</div>
          <div className="text-xs text-gray-600">dni pracy</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-semibold">{stats.totalHours}h</div>
          <div className="text-xs text-gray-600">tygodniowo</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-semibold">{stats.slotsPerDay}</div>
          <div className="text-xs text-gray-600">slotów/dzień</div>
        </div>
      </div>

      {/* Dni pracy */}
      <div className="mb-3">
        <div className="text-xs text-gray-600 mb-2">Dni pracy:</div>
        <div className="flex gap-1">
          {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'].map((day, index) => {
            const dayNames = ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela']
            const isEnabled = template.workingHours[dayNames[index]]?.enabled
            
            return (
              <div
                key={day}
                className={cn(
                  "flex-1 text-center py-1 text-xs rounded",
                  isEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                )}
              >
                {day}
              </div>
            )
          })}
        </div>
      </div>

      {/* Przyciski akcji */}
      <div className="flex gap-2">
        <button
          onClick={onApply}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <CheckCircle className="w-4 h-4" />
          Zastosuj
        </button>
        <button
          onClick={onEdit}
          className="px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Data utworzenia */}
      {template.createdAt && (
        <div className="mt-3 pt-3 border-t text-xs text-gray-500">
          Utworzono: {formatDate(new Date(template.createdAt))}
        </div>
      )}
    </div>
  )
}

// Komponent formularza szablonu
const TemplateForm: React.FC<{
  template?: ScheduleTemplate
  onSave: (data: Omit<ScheduleTemplate, 'id' | 'createdAt'>) => void
  onCancel: () => void
}> = ({ template, onSave, onCancel }) => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nazwa i opis */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nazwa szablonu
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="np. Standardowy tydzień pracy"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Opis (opcjonalny)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={2}
          placeholder="Krótki opis szablonu..."
        />
      </div>

      {/* Godziny pracy */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Godziny pracy</h3>
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
                <span className="text-sm capitalize">{day}</span>
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
                    <option value="60">60 min</option>
                    <option value="90">90 min</option>
                    <option value="120">120 min</option>
                    <option value="150">150 min</option>
                  </select>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Domyślny szablon */}
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.isDefault}
          onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
          className="rounded"
        />
        <span className="text-sm">Ustaw jako domyślny szablon</span>
      </label>

      {/* Przyciski */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Save className="w-4 h-4 inline mr-2" />
          {template ? 'Zapisz zmiany' : 'Utwórz szablon'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <X className="w-4 h-4 inline mr-2" />
          Anuluj
        </button>
      </div>
    </form>
  )
}

// Funkcja pomocnicza - domyślne godziny pracy
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

  // Filtrowanie szablonów
  const filteredTemplates = useMemo(() => {
    let filtered = [...templates]
    
    // Filtr wyszukiwania
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(term) ||
        template.description?.toLowerCase().includes(term)
      )
    }
    
    // Filtr typu
    if (filter === 'default') {
      filtered = filtered.filter(t => t.isDefault)
    } else if (filter === 'custom') {
      filtered = filtered.filter(t => !t.isDefault)
    }
    
    // Sortowanie - domyślne najpierw
    return filtered.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1
      if (!a.isDefault && b.isDefault) return 1
      return a.name.localeCompare(b.name)
    })
  }, [templates, searchTerm, filter])

  // Handlery
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
    if (confirm('Czy na pewno chcesz usunąć ten szablon?')) {
      await deleteTemplate(id)
    }
  }

  const handleDuplicateTemplate = async (template: ScheduleTemplate) => {
    const duplicated = {
      ...template,
      name: `${template.name} (kopia)`,
      isDefault: false
    }
    delete (duplicated as any).id
    delete (duplicated as any).createdAt
    await createTemplate(duplicated)
  }

  const handleSetDefault = async (template: ScheduleTemplate) => {
    // Usuń domyślny status z innych szablonów
    for (const t of templates) {
      if (t.isDefault && t.id !== template.id) {
        await updateTemplate(t.id, { ...t, isDefault: false })
      }
    }
    // Ustaw jako domyślny
    await updateTemplate(template.id, { ...template, isDefault: true })
  }

  const handleExport = () => {
    const data = JSON.stringify(templates, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `szablony_harmonogramu_${formatDate(new Date())}.json`
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
          console.error('Błąd importu:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Nagłówek z przyciskami */}
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Szablony harmonogramu</h2>
            <p className="text-sm text-gray-600">
              Zarządzaj szablonami godzin pracy i szybko je stosuj
            </p>
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
              Nowy szablon
            </button>
            
            <button
              onClick={handleExport}
              className="p-2 border rounded-lg hover:bg-gray-50"
              title="Eksportuj szablony"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <label className="p-2 border rounded-lg hover:bg-gray-50 cursor-pointer" title="Importuj szablony">
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

        {/* Filtry */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "px-3 py-1 rounded-lg text-sm",
              filter === 'all' ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
            )}
          >
            Wszystkie ({templates.length})
          </button>
          <button
            onClick={() => setFilter('default')}
            className={cn(
              "px-3 py-1 rounded-lg text-sm",
              filter === 'default' ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
            )}
          >
            Domyślne ({templates.filter(t => t.isDefault).length})
          </button>
          <button
            onClick={() => setFilter('custom')}
            className={cn(
              "px-3 py-1 rounded-lg text-sm",
              filter === 'custom' ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
            )}
          >
            Własne ({templates.filter(t => !t.isDefault).length})
          </button>
        </div>
      </div>

      {/* Formularz (modal) */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingTemplate ? 'Edytuj szablon' : 'Nowy szablon'}
            </h2>
            <TemplateForm
              template={editingTemplate || undefined}
              onSave={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
              onCancel={() => {
                setShowForm(false)
                setEditingTemplate(null)
              }}
            />
          </div>
        </div>
      )}

      {/* Lista szablonów */}
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
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Brak szablonów
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Utwórz pierwszy szablon harmonogramu, aby szybko stosować godziny pracy
          </p>
          <button
            onClick={() => {
              setEditingTemplate(null)
              setShowForm(true)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Utwórz szablon
          </button>
        </div>
      )}
    </div>
  )
}