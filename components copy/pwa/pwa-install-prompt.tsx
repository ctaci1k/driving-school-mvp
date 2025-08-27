// components/pwa/pwa-install-prompt.tsx

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, Download, Smartphone } from 'lucide-react'

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Перевіряємо чи вже встановлено
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Перевірка чи був відхилений раніше
    const dismissed = localStorage.getItem('pwa-dismissed')
    if (dismissed && Date.now() < parseInt(dismissed)) {
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Показуємо промпт через 10 секунд
      setTimeout(() => setShowPrompt(true), 10000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstalled(true)
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Не показувати тиждень
    const nextWeek = Date.now() + 7 * 24 * 60 * 60 * 1000
    localStorage.setItem('pwa-dismissed', nextWeek.toString())
  }

  if (isInstalled || !showPrompt || !deferredPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="p-4 shadow-lg border-blue-200 bg-white">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Smartphone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Zainstaluj aplikację
              </h3>
              <p className="text-sm text-gray-600">
                Szybszy dostęp do rezerwacji
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleInstall} 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Zainstaluj
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDismiss}
            className="border-gray-300"
          >
            Później
          </Button>
        </div>
      </Card>
    </div>
  )
}