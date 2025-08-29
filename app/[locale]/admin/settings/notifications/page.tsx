// app/[locale]/admin/settings/notifications/page.tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, Search, Mail, MessageSquare, Bell, Smartphone, Edit, Trash2, Copy, Eye, Send, MoreHorizontal, Code, FileText, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function NotificationsPage() {
  const t = useTranslations('admin.settings.notifications')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)

  // Mock data with translations
  const notificationTemplates = [
    {
      id: '1',
      name: t('templates.bookingConfirmation.name'),
      type: 'email',
      category: 'booking',
      subject: t('templates.bookingConfirmation.subject'),
      content: t('templates.bookingConfirmation.content'),
      status: 'active',
      usageCount: 245,
      lastModified: '2024-01-15',
      variables: ['student_name', 'date', 'time', 'instructor_name', 'vehicle_model', 'location']
    },
    {
      id: '2',
      name: t('templates.lessonReminder.name'),
      type: 'sms',
      category: 'reminder',
      subject: '',
      content: t('templates.lessonReminder.content'),
      status: 'active',
      usageCount: 389,
      lastModified: '2024-01-10',
      variables: ['time', 'instructor_name', 'location', 'school_phone']
    },
    {
      id: '3',
      name: t('templates.welcomeStudent.name'),
      type: 'email',
      category: 'welcome',
      subject: t('templates.welcomeStudent.subject'),
      content: t('templates.welcomeStudent.content'),
      status: 'active',
      usageCount: 67,
      lastModified: '2024-01-20',
      variables: ['student_name', 'package_name', 'first_lesson_date', 'portal_link']
    },
    {
      id: '4',
      name: t('templates.lessonCancellation.name'),
      type: 'email',
      category: 'cancellation',
      subject: t('templates.lessonCancellation.subject'),
      content: t('templates.lessonCancellation.content'),
      status: 'inactive',
      usageCount: 12,
      lastModified: '2024-01-05',
      variables: ['student_name', 'date', 'time', 'reason']
    },
    {
      id: '5',
      name: t('templates.paymentReminder.name'),
      type: 'email',
      category: 'payment',
      subject: t('templates.paymentReminder.subject'),
      content: t('templates.paymentReminder.content'),
      status: 'active',
      usageCount: 156,
      lastModified: '2024-01-18',
      variables: ['student_name', 'amount', 'due_date', 'invoice_number']
    }
  ]

  const categories = {
    booking: { label: t('categories.booking'), color: 'blue' },
    reminder: { label: t('categories.reminder'), color: 'purple' },
    welcome: { label: t('categories.welcome'), color: 'green' },
    cancellation: { label: t('categories.cancellation'), color: 'orange' },
    payment: { label: t('categories.payment'), color: 'yellow' },
    exam: { label: t('categories.exam'), color: 'indigo' }
  }

  const notificationTypes = {
    email: { icon: Mail, label: t('types.email') },
    sms: { icon: MessageSquare, label: t('types.sms') },
    push: { icon: Smartphone, label: t('types.push') },
    system: { icon: Bell, label: t('types.system') }
  }

  const filteredTemplates = notificationTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || template.type === typeFilter
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter
    return matchesSearch && matchesType && matchesCategory
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('buttons.newTemplate')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('dialog.createTitle')}</DialogTitle>
              <DialogDescription>
                {t('dialog.createDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template-name">{t('form.templateName')}</Label>
                  <Input id="template-name" placeholder={t('form.templateNamePlaceholder')} />
                </div>
                <div>
                  <Label htmlFor="template-category">{t('form.category')}</Label>
                  <Select>
                    <SelectTrigger id="template-category">
                      <SelectValue placeholder={t('form.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categories).map(([key, cat]) => (
                        <SelectItem key={key} value={key}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>{t('form.notificationType')}</Label>
                <RadioGroup defaultValue="email" className="grid grid-cols-4 gap-4 mt-2">
                  {Object.entries(notificationTypes).map(([key, type]) => {
                    const Icon = type.icon
                    return (
                      <div key={key} className="flex items-center space-x-2">
                        <RadioGroupItem value={key} id={key} />
                        <Label htmlFor={key} className="flex items-center gap-2 cursor-pointer">
                          <Icon className="w-4 h-4" />
                          {type.label}
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="template-subject">{t('form.subject')}</Label>
                <Input id="template-subject" placeholder={t('form.subjectPlaceholder')} />
                <p className="text-xs text-gray-500 mt-1">{t('form.subjectHint')}</p>
              </div>

              <div>
                <Label htmlFor="template-content">{t('form.content')}</Label>
                <Textarea 
                  id="template-content" 
                  placeholder={t('form.contentPlaceholder')}
                  className="min-h-[200px] font-mono text-sm"
                />
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-xs text-gray-500">{t('form.availableVariables')}</p>
                  <div className="flex flex-wrap gap-1">
                    {['student_name', 'date', 'time', 'instructor_name', 'location'].map(variable => (
                      <Badge key={variable} variant="outline" className="text-xs cursor-pointer hover:bg-gray-100">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('form.active')}</p>
                  <p className="text-sm text-gray-500">{t('form.activeDescription')}</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t('buttons.cancel')}
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                {t('buttons.createTemplate')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('filters.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t('filters.type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters.allTypes')}</SelectItem>
            {Object.entries(notificationTypes).map(([key, type]) => (
              <SelectItem key={key} value={key}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('filters.category')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters.allCategories')}</SelectItem>
            {Object.entries(categories).map(([key, cat]) => (
              <SelectItem key={key} value={key}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map(template => {
          const TypeIcon = notificationTypes[template.type as keyof typeof notificationTypes].icon
          const categoryInfo = categories[template.category as keyof typeof categories]
          
          return (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <TypeIcon className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {categoryInfo.label}
                        </Badge>
                        <Badge variant={template.status === 'active' ? 'success' : 'secondary'} className="text-xs">
                          {template.status === 'active' ? t('card.active') : t('card.inactive')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t('actions.label')}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => {
                        setSelectedTemplate(template)
                        setPreviewDialogOpen(true)
                      }}>
                        <Eye className="w-4 h-4 mr-2" />
                        {t('actions.preview')}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        {t('actions.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        {t('actions.duplicate')}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="w-4 h-4 mr-2" />
                        {t('actions.sendTest')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t('actions.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subject for email */}
                {template.type === 'email' && template.subject && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('card.subject')}</p>
                    <p className="text-sm font-medium text-gray-700">{template.subject}</p>
                  </div>
                )}

                {/* Content preview */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('card.content')}</p>
                  <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-wrap">
                    {template.content}
                  </p>
                </div>

                {/* Variables */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">{t('card.variables')}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.slice(0, 4).map(variable => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                    {template.variables.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.variables.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-1">
                          <Send className="w-3 h-3" />
                          <span>{template.usageCount}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('card.usageCount', { count: template.usageCount })}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span>{t('card.lastModified')} {template.lastModified}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {t('emptyState.title')}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || typeFilter !== 'all' || categoryFilter !== 'all'
              ? t('emptyState.noResults')
              : t('emptyState.noData')}
          </p>
          {(!searchQuery && typeFilter === 'all' && categoryFilter === 'all') && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('buttons.createFirstTemplate')}
            </Button>
          )}
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('dialog.previewTitle')}</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedTemplate?.type === 'email' && selectedTemplate.subject && (
              <div>
                <Label>{t('form.subject')}</Label>
                <div className="p-3 bg-gray-50 rounded-lg mt-1">
                  <p className="text-sm font-mono">{selectedTemplate.subject}</p>
                </div>
              </div>
            )}
            <div>
              <Label>{t('form.content')}</Label>
              <div className="p-3 bg-gray-50 rounded-lg mt-1">
                <p className="text-sm font-mono whitespace-pre-wrap">{selectedTemplate?.content}</p>
              </div>
            </div>
            <div>
              <Label>{t('card.variables')}</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTemplate?.variables.map((variable: string) => (
                  <Badge key={variable} variant="outline">
                    {`{{${variable}}}`}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              {t('buttons.close')}
            </Button>
            <Button>
              <Send className="w-4 h-4 mr-2" />
              {t('buttons.sendTest')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}