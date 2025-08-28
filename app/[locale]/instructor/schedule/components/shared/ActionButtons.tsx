// app/[locale]/instructor/schedule/components/shared/ActionButtons.tsx
// Komponent z przyciskami akcji globalnych dla harmonogramu

'use client'

import React, { useState, useRef } from 'react'
import { 
  Download, 
  Upload, 
  Plus, 
  Settings, 
  Calendar,
  Clock,
  Copy,
  FileText,
  RefreshCw,
  Wand2,
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
  const [isGenerating, setIsGenerating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { 
    exportSchedule, 
    importSchedule, 
    generateSlots,
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

  // Generowanie slotów
  const handleGenerateSlots = async () => {
    setIsGenerating(true)
    try {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 30) // Generuj na 30 dni
      
      await generateSlots(startDate, endDate)
      
      toast({
        title: "Sukces",
        description: "Wygenerowano sloty na najbliższe 30 dni",
      })
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się wygenerować slotów",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
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
                onClick={handleGenerateSlots}
                disabled={isGenerating}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
              >
                <Wand2 className="w-4 h-4" />
                Generuj sloty
              </button>
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

  // Wariant domyślny (desktop)
  return (
    <>
      <div className={cn("flex items-center gap-2", className)}>
        {/* Przycisk generowania slotów */}
        <button
          onClick={handleGenerateSlots}
          disabled={isGenerating}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors",
            isGenerating && "opacity-50 cursor-not-allowed"
          )}
          title="Generuj sloty na podstawie godzin pracy"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          <span className="text-sm font-medium hidden xl:inline">
            Generuj sloty
          </span>
        </button>

        {/* Przycisk dodawania pojedynczego slotu */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          title="Dodaj pojedynczy slot"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium hidden xl:inline">
            Dodaj slot
          </span>
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300" />

        {/* Przycisk eksportu */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="Eksportuj harmonogram do pliku"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm hidden xl:inline">Eksportuj</span>
        </button>

        {/* Przycisk importu */}
        <button
          onClick={handleImport}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="Importuj harmonogram z pliku"
        >
          <Upload className="w-4 h-4" />
          <span className="text-sm hidden xl:inline">Importuj</span>
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300" />

        {/* Przycisk kopiowania szablonu */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="Kopiuj tydzień"
        >
          <Copy className="w-4 h-4" />
          <span className="text-sm hidden xl:inline">Kopiuj tydzień</span>
        </button>

        {/* Przycisk raportu */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="Generuj raport"
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm hidden xl:inline">Raport</span>
        </button>

        {/* Przycisk odświeżania */}
        <button
          onClick={handleRefresh}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="Odśwież dane"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Ukryty input do uploadu plików */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
      />
    </>
  )
}