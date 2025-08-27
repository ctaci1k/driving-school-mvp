// components/schedule/StudentSelector.tsx
'use client'

import { useState, useMemo } from 'react'
import { 
  Search, User, Phone, Clock, TrendingUp, 
  Star, Calendar, AlertCircle, Check, X
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format, differenceInDays, isAfter } from 'date-fns'
import { uk } from 'date-fns/locale'

export interface Student {
  id: string
  name: string
  phone: string
  email?: string
  avatar?: string
  category: 'A' | 'B' | 'C' | 'D'
  status: 'active' | 'inactive' | 'paused' | 'completed'
  progress: number
  lessonsCompleted: number
  lessonsTotal: number
  lastLessonDate?: Date
  nextExamDate?: Date
  preferredTime?: string
  preferredDays?: string[]
  balance?: number
  rating?: number
  tags?: string[]
  notes?: string
}

interface StudentSelectorProps {
  students: Student[]
  value?: string
  onChange: (studentId: string) => void
  onAddNew?: () => void
  showDetails?: boolean
  showSearch?: boolean
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  className?: string
}

export function StudentSelector({
  students,
  value,
  onChange,
  onAddNew,
  showDetails = true,
  showSearch = true,
  placeholder = "Оберіть студента",
  disabled = false,
  required = false,
  error,
  className
}: StudentSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let filtered = students

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.phone.includes(searchQuery) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort by status and last lesson date
    return filtered.sort((a, b) => {
      // Active students first
      if (a.status === 'active' && b.status !== 'active') return -1
      if (a.status !== 'active' && b.status === 'active') return 1

      // Then by last lesson date (most recent first)
      if (a.lastLessonDate && b.lastLessonDate) {
        return b.lastLessonDate.getTime() - a.lastLessonDate.getTime()
      }
      if (a.lastLessonDate) return -1
      if (b.lastLessonDate) return 1

      // Finally by name
      return a.name.localeCompare(b.name, 'uk')
    })
  }, [students, searchQuery])

  // Group students by status
  const groupedStudents = useMemo(() => {
    const groups: Record<string, Student[]> = {
      active: [],
      paused: [],
      inactive: [],
      completed: []
    }

    filteredStudents.forEach(student => {
      groups[student.status].push(student)
    })

    return groups
  }, [filteredStudents])

  // Get selected student
  const selectedStudent = students.find(s => s.id === value)

  // Calculate days since last lesson
  const getDaysSinceLastLesson = (date?: Date) => {
    if (!date) return null
    const days = differenceInDays(new Date(), date)
    if (days === 0) return 'Сьогодні'
    if (days === 1) return 'Вчора'
    if (days < 7) return `${days} днів тому`
    if (days < 30) return `${Math.floor(days / 7)} тижнів тому`
    return `${Math.floor(days / 30)} місяців тому`
  }

  // Get status color
  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'paused': return 'text-yellow-600 bg-yellow-50'
      case 'inactive': return 'text-gray-600 bg-gray-50'
      case 'completed': return 'text-blue-600 bg-blue-50'
    }
  }

  const getStatusLabel = (status: Student['status']) => {
    switch (status) {
      case 'active': return 'Активний'
      case 'paused': return 'Пауза'
      case 'inactive': return 'Неактивний'
      case 'completed': return 'Завершив'
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Label */}
      <Label>
        Студент {required && <span className="text-red-500">*</span>}
      </Label>

      {/* Selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between",
              !selectedStudent && "text-muted-foreground",
              error && "border-red-500"
            )}
          >
            {selectedStudent ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  {selectedStudent.avatar && (
                    <AvatarImage src={selectedStudent.avatar} />
                  )}
                  <AvatarFallback className="text-xs">
                    {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span>{selectedStudent.name}</span>
                <Badge variant="outline" className="ml-2">
                  {selectedStudent.category}
                </Badge>
              </div>
            ) : (
              placeholder
            )}
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            {showSearch && (
              <CommandInput 
                placeholder="Пошук студентів..." 
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
            )}
            <CommandList>
              <CommandEmpty>
                <div className="py-6 text-center text-sm">
                  <p className="text-gray-500 mb-2">Студентів не знайдено</p>
                  {onAddNew && (
                    <Button 
                      size="sm" 
                      onClick={() => {
                        onAddNew()
                        setOpen(false)
                      }}
                    >
                      Додати нового студента
                    </Button>
                  )}
                </div>
              </CommandEmpty>

              {/* Active students */}
              {groupedStudents.active.length > 0 && (
                <CommandGroup heading="Активні студенти">
                  {groupedStudents.active.map(student => (
                    <CommandItem
                      key={student.id}
                      value={student.id}
                      onSelect={() => {
                        onChange(student.id)
                        setOpen(false)
                      }}
                    >
                      <StudentItem 
                        student={student} 
                        isSelected={value === student.id}
                        showDetails={showDetails}
                        daysSinceLastLesson={getDaysSinceLastLesson(student.lastLessonDate)}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Paused students */}
              {groupedStudents.paused.length > 0 && (
                <CommandGroup heading="На паузі">
                  {groupedStudents.paused.map(student => (
                    <CommandItem
                      key={student.id}
                      value={student.id}
                      onSelect={() => {
                        onChange(student.id)
                        setOpen(false)
                      }}
                    >
                      <StudentItem 
                        student={student} 
                        isSelected={value === student.id}
                        showDetails={showDetails}
                        daysSinceLastLesson={getDaysSinceLastLesson(student.lastLessonDate)}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Inactive students */}
              {groupedStudents.inactive.length > 0 && (
                <CommandGroup heading="Неактивні">
                  {groupedStudents.inactive.map(student => (
                    <CommandItem
                      key={student.id}
                      value={student.id}
                      onSelect={() => {
                        onChange(student.id)
                        setOpen(false)
                      }}
                    >
                      <StudentItem 
                        student={student} 
                        isSelected={value === student.id}
                        showDetails={showDetails}
                        daysSinceLastLesson={getDaysSinceLastLesson(student.lastLessonDate)}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Selected student details */}
      {selectedStudent && showDetails && (
        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{selectedStudent.phone}</span>
            </div>
            {selectedStudent.balance !== undefined && (
              <Badge variant={selectedStudent.balance >= 0 ? 'default' : 'destructive'}>
                ₴{selectedStudent.balance}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Прогрес: {selectedStudent.progress}%</span>
            </div>
            <div className="text-sm text-gray-600">
              {selectedStudent.lessonsCompleted}/{selectedStudent.lessonsTotal} занять
            </div>
          </div>

          {selectedStudent.nextExamDate && (
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <AlertCircle className="w-4 h-4" />
              <span>
                Іспит: {format(selectedStudent.nextExamDate, 'd MMMM', { locale: uk })}
              </span>
            </div>
          )}

          {selectedStudent.tags && selectedStudent.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedStudent.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Student item component
function StudentItem({ 
  student, 
  isSelected, 
  showDetails,
  daysSinceLastLesson 
}: { 
  student: Student
  isSelected: boolean
  showDetails: boolean
  daysSinceLastLesson: string | null
}) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          {student.avatar && <AvatarImage src={student.avatar} />}
          <AvatarFallback className="text-xs">
            {student.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{student.name}</span>
            <Badge variant="outline" className="text-xs">
              {student.category}
            </Badge>
          </div>
          {showDetails && (
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{student.progress}%</span>
              {daysSinceLastLesson && (
                <>
                  <span>•</span>
                  <span>{daysSinceLastLesson}</span>
                </>
              )}
              {student.rating && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{student.rating}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {isSelected && <Check className="w-4 h-4 text-blue-600" />}
    </div>
  )
}