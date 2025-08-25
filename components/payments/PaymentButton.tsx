// components/payments/PaymentButton.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import {
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { trpc } from '@/lib/trpc/client'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

interface PaymentButtonProps {
  amount: number
  description: string
  bookingId?: string
  packageId?: string
  onSuccess?: (paymentId: string) => void
  onError?: (error: string) => void
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  fullWidth?: boolean
  showIcon?: boolean
  children?: React.ReactNode
}

export function PaymentButton({
  amount,
  description,
  bookingId,
  packageId,
  onSuccess,
  onError,
  className,
  variant = 'default',
  size = 'default',
  fullWidth = false,
  showIcon = true,
  children
}: PaymentButtonProps) {
  const router = useRouter()
  const t = useTranslations('payments.button')
  const locale = useLocale()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  
  const createPayment = trpc.payment.createP24Payment.useMutation({
    onSuccess: (data) => {
      if (data.redirectUrl) {
        setPaymentUrl(data.redirectUrl)
        // Redirect to Przelewy24
        window.location.href = data.redirectUrl
      }
      onSuccess?.(data.paymentId)
    },
    onError: (error) => {
      setIsProcessing(false)
      toast.error(error.message)
      onError?.(error.message)
    }
  })
  
  const handlePayment = async () => {
    setIsProcessing(true)
    
    createPayment.mutate({
      amount,
      description,
      bookingId,
      packageId,
      returnUrl: `${window.location.origin}/${locale}/payments/return`,
      statusUrl: `${window.location.origin}/api/webhooks/p24`
    })
  }
  
  const handleConfirm = () => {
    setShowConfirmDialog(false)
    handlePayment()
  }
  
  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={cn(
          fullWidth && "w-full",
          className
        )}
        onClick={() => setShowConfirmDialog(true)}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('processing')}
          </>
        ) : (
          <>
            {showIcon && <CreditCard className="mr-2 h-4 w-4" />}
            {children || t('pay')}
          </>
        )}
      </Button>
      
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t('confirmPayment')}
            </DialogTitle>
            <DialogDescription>
              {t('confirmDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-secondary">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('description')}:
                  </span>
                  <span className="text-sm font-medium">
                    {description}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('amount')}:
                  </span>
                  <span className="text-lg font-bold">
                    {amount} PLN
                  </span>
                </div>
              </div>
            </div>
            
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                {t('securePayment')}
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <img 
                src="/images/p24-logo.png" 
                alt="Przelewy24" 
                className="h-6"
              />
              <span>{t('poweredBy')}</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isProcessing}
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('redirecting')}
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t('proceedToPayment')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Quick payment component for inline use
interface QuickPaymentProps {
  amount: number
  bookingId?: string
  packageId?: string
  className?: string
}

export function QuickPayment({
  amount,
  bookingId,
  packageId,
  className
}: QuickPaymentProps) {
  const t = useTranslations('payments.quick')
  
  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-lg border",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-secondary">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">{t('paymentRequired')}</p>
          <p className="text-sm text-muted-foreground">
            {t('amount')}: {amount} PLN
          </p>
        </div>
      </div>
      
      <PaymentButton
        amount={amount}
        description={bookingId ? t('bookingPayment') : t('packagePayment')}
        bookingId={bookingId}
        packageId={packageId}
        size="sm"
      >
        {t('payNow')}
      </PaymentButton>
    </div>
  )
}

// Payment status indicator
interface PaymentStatusProps {
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  amount?: number
  className?: string
}

export function PaymentStatus({
  status,
  amount,
  className
}: PaymentStatusProps) {
  const t = useTranslations('payments.status')
  
  const getStatusConfig = () => {
    switch (status) {
      case 'COMPLETED':
        return {
          icon: CheckCircle,
          color: 'text-green-600 bg-green-50',
          label: t('completed')
        }
      case 'PENDING':
        return {
          icon: Loader2,
          color: 'text-yellow-600 bg-yellow-50',
          label: t('pending')
        }
      case 'FAILED':
        return {
          icon: AlertCircle,
          color: 'text-red-600 bg-red-50',
          label: t('failed')
        }
      case 'REFUNDED':
        return {
          icon: AlertCircle,
          color: 'text-gray-600 bg-gray-50',
          label: t('refunded')
        }
    }
  }
  
  const config = getStatusConfig()
  const Icon = config.icon
  
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
      config.color,
      className
    )}>
      <Icon className={cn(
        "h-4 w-4",
        status === 'PENDING' && "animate-spin"
      )} />
      <span>{config.label}</span>
      {amount && (
        <>
          <span className="opacity-70">•</span>
          <span>{amount} PLN</span>
        </>
      )}
    </div>
  )
}

// Payment method selector
interface PaymentMethodSelectorProps {
  selected: 'P24' | 'CREDITS' | 'CASH'
  onSelect: (method: 'P24' | 'CREDITS' | 'CASH') => void
  availableCredits?: number
  className?: string
}

export function PaymentMethodSelector({
  selected,
  onSelect,
  availableCredits = 0,
  className
}: PaymentMethodSelectorProps) {
  const t = useTranslations('payments.methods')
  
  const methods = [
    {
      id: 'P24' as const,
      label: t('online'),
      description: t('onlineDescription'),
      icon: CreditCard,
      available: true
    },
    {
      id: 'CREDITS' as const,
      label: t('credits'),
      description: t('creditsDescription', { count: availableCredits }),
      icon: CreditCard,
      available: availableCredits > 0
    },
    {
      id: 'CASH' as const,
      label: t('cash'),
      description: t('cashDescription'),
      icon: CreditCard,
      available: false
    }
  ]
  
  return (
    <div className={cn("space-y-2", className)}>
      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => method.available && onSelect(method.id)}
          disabled={!method.available}
          className={cn(
            "w-full p-4 rounded-lg border text-left transition-all",
            selected === method.id && "border-primary bg-primary/5",
            !method.available && "opacity-50 cursor-not-allowed",
            method.available && "hover:border-primary/50"
          )}
        >
          <div className="flex items-start gap-3">
            <method.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{method.label}</p>
              <p className="text-sm text-muted-foreground">
                {method.description}
              </p>
            </div>
            {selected === method.id && (
              <CheckCircle className="h-5 w-5 text-primary" />
            )}
          </div>
        </button>
      ))}
    </div>
  )
}