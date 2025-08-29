// app/[locale]/instructor/schedule/components/modals/TemplateModal.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { 
  X, Save, Upload, Download, Copy, Trash2, Clock, 
  Calendar, FileText, Star, StarOff, Edit2, Check,
  AlertCircle, Loader2, Plus, Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScheduleTemplate, WorkingHours } from '../../types/schedule.types'
import { useScheduleContext } from '../../providers/ScheduleProvider'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
  template?: ScheduleTemplate | null
  mode?: 'list' | 'create' | 'edit'
  onApply?: (template: ScheduleTemplate) => void
}

// Mock preset templates - залишаємо польською без перекладу
const PRESET_TEMPLATES = [
  {
    name: 'Standardowy (8-16)',
    description: 'Klasyczne godziny pracy od poniedziałku do piątku',
    icon: <Clock className="w-5 h-5" />,
    color: 'blue',
    workingHours: {
      'poniedziałek': { enabled: true, intervals: [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '16:00' }], slotDuration: 120, breakDuration: 15 },
      'wtorek': { enabled: true, intervals: [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '16:00' }], slotDuration: 120, breakDuration: 15 },
      'środa': { enabled: true, intervals: [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '16:00' }], slotDuration: 120, breakDuration: 15 },
      'czwartek': { enabled: true, intervals: [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '16:00' }], slotDuration: 120, breakDuration: 15 },
      'piątek': { enabled: true, intervals: [{ start: '08:00', end: '12:00' }, { start: '13:00', end: '16:00' }], slotDuration: 120, breakDuration: 15 },
      'sobota': { enabled: false, intervals: [], slotDuration: 120, breakDuration: 15 },
      'niedziela': { enabled: false, intervals: [], slotDuration: 120, breakDuration: 15 }
    }
  },
  {
    name: 'Popołudniowy (12-20)',
    description: 'Zajęcia popołudniowe i wieczorne',
    icon: <Calendar className="w-5 h-5" />,
    color: 'purple',
    workingHours: {
      'poniedziałek': { enabled: true, intervals: [{ start: '12:00', end: '16:00' }, { start: '16:30', end: '20:00' }], slotDuration: 90, breakDuration: 15 },
      'wtorek': { enabled: true, intervals: [{ start: '12:00', end: '16:00' }, { start: '16:30', end: '20:00' }], slotDuration: 90, breakDuration: 15 },
      'środa': { enabled: true, intervals: [{ start: '12:00', end: '16:00' }, { start: '16:30', end: '20:00' }], slotDuration: 90, breakDuration: 15 },
      'czwartek': { enabled: true, intervals: [{ start: '12:00', end: '16:00' }, { start: '16:30', end: '20:00' }], slotDuration: 90, breakDuration: 15 },
      'piątek': { enabled: true, intervals: [{ start: '12:00', end: '16:00' }, { start: '16:30', end: '20:00' }], slotDuration: 90, breakDuration: 15 },
      'sobota': { enabled: false, intervals: [], slotDuration: 90, breakDuration: 15 },
      'niedziela': { enabled: false, intervals: [], slotDuration: 90, breakDuration: 15 }
    }
  },
  {
    name: 'Weekendowy',
    description: 'Praca tylko w weekendy',
    icon: <Star className="w-5 h-5" />,
    color: 'green',
    workingHours: {
      'poniedziałek': { enabled: false, intervals: [], slotDuration: 120, breakDuration: 30 },
      'wtorek': { enabled: false, intervals: [], slotDuration: 120, breakDuration: 30 },
      'środa': { enabled: false, intervals: [], slotDuration: 120, breakDuration: 30 },
      'czwartek': { enabled: false, intervals: [], slotDuration: 120, breakDuration: 30 },
      'piątek': { enabled: false, intervals: [], slotDuration: 120, breakDuration: 30 },
      'sobota': { enabled: true, intervals: [{ start: '08:00', end: '14:00' }, { start: '15:00', end: '19:00' }], slotDuration: 120, breakDuration: 30 },
      'niedziela': { enabled: true, intervals: [{ start: '10:00', end: '14:00' }, { start: '15:00', end: '18:00' }], slotDuration: 120, breakDuration: 30 }
    }
  }
]

