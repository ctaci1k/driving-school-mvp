// components/ui/credits-display.tsx
'use client'

import { useTranslations } from 'next-intl'
import { CreditCard, TrendingUp, AlertCircle, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { trpc } from '@/lib/trpc/client'
import { differenceInDays } from 'date-fns'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useLocale } from 'next-intl'

interface CreditsDisplayProps {
  userId?: string
  showDetails?: boolean
  compact?: boolean
  className?: string
}

export function CreditsDisplay({ 
  userId, 
  showDetails = true, 
  compact = false,
  className 
}: CreditsDisplayProps) {
  const t = useTranslations('credits')
  const locale = useLocale()
  
  // ✅ Виправлено
  const { data: userPackages, isLoading } = trpc.package.getUserPackages.useQuery({
    status: 'ACTIVE'
  })
  
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16" />
        </CardContent>
      </Card>
    )
  }
  
  const totalCredits = userPackages?.reduce((sum, pkg) => sum + pkg.creditsRemaining, 0) || 0
  const totalUsed = userPackages?.reduce((sum, pkg) => sum + pkg.creditsUsed, 0) || 0
  const totalOriginal = userPackages?.reduce((sum, pkg) => sum + pkg.creditsTotal, 0) || 0
  
  const nearestExpiry = userPackages?.reduce((nearest, pkg) => {
    const daysLeft = differenceInDays(new Date(pkg.expiresAt), new Date())
    if (!nearest || daysLeft < nearest) {
      return daysLeft
    }
    return nearest
  }, null as number | null)
  
const hasExpiringCredits = typeof nearestExpiry === 'number' && nearestExpiry < 7

  
  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{totalCredits}</span>
        <span className="text-sm text-muted-foreground">{t('credits')}</span>
        {hasExpiringCredits && (
          <Badge variant="warning" className="text-xs">
            {t('expiringSoon')}
          </Badge>
        )}
      </div>
    )
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {t('title')}
          </span>
          <Badge variant="default" className="text-lg px-3 py-1">
            {totalCredits}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalOriginal > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('usage')}</span>
              <span className="font-medium">
                {totalUsed} / {totalOriginal}
              </span>
            </div>
            <Progress 
              value={(totalUsed / totalOriginal) * 100} 
              className="h-2"
            />
          </div>
        )}
        
        {showDetails && userPackages && userPackages.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">{t('activePackages')}</h4>
            {userPackages.map((pkg) => {
              const daysLeft = differenceInDays(new Date(pkg.expiresAt), new Date())
              const usagePercentage = pkg.creditsTotal > 0 
                ? (pkg.creditsUsed / pkg.creditsTotal) * 100
                : 0
              
              return (
                <div 
                  key={pkg.id}
                  className={cn(
                    "p-3 rounded-lg border space-y-2",
                    daysLeft < 7 && "border-yellow-500 bg-yellow-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {pkg.package.name}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {pkg.creditsRemaining} {t('left')}
                    </Badge>
                  </div>
                  
                  <Progress value={usagePercentage} className="h-1" />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t('used')}: {pkg.creditsUsed}/{pkg.creditsTotal}</span>
                    <span>
                      {daysLeft > 0 
                        ? t('expiresIn', { days: daysLeft })
                        : t('expired')
                      }
                    </span>
                  </div>
                  
                  {daysLeft < 7 && daysLeft > 0 && (
                    <Alert className="mt-2">
                      <AlertCircle className="h-3 w-3" />
                      <AlertDescription className="text-xs">
                        {t('expiringWarning', { days: daysLeft })}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )
            })}
          </div>
        )}
        
        {totalCredits === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium">{t('noCredits')}</p>
              <p className="text-sm mt-1">{t('noCreditsDescription')}</p>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex gap-2">
          <Link href={`/${locale}/student/packages`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              <Package className="mr-2 h-4 w-4" />
              {t('viewPackages')}
            </Button>
          </Link>
          {totalCredits > 0 && (
            <Link href={`/${locale}/student/book`} className="flex-1">
              <Button className="w-full" size="sm">
                {t('useCredits')}
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}