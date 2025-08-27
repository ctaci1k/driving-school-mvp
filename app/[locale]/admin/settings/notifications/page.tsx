// /app/[locale]/admin/settings/notifications/page.tsx
// Strona zarządzania szablonami powiadomień

'use client'

import { useState } from 'react'
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

// Mock data
const notificationTemplates = [
  {
    id: '1',
    name: 'Potwierdzenie rezerwacji',
    type: 'email',
    category: 'booking',
    subject: 'Potwierdzenie rezerwacji zajęć - {{date}} {{time}}',
    content: 'Szanowny/a {{student_name}},\n\nPotwierdzamy rezerwację zajęć praktycznych na dzień {{date}} o godzinie {{time}}.\n\nInstruktor: {{instructor_name}}\nPojazd: {{vehicle_model}}\nMiejsce spotkania: {{location}}\n\nW razie pytań prosimy o kontakt.\n\nPozdrawiamy,\nZespół Szkoły Jazdy',
    status: 'active',
    usageCount: 245,
    lastModified: '2024-01-15',
    variables: ['student_name', 'date', 'time', 'instructor_name', 'vehicle_model', 'location']
  },
  {
    id: '2',
    name: 'Przypomnienie o zajęciach',
    type: 'sms',
    category: 'reminder',
    subject: '',
    content: 'Przypominamy o zajęciach jutro o {{time}}. Instruktor: {{instructor_name}}, miejsce: {{location}}. W razie problemów dzwoń: {{school_phone}}',
    status: 'active',
    usageCount: 389,
    lastModified: '2024-01-10',
    variables: ['time', 'instructor_name', 'location', 'school_phone']
  },
  {
    id: '3',
    name: 'Powitanie nowego kursanta',
    type: 'email',
    category: 'welcome',
    subject: 'Witamy w Szkole Jazdy!',
    content: 'Drogi/a {{student_name}},\n\nWitamy w naszej szkole jazdy! Cieszymy się, że wybrałeś/aś nas.\n\nTwój pakiet: {{package_name}}\nPierwsze zajęcia: {{first_lesson_date}}\n\nZaloguj się do panelu kursanta: {{portal_link}}\n\nŻyczymy powodzenia!\n\nZespół Szkoły Jazdy',
    status: 'active',
    usageCount: 67,
    lastModified: '2024-01-20',
    variables: ['student_name', 'package_name', 'first_lesson_date', 'portal_link']
  },
  {
    id: '4',
    name: 'Anulowanie zajęć',
    type: 'email',
    category: 'cancellation',
    subject: 'Anulowanie zajęć - {{date}}',
    content: 'Szanowny/a {{student_name}},\n\nZ przykrością informujemy, że zajęcia zaplanowane na {{date}} o godzinie {{time}} zostały anulowane.\n\nPowód: {{reason}}\n\nProsimy o kontakt w celu ustalenia nowego terminu.\n\nPrzepraszamy za utrudnienia.\n\nZespół Szkoły Jazdy',
    status: 'inactive',
    usageCount: 12,
    lastModified: '2024-01-05',
    variables: ['student_name', 'date', 'time', 'reason']
  },
  {
    id: '5',
    name: 'Przypomnienie o płatności',
    type: 'email',
    category: 'payment',
    subject: 'Przypomnienie o płatności - {{invoice_number}}',
    content: 'Szanowny/a {{student_name}},\n\nPrzypominamy o zbliżającym się terminie płatności.\n\nKwota: {{amount}} PLN\nTermin: {{due_date}}\nNumer faktury: {{invoice_number}}\n\nProsimy o terminową wpłatę.\n\nPozdrawiamy,\nZespół Szkoły Jazdy',
    status: 'active',
    usageCount: 156,
    lastModified: '2024-01-18',
    variables: ['student_name', 'amount', 'due_date', 'invoice_number']
  }
]

const categories = {
  booking: { label: 'Rezerwacje', color: 'blue' },
  reminder: { label: 'Przypomnienia', color: 'purple' },
  welcome: { label: 'Powitania', color: 'green' },
  cancellation: { label: 'Anulowania', color: 'orange' },
  payment: { label: 'Płatności', color: 'yellow' },
  exam: { label: 'Egzaminy', color: 'indigo' }
}

