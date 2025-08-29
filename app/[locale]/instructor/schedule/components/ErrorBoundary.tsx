// app/[locale]/instructor/schedule/components/ErrorBoundary.tsx
// Компонент Error Boundary для обробки помилок в додатку

'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'

interface Props {
  children: ReactNode
  locale: string
  translations?: {
    title: string
    description: string
    actions: {
      reload: string
      goHome: string
    }
    technicalDetails: string
    support: {
      contact: string
      email: string
    }
  }
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

// Default translations fallback
const defaultTranslations = {
  title: 'Упс! Щось пішло не так',
  description: 'Виникла неочікувана помилка. Вибачте за незручності.',
  actions: {
    reload: 'Оновити сторінку',
    goHome: 'Повернутися до панелі'
  },
  technicalDetails: 'Технічні деталі',
  support: {
    contact: 'Зв\'язатися з технічною підтримкою',
    email: 'support@avtoschool.ua'
  }
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
    // Оновити стан, щоб наступний рендер показав UI помилки
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Можна залогувати помилку до сервісу звітування помилок
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Зберегти деталі помилки в state
    this.setState({
      error,
      errorInfo
    })

    // Відправити помилку до сервісу моніторингу (напр. Sentry)
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
    const { locale } = this.props
    window.location.href = `/${locale}/instructor/dashboard`
  }

  render() {
    const t = this.props.translations || defaultTranslations

    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            
            <h1 className="text-xl font-semibold text-center text-gray-900 mb-2">
              {t.title}
            </h1>
            
            <p className="text-sm text-gray-600 text-center mb-6">
              {t.description}
            </p>

            {/* Дії відновлення */}
            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                {t.actions.reload}
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Home className="w-4 h-4" />
                {t.actions.goHome}
              </button>
            </div>

            {/* Деталі помилки (тільки в режимі розробки) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 p-4 bg-gray-100 rounded-lg">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                  {t.technicalDetails}
                </summary>
                <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Посилання на підтримку */}
            <div className="mt-6 pt-6 border-t text-center">
              <a
                href={`mailto:${t.support.email}`}
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Mail className="w-4 h-4" />
                {t.support.contact}
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Wrapper component for use with hooks
export function ErrorBoundaryWrapper({ 
  children, 
  locale = 'uk' 
}: { 
  children: ReactNode
  locale?: string 
}) {
  // В реальному додатку тут можна використовувати useTranslations hook
  // для отримання перекладів, але оскільки це клас-компонент,
  // ми передаємо переклади через props
  
  return (
    <ErrorBoundary locale={locale} translations={defaultTranslations}>
      {children}
    </ErrorBoundary>
  )
}