export default function TemplateModal({
  isOpen,
  onClose,
  template,
  mode = 'list',
  onApply
}: TemplateModalProps) {
  const t = useTranslations('instructor.schedule.modals.template')
  const { 
    templates, 
    createTemplate, 
    updateTemplate, 
    deleteTemplate,
    applyTemplate,
    workingHours: currentWorkingHours 
  } = useScheduleContext()
  
  const [currentMode, setCurrentMode] = useState(mode)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<ScheduleTemplate | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  
  // Form state for create/edit
  const [formData, setFormData] = useState<{
    name: string
    description: string
    isDefault: boolean
    workingHours: Record<string, WorkingHours>
  }>({
    name: '',
    description: '',
    isDefault: false,
    workingHours: currentWorkingHours
  })

  // Initialize form when editing
  useEffect(() => {
    if (template && (mode === 'edit' || currentMode === 'edit')) {
      setFormData({
        name: template.name,
        description: template.description || '',
        isDefault: template.isDefault,
        workingHours: template.workingHours
      })
      setSelectedTemplate(template)
    }
  }, [template, mode, currentMode])

  // Calculate template statistics
  const calculateTemplateStats = (workingHours: Record<string, WorkingHours>) => {
    let totalHours = 0
    let workDays = 0
    let totalSlots = 0

    Object.values(workingHours).forEach(day => {
      if (day.enabled && day.intervals.length > 0) {
        workDays++
        day.intervals.forEach(interval => {
          const [startH, startM] = interval.start.split(':').map(Number)
          const [endH, endM] = interval.end.split(':').map(Number)
          const minutes = (endH * 60 + endM) - (startH * 60 + startM)
          totalHours += minutes / 60
          totalSlots += Math.floor(minutes / (day.slotDuration + day.breakDuration))
        })
      }
    })

    return {
      totalHours: totalHours.toFixed(1),
      workDays,
      totalSlots,
      avgHoursPerDay: workDays > 0 ? (totalHours / workDays).toFixed(1) : '0'
    }
  }

  // Handle template save
  const handleSave = async () => {
    if (!formData.name) return

    setIsLoading(true)
    try {
      if (currentMode === 'create') {
        await createTemplate({
          name: formData.name,
          description: formData.description,
          workingHours: formData.workingHours,
          isDefault: formData.isDefault
        })
      } else if (currentMode === 'edit' && selectedTemplate) {
        await updateTemplate(selectedTemplate.id, {
          name: formData.name,
          description: formData.description,
          isDefault: formData.isDefault,
          workingHours: formData.workingHours
        })
      }
      setCurrentMode('list')
    } catch (error) {
      console.error('Error saving template:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle template apply
  const handleApplyTemplate = async (template: ScheduleTemplate) => {
    setIsLoading(true)
    try {
      await applyTemplate(template.id)
      if (onApply) {
        onApply(template)
      }
      onClose()
    } catch (error) {
      console.error('Error applying template:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle template delete
  const handleDelete = async (templateId: string) => {
    setIsLoading(true)
    try {
      await deleteTemplate(templateId)
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting template:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Export template
  const handleExport = (template: ScheduleTemplate) => {
    const dataStr = JSON.stringify(template, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `template-${template.name.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Import template
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        await createTemplate({
          name: `${imported.name} ${t('imported')}`,
          description: imported.description,
          workingHours: imported.workingHours,
          isDefault: false
        })
        setCurrentMode('list')
      } catch (error) {
        console.error('Error importing template:', error)
      }
    }
    reader.readAsText(file)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t(`title.${currentMode}`)}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {t(`subtitle.${currentMode}`)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* List Mode */}
            {currentMode === 'list' && (
              <div className="space-y-6">
                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentMode('create')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      {t('buttons.newTemplate')}
                    </button>
                    <label className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      {t('buttons.import')}
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleImport}
                      />
                    </label>
                  </div>
                </div>

                {/* Preset Templates */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    {t('sections.presetTemplates')}
                  </h3>
                  <div className="grid gap-3">
                    {PRESET_TEMPLATES.map((preset, index) => {
                      const stats = calculateTemplateStats(preset.workingHours)
                      return (
                        <div
                          key={index}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "p-2 rounded-lg",
                                preset.color === 'blue' && "bg-blue-100 text-blue-600",
                                preset.color === 'purple' && "bg-purple-100 text-purple-600",
                                preset.color === 'green' && "bg-green-100 text-green-600"
                              )}>
                                {preset.icon}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{preset.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">{preset.description}</p>
                                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                                  <span>{t('stats.workDays', { count: stats.workDays })}</span>
                                  <span>{t('stats.weeklyHours', { hours: stats.totalHours })}</span>
                                  <span>{t('stats.totalSlots', { count: stats.totalSlots })}</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setFormData({
                                  name: preset.name,
                                  description: preset.description,
                                  isDefault: false,
                                  workingHours: preset.workingHours
                                })
                                setCurrentMode('create')
                              }}
                              className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              {t('buttons.use')}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* User Templates */}
                {templates.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      {t('sections.userTemplates')}
                    </h3>
                    <div className="grid gap-3">
                      {templates.map(template => {
                        const stats = calculateTemplateStats(template.workingHours)
                        return (
                          <div
                            key={template.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                  <FileText className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                                    {template.isDefault && (
                                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                        {t('labels.default')}
                                      </span>
                                    )}
                                  </div>
                                  {template.description && (
                                    <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                                  )}
                                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                                    <span>{t('stats.workDays', { count: stats.workDays })}</span>
                                    <span>{t('stats.weeklyHours', { hours: stats.totalHours })}</span>
                                    <span>{t('stats.totalSlots', { count: stats.totalSlots })}</span>
                                    <span>{t('stats.created', { date: format(new Date(template.createdAt), 'dd.MM.yyyy') })}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleApplyTemplate(template)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title={t('buttons.apply')}
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedTemplate(template)
                                    setFormData({
                                      name: template.name,
                                      description: template.description || '',
                                      isDefault: template.isDefault,
                                      workingHours: template.workingHours
                                    })
                                    setCurrentMode('edit')
                                  }}
                                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                  title={t('buttons.edit')}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleExport(template)}
                                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                  title={t('buttons.export')}
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setShowDeleteConfirm(template.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title={t('buttons.delete')}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Delete Confirmation */}
                            {showDeleteConfirm === template.id && (
                              <div className="mt-3 p-3 bg-red-50 rounded-lg">
                                <p className="text-sm text-red-700 mb-2">
                                  {t('deleteConfirm.message')}
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleDelete(template.id)}
                                    disabled={isLoading}
                                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
                                  >
                                    {isLoading ? t('buttons.deleting') : t('deleteConfirm.confirm')}
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="px-3 py-1.5 text-gray-700 text-sm hover:bg-gray-200 rounded-lg"
                                  >
                                    {t('buttons.cancel')}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {templates.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t('empty.title')}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {t('empty.description')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Create/Edit Mode */}
            {(currentMode === 'create' || currentMode === 'edit') && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.name')}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={t('form.namePlaceholder')}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.description')}
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={t('form.descriptionPlaceholder')}
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium text-sm">{t('form.setDefault')}</span>
                      <p className="text-xs text-gray-500">{t('form.setDefaultDescription')}</p>
                    </div>
                  </label>
                </div>

                {/* Working Hours Preview */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{t('workingHours.title')}</h4>
                    <button
                      onClick={() => {
                        // Open working hours modal for editing
                      }}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Settings className="w-4 h-4" />
                      {t('workingHours.editHours')}
                    </button>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {Object.entries(formData.workingHours).map(([day, hours]) => (
                      <div key={day} className="flex items-center justify-between">
                        <span className="capitalize text-gray-700">{day}:</span>
                        <span className="text-gray-500">
                          {hours.enabled 
                            ? hours.intervals.map(i => `${i.start}-${i.end}`).join(', ')
                            : t('workingHours.free')
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">{t('workingHours.summary')}:</span>
                        <div className="font-medium text-gray-900 mt-1">
                          {(() => {
                            const stats = calculateTemplateStats(formData.workingHours)
                            return `${t('workingHours.days', { count: stats.workDays })} • ${t('workingHours.hoursPerWeek', { hours: stats.totalHours })}`
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
            {currentMode === 'list' ? (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {t('buttons.close')}
              </button>
            ) : (
              <button
                onClick={() => setCurrentMode('list')}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {t('buttons.back')}
              </button>
            )}
            
            {(currentMode === 'create' || currentMode === 'edit') && (
              <button
                onClick={handleSave}
                disabled={isLoading || !formData.name}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('buttons.saving')}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {currentMode === 'create' ? t('buttons.save') : t('buttons.saveChanges')}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}