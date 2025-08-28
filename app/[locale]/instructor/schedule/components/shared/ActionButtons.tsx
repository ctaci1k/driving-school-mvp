// app/[locale]/instructor/schedule/components/shared/ActionButtons.tsx
// Komponent z przyciskami akcji globalnych dla harmonogramu

'use client'

import React, { useState, useRef } from 'react'
import { 
  Download, 
  Upload, 
  Settings, 
  Calendar,
  Clock,
  Copy,
  FileText,
  RefreshCw,
  ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScheduleContext } from '../../providers/ScheduleProvider'
import { useToast } from '@/hooks/use-toast'

interface ActionButtonsProps {
  className?: string
  variant?: 'default' | 'compact' | 'mobile'
}

export default function ActionButtons({ 
  className, 
  variant = 'default' 
}: ActionButtonsProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { 
    exportSchedule, 
    importSchedule,
    refreshData 
  } = useScheduleContext()
  
  const { toast } = useToast()

  // Eksport harmonogramu
  const handleExport = async () => {
    try {
      const data = exportSchedule()
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `harmonogram_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Sukces",
        description: "Harmonogram został wyeksportowany",
      })
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się wyeksportować harmonogramu",
        variant: "destructive",
      })
    }
  }

  // Import harmonogramu
  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      await importSchedule(text)
      
      toast({
        title: "Sukces",
        description: "Harmonogram został zaimportowany",
      })
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nieprawidłowy format pliku",
        variant: "destructive",
      })
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Odświeżanie danych
  const handleRefresh = async () => {
    try {
      await refreshData()
      toast({
        title: "Sukces",
        description: "Dane zostały odświeżone",
      })
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się odświeżyć danych",
        variant: "destructive",
      })
    }
  }

  // Wariant mobilny
  if (variant === 'mobile') {
    return (
      <div className={cn("relative", className)}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Akcje</span>
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform",
            showDropdown && "rotate-180"
          )} />
        </button>

        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
            <div className="py-1">
              <button
                onClick={handleExport}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
              >
                <Download className="w-4 h-4" />
                Eksportuj harmonogram
              </button>
              <button
                onClick={handleImport}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
              >
                <Upload className="w-4 h-4" />
                Importuj harmonogram
              </button>
              <button
                onClick={handleRefresh}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
              >
                <RefreshCw className="w-4 h-4" />
                Odśwież dane
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Wariant kompaktowy
  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <button
          onClick={handleExport}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Eksportuj"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={handleImport}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Importuj"
        >
          <Upload className="w-4 h-4" />
        </button>
        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Odśwież"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    )
  }

  // Wariant domyślny
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">Eksportuj</span>
      </button>
      
      <button
        onClick={handleImport}
        className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Upload className="w-4 h-4" />
        <span className="text-sm font-medium">Importuj</span>
      </button>
      
      <button
        onClick={handleRefresh}
        className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        <span className="text-sm font-medium">Odśwież</span>
      </button>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  )
}