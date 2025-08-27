// /app/[locale]/admin/settings/branches/page.tsx
// Strona zarządzania filiami szkoły jazdy

'use client'

import { useState } from 'react'
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

// Mock data
const branches = [
  {
    id: '1',
    name: 'Filia Centrum',
    address: 'ul. Marszałkowska 100, 00-001 Warszawa',
    phone: '+48 22 123 45 67',
    email: 'centrum@szkola-jazdy.pl',
    status: 'active',
    manager: 'Jan Kowalski',
    instructors: 8,
    students: 124,
    vehicles: 5,
    workingHours: 'Pon-Pt: 8:00-20:00, Sob: 9:00-15:00',
    coordinates: { lat: 52.2297, lng: 21.0122 }
  },
  {
    id: '2',
    name: 'Filia Mokotów',
    address: 'ul. Puławska 45, 02-515 Warszawa',
    phone: '+48 22 234 56 78',
    email: 'mokotow@szkola-jazdy.pl',
    status: 'active',
    manager: 'Anna Nowak',
    instructors: 6,
    students: 89,
    vehicles: 4,
    workingHours: 'Pon-Pt: 9:00-19:00, Sob: 10:00-14:00',
    coordinates: { lat: 52.1934, lng: 21.0238 }
  },
  {
    id: '3',
    name: 'Filia Praga',
    address: 'ul. Targowa 15, 03-728 Warszawa',
    phone: '+48 22 345 67 89',
    email: 'praga@szkola-jazdy.pl',
    status: 'inactive',
    manager: 'Piotr Wiśniewski',
    instructors: 4,
    students: 56,
    vehicles: 3,
    workingHours: 'Pon-Pt: 8:00-18:00',
    coordinates: { lat: 52.2521, lng: 21.0442 }
  }
]

export default function BranchesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState<any>(null)

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
          <h1 className="text-3xl font-bold text-gray-800">Filie</h1>
          <p className="text-gray-600 mt-1">Zarządzaj lokalizacjami swojej szkoły jazdy</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj filię
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Dodaj nową filię</DialogTitle>
              <DialogDescription>
                Wprowadź dane nowej lokalizacji szkoły jazdy
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nazwa filii</Label>
                  <Input id="name" placeholder="np. Filia Centrum" />
                </div>
                <div>
                  <Label htmlFor="manager">Kierownik</Label>
                  <Select>
                    <SelectTrigger id="manager">
                      <SelectValue placeholder="Wybierz kierownika" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jan">Jan Kowalski</SelectItem>
                      <SelectItem value="anna">Anna Nowak</SelectItem>
                      <SelectItem value="piotr">Piotr Wiśniewski</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" type="tel" placeholder="+48 22 123 45 67" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="filia@szkola-jazdy.pl" />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Adres</Label>
                <Textarea id="address" placeholder="ul. Przykładowa 1, 00-000 Warszawa" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="working-hours">Godziny otwarcia</Label>
                  <Input id="working-hours" placeholder="Pon-Pt: 8:00-20:00" />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select defaultValue="active">
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktywna</SelectItem>
                      <SelectItem value="inactive">Nieaktywna</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Anuluj
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Dodaj filię
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
            placeholder="Szukaj filii..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie</SelectItem>
            <SelectItem value="active">Aktywne</SelectItem>
            <SelectItem value="inactive">Nieaktywne</SelectItem>
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
                  {branch.status === 'active' ? 'Aktywna' : 'Nieaktywna'}
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
                    <span className="text-xs">Instruktorzy</span>
                  </div>
                  <p className="font-semibold text-sm mt-1">{branch.instructors}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span className="text-xs">Kursanci</span>
                  </div>
                  <p className="font-semibold text-sm mt-1">{branch.students}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-500">
                    <Car className="w-4 h-4" />
                    <span className="text-xs">Pojazdy</span>
                  </div>
                  <p className="font-semibold text-sm mt-1">{branch.vehicles}</p>
                </div>
              </div>

              {/* Manager */}
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500 mb-1">Kierownik</p>
                <p className="text-sm font-medium">{branch.manager}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edytuj
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="px-2">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Akcje</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Calendar className="w-4 h-4 mr-2" />
                      Zobacz harmonogram
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="w-4 h-4 mr-2" />
                      Zarządzaj instruktorami
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Car className="w-4 h-4 mr-2" />
                      Zarządzaj pojazdami
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Usuń filię
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
            Brak filii
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || statusFilter !== 'all' 
              ? 'Nie znaleziono filii spełniających kryteria wyszukiwania'
              : 'Dodaj pierwszą filię swojej szkoły jazdy'}
          </p>
          {(!searchQuery && statusFilter === 'all') && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj pierwszą filię
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}