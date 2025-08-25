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
  
  // ✅ Виправлено
  const { data: templates, refetch: refetchTemplates } = trpc.schedule.getTemplates.useQuery()
  
  // ✅ Виправлено
  const { data: currentSchedule } = trpc.schedule.getMySchedule.useQuery()
  
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
      name: newTemplateName
    })
  }
  
  const handleUpdateTemplate = () => {
    if (!editingTemplate) return
    
    updateTemplate.mutate({
      id: editingTemplate.id,
      name: editingTemplate.name,
      weekPattern: editingTemplate.weekPattern
    })
  }
  
  const addTimeSlot = (dayOfWeek: number) => {
    if (!editingTemplate) return
    
    const newSlot: WeekPattern = {
      dayOfWeek,
      startTime: '09:00',
      endTime: '10:00'
    }
    
    setEditingTemplate({
      ...editingTemplate,
      weekPattern: [...editingTemplate.weekPattern, newSlot]
    })
  }
  
  const removeTimeSlot = (index: number) => {
    if (!editingTemplate) return
    
    setEditingTemplate({
      ...editingTemplate,
      weekPattern: editingTemplate.weekPattern.filter((_, i) => i !== index)
    })
  }
  
  const updateTimeSlot = (index: number, field: keyof WeekPattern, value: any) => {
    if (!editingTemplate) return
    
    const updated = [...editingTemplate.weekPattern]
    updated[index] = { ...updated[index], [field]: value }
    
    setEditingTemplate({
      ...editingTemplate,
      weekPattern: updated
    })
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('title')}</span>
            <Button
              size="sm"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('createNew')}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {templates?.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {t('noTemplates')}
            </p>
          ) : (
            <div className="space-y-2">
              {templates?.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="template"
                      value={template.id}
                      checked={activeTemplateId === template.id}
                      onChange={(e) => setActiveTemplateId(e.target.value)}
                      className="h-4 w-4"
                    />
                    <div>
                      <p className="font-medium">{template.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {template.weekPattern.length} {t('timeSlots')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingTemplate({
                        id: template.id,
                        name: template.name,
                        weekPattern: template.weekPattern
                      })
                      setIsEditing(true)
                    }}
                  >
                    {t('edit')}
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {activeTemplateId && (
            <Button
              className="w-full"
              onClick={handleApplyTemplate}
              disabled={applyTemplate.isLoading}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {t('applyTemplate')}
            </Button>
          )}
        </CardContent>
      </Card>
      
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>{t('createNewTemplate')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t('templateName')}</Label>
              <Input
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder={t('namePlaceholder')}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSaveAsTemplate}
                disabled={saveAsTemplate.isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                {t('save')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false)
                  setNewTemplateName('')
                }}
              >
                {t('cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {isEditing && editingTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>{t('editTemplate')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t('templateName')}</Label>
              <Input
                value={editingTemplate.name}
                onChange={(e) => setEditingTemplate({
                  ...editingTemplate,
                  name: e.target.value
                })}
              />
            </div>
            
            <div className="space-y-4">
              {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => {
                const daySlots = editingTemplate.weekPattern.filter(
                  slot => slot.dayOfWeek === dayOfWeek
                )
                
                return (
                  <div key={dayOfWeek} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Label>{tDays(dayOfWeek.toString())}</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addTimeSlot(dayOfWeek)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {daySlots.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        {t('noSlots')}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {daySlots.map((slot, i) => {
                          const index = editingTemplate.weekPattern.indexOf(slot)
                          return (
                            <div key={i} className="flex items-center gap-2">
                              <Input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                                className="w-32"
                              />
                              <span>-</span>
                              <Input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                                className="w-32"
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removeTimeSlot(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleUpdateTemplate}
                disabled={updateTemplate.isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                {t('saveChanges')}
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
          </CardContent>
        </Card>
      )}
    </div>
  )
}