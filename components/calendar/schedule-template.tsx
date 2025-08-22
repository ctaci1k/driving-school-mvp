// components/calendar/schedule-template.tsx

'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import { Calendar, Clock, Save, Check, Plus, X } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { toast } from '@/lib/toast'

interface WeekPattern {
  dayOfWeek: number
  startTime: string
  endTime: string
}

interface ScheduleTemplateType {
  id: string
  name: string
  weekPattern: WeekPattern[]
  validFrom: Date
  validTo?: Date | null
}

interface EditingTemplate {
  id: string
  name: string
  weekPattern: WeekPattern[]
}

export function ScheduleTemplate() {
  const t = useTranslations('calendar.scheduleTemplates')
  const tDays = useTranslations('calendar.weekDays')
  
  const [isEditing, setIsEditing] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EditingTemplate | null>(null)
  const [activeTemplateId, setActiveTemplateId] = useState<string>('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState('')
  
  // tRPC queries
  const { data: templates, refetch: refetchTemplates } = trpc.schedule.getTemplates.useQuery()
  const { data: currentSchedule } = trpc.schedule.getMySchedule.useQuery()
  
  // tRPC mutations
  const applyTemplate = trpc.schedule.applyTemplate.useMutation({
    onSuccess: (data) => {
      toast.success(data.message || t('templateApplied'))
      refetchTemplates()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
  
  const saveAsTemplate = trpc.schedule.saveAsTemplate.useMutation({
    onSuccess: (data) => {
      toast.success(data.message || t('templateSaved'))
      setShowCreateForm(false)
      setNewTemplateName('')
      refetchTemplates()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const updateTemplate = trpc.schedule.updateTemplate.useMutation({
    onSuccess: (data) => {
      toast.success(data.message || t('templateUpdated'))
      setIsEditing(false)
      refetchTemplates()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })
  
  const activeTemplate = templates?.find(t => t.id === activeTemplateId)
  
  const handleApplyTemplate = () => {
    if (!activeTemplateId) return
    
    if (confirm(t('confirmApply'))) {
      applyTemplate.mutate({
        templateId: activeTemplateId,
        overwriteExisting: true
      })
    }
  }
  
  const handleSaveAsTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error(t('nameRequired'))
      return
    }
    
    saveAsTemplate.mutate({
      name: newTemplateName,
      description: ''
    })
  }

  const handleUpdateTemplate = () => {
    if (!editingTemplate) return
    
    updateTemplate.mutate({
      templateId: editingTemplate.id,
      name: editingTemplate.name,
      weekPattern: editingTemplate.weekPattern
    })
  }
  
  useEffect(() => {
    if (templates?.length && !activeTemplateId) {
      setActiveTemplateId(templates[0].id)
    }
  }, [templates, activeTemplateId])
  
  return (
    <div className="space-y-4">
      {/* Lista szablonów */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('title')}</span>
            <Button 
              size="sm" 
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? t('cancel') : t('createTemplate')}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Formularz tworzenia nowego szablonu */}
          {showCreateForm && currentSchedule && currentSchedule.length > 0 && (
            <div className="mb-4 p-4 border rounded-lg bg-gray-50">
              <Label>{t('saveCurrentAsTemplate')}</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder={t('templateNamePlaceholder')}
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                />
                <Button 
                  onClick={handleSaveAsTemplate}
                  disabled={saveAsTemplate.isLoading || !newTemplateName.trim()}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saveAsTemplate.isLoading ? t('saving') : t('save')}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {t('willSaveCurrentSchedule')}
              </p>
            </div>
          )}

          {/* Повідомлення якщо немає розкладу */}
          {showCreateForm && (!currentSchedule || currentSchedule.length === 0) && (
            <div className="mb-4 p-4 border rounded-lg bg-yellow-50">
              <p className="text-sm text-yellow-800">
                {t('noScheduleToSave')}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates?.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-colors ${
                  activeTemplateId === template.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveTemplateId(template.id)}
              >
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">
                    {template.name}
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {t('validFrom')}: {new Date(template.validFrom).toLocaleDateString('pl-PL')}
                      </span>
                    </div>
                    {template.validTo && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {t('validTo')}: {new Date(template.validTo).toLocaleDateString('pl-PL')}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>
                        {template.weekPattern.length} {t('days')}
                      </span>
                    </div>
                  </div>
                  {activeTemplateId === template.id && (
                    <div className="mt-2 text-xs text-blue-600 font-medium">
                      <Check className="w-3 h-3 inline mr-1" />
                      {t('activeTemplate')}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Szczegóły aktywnego szablonu */}
      {activeTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing && editingTemplate ? (
                <Input
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                  className="text-lg font-semibold"
                />
              ) : (
                activeTemplate.name
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <>
                <div className="space-y-2">
  {activeTemplate.weekPattern.map((pattern: WeekPattern) => (
    <div 
      key={pattern.dayOfWeek}
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
    >
      <div className="font-medium">
        {tDays(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][pattern.dayOfWeek])}
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {pattern.startTime} - {pattern.endTime}
        </span>
      </div>
    </div>
  ))}
</div>
                
                <div className="mt-4 flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={handleApplyTemplate}
                    disabled={applyTemplate.isLoading}
                  >
                    {applyTemplate.isLoading ? t('applying') : t('applyTemplate')}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsEditing(true)
                      setEditingTemplate({
                        id: activeTemplate.id,
                        name: activeTemplate.name,
                        weekPattern: [...activeTemplate.weekPattern]
                      })
                    }}
                  >
                    {t('editTemplate')}
                  </Button>
                </div>
              </>
            ) : editingTemplate && (
              <>
                <div className="space-y-2">
                  {editingTemplate.weekPattern.map((pattern, index) => (
                    <div 
                      key={`${pattern.dayOfWeek}-${index}`}
                      className="flex items-center justify-between p-3 bg-white border rounded-lg"
                    >
                      <div className="font-medium w-32">
                        {tDays(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][pattern.dayOfWeek])}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={pattern.startTime}
                          onChange={(e) => {
                            const newPattern = [...editingTemplate.weekPattern]
                            newPattern[index].startTime = e.target.value
                            setEditingTemplate({...editingTemplate, weekPattern: newPattern})
                          }}
                          className="w-28"
                        />
                        <span>-</span>
                        <Input
                          type="time"
                          value={pattern.endTime}
                          onChange={(e) => {
                            const newPattern = [...editingTemplate.weekPattern]
                            newPattern[index].endTime = e.target.value
                            setEditingTemplate({...editingTemplate, weekPattern: newPattern})
                          }}
                          className="w-28"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const newPattern = editingTemplate.weekPattern.filter((_, i) => i !== index)
                            setEditingTemplate({...editingTemplate, weekPattern: newPattern})
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const availableDays = [1,2,3,4,5,6,0].filter(
                        d => !editingTemplate.weekPattern.find(p => p.dayOfWeek === d)
                      )
                      if (availableDays.length > 0) {
                        setEditingTemplate({
                          ...editingTemplate,
                          weekPattern: [...editingTemplate.weekPattern, {
                            dayOfWeek: availableDays[0],
                            startTime: '09:00',
                            endTime: '17:00'
                          }]
                        })
                      } else {
                        toast.error(t('allDaysAdded'))
                      }
                    }}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('addDay')}
                  </Button>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={handleUpdateTemplate}
                    disabled={updateTemplate.isLoading}
                  >
                    {updateTemplate.isLoading ? t('saving') : t('saveChanges')}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      setEditingTemplate(null)
                    }}
                  >
                    {t('cancel')}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}