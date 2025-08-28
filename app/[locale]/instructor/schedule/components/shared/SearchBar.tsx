// app/[locale]/instructor/schedule/components/shared/SearchBar.tsx
// Komponent paska wyszukiwania z autouzupełnianiem i filtrami

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, X, Filter, User, MapPin, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  showFilters?: boolean
  onFilterClick?: () => void
  suggestions?: SearchSuggestion[]
}

interface SearchSuggestion {
  id: string
  type: 'kursant' | 'lokalizacja' | 'data'
  label: string
  subtitle?: string
  icon?: React.ReactNode
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Szukaj kursanta, lokalizacji, daty...",
  className,
  showFilters = false,
  onFilterClick,
  suggestions = []
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Przykładowe sugestie (w prawdziwej aplikacji byłyby pobierane z API)
  const defaultSuggestions: SearchSuggestion[] = [
    {
      id: '1',
      type: 'kursant',
      label: 'Anna Nowak',
      subtitle: 'tel: 123 456 789',
      icon: <User className="w-4 h-4" />
    },
    {
      id: '2',
      type: 'kursant',
      label: 'Piotr Kowalski',
      subtitle: 'tel: 987 654 321',
      icon: <User className="w-4 h-4" />
    },
    {
      id: '3',
      type: 'lokalizacja',
      label: 'Plac manewrowy Warszawa',
      subtitle: 'ul. Puławska 21',
      icon: <MapPin className="w-4 h-4" />
    },
    {
      id: '4',
      type: 'lokalizacja',
      label: 'Plac manewrowy Kraków',
      subtitle: 'ul. Wadowicka 8',
      icon: <MapPin className="w-4 h-4" />
    },
    {
      id: '5',
      type: 'data',
      label: 'Dzisiaj',
      subtitle: new Date().toLocaleDateString('pl-PL'),
      icon: <Calendar className="w-4 h-4" />
    },
    {
      id: '6',
      type: 'data',
      label: 'Jutro',
      subtitle: new Date(Date.now() + 86400000).toLocaleDateString('pl-PL'),
      icon: <Calendar className="w-4 h-4" />
    }
  ]

  // Filtrowanie sugestii na podstawie wpisanego tekstu
  const filteredSuggestions = value.length > 0
    ? (suggestions.length > 0 ? suggestions : defaultSuggestions).filter(s =>
        s.label.toLowerCase().includes(value.toLowerCase()) ||
        s.subtitle?.toLowerCase().includes(value.toLowerCase())
      )
    : []

  // Obsługa klawiszy
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
          handleSuggestionClick(filteredSuggestions[highlightedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setHighlightedIndex(-1)
        break
    }
  }

  // Obsługa kliknięcia w sugestię
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.label)
    setShowSuggestions(false)
    setHighlightedIndex(-1)
    inputRef.current?.blur()
  }

  // Obsługa focusu
  const handleFocus = () => {
    setIsFocused(true)
    if (value.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleBlur = () => {
    // Opóźnienie, aby umożliwić kliknięcie w sugestię
    setTimeout(() => {
      setIsFocused(false)
      setShowSuggestions(false)
      setHighlightedIndex(-1)
    }, 200)
  }

  // Czyszczenie pola
  const handleClear = () => {
    onChange('')
    inputRef.current?.focus()
  }

  // Efekt dla pokazywania sugestii
  useEffect(() => {
    if (value.length > 0 && isFocused) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [value, isFocused])

  // Ikona typu sugestii
  const getTypeIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'kursant':
        return <User className="w-4 h-4 text-blue-500" />
      case 'lokalizacja':
        return <MapPin className="w-4 h-4 text-green-500" />
      case 'data':
        return <Calendar className="w-4 h-4 text-purple-500" />
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "relative flex items-center rounded-lg border bg-white transition-all",
        isFocused ? "border-blue-500 shadow-sm ring-1 ring-blue-500" : "border-gray-300"
      )}>
        <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-10 py-2 text-sm bg-transparent outline-none placeholder:text-gray-400"
        />

        {/* Przyciski akcji */}
        <div className="flex items-center gap-1 pr-2">
          {value && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Wyczyść"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          
          {showFilters && onFilterClick && (
            <>
              <div className="w-px h-4 bg-gray-300" />
              <button
                onClick={onFilterClick}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Filtry zaawansowane"
              >
                <Filter className="w-4 h-4 text-gray-500" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Dropdown z sugestiami */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-auto z-50"
        >
          <div className="py-1">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  "w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3",
                  index === highlightedIndex && "bg-blue-50"
                )}
              >
                <div className="flex-shrink-0">
                  {suggestion.icon || getTypeIcon(suggestion.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.label}
                  </p>
                  {suggestion.subtitle && (
                    <p className="text-xs text-gray-500 truncate">
                      {suggestion.subtitle}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <span className="text-xs text-gray-400 capitalize">
                    {suggestion.type}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {filteredSuggestions.length === 0 && value && (
            <div className="px-3 py-4 text-center">
              <p className="text-sm text-gray-500">
                Brak wyników dla "{value}"
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Spróbuj innych słów kluczowych
              </p>
            </div>
          )}
        </div>
      )}

      {/* Podpowiedzi skrótów klawiszowych */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-[21rem] text-xs text-gray-400 flex items-center gap-4 px-2">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">↑↓</kbd>
            nawigacja
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">Enter</kbd>
            wybierz
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">Esc</kbd>
            zamknij
          </span>
        </div>
      )}
    </div>
  )
}