const notificationTypes = {
  email: { icon: Mail, label: 'Email' },
  sms: { icon: MessageSquare, label: 'SMS' },
  push: { icon: Smartphone, label: 'Push' },
  system: { icon: Bell, label: 'System' }
}

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)

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
          <h1 className="text-3xl font-bold text-gray-800">Szablony powiadomień</h1>
          <p className="text-gray-600 mt-1">Zarządzaj szablonami wiadomości email, SMS i powiadomień systemowych</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nowy szablon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Utwórz nowy szablon</DialogTitle>
              <DialogDescription>
                Zdefiniuj nowy szablon powiadomienia z dynamicznymi zmiennymi
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template-name">Nazwa szablonu</Label>
                  <Input id="template-name" placeholder="np. Potwierdzenie rezerwacji" />
                </div>
                <div>
                  <Label htmlFor="template-category">Kategoria</Label>
                  <Select>
                    <SelectTrigger id="template-category">
                      <SelectValue placeholder="Wybierz kategorię" />
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
                <Label>Typ powiadomienia</Label>
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
                <Label htmlFor="template-subject">Temat (dla email)</Label>
                <Input id="template-subject" placeholder="np. Potwierdzenie rezerwacji - {{date}}" />
                <p className="text-xs text-gray-500 mt-1">Użyj {`{{zmienna}}`} dla dynamicznych wartości</p>
              </div>

              <div>
                <Label htmlFor="template-content">Treść</Label>
                <Textarea 
                  id="template-content" 
                  placeholder="Szanowny/a {{student_name}}..."
                  className="min-h-[200px] font-mono text-sm"
                />
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-xs text-gray-500">Dostępne zmienne:</p>
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
                  <p className="font-medium">Aktywny</p>
                  <p className="text-sm text-gray-500">Szablon będzie używany automatycznie</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Anuluj
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Utwórz szablon
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
            placeholder="Szukaj szablonów..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Typ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie typy</SelectItem>
            {Object.entries(notificationTypes).map(([key, type]) => (
              <SelectItem key={key} value={key}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Kategoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie kategorie</SelectItem>
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
                          {template.status === 'active' ? 'Aktywny' : 'Nieaktywny'}
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
                      <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => {
                        setSelectedTemplate(template)
                        setPreviewDialogOpen(true)
                      }}>
                        <Eye className="w-4 h-4 mr-2" />
                        Podgląd
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edytuj
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplikuj
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="w-4 h-4 mr-2" />
                        Wyślij test
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Usuń
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subject for email */}
                {template.type === 'email' && template.subject && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Temat:</p>
                    <p className="text-sm font-medium text-gray-700">{template.subject}</p>
                  </div>
                )}

                {/* Content preview */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Treść:</p>
                  <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-wrap">
                    {template.content}
                  </p>
                </div>

                {/* Variables */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Zmienne:</p>
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
                          <p>Wysłane {template.usageCount} razy</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span>Ostatnia zmiana: {template.lastModified}</span>
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
            Brak szablonów
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || typeFilter !== 'all' || categoryFilter !== 'all'
              ? 'Nie znaleziono szablonów spełniających kryteria wyszukiwania'
              : 'Utwórz pierwszy szablon powiadomienia'}
          </p>
          {(!searchQuery && typeFilter === 'all' && categoryFilter === 'all') && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Utwórz pierwszy szablon
            </Button>
          )}
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Podgląd szablonu</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedTemplate?.type === 'email' && selectedTemplate.subject && (
              <div>
                <Label>Temat</Label>
                <div className="p-3 bg-gray-50 rounded-lg mt-1">
                  <p className="text-sm font-mono">{selectedTemplate.subject}</p>
                </div>
              </div>
            )}
            <div>
              <Label>Treść</Label>
              <div className="p-3 bg-gray-50 rounded-lg mt-1">
                <p className="text-sm font-mono whitespace-pre-wrap">{selectedTemplate?.content}</p>
              </div>
            </div>
            <div>
              <Label>Zmienne</Label>
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
              Zamknij
            </Button>
            <Button>
              <Send className="w-4 h-4 mr-2" />
              Wyślij test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}