// lib/pwa/offline-manager.ts

export class OfflineManager {
  private static instance: OfflineManager
  private isOnline: boolean = navigator.onLine

  static getInstance() {
    if (!this.instance) {
      this.instance = new OfflineManager()
    }
    return this.instance
  }

  constructor() {
    this.setupListeners()
    this.cacheEssentialData()
  }

  private setupListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.syncData()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.notifyOffline()
    })
  }

  private async cacheEssentialData() {
    if ('caches' in window) {
      const cache = await caches.open('offline-data-v1')
      
      // Кешуємо важливі дані
      const essentialUrls = [
        '/api/trpc/booking.list',
        '/api/trpc/schedule.getMySchedule',
        '/api/trpc/user.getProfile',
      ]

      for (const url of essentialUrls) {
        try {
          const response = await fetch(url)
          await cache.put(url, response)
        } catch (error) {
          console.error('Failed to cache:', url)
        }
      }
    }
  }

  private async syncData() {
    // Синхронізуємо офлайн зміни
    const pendingBookings = localStorage.getItem('pendingBookings')
    if (pendingBookings) {
      const bookings = JSON.parse(pendingBookings)
      for (const booking of bookings) {
        try {
          await fetch('/api/trpc/booking.create', {
            method: 'POST',
            body: JSON.stringify(booking),
            headers: { 'Content-Type': 'application/json' }
          })
        } catch (error) {
          console.error('Sync failed:', error)
        }
      }
      localStorage.removeItem('pendingBookings')
    }
  }

  private notifyOffline() {
    // Показуємо повідомлення про офлайн режим
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Jesteś offline', {
        body: 'Niektóre funkcje mogą być niedostępne',
        icon: '/icons/icon-192x192.png'
      })
    }
  }

  public getStatus() {
    return this.isOnline
  }
}