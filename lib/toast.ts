// lib/toast.ts
import { toast as sonnerToast, Toaster as SonnerToaster } from 'sonner'

export const toast = {
  success: (message: string, options?: any) => {
    sonnerToast.success(message, {
      duration: 4000,
      ...options
    })
  },
  
  error: (message: string, options?: any) => {
    sonnerToast.error(message, {
      duration: 5000,
      ...options
    })
  },
  
  warning: (message: string, options?: any) => {
    sonnerToast.warning(message, {
      duration: 4000,
      ...options
    })
  },
  
  info: (message: string, options?: any) => {
    sonnerToast.info(message, {
      duration: 4000,
      ...options
    })
  },
  
  loading: (message: string, options?: any) => {
    return sonnerToast.loading(message, {
      ...options
    })
  },
  
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return sonnerToast.promise(promise, options)
  },
  
  dismiss: (id?: string | number) => {
    sonnerToast.dismiss(id)
  },
  

  custom: (component: () => React.ReactElement, options?: any) => {
  sonnerToast.custom(component, options)
}
}

export { SonnerToaster as Toaster }

// Custom toast variants
export const toastVariants = {
  bookingConfirmed: (date: string, instructor: string) => {
    toast.success(
      `Lekcja zarezerwowana na ${date} z ${instructor}`,
      {
        icon: '✅',
        duration: 5000
      }
    )
  },
  
  bookingCancelled: () => {
    toast.info('Lekcja została anulowana', {
      icon: '❌',
      duration: 4000
    })
  },
  
  paymentSuccess: (amount: number) => {
    toast.success(`Płatność ${amount} PLN została zrealizowana`, {
      icon: '💳',
      duration: 5000
    })
  },
  
  paymentFailed: () => {
    toast.error('Płatność nie powiodła się. Spróbuj ponownie.', {
      icon: '⚠️',
      duration: 6000
    })
  },
  
  creditsLow: (remaining: number) => {
    toast.warning(`Masz tylko ${remaining} kredytów`, {
      icon: '⚠️',
      duration: 5000
    })
  },
  
  sessionExpired: () => {
    toast.error('Sesja wygasła. Zaloguj się ponownie.', {
      icon: '🔒',
      duration: 6000
    })
  }
}