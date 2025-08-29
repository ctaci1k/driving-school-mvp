// app/[locale]/admin/settings/branches/page.tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, Search, MapPin, Phone, Mail, Clock, Edit, Trash2, MoreHorizontal, Users, Car, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

export default function BranchesPage() {
  const t = useTranslations('admin.settings.branches')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<any>(null)

  // Mock data with Ukrainian cities
  const branches = [
    {
      id: '1',
      name: t('mockData.branches.center'),
      address: t('mockData.branches.address1'),
      phone: '+380 44 123 45 67',
      email: 'center@autoshkola.ua',
      status: 'active',
      manager: t('mockData.managers.jan'),
      instructors: 8,
      students: 124,
      vehicles: 5,
      workingHours: t('mockData.workingHours.weekdays'),
      coordinates: { lat: 50.4501, lng: 30.5234 }
    },
    {
      id: '2',
      name: t('mockData.branches.podil'),
      address: t('mockData.branches.address2'),
      phone: '+380 44 234 56 78',
      email: 'podil@autoshkola.ua',
      status: 'active',
      manager: t('mockData.managers.anna'),
      instructors: 6,
      students: 89,
      vehicles: 4,
      workingHours: t('mockData.workingHours.weekdaysShort'),
      coordinates: { lat: 50.4666, lng: 30.5117 }
    },
    {
      id: '3',
      name: t('mockData.branches.obolon'),
      address: t('mockData.branches.address3'),
      phone: '+380 44 345 67 89',
      email: 'obolon@autoshkola.ua',
      status: 'inactive',
      manager: t('mockData.managers.petro'),
      instructors: 4,
      students: 56,
      vehicles: 3,
      workingHours: t('mockData.workingHours.weekdaysOnly'),
      coordinates: { lat: 50.5011, lng: 30.4982 }
    }
  ]

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          branch.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || branch.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('buttons.addBranch')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('dialog.addTitle')}</DialogTitle>
              <DialogDescription>
                {t('dialog.addDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t('form.branchName')}</Label>
                  <Input id="name" placeholder={t('form.branchNamePlaceholder')} />
                </div>
                <div>
                  <Label htmlFor="manager">{t('form.manager')}</Label>
                  <Select>
                    <SelectTrigger id="manager">
                      <SelectValue placeholder={t('form.selectManager')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jan">{t('mockData.managers.jan')}</SelectItem>
                      <SelectItem value="anna">{t('mockData.managers.anna')}</SelectItem>
                      <SelectItem value="petro">{t('mockData.managers.petro')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone">{t('form.phone')}</Label>
                  <Input id="phone" type="tel" placeholder={t('form.phonePlaceholder')} />
                </div>
                <div>
                  <Label htmlFor="email">{t('form.email')}</Label>
                  <Input id="email" type="email" placeholder={t('form.emailPlaceholder')} />
                </div>
              </div>
              <div>
                <Label htmlFor="address">{t('form.address')}</Label>
                <Textarea id="address" placeholder={t('form.addressPlaceholder')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="working-hours">{t('form.workingHours')}</Label>
                  <Input id="working-hours" placeholder={t('form.workingHoursPlaceholder')} />
                </div>
                <div>
                  <Label htmlFor="status">{t('form.status')}</Label>
                  <Select defaultValue="active">
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('card.active')}</SelectItem>
                      <SelectItem value="inactive">{t('card.inactive')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                {t('buttons.cancel')}
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                {t('buttons.addBranch')}
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('filters.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters.all')}</SelectItem>
            <SelectItem value="active">{t('filters.active')}</SelectItem>
            <SelectItem value="inactive">{t('filters.inactive')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map(branch => (
          <Card key={branch.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{branch.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {branch.address}
                  </CardDescription>
                </div>
                <Badge variant={branch.status === 'active' ? 'success' : 'secondary'}>
                  {branch.status === 'active' ? t('card.active') : t('card.inactive')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{branch.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{branch.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{branch.workingHours}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span className="text-xs">{t('card.instructors')}</span>
                  </div>
                  <p className="font-semibold text-sm mt-1">{branch.instructors}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span className="text-xs">{t('card.students')}</span>
                  </div>
                  <p className="font-semibold text-sm mt-1">{branch.students}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500">
                    <Car className="w-4 h-4" />
                    <span className="text-xs">{t('card.vehicles')}</span>
                  </div>
                  <p className="font-semibold text-sm mt-1">{branch.vehicles}</p>
                </div>
              </div>

              {/* Manager */}
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500 mb-1">{t('card.manager')}</p>
                <p className="text-sm font-medium">{branch.manager}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  {t('buttons.edit')}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="px-2">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t('actions.label')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Calendar className="w-4 h-4 mr-2" />
                      {t('actions.viewSchedule')}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="w-4 h-4 mr-2" />
                      {t('actions.manageInstructors')}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Car className="w-4 h-4 mr-2" />
                      {t('actions.manageVehicles')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('actions.deleteBranch')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBranches.length === 0 && (
        <Card className="p-12 text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {t('emptyState.title')}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || statusFilter !== 'all' 
              ? t('emptyState.noResults')
              : t('emptyState.noData')}
          </p>
          {(!searchQuery && statusFilter === 'all') && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('buttons.addFirstBranch')}
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}