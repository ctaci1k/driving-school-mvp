// components/pwa/push-notifications.tsx

'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bell, BellOff } from 'lucide-react'
import { toast } from '@/lib/toast'

export function PushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Twoja przeglądarka nie obsługuje powiadomień')
      return
    }

    const result = await Notification.requestPermission()
    setPermission(result)

    if (result === 'granted') {
      // Реєструємо для push
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      })

      // Відправляємо subscription на сервер
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'Content-Type': 'application/json' }
      })

      toast.success('Powiadomienia włączone!')
      
      // Тестове повідомлення
      new Notification('AutoSzkoła', {
        body: 'Będziesz otrzymywać przypomnienia o lekcjach',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png'
      })
    }
  }

  return (
    <div className="flex items-center gap-3">
      {permission === 'granted' ? (
        <>
          <BellOff className="w-5 h-5 text-gray-500" />
          <span className="text-sm">Powiadomienia włączone</span>
        </>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={requestPermission}
        >
          <Bell className="w-4 h-4 mr-2" />
          Włącz przypomnienia
        </Button>
      )}
    </div>
  )
}