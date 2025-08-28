// app/[locale]/instructor/schedule/components/ErrorBoundary.tsx
// Komponent Error Boundary do obsługi błędów w aplikacji

'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Aktualizuj stan, aby następny render pokazał UI błędu
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Możesz zalogować błąd do serwisu raportowania błędów
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Zapisz szczegóły błędu w state
    this.setState({
      error,
      errorInfo
    })

    // Wyślij błąd do serwisu monitoringu (np. Sentry)
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      // logErrorToService(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/instructor/dashboard'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            
            <h1 className="text-xl font-semibold text-center text-gray-900 mb-2">
              Ups! Coś poszło nie tak
            </h1>
            
            <p className="text-sm text-gray-600 text-center mb-6">
              Wystąpił nieoczekiwany błąd. Przepraszamy za utrudnienia.
            </p>

            {/* Akcje naprawcze */}
            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Odśwież stronę
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Home className="w-4 h-4" />
                Wróć do panelu
              </button>
            </div>

            {/* Szczegóły błędu (tylko w trybie deweloperskim) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 p-4 bg-gray-100 rounded-lg">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                  Szczegóły techniczne
                </summary>
                <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Link do wsparcia */}
            <div className="mt-6 pt-6 border-t text-center">
              <a
                href="mailto:support@szkola-jazdy.pl"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Mail className="w-4 h-4" />
                Skontaktuj się z pomocą techniczną
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}