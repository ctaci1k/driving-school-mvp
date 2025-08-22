// components/calendar/calendar-filters.tsx

'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useTranslations } from 'next-intl'
import { Search, Filter, X, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterState {
  searchQuery: string
  instructorId: string
  studentId: string
  vehicleId: string
  locationId: string
  lessonType: string
  status: string
  dateFrom: Date | null
  dateTo: Date | null
  showOnlyAvailable: boolean
  showConflicts: boolean
}

export function CalendarFilters({ onFiltersChange }: { onFiltersChange?: (filters: FilterState) => void }) {
  const t = useTranslations('calendar.filters')
  const tLessons = useTranslations('calendar')
  
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    instructorId: '',
    studentId: '',
    vehicleId: '',
    locationId: '',
    lessonType: '',
    status: '',
    dateFrom: null,
    dateTo: null,
    showOnlyAvailable: false,
    showConflicts: false
  })
  
  // Przykładowe dane
  const instructors = [
    { id: '1', name: 'Jan Kowalski' },
    { id: '2', name: 'Anna Nowak' },
    { id: '3', name: 'Piotr Wiśniewski' }
  ]
  
  const vehicles = [
    { id: '1', name: 'Toyota Yaris (WW 12345)' },
    { id: '2', name: 'VW Golf (WW 67890)' },
    { id: '3', name: 'Skoda Fabia (WW 11111)' }
  ]
  
  const locations = [
    { id: '1', name: 'Warszawa Centrum' },
    { id: '2', name: 'Warszawa Mokotów' },
    { id: '3', name: 'Warszawa Ursynów' }
  ]
  
  const lessonTypes = [
    { id: 'cityDriving', name: tLessons('cityDriving') },
    { id: 'parallelParking', name: tLessons('parallelParking') },
    { id: 'highwayDriving', name: tLessons('highwayDriving') },
    { id: 'examPreparation', name: tLessons('examPreparation') }
  ]
  
  const statuses = [
    { id: 'CONFIRMED', name: 'Potwierdzone' },
    { id: 'PENDING', name: 'Oczekujące' },
    { id: 'COMPLETED', name: 'Zakończone' },
    { id: 'CANCELLED', name: 'Anulowane' }
  ]
  
  const activeFiltersCount = Object.values(filters).filter(v => 
    v && v !== '' && v !== false
  ).length
  
  const handleApplyFilters = () => {
    onFiltersChange?.(filters)
    console.log('Applying filters:', filters)
  }
  
  const handleClearFilters = () => {
    const cleared: FilterState = {
      searchQuery: '',
      instructorId: '',
      studentId: '',
      vehicleId: '',
      locationId: '',
      lessonType: '',
      status: '',
      dateFrom: null,
      dateTo: null,
      showOnlyAvailable: false,
      showConflicts: false
    }
    setFilters(cleared)
    onFiltersChange?.(cleared)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t('title')}
          </span>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {t('activeFilters', { count: activeFiltersCount })}
              </span>
            )}
            <Button
              size="sm"
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Ukryj' : 'Pokaż'} filtry
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Wyszukiwarka */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={filters.searchQuery}
            onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
            className="pl-10"
          />
        </div>
        
        {/* Rozszerzone filtry */}
        {showFilters && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Instruktor */}
              <div>
                <Label>{t('instructor')}</Label>
                <select 
                  className="w-full p-2 border rounded-md mt-1"
                  value={filters.instructorId}
                  onChange={(e) => setFilters({...filters, instructorId: e.target.value})}
                >
                  <option value="">{t('allInstructors')}</option>
                  {instructors.map(i => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Pojazd */}
              <div>
                <Label>{t('vehicle')}</Label>
                <select 
                  className="w-full p-2 border rounded-md mt-1"
                  value={filters.vehicleId}
                  onChange={(e) => setFilters({...filters, vehicleId: e.target.value})}
                >
                  <option value="">{t('allVehicles')}</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Lokalizacja */}
              <div>
                <Label>{t('location')}</Label>
                <select 
                  className="w-full p-2 border rounded-md mt-1"
                  value={filters.locationId}
                  onChange={(e) => setFilters({...filters, locationId: e.target.value})}
                >
                  <option value="">{t('allLocations')}</option>
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Typ lekcji */}
              <div>
                <Label>{t('lessonType')}</Label>
                <select 
                  className="w-full p-2 border rounded-md mt-1"
                  value={filters.lessonType}
                  onChange={(e) => setFilters({...filters, lessonType: e.target.value})}
                >
                  <option value="">{t('allTypes')}</option>
                  {lessonTypes.map(lt => (
                    <option key={lt.id} value={lt.id}>{lt.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Status */}
              <div>
                <Label>{t('status')}</Label>
                <select 
                  className="w-full p-2 border rounded-md mt-1"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">{t('allStatuses')}</option>
                  {statuses.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Zakres dat */}
              <div>
                <Label>{t('dateRange')}</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    type="date" 
                    placeholder={t('from')}
                    onChange={(e) => setFilters({...filters, dateFrom: new Date(e.target.value)})}
                  />
                  <Input 
                    type="date" 
                    placeholder={t('to')}
                    onChange={(e) => setFilters({...filters, dateTo: new Date(e.target.value)})}
                  />
                </div>
              </div>
            </div>
            
            {/* Przełączniki */}
            <div className="flex flex-wrap gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Switch
                  checked={filters.showOnlyAvailable}
                  onCheckedChange={(checked) => setFilters({...filters, showOnlyAvailable: checked})}
                />
                <Label>{t('showOnlyAvailable')}</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={filters.showConflicts}
                  onCheckedChange={(checked) => setFilters({...filters, showConflicts: checked})}
                />
                <Label>{t('showConflicts')}</Label>
              </div>
            </div>
            
            {/* Przyciski akcji */}
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleApplyFilters} className="flex-1">
                {t('applyFilters')}
              </Button>
              <Button variant="outline" onClick={handleClearFilters}>
                {t('clearFilters')}
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                {t('exportFiltered')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}