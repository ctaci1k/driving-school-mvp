// components/calendar/conflict-detection.tsx

'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { AlertTriangle, Clock, Car, MapPin, User, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Conflict {
  id: string
  type: 'doubleBooking' | 'insufficientTravelTime' | 'instructorUnavailable' | 'vehicleUnavailable' | 'locationClosed' | 'exceedsWorkingHours'
  severity: 'critical' | 'high' | 'medium' | 'low'
  date: Date
  time: string
  bookingIds: string[]
  description: string
  suggestedResolution?: string
}

export function ConflictDetection() {
  const t = useTranslations('calendar.conflicts')
  
  const [conflicts, setConflicts] = useState<Conflict[]>([
    {
      id: '1',
      type: 'doubleBooking',
      severity: 'critical',
      date: new Date('2024-01-25'),
      time: '10:00-12:00',
      bookingIds: ['B001', 'B002'],
      description: 'Instruktor Jan Kowalski ma 2 lekcje w tym samym czasie',
      suggestedResolution: 'Przełóż jedną lekcję na 14:00'
    },
    {
      id: '2',
      type: 'insufficientTravelTime',
      severity: 'high',
      date: new Date('2024-01-26'),
      time: '12:00-14:00',
      bookingIds: ['B003', 'B004'],
      description: 'Tylko 15 minut między lekcjami w różnych lokalizacjach (potrzeba 30 min)',
      suggestedResolution: 'Dodaj 30 min przerwy między lekcjami'
    },
    {
      id: '3',
      type: 'vehicleUnavailable',
      severity: 'medium',
      date: new Date('2024-01-27'),
      time: '09:00-11:00',
      bookingIds: ['B005'],
      description: 'Pojazd WW 12345 jest na przeglądzie technicznym',
      suggestedResolution: 'Przypisz pojazd WW 67890'
    }
  ])
  
  const [isScanning, setIsScanning] = useState(false)
  
  const handleScanConflicts = () => {
    setIsScanning(true)
    // Symulacja skanowania
    setTimeout(() => {
      setIsScanning(false)
    }, 2000)
  }
  
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }
  
  const getConflictIcon = (type: string) => {
    switch(type) {
      case 'doubleBooking': return User
      case 'insufficientTravelTime': return Clock
      case 'vehicleUnavailable': return Car
      case 'instructorUnavailable': return User
      case 'locationClosed': return MapPin
      case 'exceedsWorkingHours': return Clock
      default: return AlertTriangle
    }
  }
  
  const handleResolve = (conflictId: string) => {
    setConflicts(prev => prev.filter(c => c.id !== conflictId))
  }
  
  return (
    <div className="space-y-4">
      {/* Panel kontrolny */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {t('title')}
            </span>
            <div className="flex items-center gap-2">
              {conflicts.length > 0 && (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  {t('conflictsFound', { count: conflicts.length })}
                </span>
              )}
              <Button 
                size="sm"
                onClick={handleScanConflicts}
                disabled={isScanning}
              >
                {isScanning ? 'Skanowanie...' : t('detectConflicts')}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {conflicts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">{t('noConflicts')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {conflicts.map((conflict) => {
                const Icon = getConflictIcon(conflict.type)
                
                return (
                  <div
                    key={conflict.id}
                    className={cn(
                      "p-4 rounded-lg border",
                      getSeverityColor(conflict.severity)
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {t(`conflictTypes.${conflict.type}`)}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-white/50 rounded">
                              {t(`severity.${conflict.severity}`)}
                            </span>
                          </div>
                          <p className="text-sm mb-2">{conflict.description}</p>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {conflict.date.toLocaleDateString('pl-PL')} {conflict.time}
                            </span>
                            <span>
                              {t('affectedBookings')}: {conflict.bookingIds.join(', ')}
                            </span>
                          </div>
                          {conflict.suggestedResolution && (
                            <div className="mt-2 p-2 bg-white/30 rounded text-sm">
                              <strong>Sugestia:</strong> {conflict.suggestedResolution}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleResolve(conflict.id)}
                        >
                          {t('resolve')}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleResolve(conflict.id)}
                        >
                          {t('ignore')}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {conflicts.length > 1 && (
                <Button className="w-full" variant="outline">
                  {t('resolveAll')}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}